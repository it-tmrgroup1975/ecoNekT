import { LayoutDashboard, Users, Clock, Banknote, ShieldCheck, Settings, ChevronRight } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "../../components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils";
import { useEffect } from "react";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "พนักงาน", url: "/employees", icon: Users },
  { title: "ลงเวลาทำงาน", url: "/attendance", icon: Clock },
  { title: "เงินเดือน (Payroll)", url: "/payroll", icon: Banknote },
  { title: "การประเมิน & KPI", url: "/kpi", icon: ShieldCheck },
  { title: "ตั้งค่าระบบ", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar(); // 'expanded' หรือ 'collapsed'
  const isCollapsed = state === "collapsed";

  // ใช้ useEffect เพื่อตรวจจับการเปลี่ยนแปลงของ state และบันทึกลง localStorage
  useEffect(() => {
    // บันทึกค่า: ถ้าเป็น 'expanded' เก็บ true, ถ้าเป็น 'collapsed' เก็บ false
    const isOpen = state === "expanded";
    localStorage.setItem("sidebar_state", JSON.stringify(isOpen));
  }, [state]); // ทำงานทุกครั้งที่ state ของ Sidebar เปลี่ยนแปลง

  return (
    <Sidebar 
      variant="floating" 
      collapsible="icon" 
      className="border-primary/10 bg-background/50 backdrop-blur-xl transition-all duration-500"
    >

      <SidebarHeader className={cn(
        "flex items-center justify-center transition-all duration-500 py-8",
        isCollapsed ? "px-0" : "px-6"
      )}>
        {isCollapsed ? (
          /* โลโก้ตอนยุบ: อักษรตัวแรกสีเด่นในวงกลม Glassmorphism */
          <div className="flex h-11 w-11 items-center justify-center rounded-xl animate-in zoom-in-50 duration-300">
            <div className="font-black tracking-tighter bg-gradient-to-br from-primary via-primary to-secondary bg-clip-text text-transparent">
              <span className="flex justify-end text-sm -mb-2.5">eco</span>
              <span className="text-xl">NekT</span>
            </div>
          </div>
        ) : (
          /* โลโก้ตอนขยาย: ชื่อเต็มพร้อม Gradient */
          <div className="flex flex-col w-full animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-primary via-primary to-secondary bg-clip-text text-transparent">
              ecoNekT
            </h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50 mt-1">
              Workforce Intelligence
            </p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-0">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-primary/40 font-bold text-[10px] uppercase tracking-widest mb-2 px-4">
              Main Management
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive} 
                      tooltip={item.title}
                      className={cn(
                        "h-11 transition-all duration-300 rounded-xl",
                        "hover:bg-primary/5 hover:text-primary",
                        "data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-primary/25"
                      )}
                    >
                      <Link to={item.url} className="flex items-center w-full">
                        <item.icon className={cn(
                          "w-5 h-5 transition-transform duration-300",
                          isActive ? "scale-110" : "text-muted-foreground group-hover:text-primary"
                        )} />
                        {!isCollapsed && (
                          <div className="flex items-center justify-between w-full ml-3 animate-in fade-in duration-500">
                            <span className="font-semibold text-sm">{item.title}</span>
                            {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                          </div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Footer พื้นที่เล็กๆ ด้านล่าง */}
      {!isCollapsed && (
        <div className="p-4 mt-auto border-t border-primary/5">
          <div className="bg-secondary/5 rounded-2xl p-3 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">System Online</span>
          </div>
        </div>
      )}
    </Sidebar>
  )
}