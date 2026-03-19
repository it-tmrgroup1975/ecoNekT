import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

// 1. กำหนด Interface ของ User ให้ชัดเจน
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
}

// 2. อัปเดต Interface ของ Context ให้ครอบคลุม
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 3. สร้างฟังก์ชัน fetchProfile เพื่อดึงข้อมูลจาก Backend
  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // เรียก API เส้น /me หรือ /profile ของคุณ
      const response = await api.get("/users/me/"); 
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Fetch profile failed:", error);
      logout(); // ถ้า Token ผิดพลาดให้เตะออกทันที
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = (token: string) => {
    localStorage.setItem("access_token", token);
    // หลังจากเก็บ token ให้ดึง profile ทันที
    fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // 4. ส่งค่าให้ครบตามที่ Interface กำหนด
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user,           // เพิ่ม user
        login, 
        logout, 
        isLoading, 
        fetchProfile    // เพิ่ม fetchProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};