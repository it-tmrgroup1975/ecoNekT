import os
from django.db import models
from django.utils.timezone import now
from django_resized import ResizedImageField
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """บังคับใช้ Email แทน Username และบังคับใส่ Role ตอนสร้าง Superuser"""
    def create_user(self, email, password=None, role='employee', **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        # บังคับ Admin Role สำหรับ Superuser
        return self.create_user(email, password, role='admin', **extra_fields)

class Company(models.Model):
    name = models.CharField(max_length=255)
    tax_id = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # ส่วนนี้เพื่อให้ return ชื่อออกมา
    def __str__(self):
        return self.name

class Department(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=100)
    
    # แก้ไขจาก on_row_delete เป็น on_delete
    manager = models.ForeignKey(
        'User', 
        on_delete=models.SET_NULL,
        null=True, 
        blank=True, 
        related_name='managed_departments'
    )

    def __str__(self):
        return self.name


class Position(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='positions')
    title = models.CharField(max_length=100)

    # ส่วนนี้เพื่อให้ return ชื่อออกมา
    def __str__(self):
        return self.title

class User(AbstractUser):
    username = None # ยกเลิกการใช้ username
    email = models.EmailField(_('email address'), unique=True)
    
    ROLE_CHOICES = (
        ('admin', 'Admin/HR'),
        ('staff', 'Supervisor'),
        ('employee', 'Employee'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='employee')
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] # email ถูกบังคับโดย USERNAME_FIELD แล้ว

    objects = UserManager()


def get_avatar_upload_path(instance, filename):
    """
    ฟังก์ชันจัดระเบียบโฟลเดอร์: avatars/IDบริษัท/ปี-เดือน-วัน/ชื่อไฟล์
    ช่วยให้ไล่หาไฟล์ง่ายและป้องกันไฟล์ชื่อซ้ำในโฟลเดอร์เดียว
    """
    company_id = instance.user.company.id if instance.user.company else 'no_company'
    date_path = now().strftime('%Y/%m/%d')
    # ใช้ ID ของ User เป็นชื่อไฟล์เพื่อป้องกันการเดาชื่อรูปภาพพนักงานคนอื่น
    ext = filename.split('.')[-1]
    new_filename = f"user_{instance.user.id}_avatar.{ext}"
    return os.path.join('avatars', str(company_id), date_path, new_filename)


class Employee(models.Model):
    user = models.OneToOneField(
        'User', # อ้างอิงไปยัง Custom User ที่คุณสร้างไว้
        on_delete=models.CASCADE, 
        related_name='employee_profile'
    )
    employee_code = models.CharField(max_length=20, unique=True)
    position = models.ForeignKey('Position', on_delete=models.SET_NULL, null=True)
    
    # --- การจัดการรูปภาพ Avatar ที่ปรับปรุงใหม่ ---
    avatar = ResizedImageField(
        size=[500, 500],           # บังคับขนาดไม่เกิน 500x500 px
        quality=80,                # บีบอัดคุณภาพเหลือ 80% เพื่อประหยัดพื้นที่
        crop=['middle', 'center'], # ครอปรูปจากกึ่งกลางให้เป็นสี่เหลี่ยมจัตุรัสอัตโนมัติ (เหมาะสำหรับ Profile)
        upload_to=get_avatar_upload_path, 
        force_format='JPEG',       # บังคับเป็น JPEG ทั้งหมดเพื่อความเป็นระเบียบของนามสกุลไฟล์
        null=True, 
        blank=True
    )

    supervisor = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='subordinates'
    )
    
    skills = models.JSONField(default=list)
    joined_at = models.DateField(auto_now_add=True)

    class Meta:
        verbose_name = "พนักงาน"
        verbose_name_plural = "ข้อมูลพนักงาน"
        ordering = ['employee_code']

    def __str__(self):
        return f"{self.employee_code} - {self.user.email}"
    

# เพื่อรองรับการลาและการอนุมัติ
class LeaveRequest(models.Model):
    LEAVE_TYPES = (
        ('sick', 'ลาป่วย'),
        ('casual', 'ลากิจ'),
        ('annual', 'ลาพักร้อน'),
    )
    STATUS_CHOICES = (
        ('pending', 'รออนุมัติ'),
        ('approved', 'อนุมัติแล้ว'),
        ('rejected', 'ปฏิเสธ'),
    )

    employee = models.ForeignKey('Employee', on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.CharField(max_length=10, choices=LEAVE_TYPES)
    rejection_reason = models.TextField(null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    
    # ผู้ที่ทำการอนุมัติจริง
    approved_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "การลา"
        verbose_name_plural = "ข้อมูลการลา"


class Notification(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']