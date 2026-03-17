import React from "react"
import { Home, Calendar, QrCode, User, FileText, type LucideIcon } from "lucide-react"
import { NavLink } from "react-router-dom"

interface MobileNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans pb-28">
      {/* Top Header: ใช้ Sky Blue Gradient จางๆ เพื่อความสดใส */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border/50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ecoNekT
        </h1>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          </div>
        </div>
      </header>
      
      <main className="flex-1 px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      {/* Navigation Bar: เน้นความโค้งมนและความลอย (Floating) */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 bg-white/90 shadow-[0_20px_50px_rgba(124,58,237,0.15)] rounded-[2rem] border border-white/50 h-20 flex items-center justify-around px-4 backdrop-blur-2xl">
        <MobileNavItem to="/home" icon={Home} label="หน้าแรก" />
        <MobileNavItem to="/attendance" icon={Calendar} label="ลงเวลา" />
        
        {/* Center Action Button: ใช้ Violet Primary เด่นชัด */}
        <div className="relative">
          <button className="relative -top-10 bg-primary text-white p-5 rounded-2xl shadow-xl shadow-primary/40 ring-[6px] ring-background transition-all active:scale-95 hover:rotate-12">
            <QrCode className="w-8 h-8" />
          </button>
        </div>

        <MobileNavItem to="/payroll" icon={FileText} label="สลิป" />
        <MobileNavItem to="/profile" icon={User} label="โปรไฟล์" />
      </nav>
    </div>
  )
}

function MobileNavItem({ to, icon: Icon, label }: MobileNavItemProps) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex flex-col items-center gap-1.5 transition-all duration-300 ${
          isActive ? 'text-primary scale-110' : 'text-muted-foreground hover:text-secondary'
        }`
      }
    >
      <Icon className="w-6 h-6 stroke-[2.5]" />
      <span className="text-[10px] font-bold tracking-tight uppercase">{label}</span>
    </NavLink>
  )
}