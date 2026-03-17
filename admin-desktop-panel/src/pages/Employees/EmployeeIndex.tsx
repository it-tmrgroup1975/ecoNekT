import { useState, useEffect } from "react";
import api from "../../api/axios";
import { DataTable } from "../../components/shared/DataTable";
import { LayoutGrid, List } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import type { Employee } from "../../types/employee";
import { cn } from "../../lib/utils";

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  useEffect(() => {
    // ดึงข้อมูลจริงจาก Django Backend
    api.get("/users/employees/").then(res => setEmployees(res.data));
  }, []);

  const columns = [
    {
      header: "พนักงาน",
      accessorKey: "employee_code",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarImage src={row.original.avatar} />
            <AvatarFallback>{row.original.employee_code.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-foreground">{row.original.user.first_name}</span>
            <span className="text-xs text-muted-foreground">{row.original.employee_code}</span>
          </div>
        </div>
      ),
    },
    { header: "ตำแหน่ง", accessorKey: "position_details.title" },
    { header: "แผนก", accessorKey: "position_details.department_name" },
    { header: "วันที่เข้าร่วม", accessorKey: "joined_at" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-primary">จัดการพนักงาน</h1>
          <p className="text-muted-foreground italic">ข้อมูลบุคลากรทั้งหมดในองค์กรของคุณ</p>
        </div>
        
        {/* View Switcher */}
        <div className="bg-primary/5 p-1 rounded-2xl flex gap-1">
          <button onClick={() => setViewMode("list")} 
            className={cn("p-2 rounded-xl transition-all", viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}>
            <List className="h-5 w-5" />
          </button>
          <button onClick={() => setViewMode("kanban")}
            className={cn("p-2 rounded-xl transition-all", viewMode === "kanban" ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}>
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <DataTable columns={columns} data={employees} searchPlaceholder="ค้นหาพนักงานด้วยชื่อหรือรหัส..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map(emp => (
            <div key={emp.id} className="bg-white p-6 rounded-3xl border border-primary/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all">
               {/* Kanban Card UI - สวยงามระดับ World Class */}
               <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24 ring-4 ring-secondary/10">
                    <AvatarImage src={emp.avatar ?? undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">EM</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{emp.user.first_name} {emp.user.last_name}</h3>
                    <p className="text-sm text-secondary font-medium">{emp.position_details?.title}</p>
                  </div>
                  <span className="px-4 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase rounded-full">
                    {emp.employee_code}
                  </span>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}