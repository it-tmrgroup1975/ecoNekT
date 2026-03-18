export const Payroll = () => (
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
