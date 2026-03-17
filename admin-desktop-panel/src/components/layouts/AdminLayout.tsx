import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { TooltipProvider } from "../../components/ui/tooltip" // 1. เพิ่มการ Import นี้
import { AppSidebar } from "./AppSidebar"
import { UserNav } from "./UserNav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    /* 2. หุ้มทุกอย่างด้วย TooltipProvider */
    <TooltipProvider delayDuration={0}> 
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden bg-background font-sans">
          <AppSidebar />
          <main className="flex-1 flex flex-col min-w-0 relative overflow-y-auto">
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="h-4 w-[1px] bg-border" />
                <h2 className="text-sm font-medium text-muted-foreground">ecoNekT Admin</h2>
              </div>
              <UserNav />
            </header>

            {/* Page Content */}
            <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}