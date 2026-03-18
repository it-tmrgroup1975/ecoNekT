import { Clock, CalendarCheck, Bell, ArrowRight, Play, Briefcase } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

export default function Home() {
  const { user } = useAuth();

  // ดึงชื่อมาแสดงผล
  const displayName = user?.first_name || user?.email?.split('@')[0] || "พนักงาน";

  return (
    <div className="flex flex-col space-y-5 pb-10 animate-in fade-in duration-700">
      
      {/* 1. Greeting Section & Quick Time Widget */}
      <section className="space-y-3">
        <div className="px-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ยินดีต้อนรับ</p>
          <h2 className="text-2xl font-black text-slate-800">สวัสดี, {displayName}</h2>
        </div>

        {/* Time Attendance Widget (ลงเวลาด่วน) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm overflow-hidden relative group">
          <div className="flex justify-between items-center relative z-10">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-2 py-0.5 rounded">
                สถานะปัจจุบัน: ยังไม่เข้างาน
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-800">08:54</span>
                <span className="text-sm font-bold text-slate-400 uppercase">น.</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">19 มีนาคม 2026 • สำนักงานใหญ่</p>
            </div>
            
            <button className="z-5 bg-primary text-white p-4 rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all flex items-center gap-2 hover:bg-primary/90">
              <Play className="w-5 h-5 fill-current" />
              <span className="font-bold text-sm">บันทึกเวลา</span>
            </button>
          </div>
          {/* Decorative background icon */}
          <Clock className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 -z-0" />
        </div>
      </section>

      {/* 2. Leave Summary (โควตาวันลา) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">สรุปวันลาคงเหลือ</h3>
          <CalendarCheck className="w-4 h-4 text-slate-300" />
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <LeaveCard label="ลาป่วย" count={15} total={30} color="text-rose-500" bg="bg-rose-50" />
          <LeaveCard label="ลากิจ" count={4} total={6} color="text-amber-500" bg="bg-amber-50" />
          <LeaveCard label="พักร้อน" count={8} total={12} color="text-emerald-500" bg="bg-emerald-50" />
        </div>
      </section>

      {/* 3. Recent Notifications (แจ้งเตือนล่าสุด) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">แจ้งเตือนล่าสุด</h3>
          <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
            ดูทั้งหมด <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50 shadow-sm">
          <NotificationItem 
            title="อนุมัติการลาแล้ว" 
            desc="ใบลาพักร้อนวันที่ 25 มี.ค. ได้รับการอนุมัติโดย HR" 
            time="2 ชม. ที่แล้ว" 
            type="success"
          />
          <NotificationItem 
            title="ลืมลงเวลา?" 
            desc="คุณยังไม่ได้ลงเวลาเลิกงานของเมื่อวาน กรุณาตรวจสอบ" 
            time="1 วันที่แล้ว" 
            type="warning"
          />
          <NotificationItem 
            title="ประกาศบริษัท" 
            desc="แจ้งปรับปรุงระบบเครือข่ายภายในช่วงวันหยุดนี้" 
            time="2 วันที่แล้ว" 
            type="info"
          />
          <NotificationItem 
            title="ปฏิเสธการลาแล้ว" 
            desc="ใบลาพักร้อนวันที่ 20 ก.พ. ไม่ได้รับการอนุมัติโดย HR" 
            time="34 วันที่แล้ว" 
            type="danger"
          />
        </div>
      </section>

    </div>
  );
}

// --- Sub Components ---

function LeaveCard({ label, count, total, color, bg }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col items-center shadow-sm">
      <span className="text-[10px] font-bold text-slate-400 mb-1">{label}</span>
      <span className={cn("text-xl font-black", color)}>{count}</span>
      <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
        <div 
          className={cn("h-full rounded-full", color.replace('text', 'bg'))} 
          style={{ width: `${(count/total) * 100}%` }} 
        />
      </div>
      <span className="text-[9px] font-bold text-slate-300 mt-1">{total} วัน</span>
    </div>
  );
}

function NotificationItem({ title, desc, time, type }: any) {
  const iconColor = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
    danger: "bg-red-500"
  }[type as 'success' | 'warning' | 'info'];

  return (
    <div className="p-4 flex gap-3 active:bg-slate-50 transition-colors">
      <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", iconColor)} />
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <h4 className="text-xs font-bold text-slate-800 leading-none">{title}</h4>
          <span className="text-[9px] font-bold text-slate-300 uppercase">{time}</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-1">{desc}</p>
      </div>
    </div>
  );
}