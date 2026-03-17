import React from "react"
import { Home, Calendar, QrCode, User, FileText, type LucideIcon } from "lucide-react"
import { NavLink } from "react-router-dom"

// 1. สร้าง Interface สำหรับ Props ให้ชัดเจน
interface MobileNavItemProps {
  to: string;
  icon: LucideIcon; // รับ Component Icon เข้ามาโดยตรง
  label: string;
}

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-24">
      {/* ... Header เดิม ... */}
      
      <main className="flex-1 px-4 py-6 animate-in zoom-in-95 duration-300">
        {children}
      </main>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-6 left-4 right-4 z-50 bg-white shadow-2xl rounded-2xl border border-border/50 h-18 flex items-center justify-around px-2 backdrop-blur-md bg-opacity-95">
        <MobileNavItem to="/home" icon={Home} label="หน้าแรก" />
        <MobileNavItem to="/attendance" icon={Calendar} label="ลงเวลา" />
        
        {/* Main Action Button (QR Scan) */}
        <button className="relative -top-6 bg-primary text-white p-4 rounded-full shadow-lg shadow-primary/40 ring-4 ring-background transition-transform active:scale-90">
          <QrCode className="w-7 h-7" />
        </button>

        <MobileNavItem to="/payroll" icon={FileText} label="สลิป" />
        <MobileNavItem to="/profile" icon={User} label="โปรไฟล์" />
      </nav>
    </div>
  )
}

// 2. ปรับปรุงฟังก์ชัน MobileNavItem ให้ใช้ Icon เป็น Component
function MobileNavItem({ to, icon: Icon, label }: MobileNavItemProps) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex flex-col items-center gap-1 transition-colors ${
          isActive ? 'text-primary' : 'text-muted-foreground'
        }`
      }
    >
      {/* ส่ง className เข้าไปที่ Icon Component ได้เลยโดยตรง */}
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  )
}