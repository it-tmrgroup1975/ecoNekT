import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/auth/RouteGuard";
import MobileLayout from "./components/layouts/MobileLayout";

// นำเข้า Pages (สมมติว่าคุณแยกไฟล์แล้ว)
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import NotificationList from "./pages/Notifications/NotificationList";
import { Attendance } from "./pages/Attendance/Attendance";
import { Payroll } from "./pages/Payroll/Payroll";

function App() {
  return (
    // แก้ไข Error: AuthProvider ต้องมี children เสมอ
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- 1. Public Routes (พนักงานที่ Login แล้ว ห้ามเข้าหน้านี้) --- */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* --- 2. Protected Routes (ต้อง Login เท่านั้น ถึงจะเห็นกลุ่มนี้) --- */}
          <Route element={<ProtectedRoute />}>
            {/* หุ้ม Layout ชั้นเดียวสำหรับทุกหน้าภายใน */}
            <Route element={<MobileLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<NotificationList />} />
              
              {/* Redirect หน้าแรกสุดไปที่ /home */}
              <Route path="/" element={<Navigate to="/home" replace />} />
            </Route>
          </Route>

          {/* --- 3. Fallback (หน้าที่ไม่พบ) --- */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;