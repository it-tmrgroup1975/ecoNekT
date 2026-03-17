import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Ring: ใช้สี Sky Blue (Secondary) เพื่อตัดกับสี Violet */}
        <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-secondary/20 hover:ring-secondary/40 transition-all">
          <Avatar className="h-10 w-10 border-2 border-background">
            <AvatarImage src="/avatars/admin-default.png" alt="Admin" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">AD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 border-primary/10 shadow-xl shadow-primary/5" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none text-primary">Super Admin</p>
            <p className="text-xs leading-none text-muted-foreground/70">admin@econekt.io</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/5" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer hover:bg-secondary/10 hover:text-secondary">โปรไฟล์</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:bg-secondary/10 hover:text-secondary">การตั้งค่า</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-primary/5" />
        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-medium">
          ออกจากระบบ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}