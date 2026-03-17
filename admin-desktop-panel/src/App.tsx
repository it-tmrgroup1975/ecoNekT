import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

// หน้าจำลอง (เดี๋ยวเราจะสร้างตัวจริงทีหลัง)
const Employees = () => <div className="text-2xl font-bold">จัดการข้อมูลพนักงาน</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/employees" element={<AdminLayout><Employees /></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;