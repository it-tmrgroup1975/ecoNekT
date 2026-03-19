import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/shared/RouteGuards";

import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import EmployeeList from "./pages/Employees/EmployeeIndex";
import Attendance from "./pages/Attendance/Attendance";
import Login from "./pages/Auth/Login"; // หน้า Login ที่สร้างไว้ก่อนหน้า
import Profile from "./pages/Auth/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Public Routes: เข้าถึงได้เฉพาะตอนที่ยังไม่ได้ Login */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* 2. Protected Routes: ต้อง Login เท่านั้น */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout children={<Outlet />} />}> 
              {/* หมายเหตุ: ปรับ AdminLayout ให้รองรับ Outlet หรือส่งผ่าน element ปกติ */}
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* 3. Fallback: กรณีไม่พบหน้า */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// ปรับปรุง AdminLayout เล็กน้อยเพื่อให้ใช้งานกับ <Outlet /> ของ React Router ได้ง่ายขึ้น
// หรือจะใช้รูปแบบเดิมที่คุณมีคือ <AdminLayout><Component /></AdminLayout> ก็ได้เช่นกัน

export default App;