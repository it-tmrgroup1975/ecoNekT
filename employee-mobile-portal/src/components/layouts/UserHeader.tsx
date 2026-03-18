import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserHeaderProps {
  className?: string;
}

export default function UserHeader({ className }: UserHeaderProps) {
  // ดึงข้อมูล user จาก AuthContext
  const { user } = useAuth();

  // สร้างอักษรย่อสำหรับ Fallback (ปรับปรุงให้รองรับกรณีชื่อเป็นค่าว่าง)
  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && firstName.trim() !== "") {
      const f = firstName.charAt(0).toUpperCase();
      const l = lastName && lastName.trim() !== "" ? lastName.charAt(0).toUpperCase() : "";
      return `${f}${l}`;
    }
    // ถ้าไม่มีชื่อจริง ให้ใช้อักษรตัวแรกจาก Email แทน
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  // ตรวจสอบว่ามีชื่อแสดงผลหรือไม่ ถ้าไม่มีให้ใช้ส่วนแรกของ email
  const displayName = user?.first_name || user?.last_name 
    ? `${user.first_name} ${user.last_name}`.trim()
    : user?.email?.split('@')[0] || "User";

  return (
    <div className={cn("flex items-center justify-between p-4 bg-white/95 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100", className)}>
      {/* โลโก้แอปฝั่งซ้าย */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-black text-primary italic tracking-tighter leading-none">ecoNekT</h1>
        <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase pl-0.5">Portal</span>
      </div>

      {/* ส่วนข้อมูลผู้ใช้ฝั่งขวา (UI ระดับโลก) */}
      <div className="flex items-center gap-3 active:bg-slate-50 p-1 rounded-full transition-all cursor-pointer group">
        {/* ข้อความชื่อและตำแหน่ง */}
        <div className="text-right flex flex-col justify-center">
          <span className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
            {displayName}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            {user?.role === 'admin' ? 'ผู้ดูแลระบบ' : (user?.position || "พนักงาน")}
          </span>
        </div>

        {/* Avatar พร้อมสถานะ Online */}
        <div className="relative">
          <Avatar className="w-11 h-11 border-2 border-white shadow-md shadow-slate-200 ring-1 ring-slate-100 transition-transform group-hover:scale-105">
            {/* 1. เปลี่ยนจาก user.avatar เป็น user.avatar_url ตามข้อมูลจริงจาก API */}
            <AvatarImage src={user?.avatar_url} alt={displayName} className="object-cover" />
            
            {/* 2. แสดง Fallback โดยส่ง email เข้าไปด้วยเผื่อกรณีชื่อว่าง */}
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-black text-sm">
              {getInitials(user?.first_name, user?.last_name, user?.email)}
            </AvatarFallback>
          </Avatar>
          
          {/* Green Dot แสดงสถานะ Online */}
          <span className="absolute bottom-0.5 right-0.5 block h-3 w-3 rounded-full ring-2 ring-white bg-emerald-500 shadow-sm" />
        </div>
      </div>
    </div>
  );
}