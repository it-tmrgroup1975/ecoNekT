import { Users, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard สรุปภาพรวม</h1>
        <p className="text-muted-foreground">ยินดีต้อนรับกลับมา, ข้อมูลอัปเดตล่าสุดเมื่อ 5 นาทีที่แล้ว</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="พนักงานทั้งหมด" value="1,284" icon={<Users />} trend="+12% เดือนนี้" />
        <StatsCard title="เข้างานวันนี้" value="1,150" icon={<Clock />} trend="92% Coverage" color="text-success" />
        <StatsCard title="คำขออนุมัติลา" value="12" icon={<AlertCircle />} trend="รอการตรวจสอบ" color="text-destructive" />
        <StatsCard title="KPI เฉลี่ยองค์กร" value="88%" icon={<TrendingUp />} trend="+2.4% vs ปีที่แล้ว" />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Attendance Chart Mockup */}
        <Card className="col-span-4 border-none shadow-sm bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">สถิติการเข้างานรายสัปดาห์</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full bg-slate-50/50 rounded-xl border-2 border-dashed border-muted flex items-center justify-center">
                <p className="text-muted-foreground italic">Area Chart: แสดงแนวโน้มการมาทำงาน กะเช้า/กะดึก</p>
             </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">กิจกรรมล่าสุด</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">เพิ่มพนักงานใหม่ในแผนก IT</p>
                  <p className="text-xs text-muted-foreground">โดย Admin สมชาย • 2 ชม. ที่แล้ว</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend, color = "text-primary" }) {
  return (
    <Card className="border-none shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg bg-slate-50 ${color}`}>{icon}</div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{trend}</span>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}