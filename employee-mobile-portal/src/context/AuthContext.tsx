import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "../api/axios";

interface AuthContextType {
  isAuthenticated: boolean | null; // null คือกำลังโหลดสถานะ
  user: any;
  login: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// สร้าง Interface เพื่อบอก TypeScript ว่าคอมโพเนนต์นี้ต้องมี children
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/users/me/");
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err: any) {
        // ตรวจสอบว่าถ้าเป็น 401 หรือ Token พัง
        if (err.response?.status === 401) {
          console.warn("Session expired, logging out...");
        }

        // สำคัญ: ต้องเซตเป็น false และ null เพื่อให้ระบบ "ยอมรับ" ว่าไม่ได้ล็อกอินแล้ว
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false); // เลิกโชว์ Loading (ถ้ามี)
      }
    };

    checkAuth();
  }, []);

  // ตัวอย่างง่ายๆ สำหรับโปรเจกต์คุณ (ใช้เช็คจาก localStorage เบื้องต้นคู่กับ Cookie)
  useEffect(() => {
    const authStatus = localStorage.getItem("is_logged_in") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  const login = (userData: any) => {
    localStorage.setItem("is_logged_in", "true");
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("is_logged_in");
    setIsAuthenticated(false);
    setUser(null);
  };

  // 3. ป้องกันแอป Render ก่อนโหลดเสร็จ (กัน Infinite Redirect)
  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-slate-50 font-black text-primary animate-pulse">ecoNekT...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};