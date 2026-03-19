from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AttendanceRecord
from .serializers import AttendanceRecordSerializer
import pandas as pd
from datetime import datetime
from django.db import transaction
from apps.users.models import Employee
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceRecordSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Admin เห็นทั้งหมด, พนักงานเห็นแค่ของตัวเอง
        if self.request.user.is_staff:
            return AttendanceRecord.objects.all()
        return AttendanceRecord.objects.filter(employee__user=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-history')
    def my_history(self, request):
        """API สำหรับพนักงานดูประวัติตัวเอง"""
        records = self.get_queryset().order_by('-date')[:30] # ดึงย้อนหลัง 30 รายการ
        serializer = self.get_serializer(records, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='my-summary')
    def my_summary(self, request):
        """ดึงสถิติสรุปของเดือนปัจจุบันสำหรับพนักงาน"""
        today = timezone.now()
        first_day = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # ดึงข้อมูลทั้งหมดของเดือนนี้
        queryset = AttendanceRecord.objects.filter(
            employee__user=request.user,
            date__gte=first_day.date(),
            date__lte=today.date()
        )

        summary = {
            "present_count": queryset.filter(status='present').count(),
            "late_count": queryset.filter(status='late').count(),
            "absent_count": queryset.filter(status='absent').count(),
            "month_name": today.strftime('%B'), # จะได้ชื่อเดือนภาษาอังกฤษ เช่น March
        }
        return Response(summary)


def import_attendance_excel(file_path):
    """
    Function to read ZKTeco Excel file and save to AttendanceRecord 
    with Duplicate Validation and Smart Update Logic.
    """
    try:
        # 1. Read Excel file using pandas
        df = pd.read_excel(file_path)

        # 2. Basic Data Cleaning & Validation
        required_columns = ['AC-No.', 'Time']
        if not all(col in df.columns for col in required_columns):
            return {"status": "error", "message": "รูปแบบไฟล์ไม่ถูกต้อง: ไม่พบคอลัมน์ AC-No. หรือ Time"}

        import_count = 0
        update_count = 0
        skip_count = 0
        errors = []

        # 3. Use transaction to ensure data integrity
        with transaction.atomic():
            for index, row in df.iterrows():
                emp_code = str(row['AC-No.']).strip()
                timestamp_raw = row['Time']

                # Convert timestamp if it's string
                if isinstance(timestamp_raw, str):
                    try:
                        timestamp = datetime.strptime(timestamp_raw, '%Y-%m-%d %H:%M:%S')
                    except ValueError:
                        errors.append(f"แถวที่ {index+1}: รูปแบบเวลาไม่ถูกต้อง ({timestamp_raw})")
                        continue
                else:
                    timestamp = timestamp_raw

                # Ensure timestamp is timezone-aware (Thailand/Bangkok as per settings)
                if timezone.is_naive(timestamp):
                    timestamp = timezone.make_aware(timestamp)

                # 4. Map Device ID to System Employee
                try:
                    employee = Employee.objects.get(employee_code=emp_code)
                except Employee.DoesNotExist:
                    errors.append(f"แถวที่ {index+1}: ไม่พบรหัสพนักงาน {emp_code} ในระบบ")
                    continue

                date_only = timestamp.date()

                # 5. Smart Duplicate Validation & Update Logic
                # Use get_or_create to handle daily records uniquely per employee
                record, created = AttendanceRecord.objects.get_or_create(
                    employee=employee,
                    date=date_only,
                    defaults={
                        'clock_in': timestamp,
                        'source': 'device',
                        'status': 'present' # Default status
                    }
                )

                if created:
                    import_count += 1
                else:
                    # DUPLICATE VALIDATION LOGIC:
                    # If record exists, we determine if the new timestamp is a better 'in' or 'out' time
                    is_updated = False
                    
                    # Check for Earliest Time (Clock-in)
                    if record.clock_in and timestamp < record.clock_in:
                        record.clock_in = timestamp
                        is_updated = True
                    
                    # Check for Latest Time (Clock-out)
                    # Only set clock_out if it's actually later than clock_in
                    if timestamp > record.clock_in:
                        if not record.clock_out or timestamp > record.clock_out:
                            record.clock_out = timestamp
                            is_updated = True
                    
                    if is_updated:
                        record.save()
                        update_count += 1
                    else:
                        # Skip if the timestamp is between existing clock_in and clock_out
                        skip_count += 1
                
        return {
            "status": "success", 
            "message": f"นำเข้าสำเร็จ: ใหม่ {import_count}, อัปเดต {update_count}, ข้าม {skip_count} รายการ",
            "errors": errors
        }

    except Exception as e:
        return {"status": "error", "message": f"เกิดข้อผิดพลาดในการประมวลผล: {str(e)}"}