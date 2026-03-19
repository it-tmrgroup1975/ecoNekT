import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2 } from "lucide-react";

// สำหรับหน้าที่ต้อง Login เท่านั้นถึงจะเข้าได้
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// สำหรับหน้า Login/Register (ถ้า Login แล้วให้ดีดไปหน้า Dashboard ทันที)
export const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};