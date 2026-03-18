import { useState, useEffect, type ReactNode } from "react" //
import { Home, Calendar, QrCode, User, FileText, type LucideIcon } from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"
import api from "../../api/axios" //

// 1. นำเข้า UserHeader (Avatar และชื่อพนักงาน)
import UserHeader from "./UserHeader";

interface MobileNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  badgeCount?: number; // Prop สำหรับแสดงตัวเลขแจ้งเตือน
}

interface MobileLayoutProps {
  children?: ReactNode; // ใช้เครื่องหมาย ? เพื่อบอกว่าจะมีหรือไม่มีก็ได้ (Optional)
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  // State สำหรับจัดการข้อมูลการแจ้งเตือน
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // ดึงข้อมูลจำนวนการแจ้งเตือนที่ยังไม่ได้อ่านจาก API
  useEffect(() => {
    const fetchUnreadCount = async () => {
      // 1. เพิ่มเงื่อนไข: ถ้ายังไม่ Login ไม่ต้องเรียก API
      // (สมมติว่าคุณมีสถานะจาก AuthContext หรือเช็คจาก Cookie เบื้องต้น)
      try {
        const res = await api.get("/users/notifications/unread_count/");
        setUnreadCount(res.data.unread_count);
      } catch (err: any) {
        // 2. ถ้าเจอ 401 หรือ 500 ให้เงียบไว้ก่อน (Fallback)
        console.error("Notification Fetch Error:", err.message);
        setUnreadCount(0);
      }
    };

    // เรียกครั้งแรกทันทีที่โหลดคอมโพเนนต์
    fetchUnreadCount();

    // ตั้งเวลา Refresh ทุก 1 นาที (Polling) เพื่อให้ข้อมูลเป็นปัจจุบัน
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const hasUnread = unreadCount > 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-24 shadow-2xl shadow-slate-200">

      {/* 2. วาง UserHeader ไว้บนสุดของทุกหน้า */}
      <UserHeader />

      {/* ส่วนเนื้อหาหลัก */}
      <main className="flex-grow p-4 animate-in zoom-in-95 duration-300">
        <Outlet />
      </main>

      {/* แถบเมนูด้านล่าง (Fixed Bottom Navigation) */}
      <nav className="fixed bottom-6 left-4 right-4 z-50 bg-white shadow-2xl rounded-2xl border border-border/50 h-18 flex items-center justify-around px-2 backdrop-blur-md bg-opacity-95 max-w-sm mx-auto">
        <MobileNavItem to="/home" icon={Home} label="หน้าแรก" />
        <MobileNavItem to="/attendance" icon={Calendar} label="ลงเวลา" />

        {/* ปุ่ม QR Code ตรงกลาง */}
        <button className="relative -top-6 bg-primary text-white p-4 rounded-full shadow-lg shadow-primary/40 ring-4 ring-background transition-transform active:scale-90">
          <QrCode className="w-7 h-7" />
        </button>

        <MobileNavItem to="/payroll" icon={FileText} label="สลิป" />

        {/* เมนูโปรไฟล์พร้อม Notification Badge */}
        <div className="relative">
          <MobileNavItem to="/profile" icon={User} label="โปรไฟล์" />
          {hasUnread && (
            <span className="absolute -top-1 right-1 bg-destructive text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </nav>
    </div>
  )
}

function MobileNavItem({ to, icon: Icon, label }: MobileNavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'
        }`
      }
    >
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  )
}