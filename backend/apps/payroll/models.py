from django.db import models
from django.conf import settings

class Payroll(models.Model):
    # เชื่อมโยงกับพนักงาน
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='payrolls'
    )
    
    # ข้อมูลหัวเอกสาร (Header)
    period_no = models.IntegerField(help_text="งวดที่จ่าย (เช่น 1-24)")
    period_date = models.DateField(help_text="วันสิ้นสุดงวดการจ่าย")
    
    # รายได้หลัก (แยกฟิลด์เพื่อใช้ทำ Query/Analytics)
    salary_wage = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="เงินเดือน/ค่าแรง")
    ot_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="รวม OT ทุกประเภท")
    incentive = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="เบี้ยขยัน")
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="เงินได้รวม")

    # รายจ่ายหลัก
    income_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="ภาษีเงินได้")
    social_security = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="ประกันสังคม")
    total_deductions = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="รายจ่ายรวม")

    # ยอดสุทธิ
    net_pay = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="เงินได้สุทธิ")

    # เก็บข้อมูลสะสมต้นปีถึงปัจจุบัน (YTD - Year To Date)
    ytd_net_income = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, verbose_name="สะสมเงินได้สุทธิ")
    
    # 📦 เก็บข้อมูลดิบทั้งหมดจาก Excel (ฟิลด์ย่อยๆ เช่น ค่าคอมมิชชั่น, ค่าน้ำมัน, มาสาย)
    # เพื่อนำไป Render ในหน้าสลิปแบบละเอียดโดยไม่ต้องสร้างคอลัมน์ใน DB เยอะเกินไป
    # ปรับ data_json ให้ยอมรับค่าว่างได้
    data_json = models.JSONField(
        default=dict,
        null=True, 
        blank=True, 
        help_text="Raw data from Excel (e.g., OT1, OT2, Late, Fuel, YTD stats)"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "ข้อมูลเงินเดือน"
        verbose_name_plural = "ข้อมูลเงินเดือน"
        ordering = ['-period_date', 'period_no']

    def __str__(self):
        return f"งวดที่ {self.period_no} ({self.period_date}) - {self.user.email}"