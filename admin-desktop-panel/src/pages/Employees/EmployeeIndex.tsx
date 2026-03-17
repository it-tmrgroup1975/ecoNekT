import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { DataTable } from "../../components/shared/DataTable";
import { LayoutGrid, List } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { EmployeeSkeleton } from "./components/EmployeeSkeleton"; // นำเข้า Skeleton ที่สร้างไว้
import type { Employee } from "../../types/employee";
import type { ColumnDef } from "@tanstack/react-table"; // นำเข้า type สำหรับ columns
import { cn } from "../../lib/utils";

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  // 1. อ่านค่า View Mode ล่าสุดจาก localStorage
  const [viewMode, setViewMode] = useState<"list" | "kanban">(() => {
    const savedView = localStorage.getItem("employee_view_mode");
    return (savedView as "list" | "kanban") || "list";
  });

  // 2. บันทึกค่าทุกครั้งที่ viewMode เปลี่ยน
  useEffect(() => {
    localStorage.setItem("employee_view_mode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    // ดึงข้อมูลจริงจาก Django Backend พร้อมจัดการ Loading state
    setIsLoading(true);
    api.get("/users/employees/")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch employees:", err);
      })
      .finally(() => {
        // หน่วงเวลาเล็กน้อยเพื่อให้ Transition ของ Skeleton ดูเนียนตาขึ้น (Optional)
        setTimeout(() => setIsLoading(false), 500);
      });
  }, []);

  // กำหนด Columns พร้อมระบุ Type เพื่อป้องกัน Error 'row'
  const columns: ColumnDef<Employee>[] = [
    {
      header: "พนักงาน",
      accessorKey: "employee_code",
      cell: ({ row }) => {
        const emp = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/10">
              {/* แปลง null เป็น undefined เพื่อให้ AvatarImage ทำงานถูกต้อง */}
              <AvatarImage src={emp.avatar ?? undefined} alt={emp.employee_code} />
              <AvatarFallback className="bg-primary/5 text-primary font-bold">
                {emp.employee_code.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm text-foreground">
                {emp.user.first_name} {emp.user.last_name}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                {emp.employee_code}
              </span>
            </div>
          </div>
        );
      },
    },
    { 
      header: "ตำแหน่ง", 
      accessorKey: "position_details.title",
      cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>
    },
    { 
      header: "แผนก", 
      accessorKey: "position_details.department_name",
      cell: ({ getValue }) => (
        <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
          {getValue() as string}
        </span>
      )
    },
    { 
      header: "วันที่เข้าร่วม", 
      accessorKey: "joined_at",
      cell: ({ getValue }) => {
        const dateStr = getValue() as string;
        return (
          <span className="text-muted-foreground tabular-nums">
            {new Date(dateStr).toLocaleDateString("th-TH", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      }
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h1 className="text-3xl font-black tracking-tighter text-primary">จัดการพนักงาน</h1>
          <p className="text-muted-foreground italic">ข้อมูลบุคลากรทั้งหมดในองค์กรของคุณ</p>
        </div>
        
        {/* View Switcher */}
        <div className="bg-primary/5 p-1 rounded-2xl flex gap-1 border border-primary/5">
          <button 
            onClick={() => setViewMode("list")} 
            className={cn(
              "p-2 rounded-xl transition-all duration-300", 
              viewMode === "list" ? "bg-white shadow-md text-primary" : "text-muted-foreground hover:text-primary/70"
            )}
          >
            <List className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setViewMode("kanban")}
            className={cn(
              "p-2 rounded-xl transition-all duration-300", 
              viewMode === "kanban" ? "bg-white shadow-md text-primary" : "text-muted-foreground hover:text-primary/70"
            )}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content Section with Skeleton Logic */}
      {isLoading ? (
        <EmployeeSkeleton viewMode={viewMode} rowCount={6} />
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          {viewMode === "list" ? (
            <DataTable 
              columns={columns} 
              data={employees} 
              searchPlaceholder="ค้นหาพนักงานด้วยชื่อหรือรหัส..." 
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {employees.map((emp) => (
                <div 
                  key={emp.id} 
                  className="group bg-white p-6 rounded-3xl border border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                >
                   <div className="flex flex-col items-center text-center space-y-4">
                      <Avatar className="h-24 w-24 ring-4 ring-secondary/10 group-hover:ring-secondary/20 transition-all duration-500">
                        <AvatarImage src={emp.avatar ?? undefined} alt={emp.user.first_name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                          {emp.user.first_name.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                          {emp.user.first_name} {emp.user.last_name}
                        </h3>
                        <p className="text-sm text-secondary font-bold tracking-tight">
                          {emp.position_details?.title || "ไม่ระบุตำแหน่ง"}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">
                          {emp.position_details?.department_name}
                        </p>
                      </div>
                      <span className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase rounded-full tracking-widest border border-primary/10">
                        {emp.employee_code}
                      </span>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}