import { useEffect, useState } from "react";
import { ListSkeleton } from "../../components/shared/MobileSkeletons";
import api from "../../api/axios";
import { Clock, CheckCircle2, AlertTriangle, UserCheck } from "lucide-react";
import { cn } from "../../lib/utils";

const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);
  const [summary, setSummary] = useState({ present_count: 0, late_count: 0, month_name: "" });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("No token found, redirecting to login...");
        // window.location.href = "/login"; // เปิดใช้งานถ้าต้องการให้ดีดไปหน้า login
        return;
      }

      try {
        setLoading(true);
        const [historyRes, summaryRes] = await Promise.all([
          api.get("/attendance/my-history/"),
          api.get("/attendance/my-summary/")
        ]);
        setRecords(historyRes.data);
        setSummary(summaryRes.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.error("Token invalid or expired");
          // localStorage.removeItem("token"); // ลบ token ที่เสียทิ้ง
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 pb-20">
      {/* Header Stat Card */}
      <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-sm font-medium opacity-80">สถิติการเข้างาน</h2>
          <p className="text-2xl font-black mt-1">เดือน{summary.month_name || "ปัจจุบัน"}</p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
              <p className="text-[10px] uppercase font-bold opacity-80">มาปกติ</p>
              <p className="text-xl font-black">{summary.present_count} วัน</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
              <p className="text-[10px] uppercase font-bold opacity-80">มาสาย</p>
              <p className="text-xl font-black">{summary.late_count} วัน</p>
            </div>
          </div>
        </div>
        <UserCheck className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
          บันทึกเวลาย้อนหลัง
        </h3>

        {loading ? (
          <ListSkeleton />
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div key={record.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    record.status === 'late' ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"
                  )}>
                    {record.status === 'late' ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">
                      {new Date(record.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {record.in_time}</span>
                      <span>•</span>
                      <span>ออก: {record.out_time || "--:--"}</span>
                    </div>
                  </div>
                </div>

                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                  record.status === 'late' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                )}>
                  {record.status === 'late' ? "Late" : "On Time"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;