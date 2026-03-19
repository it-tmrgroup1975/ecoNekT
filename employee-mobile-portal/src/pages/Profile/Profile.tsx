import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { User, LogOut, ChevronRight, ShieldCheck, Mail } from "lucide-react";
import { ListSkeleton } from "../../components/shared/MobileSkeletons"; //

export default function Profile() {
  const { logout, user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      // 1. แจ้ง Backend ให้ลบ Cookie (HttpOnly)
      await api.post("/users/logout/");
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      // 2. เคลียร์ State และดีดไปหน้า Login ทันที
      logout();
    }
  };

  /* If user data is not yet available but the user is authenticated, 
     show the ListSkeleton to maintain UI consistency during data fetching.
  */
  if (!user && isAuthenticated) {
    return <ListSkeleton />; //
  }

  // จัดการชื่อแสดงผลกรณีชื่อจริงยังเป็นค่าว่าง
  const displayName = user?.first_name 
    ? `${user.first_name} ${user.last_name}`.trim() 
    : user?.email?.split('@')[0] || "User";

  return (
    /* We removed the <MobileLayout> wrapper here because this page is now 
       rendered inside the <Outlet /> of MobileLayout defined in App.tsx.
    */
    <div className="flex flex-col space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Profile Header (UI/UX ระดับโลก) */}
      <div className="flex flex-col items-center py-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/5 to-transparent" />
        
        <div className="relative z-10">
          <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-2xl overflow-hidden ring-1 ring-slate-100">
            <img 
              // เปลี่ยนจาก user.avatar เป็น user.avatar_url ตามข้อมูลจริงจาก API
              src={user?.avatar_url || "https://ui-avatars.com/api/?name=" + displayName} 
              alt="Avatar" 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
            />
          </div>
          {/* Status Indicator พร้อม Animation */}
          <div className="absolute bottom-2 right-2 bg-emerald-500 border-4 border-white w-7 h-7 rounded-full shadow-lg animate-pulse" />
        </div>
        
        <div className="text-center mt-5 z-10">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {displayName}
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full">
              {user?.role === 'admin' ? 'ผู้ดูแลระบบ' : (user?.position || "พนักงาน")}
            </span>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="space-y-3">
        <h3 className="px-5 text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <     Mail className="w-3 h-3" /> ข้อมูลการติดต่อ
        </h3>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
          <span className="text-sm font-bold text-slate-500">อีเมลพนักงาน</span>
          <span className="text-sm font-black text-slate-800">{user?.email}</span>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="space-y-3">
        <h3 className="px-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
          บัญชีและสิทธิ์
        </h3>
        <div className="bg-white rounded-[2rem] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
          <ProfileMenuItem icon={User} label="ข้อมูลส่วนตัว" />
          <ProfileMenuItem icon={ShieldCheck} label="เปลี่ยนรหัสผ่าน" />
        </div>
      </div>

      {/* Logout Button (ปรับให้ดู Minimal ขึ้น) */}
      <button 
        onClick={handleLogout} 
        className="group flex items-center justify-center gap-3 w-full py-5 text-destructive font-black bg-white hover:bg-destructive/5 rounded-3xl border border-slate-100 transition-all active:scale-95 shadow-sm"
      >
        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        ออกจากระบบ
      </button>

      <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
        ecoNekT Portal v1.0.26
      </p>
    </div>
  );
}

// Sub-component เมนู
function ProfileMenuItem({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="group flex items-center justify-between p-5 active:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
    </div>
  );
}