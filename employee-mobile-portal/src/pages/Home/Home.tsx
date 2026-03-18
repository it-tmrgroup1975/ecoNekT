export default function Home() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="bg-primary/10 p-6 rounded-[2rem] border border-primary/20 shadow-sm">
        <h2 className="text-sm font-medium text-primary">สวัสดีตอนเช้า</h2>
        <p className="text-2xl font-black text-foreground">คุณพนักงาน สมชาย</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-border/50">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">เวลาเข้างานวันนี้</p>
          <p className="text-xl font-black text-emerald-600 mt-1">08:30 น.</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-border/50">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">ชั่วโมงทำงานสะสม</p>
          <p className="text-xl font-black text-secondary mt-1">160 ชม.</p>
        </div>
      </div>
    </div>
  );
}