import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { User, LogOut, ChevronRight, ShieldCheck } from "lucide-react";

export default function Profile() {
  // ดึง logout และข้อมูล user จาก AuthContext
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      // 1. แจ้ง Backend ให้ลบ Cookie (Server-side)
      await api.post("/users/logout/");
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      // 2. เคลียร์ State ใน React (Client-side) ไม่ว่าจะเรียก API สำเร็จหรือไม่
      // เพื่อให้ ProtectedRoute ทำงานทันที
      logout();
    }
  };

  return (
    <div className="flex flex-col space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header */}
      <div className="flex flex-col items-center py-8 bg-white rounded-[2.5rem] border border-primary/5 shadow-sm">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-primary/10 border-4 border-white shadow-xl overflow-hidden">
            <img 
              src={user?.avatar || "https://github.com/shadcn.png"} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="absolute bottom-1 right-1 bg-emerald-500 border-4 border-white w-6 h-6 rounded-full" />
        </div>
        
        <div className="text-center mt-4">
          <h2 className="text-2xl font-black text-foreground">
            {user?.first_name} {user?.last_name}
          </h2>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">
            {user?.position || "Fullstack Developer"}
          </p>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="space-y-2">
        <h3 className="px-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
          บัญชีและสิทธิ์
        </h3>
        <div className="bg-white rounded-3xl border border-primary/5 divide-y divide-primary/5 overflow-hidden">
          <ProfileMenuItem icon={User} label="ข้อมูลส่วนตัว" />
          <ProfileMenuItem icon={ShieldCheck} label="เปลี่ยนรหัสผ่าน" />
        </div>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout} 
        className="group flex items-center justify-center gap-3 w-full py-4 text-destructive font-black bg-destructive/5 hover:bg-destructive/10 rounded-2xl transition-all active:scale-95 mt-4"
      >
        <LogOut className="w-5 h-5" />
        ออกจากระบบ
      </button>
    </div>
  );
}

// Sub-component สำหรับเมนู
function ProfileMenuItem({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center justify-between p-4 active:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold text-foreground">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </div>
  );
}