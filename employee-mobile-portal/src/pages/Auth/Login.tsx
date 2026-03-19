// src/pages/Login/Login.tsx
import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. ยิง API Login ไปที่ Backend
      const response = await api.post("/users/login/", { email, password });
      
      // 2. ดึงข้อมูลจาก Response (อ้างอิงตาม SimpleJWT และโครงสร้าง User ของคุณ)
      const { access, refresh, user } = response.data;

      // 3. บันทึก Token ลง localStorage เพื่อให้ axios.ts นำไปใช้
      if (access) {
        // ใช้ key 'access_token' ให้ตรงกับที่เขียนไว้ใน api/axios.ts
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('is_logged_in', 'true');
      }
      
      // 4. อัปเดตสถานะใน AuthContext (Zustand หรือ Context ที่คุณใช้)
      login(user); 
      
      // 5. เมื่อบันทึกสำเร็จแล้วจึงค่อย Navigate ไปหน้าหลัก
      navigate("/home"); 
    } catch (err: any) {
      console.error("Login error:", err);
      const message = err.response?.data?.detail || "ล็อกอินไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน";
      alert(message);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center px-8 bg-slate-50 animate-in fade-in duration-500">
      <div className="max-w-sm mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black text-primary italic tracking-tighter text-blue-600">ecoNekT</h1>
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
          
          <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-lg shadow-primary/20">
            เข้าสู่ระบบ
          </Button>
        </form>
      </div>
    </div>
  );
}