import { cn } from "../../../lib/utils";
import { CalendarDays, Pill, Briefcase } from "lucide-react";
import type { LeaveQuota } from "../../../types/leave";

const leaveMockData: LeaveQuota[] = [
  { type: 'sick', label: 'ลาป่วย', total: 30, used: 2, remaining: 28, color: 'bg-rose-500' },
  { type: 'casual', label: 'ลากิจ', total: 6, used: 1, remaining: 5, color: 'bg-amber-500' },
  { type: 'annual', label: 'พักร้อน', total: 12, used: 4, remaining: 8, color: 'bg-primary' },
];

export function LeaveSummary() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70">
          สิทธิ์การลาคงเหลือ
        </h3>
        <span className="text-[10px] font-bold text-muted-foreground italic">ปีงบประมาณ 2026</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {leaveMockData.map((leave) => (
          <div 
            key={leave.type}
            className="relative overflow-hidden bg-white p-4 rounded-3xl border border-border/50 shadow-sm transition-all active:scale-95"
          >
            {/* Background Decorative Icon */}
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] rotate-12">
              {leave.type === 'sick' && <Pill className="w-16 h-16" />}
              {leave.type === 'casual' && <Briefcase className="w-16 h-16" />}
              {leave.type === 'annual' && <CalendarDays className="w-16 h-16" />}
            </div>

            <div className="flex flex-col items-center text-center space-y-2 relative z-10">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                {leave.label}
              </span>
              
              <div className="flex flex-col">
                <span className="text-2xl font-black text-foreground tabular-nums">
                  {leave.remaining}
                </span>
                <span className="text-[9px] font-medium text-muted-foreground">
                  จาก {leave.total} วัน
                </span>
              </div>

              {/* Progress Bar ขนาดจิ๋ว */}
              <div className="h-1 w-full bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-1000", leave.color)}
                  style={{ width: `${(leave.remaining / leave.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}