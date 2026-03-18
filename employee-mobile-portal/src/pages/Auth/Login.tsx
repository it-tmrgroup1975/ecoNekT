import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // 1. นำเข้า useAuth
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // 2. ดึงฟังก์ชัน login มาใช้

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // เรียก API Login (Backend จะส่ง Set-Cookie กลับมาให้เอง)
      const response = await api.post("/users/login/", { email, password });
      
      // 3. อัปเดตสถานะใน AuthContext ทันที
      // ส่งข้อมูล user ที่ได้จาก response.data.user ไปเก็บใน Context
      login(response.data.user); 
      
      // 4. นำทางไปหน้าหลัก (ProtectedRoute จะอนุญาตให้เข้าแล้ว)
      navigate("/home"); 
    } catch (err) {
      console.error("Login error:", err);
      alert("ล็อกอินไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center px-8 bg-slate-50 animate-in fade-in duration-500">
      <div className="max-w-sm mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black text-primary italic tracking-tighter">ecoNekT</h1>
          <p className="text-muted-foreground font-medium">Employee Portal System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input 
              type="email" 
              placeholder="อีเมลพนักงาน" 
              className="h-12 rounded-xl border-slate-200 focus:ring-primary"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <Input 
              type="password" 
              placeholder="รหัสผ่าน" 
              className="h-12 rounded-xl border-slate-200 focus:ring-primary"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          
          <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
            เข้าสู่ระบบ
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground italic">
          &copy; 2026 ecoNekT Corporation. All rights reserved.
        </p>
      </div>
    </div>
  );
}