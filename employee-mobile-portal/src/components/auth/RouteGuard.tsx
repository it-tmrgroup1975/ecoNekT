import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// 1. ProtectedRoute: สำหรับหน้าภายใน (ต้อง Login เท่านั้น)
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  // ระหว่างที่รอดึงข้อมูล Profile จาก API /me/ ให้แสดง Loading ก่อน
  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ถ้าไม่ได้ Login ให้ดีดไปหน้า Login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// 2. PublicRoute: สำหรับหน้า Login (ถ้า Login แล้ว ห้ามเข้าหน้านี้ ให้เด้งไป Home)
export const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return null; // หรือ loading spinner
  }

  // ถ้า Login แล้ว แต่พยายามเข้าหน้า Login ให้ดีดไปหน้า Home
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};