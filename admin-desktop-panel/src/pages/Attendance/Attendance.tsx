import { useEffect, useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { cn } from "../../lib/utils";
import { ListSkeleton } from "../../components/shared/DesktopSkeletons";
import api from "../../api/axios";

const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
  const fetchHistory = async () => {
    // ดึง token มาเช็คก่อน (ถ้าคุณเก็บไว้ใน localStorage)
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.warn("No token found, skipping fetch");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/attendance/my-history/");
      setRecords(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error("Session expired or unauthorized");
        // อาจจะใช้ logout() ที่นี่ถ้า token หมดอายุจริง
      }
    } finally {
      setLoading(false);
    }
  };
  fetchHistory();
}, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary to-primary/80 p-6 rounded-3xl text-white shadow-lg">
        <h2 className="text-lg font-bold opacity-90">สรุปการลงเวลา</h2>
        <p className="text-3xl font-black mt-1">เดือนมีนาคม</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">
          ประวัติการลงเวลาย้อนหลัง
        </h3>

        {loading ? (
          <ListSkeleton />
        ) : (
          <div className="space-y-3">
            {records.length > 0 ? (
              records.map((record) => (
                <div key={record.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-xl",
                      record.status === 'late' ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"
                    )}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{record.date}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {record.in_time} - {record.out_time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-1 rounded-md",
                      record.status === 'late' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {record.status === 'late' ? "มาสาย" : "ปกติ"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 bg-white rounded-2xl border border-dashed">
                ไม่พบข้อมูลการลงเวลา
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;