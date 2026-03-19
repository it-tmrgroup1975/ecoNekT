import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import EmployeeList from "./pages/Employees/EmployeeIndex";
import Attendance from "./pages/Attendance/Attendance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/employees" element={<AdminLayout><EmployeeList /></AdminLayout>} />
        <Route path="/attendance" element={<AdminLayout><Attendance /></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;