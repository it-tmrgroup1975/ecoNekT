import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserHeaderProps {
  className?: string;
}

export default function UserHeader({ className }: UserHeaderProps) {
  // ดึงข้อมูล user จาก AuthContext
  const { user, isAuthenticated } = useAuth();

  if (!user && isAuthenticated) {
    return <div className="h-16 bg-white animate-pulse" />; // Skeleton แบบง่าย
  }

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
    <div className={cn("flex items-center justify-between p-4 bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-100", className)}>
      {/* โลโก้แอปฝั่งซ้าย */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-black text-primary italic tracking-tighter leading-none">ecoNekT</h1>
        <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase pl-0.5">EMPLOYEE Portal</span>
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
        <div className="relative group cursor-pointer active:scale-95 transition-transform">
          <Avatar className="w-11 h-11 border-2 border-white shadow-xl ring-1 ring-slate-100 overflow-hidden">
            {/* 1. ใส่ Full URL จาก API */}
            <AvatarImage
              src={user?.avatar_url || ''}
              className="object-cover"
              alt={displayName}
            />
            {/* 2. Fallback จะทำงานเมื่อ src เป็น null หรือโหลดรูปไม่สำเร็จ */}
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm uppercase">
              {getInitials(user?.first_name, user?.last_name, user?.email)}
            </AvatarFallback>
          </Avatar>

          {/* Status indicator (UX: ทำให้แอปดูมีชีวิต) */}
          <div className="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
}