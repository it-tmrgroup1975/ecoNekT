import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext"; // [1] นำเข้า useAuth

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import api from "../../api/axios";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // [2] ดึงฟังก์ชัน login มาใช้งาน

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/users/login/", {
        email,
        password,
      });

      const { access, refresh } = response.data;

      // [3] เก็บ refresh token ไว้ใน localStorage (เป็นส่วนเสริม)
      localStorage.setItem("refresh_token", refresh);

      // [4] เรียกใช้ login() จาก Context แทนการ setItem(access_token) ด้วยตัวเอง
      // ฟังก์ชันนี้จะทำการ localStorage.setItem("access_token", access) 
      // และสั่ง setIsAuthenticated(true) ทำให้ UI เปลี่ยนทันที
      login(access); 

      toast.success("เข้าสู่ระบบสำเร็จ", {
        description: "ยินดีต้อนรับเข้าสู่ระบบจัดการองค์กร",
      });

      // [5] นำทางไปยัง Dashboard
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error("การเข้าสู่ระบบล้มเหลว", {
        description: error.response?.data?.detail || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background p-4">
      <div className="w-full max-w-[400px] animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="p-3 rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <ShieldCheck className="size-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            ERP Enterprise
          </h1>
          <p className="text-muted-foreground text-sm">
            ลงชื่อเข้าใช้งานเพื่อจัดการระบบ
          </p>
        </div>

        <Card className="border-none shadow-2xl shadow-primary/5 ring-1 ring-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">ยินดีต้อนรับกลับมา</CardTitle>
            <CardDescription>
              กรอกข้อมูลของคุณเพื่อเข้าสู่แผงควบคุมหลัก
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">
                  อีเมล
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">
                    รหัสผ่าน
                  </label>
                  <Button variant="link" size="xs" className="px-0 font-normal">
                    ลืมรหัสผ่าน?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full h-10 text-sm font-semibold" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
              <p className="text-center text-[12px] text-muted-foreground">
                การเข้าสู่ระบบหมายความว่าคุณยอมรับ 
                <span className="text-primary hover:underline cursor-pointer ml-1">ข้อกำหนดการใช้งาน</span>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;