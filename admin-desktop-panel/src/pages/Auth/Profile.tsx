import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Mail, Shield, User, Camera } from "lucide-react";

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || "U"}`.toUpperCase();

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-[oklch(0.99_0.005_280)] min-h-screen animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">ข้อมูลส่วนตัว</h2>
        <p className="text-muted-foreground">จัดการข้อมูลบัญชีและสิทธิ์การเข้าใช้งานของคุณ</p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Left Card: Profile Snapshot */}
        <Card className="md:col-span-4 border-none shadow-xl shadow-primary/5 bg-card ring-1 ring-border/50 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary to-secondary opacity-80" />
          <CardContent className="relative pt-0 flex flex-col items-center">
            <div className="relative -mt-12 group cursor-pointer">
              <Avatar className="h-32 w-32 border-4 border-background shadow-2xl transition-transform group-hover:scale-105">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Camera className="text-white w-6 h-6" />
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-foreground">{user.first_name} {user.last_name}</h3>
              <Badge variant="secondary" className="mt-2 bg-secondary/10 text-secondary hover:bg-secondary/20 border-none px-4">
                {user.role?.toUpperCase() || "STAFF"}
              </Badge>
            </div>

            <div className="w-full mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-muted/30 text-muted-foreground border border-transparent hover:border-primary/20 transition-colors">
                <Mail className="size-4 text-primary" />
                {user.email}
              </div>
              <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-muted/30 text-muted-foreground border border-transparent hover:border-primary/20 transition-colors">
                <Shield className="size-4 text-primary" />
                สิทธิ์การใช้งาน: {user.role === 'admin' ? 'ผู้ดูแลระบบสูงสุด' : 'พนักงานทั่วไป'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Card: Edit Form */}
        <Card className="md:col-span-8 border-none shadow-xl shadow-primary/5 bg-card ring-1 ring-border/50">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User className="size-5 text-primary" />
              รายละเอียดบัญชี
            </CardTitle>
            <CardDescription>ข้อมูลเหล่านี้จะถูกนำไปใช้ในเอกสารและรายงานต่างๆ ของระบบ</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">ชื่อจริง</Label>
                <Input id="firstName" defaultValue={user.first_name} className="focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">นามสกุล</Label>
                <Input id="lastName" defaultValue={user.last_name} className="focus:ring-primary/20" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">อีเมลพนักงาน (ไม่สามารถเปลี่ยนได้)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground/50" />
                <Input id="email" defaultValue={user.email} disabled className="pl-9 bg-muted/50 border-dashed" />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button className="px-10 h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
                บันทึกการเปลี่ยนแปลง
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;