import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MobileLayout from "./components/layouts/MobileLayout";

// --- Mock Components สำหรับ Demo (เดี๋ยวเราจะสร้างไฟล์แยกในภายหลัง) ---
const Home = () => (
  <div className="space-y-4">
    <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20">
      <h2 className="text-sm font-medium text-primary">สวัสดีตอนเช้า</h2>
      <p className="text-2xl font-bold text-foreground">คุณพนักงาน สมชาย</p>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm border">
        <p className="text-xs text-muted-foreground">เวลาเข้างานวันนี้</p>
        <p className="text-lg font-bold text-success">08:30 น.</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm border">
        <p className="text-xs text-muted-foreground">ชั่วโมงทำงานสะสม</p>
        <p className="text-lg font-bold text-secondary">160 ชม.</p>
      </div>
    </div>
  </div>
);

const Attendance = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">บันทึกเวลาทำงาน</h2>
    <div className="aspect-square w-full bg-slate-200 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-300">
      <p className="text-muted-foreground italic">ส่วนแสดงแผนที่ / GPS Check-in</p>
    </div>
  </div>
);

const Payroll = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">สลิปเงินเดือน</h2>
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white p-4 rounded-xl border flex justify-between items-center">
        <div>
          <p className="font-bold">มีนาคม 2026</p>
          <p className="text-xs text-muted-foreground">โอนเข้าบัญชีแล้ว</p>
        </div>
        <button className="text-primary font-medium text-sm">ดู PDF</button>
      </div>
    ))}
  </div>
);

const Profile = () => (
  <div className="flex flex-col items-center py-6 space-y-4">
    <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-white shadow-lg overflow-hidden">
      <img src="https://github.com/shadcn.png" alt="Avatar" className="w-full h-full object-cover" />
    </div>
    <div className="text-center">
      <h2 className="text-xl font-bold">สมชาย รักงาน</h2>
      <p className="text-sm text-muted-foreground">Fullstack Developer | IT Dept.</p>
    </div>
    <button className="w-full py-3 text-destructive font-bold bg-destructive/10 rounded-xl">
      ออกจากระบบ
    </button>
  </div>
);

// --- Main App Component ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect หน้าแรกไปที่ /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* หุ้มทุกหน้าด้วย MobileLayout เพื่อให้มี Bottom Navigation ตลอดเวลา */}
        <Route
          path="/home"
          element={
            <MobileLayout>
              <Home />
            </MobileLayout>
          }
        />
        <Route
          path="/attendance"
          element={
            <MobileLayout>
              <Attendance />
            </MobileLayout>
          }
        />
        <Route
          path="/payroll"
          element={
            <MobileLayout>
              <Payroll />
            </MobileLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MobileLayout>
              <Profile />
            </MobileLayout>
          }
        />

        {/* Fallback สำหรับหน้าที่ไม่พบ */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;