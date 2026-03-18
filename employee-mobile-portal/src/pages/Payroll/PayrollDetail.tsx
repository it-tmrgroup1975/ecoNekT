import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Printer, Landmark } from "lucide-react";
import api from "../../api/axios";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function PayrollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/payroll/my-payrolls/${id}/`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="p-10 text-center animate-pulse">กำลังแกะซองเงินเดือน...</div>;
  if (!data) return <div className="p-10 text-center">ไม่พบข้อมูล</div>;

  const raw = data.data_json || {}; // ข้อมูลดิบจาก Excel

  const handleDownloadPDF = () => {
    // ดึง Token จากที่ที่คุณเก็บไว้ (เช่น localStorage หรือจาก AuthContext)
    // สมมติว่าเก็บไว้ใน Cookie หรือ LocalStorage
    const backendUrl = "http://localhost:8000";

    // หมายเหตุ: การส่ง Token ผ่าน URL ควรทำเฉพาะกรณี Download ไฟล์ และตั้งค่า Token ให้หมดอายุเร็ว
    window.open(`${backendUrl}/api/payroll/my-payrolls/${id}/pdf/`, '_blank');
  };

  return (
    <div className="flex flex-col space-y-4 pb-20 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-1">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl shadow-sm">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">รายละเอียดสลิป</h2>
        <button onClick={handleDownloadPDF} className="p-2 bg-white rounded-xl shadow-sm text-primary">
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Main Slip Card */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Header ส่วนหัวสลิป */}
        <div className="bg-slate-50 p-6 border-b border-dashed border-slate-200 text-center">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">งวดการจ่ายที่ {data.period_no}</h3>
          <p className="text-lg font-black text-slate-800">
            {format(new Date(data.period_date), 'dd MMMM yyyy', { locale: th })}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Earnings & Deductions Grid */}
          <div className="grid grid-cols-2 gap-8 relative">
            {/* เส้นแบ่งกลาง */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-100 hidden sm:block" />

            {/* ฝั่งรายได้ */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest border-b border-emerald-50 pb-1">รายได้ (Earnings)</h4>
              <DetailRow label="เงินเดือน/ค่าแรง" value={data.salary_wage} />
              <DetailRow label="OT 1.5" value={raw.ot1} />
              <DetailRow label="เบี้ยขยัน" value={data.incentive} />
              <DetailRow label="อื่นๆ" value={raw.others_income} />
              <div className="pt-2 flex justify-between font-black text-slate-800 text-xs">
                <span>รวมเงินได้</span>
                <span>{Number(data.total_earnings).toLocaleString()}</span>
              </div>
            </div>

            {/* ฝั่งรายการหัก */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest border-b border-rose-50 pb-1">รายการหัก (Deductions)</h4>
              <DetailRow label="ภาษีเงินได้" value={data.income_tax} />
              <DetailRow label="ประกันสังคม" value={data.social_security} />
              <DetailRow label="มาสาย/ขาดงาน" value={raw.late_deduction} />
              <div className="pt-2 flex justify-between font-black text-rose-600 text-xs">
                <span>รวมรายการหัก</span>
                <span>{Number(data.total_deductions).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Net Pay Highlight */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">เงินได้สุทธิ</p>
              <p className="text-2xl font-black text-emerald-400">
                {Number(data.net_pay).toLocaleString()} <span className="text-xs font-bold text-white">฿</span>
              </p>
            </div>
            <div className="text-right">
              <Landmark className="w-8 h-8 opacity-20" />
            </div>
          </div>

          {/* YTD Info - ข้อมูลสะสมต้นปี */}
          <div className="grid grid-cols-2 gap-3">
            <YTDBox label="เงินได้สุทธิสะสม" value={data.ytd_net_income} />
            <YTDBox label="ประกันสังคมสะสม" value={raw.ytd_social_security} />
          </div>
        </div>
      </div>

      <p className="text-[10px] text-center text-slate-400 font-bold px-10 italic">
        * ข้อมูลนี้เป็นความลับของบริษัท ห้ามมิให้เปิดเผยแก่บุคคลภายนอก
      </p>
    </div>
  );
}

// --- Helper Components ---
function DetailRow({ label, value }: { label: string, value: any }) {
  if (!value || value === "0" || value === "0.00") return null;
  return (
    <div className="flex justify-between text-[11px] font-bold text-slate-500">
      <span>{label}</span>
      <span className="text-slate-700">{Number(value).toLocaleString()}</span>
    </div>
  );
}

function YTDBox({ label, value }: { label: string, value: any }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
      <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</p>
      <p className="text-sm font-black text-slate-700">{Number(value || 0).toLocaleString()}</p>
    </div>
  );
}