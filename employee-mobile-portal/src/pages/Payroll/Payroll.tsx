import { useEffect, useState } from "react";
import { FileText, ChevronRight, TrendingUp } from "lucide-react";
import api from "../../api/axios"; 
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
// Import the skeleton component we created
import { ListSkeleton } from "../../components/shared/MobileSkeletons";

export default function Payroll() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        // Fetch payroll data from the backend API
        const response = await api.get("/payroll/my-payrolls/");
        setPayrolls(response.data);
      } catch (error) {
        console.error("Failed to fetch payrolls", error);
      } finally {
        // Small delay to ensure smooth transition from skeleton to content
        setLoading(false);
      }
    };

    fetchPayrolls();
  }, []);

  // Calculate the latest entry for the summary card
  const latestPayroll = payrolls.length > 0 ? payrolls[0] : null;

  /* REFACTORING NOTE: 
     We replaced the 'Loader2' full-screen spinner with 'ListSkeleton' 
     to match the modern enterprise look and feel.
  */
  if (loading) {
    return <ListSkeleton />;
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Header Summary - Displays actual data from the latest period */}
      <div className="bg-primary p-6 rounded-[2rem] text-white shadow-lg shadow-primary/20 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest">
            เงินได้สุทธิงวดล่าสุด ({latestPayroll ? `งวดที่ ${latestPayroll.period_no}` : '-'})
          </p>
          <h2 className="text-4xl font-black mt-2">
            {latestPayroll ? Number(latestPayroll.net_pay).toLocaleString() : "0.00"} 
            <span className="text-sm font-bold ml-1">฿</span>
          </h2>
          
          <div className="flex items-center gap-2 mt-4 bg-white/10 w-fit px-3 py-1 rounded-full text-[10px] font-bold">
            <TrendingUp className="w-3 h-3" /> 
            อัปเดตเมื่อ {latestPayroll ? format(new Date(latestPayroll.period_date), 'dd MMM yyyy', { locale: th }) : '-'}
          </div>
        </div>
        <FileText className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
      </div>

      {/* 2. Payroll History - Mapping data from database */}
      <div className="space-y-3">
        <h3 className="px-1 text-sm font-black text-slate-800 uppercase tracking-tight">
          ประวัติเงินเดือน ({payrolls.length} งวดล่าสุด)
        </h3>
        
        <div className="space-y-3">
          {payrolls.length > 0 ? (
            payrolls.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm active:scale-95 transition-all cursor-pointer hover:border-primary/20"
                onClick={() => navigate(`/payroll/${item.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary font-bold shadow-inner text-xs">
                    งวด {item.period_no}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">
                      รอบวันที่ {format(new Date(item.period_date), 'dd/MM/yyyy')}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">โอนเข้าบัญชีแล้ว</p>
                  </div>
                </div>
                
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      {Number(item.net_pay).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">สำเร็จ</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase">ไม่พบข้อมูลการจ่ายเงิน</p>
            </div>
          )}
        </div>
      </div>

      <button className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
        ขอหนังสือรับรองเงินเดือน (PDF)
      </button>
    </div>
  );
}