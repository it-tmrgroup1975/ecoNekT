import { FileText, ChevronRight, TrendingUp } from "lucide-react";

export default function Payroll() {
  const mockPayrolls = [
    { id: 1, period: "งวดที่ 4", date: "28/02/2569", amount: "10,047.00" },
    { id: 2, period: "งวดที่ 3", date: "15/02/2569", amount: "9,850.00" },
    { id: 3, period: "งวดที่ 2", date: "31/01/2569", amount: "10,120.00" },
    { id: 4, period: "งวดที่ 1", date: "15/01/2569", amount: "9,900.00" },
  ];

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Summary */}
      <div className="bg-primary p-6 rounded-[2rem] text-white shadow-lg shadow-primary/20 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest">เงินได้สุทธิงวดล่าสุด</p>
          <h2 className="text-4xl font-black mt-2">10,047.00 <span className="text-sm font-bold">฿</span></h2>
          <div className="flex items-center gap-2 mt-4 bg-white/10 w-fit px-3 py-1 rounded-full text-[10px] font-bold">
            <TrendingUp className="w-3 h-3" /> เพิ่มขึ้น 2.5% จากงวดก่อน
          </div>
        </div>
        <FileText className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
      </div>

      {/* Payroll History */}
      <div className="space-y-3">
        <h3 className="px-1 text-sm font-black text-slate-800 uppercase tracking-tight">ประวัติเงินเดือน (4 งวดล่าสุด)</h3>
        
        <div className="space-y-3">
          {mockPayrolls.map((item) => (
            <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm active:scale-95 transition-all cursor-pointer hover:border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary font-bold shadow-inner">
                  {item.id}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">{item.period}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{item.date}</p>
                </div>
              </div>
              
              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="text-sm font-black text-slate-800">{item.amount}</p>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">โอนสำเร็จ</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
        ขอหนังสือรับรองเงินเดือน (PDF)
      </button>
    </div>
  );
}