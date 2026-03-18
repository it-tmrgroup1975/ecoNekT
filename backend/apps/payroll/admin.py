import pandas as pd
from django.contrib import admin, messages
from django.shortcuts import render, redirect
from django.urls import path
from django import forms
from django.conf import settings
from .models import Payroll
from django.contrib.auth import get_user_model

User = get_user_model()

class ExcelImportForm(forms.Form):
    excel_file = forms.FileField(label="เลือกไฟล์ Excel (.xlsx)")

@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'period_no', 'period_date', 'net_pay_format', 'created_at')
    list_filter = ('period_no', 'period_date')
    search_fields = ('user__email', 'user__employee_profile__employee_code')

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'พนักงาน'

    def net_pay_format(self, obj):
        return f"{obj.net_pay:,.2f} ฿"
    net_pay_format.short_description = 'เงินได้สุทธิ'

    # --- ส่วนการจัดการ URL สำหรับ Import ---
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('import-excel/', self.admin_site.admin_view(self.import_excel), name='payroll_import_excel'),
        ]
        return custom_urls + urls

    def import_excel(self, request):
        if request.method == "POST":
            form = ExcelImportForm(request.POST, request.FILES)
            if form.is_valid():
                file = request.FILES["excel_file"]
                try:
                    df = pd.read_excel(file)
                    # ตรวจสอบฟิลด์ที่จำเป็นใน Excel
                    required_columns = ['employee_code', 'period_no', 'period_end_date', 'net_pay']
                    if not all(col in df.columns for col in required_columns):
                        messages.error(request, f"ไฟล์ Excel ต้องมีคอลัมน์: {', '.join(required_columns)}")
                        return redirect(".")

                    success_count = 0
                    for _, row in df.iterrows():
                        # ค้นหาพนักงานจากรหัสพนักงานใน Profile
                        try:
                            user = User.objects.get(employee_profile__employee_code=str(row['employee_code']))
                            
                            Payroll.objects.update_or_create(
                                user=user,
                                period_no=row['period_no'],
                                period_date=row['period_end_date'],
                                defaults={
                                    'total_earnings': row.get('total_earnings', 0),
                                    'total_deductions': row.get('total_deductions', 0),
                                    'net_pay': row['net_pay'],
                                    'data_json': row.to_dict() # เก็บค่าดิบทั้งหมดจาก Excel ไว้โชว์ในสลิป
                                }
                            )
                            success_count += 1
                        except User.DoesNotExist:
                            continue # ถ้าไม่พบพนักงานให้ข้ามไป

                    messages.success(request, f"นำเข้าข้อมูลสำเร็จ {success_count} รายการ")
                    return redirect("admin:payroll_payroll_changelist")
                except Exception as e:
                    messages.error(request, f"เกิดข้อผิดพลาดในการอ่านไฟล์: {str(e)}")
        
        form = ExcelImportForm()
        payload = {"form": form, "title": "นำเข้าข้อมูลจาก Excel"}
        return render(request, "admin/payroll/excel_form.html", payload)