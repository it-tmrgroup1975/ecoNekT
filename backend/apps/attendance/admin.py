import pandas as pd
from django.contrib import admin
from django.shortcuts import render, redirect
from django.urls import path
from django.contrib import messages
from .models import AttendanceRecord
from .views import import_attendance_excel # Import the logic with duplicate validation

@admin.register(AttendanceRecord)
class AttendanceAdmin(admin.ModelAdmin):
    # Display columns in the admin list view
    list_display = ('employee', 'date', 'clock_in', 'clock_out', 'status', 'source')
    
    # FIX: Corrected relationship path from 'employee__company' to 'employee__user__company'
    # This matches your model structure where Company is linked to the User model.
    list_filter = ('date', 'status', 'source', 'employee__user__company') 
    
    # Enable searching by employee code or user email
    search_fields = ('employee__employee_code', 'employee__user__email')

    # 1. Add Custom URL for the Upload page
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('import-excel/', self.admin_site.admin_view(self.import_excel_view), name='attendance_import_excel'),
        ]
        return custom_urls + urls

    # 2. Logic for the Excel upload interface and processing
    def import_excel_view(self, request):
        if request.method == "POST":
            excel_file = request.FILES.get('excel_file')
            
            if not excel_file:
                self.message_user(request, "กรุณาเลือกไฟล์ก่อนกดนำเข้า", messages.WARNING)
                return redirect("..")

            # Execute the import logic with duplicate validation and timezone handling
            result = import_attendance_excel(excel_file)
            
            if result['status'] == 'success':
                # Success message showing count of new and updated records
                self.message_user(request, result['message'], messages.SUCCESS)
                
                # Display individual errors (e.g., employee code not found) if any occurred
                if result['errors']:
                    for err in result['errors']:
                        self.message_user(request, err, messages.ERROR)
            else:
                # Error message for general processing failures
                self.message_user(request, result['message'], messages.ERROR)
                
            return redirect("..")

        # Render the custom upload template
        return render(request, "admin/attendance/excel_upload.html", {"title": "นำเข้าเวลาทำงานจาก ZKTeco"})