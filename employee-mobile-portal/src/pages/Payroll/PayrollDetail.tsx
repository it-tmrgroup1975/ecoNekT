import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Landmark } from "lucide-react";
import api from "../../api/axios";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { ListSkeleton } from "../../components/shared/MobileSkeletons"; // Import the shared skeleton component

export default function PayrollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      /* Show skeleton while fetching specific payroll detail from API */
      setLoading(true);
      try {
        const res = await api.get(`/payroll/my-payrolls/${id}/`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch payroll details:", err);
      } finally {
        /* Introduce a slight delay for smoother visual transition */
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchDetail();
  }, [id]);

  /* REFACTORING NOTE:
     We handle loading within the component to show a specialized skeleton.
     The parent MobileLayout will handle the general page transition skeleton.
  */
  if (loading) return <ListSkeleton />; 
  if (!data) return <div className="p-10 text-center font-bold text-slate-500">ไม่พบข้อมูล</div>;

  const raw = data.data_json || {}; // Raw data object from Excel/JSONField

  const handleDownloadPDF = () => {
    /* Backend URL configuration for PDF generation endpoint */
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    
    /* Open PDF slip in a new tab using the authenticated endpoint */
    window.open(`${backendUrl}/payroll/my-payrolls/${id}/pdf/`, '_blank');
  };

  return (
    /* Main container with entry animation. MobileLayout provides the overall padding and scroll. */
    <div className="flex flex-col space-y-4 pb-10 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Top Navigation Bar inside the page content */}
      <div className="flex items-center justify-between px-1">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">รายละเอียดสลิป</h2>
        <button 
          onClick={handleDownloadPDF} 
          className="p-2 bg-white rounded-xl shadow-sm text-primary hover:text-primary/80 transition-colors"
          aria-label="Download PDF"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Main Slip Card Component */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Slip Header: Displays payment period and date */}
        <div className="bg-slate-50 p-6 border-b border-dashed border-slate-200 text-center">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
            งวดการจ่ายที่ {data.period_no}
          </h3>
          <p className="text-lg font-black text-slate-800">
            {format(new Date(data.period_date), 'dd MMMM yyyy', { locale: th })}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Earnings & Deductions Grid Section */}
          <div className="grid grid-cols-2 gap-8 relative">
            {/* Visual separator for desktop-like view on larger mobile screens */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-100 hidden sm:block" />

            {/* Earnings Section (Emerald Theme) */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest border-b border-emerald-50 pb-1">รายได้ (Earnings)</h4>
              <DetailRow label="เงินเดือน/ค่าแรง" value={data.salary_wage} />
              <DetailRow label="OT 1.5" value={raw.ot1} />
              <DetailRow label="เบี้ยขยัน" value={data.incentive} />
              <DetailRow label="อื่นๆ" value={raw.others_income} />
              <div className="pt-2 flex justify-between font-black text-slate-800 text-xs border-t border-slate-50 mt-1">
                <span>รวมเงินได้</span>
                <span>{Number(data.total_earnings).toLocaleString()}</span>
              </div>
            </div>

            {/* Deductions Section (Rose Theme) */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest border-b border-rose-50 pb-1">รายการหัก (Deductions)</h4>
              <DetailRow label="ภาษีเงินได้" value={data.income_tax} />
              <DetailRow label="ประกันสังคม" value={data.social_security} />
              <DetailRow label="มาสาย/ขาดงาน" value={raw.late_deduction} />
              <div className="pt-2 flex justify-between font-black text-rose-600 text-xs border-t border-rose-50 mt-1">
                <span>รวมรายการหัก</span>
                <span>{Number(data.total_deductions).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Net Pay Highlight Box: Primary focus of the slip */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white flex items-center justify-between shadow-lg">
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

          {/* Year-To-Date (YTD) Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <YTDBox label="เงินได้สุทธิสะสม" value={data.ytd_net_income} />
            <YTDBox label="ประกันสังคมสะสม" value={raw.ytd_social_security} />
          </div>
        </div>
      </div>

      {/* Confidentiality Footer Notice */}
      <p className="text-[10px] text-center text-slate-400 font-bold px-10 italic leading-relaxed">
        * ข้อมูลนี้เป็นความลับของบริษัท ห้ามมิให้เปิดเผยแก่บุคคลภายนอก
      </p>
    </div>
  );
}

/** * Helper Component: DetailRow
 * Renders a row for specific earnings or deductions. Hides row if value is zero.
 */
function DetailRow({ label, value }: { label: string, value: any }) {
  if (!value || value === "0" || value === "0.00" || value === 0) return null;
  return (
    <div className="flex justify-between text-[11px] font-bold text-slate-500">
      <span>{label}</span>
      <span className="text-slate-700">{Number(value).toLocaleString()}</span>
    </div>
  );
}

/** * Helper Component: YTDBox
 * Renders a small box for Year-To-Date accumulated data.
 */
function YTDBox({ label, value }: { label: string, value: any }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 shadow-inner">
      <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</p>
      <p className="text-sm font-black text-slate-700">{Number(value || 0).toLocaleString()}</p>
    </div>
  );
}