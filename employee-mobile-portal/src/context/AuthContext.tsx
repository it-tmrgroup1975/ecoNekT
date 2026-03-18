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

 useEffect(() => {
  api.get("/users/me/")
    .then((res) => {
      setIsAuthenticated(true);
      setUser(res.data);
    })
    .catch((err) => {
      console.error("ทำไมถึงโดนดีด?:", err.response?.data);
      // ถ้า 401 หรือ Error ให้เซตเป็น false เพื่อให้ PublicRoute ยอมให้เข้าหน้า Login
      setIsAuthenticated(false); 
      setUser(null);
    });
}, []);

  // ตัวอย่างง่ายๆ สำหรับโปรเจกต์คุณ (ใช้เช็คจาก localStorage เบื้องต้นคู่กับ Cookie)
  useEffect(() => {
    const authStatus = localStorage.getItem("is_logged_in") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  const login = (userData: any) => {
    localStorage.setItem("is_logged_in", "true");
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("is_logged_in");
    setIsAuthenticated(false);
    setUser(null);
  };

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