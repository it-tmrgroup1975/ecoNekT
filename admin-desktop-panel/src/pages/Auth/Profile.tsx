import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../api/user"; // นำเข้า service
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
import { toast } from "sonner";
import { 
  Mail, Shield, User, Camera, KeyRound, Loader2, Eye, EyeOff 
} from "lucide-react";

const Profile: React.FC = () => {
  const { user, fetchProfile } = useAuth();
  
  // States สำหรับ Profile
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });

  // Sync ข้อมูลจาก AuthContext ลงใน Local State เมื่อโหลดหน้า
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      });
    }
  }, [user]);

  // States สำหรับ Change Password
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  if (!user) return null;

  // ฟังก์ชันอัปเดตข้อมูลส่วนตัว
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await userService.updateProfile(formData);
      // CRITICAL: เรียก fetchProfile เพื่ออัปเดตข้อมูลใน Context 
      // ทำให้ชื่อบน UserNav และส่วนอื่นๆ เปลี่ยนตามทันที
      await fetchProfile(); 
      toast.success("อัปเดตข้อมูลส่วนตัวสำเร็จ");
    } catch (error: any) {
      toast.error("ไม่สามารถอัปเดตข้อมูลได้", {
        description: error.response?.data?.detail || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // ฟังก์ชันเปลี่ยนรหัสผ่าน
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      return toast.error("รหัสผ่านใหม่ไม่ตรงกัน");
    }

    setIsChangingPassword(true);
    try {
      await userService.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      // เคลียร์ฟอร์มรหัสผ่านเมื่อสำเร็จ
      setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
      toast.success("เปลี่ยนรหัสผ่านสำเร็จแล้ว");
    } catch (error: any) {
      toast.error("เปลี่ยนรหัสผ่านไม่สำเร็จ", {
        description: error.response?.data?.detail || "รหัสผ่านเดิมไม่ถูกต้อง"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-background min-h-screen animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-primary">การตั้งค่าบัญชี</h2>
        <p className="text-muted-foreground text-sm">จัดการข้อมูลส่วนตัวและรักษาความปลอดภัยของบัญชีคุณ</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Section: Profile Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl shadow-primary/5 ring-1 ring-border/50">
            <CardContent className="pt-8 flex flex-col items-center">
              <div className="relative group cursor-pointer">
                <Avatar className="h-32 w-32 border-4 border-background shadow-2xl transition-all group-hover:brightness-75">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white drop-shadow-md w-8 h-8" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-foreground">
                {user.first_name} {user.last_name}
              </h3>
              <Badge variant="secondary" className="mt-2 bg-secondary/10 text-secondary border-none px-4">
                {user.role?.toUpperCase()}
              </Badge>
              
              <div className="w-full mt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-muted/30 text-muted-foreground">
                  <Mail className="size-4 text-primary" /> {user.email}
                </div>
                <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-muted/30 text-muted-foreground">
                  <Shield className="size-4 text-primary" /> สิทธิ์: {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'พนักงาน'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Edit Profile Form */}
          <Card className="border-none shadow-xl shadow-primary/5 ring-1 ring-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="size-5 text-primary" /> ข้อมูลพื้นฐาน
              </CardTitle>
              <CardDescription>ข้อมูลที่จะแสดงผลในเอกสารและรายงานต่างๆ ในระบบ</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ชื่อจริง</Label>
                    <Input 
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>นามสกุล</Label>
                    <Input 
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button disabled={isUpdating} className="px-8 shadow-lg shadow-primary/20">
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    บันทึกข้อมูลส่วนตัว
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Form */}
          <Card className="border-none shadow-xl shadow-primary/5 ring-1 ring-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <KeyRound className="size-5" /> เปลี่ยนรหัสผ่าน
              </CardTitle>
              <CardDescription>ตั้งค่ารหัสผ่านใหม่เพื่อความปลอดภัยของบัญชี</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label>รหัสผ่านปัจจุบัน</Label>
                  <Input 
                    type={showPassword ? "text" : "password"}
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>รหัสผ่านใหม่</Label>
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ยืนยันรหัสผ่านใหม่</Label>
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-muted-foreground hover:bg-transparent"
                  >
                    {showPassword ? <EyeOff className="mr-2 size-4" /> : <Eye className="mr-2 size-4" />}
                    {showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  </Button>
                  <Button variant="destructive" disabled={isChangingPassword} className="px-8 shadow-lg shadow-destructive/10">
                    {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    อัปเดตรหัสผ่านใหม่
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;