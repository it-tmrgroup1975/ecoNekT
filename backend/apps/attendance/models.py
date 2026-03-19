from django.db import models
from django.conf import settings
from apps.users.models import Employee

class AttendanceRawLog(models.Model):
    """
    เก็บข้อมูลดิบจากเครื่องบันทึกเวลา (รองรับทั้งการ Upload ไฟล์ และ ADMS Push)
    """
    device_id = models.CharField(max_length=50, blank=True, null=True)
    user_id_on_device = models.CharField(max_length=50, help_text="ID ของพนักงานที่ตั้งค่าในเครื่อง")
    timestamp = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "ข้อมูลดิบการลงเวลา"
        verbose_name_plural = "ข้อมูลดิบการลงเวลา"
        ordering = ['-timestamp']

class AttendanceRecord(models.Model):
    """
    ข้อมูลการลงเวลาที่ประมวลผลแล้ว (In/Out ต่อวัน)
    """
    STATUS_CHOICES = (
        ('present', 'ปกติ'),
        ('late', 'มาสาย'),
        ('early_leave', 'กลับก่อน'),
        ('absent', 'ขาดงาน'),
    )

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    clock_in = models.DateTimeField(null=True, blank=True)
    clock_out = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')
    
    # ฟิลด์รองรับ Mobile Check-in (GPS)
    source = models.CharField(max_length=50, default='device', help_text="device หรือ mobile_gps")
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    class Meta:
        verbose_name = "ข้อมูลการเข้างาน"
        verbose_name_plural = "ข้อมูลการเข้างาน"
        unique_together = ('employee', 'date') # หนึ่งคนมีได้ 1 Record ต่อวัน
        ordering = ['-date']

    def __str__(self):
        return f"{self.employee.employee_code} - {self.date}"