from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Employee, LeaveRequest, Notification
from .serializers import EmployeeSerializer, LeaveRequestSerializer, NotificationSerializer
from django.db.models import Q


class EmployeeViewSet(viewsets.ModelViewSet):
    # 1. กำหนด queryset พื้นฐานพร้อม select_related เพื่อดึงข้อมูล User และ Position มาใน Query เดียว
    # การใส่ 'user' ตรงนี้จะช่วยให้ฟิลด์ first_name, last_name, email ใน Serializer ทำงานได้เร็วขึ้น
    queryset = Employee.objects.all().select_related(
        'user', 
        'position', 
        'position__department'
    )
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.AllowAny] 

    def get_queryset(self):
        user = self.request.user
        
        # 2. ใช้ self.queryset ที่ทำ select_related ไว้แล้วเป็นฐาน
        qs = self.queryset
        
        # 3. กรองข้อมูลตามสิทธิ์ (Multi-tenancy) 
        # ถ้าพนักงานไม่ใช่ Admin ให้เห็นเฉพาะเพื่อนร่วมบริษัทเดียวกัน
        if user.is_authenticated and user.role != 'admin':
            # ตรวจสอบว่า User model มีความสัมพันธ์กับ company หรือไม่
            qs = qs.filter(user__company=user.company)
            
        return qs
    

class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all().select_related('employee__user', 'employee__position__department')
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # ดึง QuerySet เริ่มต้นพร้อมใช้ select_related เพื่อลด Query (Optimization)
        queryset = self.queryset.select_related(
            'employee__user', 
            'employee__position__department'
        )

        # 1. กรณีเป็น Admin: เห็นรายการลาทั้งหมดของพนักงานทุกคนที่อยู่ใน "บริษัทเดียวกัน"
        if user.role == 'admin':
            return queryset.filter(employee__user__company=user.company)

        # 2. กรณีเป็น Staff/Manager: 
        # เห็นเฉพาะใบลาของพนักงานที่อยู่ในแผนกที่ตนเองเป็น Manager (managed_departments)
        if user.role == 'staff':
            # ดึงรายชื่อแผนกทั้งหมดที่ User คนนี้ดูแลอยู่
            managed_depts = user.managed_departments.all()
            return queryset.filter(
                employee__position__department__in=managed_depts
            ).distinct()

        # 3. กรณีเป็น Employee (หรือ Role อื่นๆ): 
        # เห็นเฉพาะใบลาที่เป็นของ "ตนเอง" เท่านั้น
        # กรองผ่าน employee__user เพื่อความแม่นยำ
        return queryset.filter(employee__user=user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def approve(self, request, pk=None):
        leave = self.get_object()
        user = request.user
        
        # ตรวจสอบสิทธิ์: ต้องเป็น Manager ของแผนกนั้น หรือ Admin
        is_manager = leave.employee.position.department.manager == user
        if not (is_manager or user.role == 'admin'):
            return Response({"detail": "ไม่มีสิทธิ์อนุมัติ"}, status=status.HTTP_403_FORBIDDEN)
            
        leave.status = 'approved'
        leave.approved_by = user
        leave.save()
        return Response({"status": "approved"})
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reject(self, request, pk=None):
        leave = self.get_object()
        user = request.user
        
        # ตรวจสอบสิทธิ์: ต้องเป็น Manager ของแผนกนั้น หรือ Admin
        is_manager = leave.employee.position.department.manager == user
        if not (is_manager or user.role == 'admin'):
            return Response({"detail": "ไม่มีสิทธิ์ปฏิเสธการลานี้"}, status=status.HTTP_403_FORBIDDEN)
            
        reason = request.data.get('rejection_reason')
        if not reason:
            return Response({"detail": "กรุณาระบุเหตุผลที่ไม่อนุมัติ"}, status=status.HTTP_400_BAD_REQUEST)

        leave.status = 'rejected'
        leave.rejection_reason = reason
        leave.approved_by = user # บันทึกว่าใครเป็นคนจัดการใบลา
        leave.save()
        
        # ส่งการแจ้งเตือน (เรียกใช้ฟังก์ชันในข้อถัดไป)
        self.send_leave_notification(leave)
        
        return Response({"status": "rejected", "reason": reason})

    def send_leave_notification(self, leave):
        status_text = "อนุมัติแล้ว" if leave.status == 'approved' else "ถูกปฏิเสธ"
        reason_text = f" เนื่องจาก: {leave.rejection_reason}" if leave.rejection_reason else ""
        
        Notification.objects.create(
            user=leave.employee.user,
            title=f"คำขอลาของท่าน{status_text}",
            message=f"คำขอลา {leave.get_leave_type_display()} ตั้งแต่วันที่ {leave.start_date} {status_text}{reason_text}"
        )

    def perform_create(self, serializer):
        """
        Custom Logic เมื่อมีการสร้างใบลาใหม่:
        ระบบจะดึง User ที่ Login อยู่มาหาโปรไฟล์ Employee และบันทึกลงในฟิลด์ employee อัตโนมัติ
        """
        user = self.request.user
        
        try:
            # ดึง Employee Profile ที่เชื่อมกับ User นี้ (OneToOneField)
            employee_profile = user.employee_profile
            
            # สั่ง Save โดยระบุตัวตนพนักงานพิ่มเติมจากข้อมูลที่ส่งมาจาก Form
            serializer.save(employee=employee_profile)
            
        except AttributeError:
            # กรณี User นี้ไม่มีโปรไฟล์ Employee (เช่น Admin ที่ไม่ได้เป็นพนักงาน)
            raise serializers.ValidationError({
                "detail": "ไม่พบโปรไฟล์พนักงานสำหรับผู้ใช้งานนี้ ไม่สามารถยื่นลาได้"
            })
        
class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # ให้ดึงเฉพาะการแจ้งเตือนของตัวเอง
        return Notification.objects.filter(user=self.request.user).order_description('-created_at')

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        try:
            # ตรวจสอบว่าใช้ request.user และฟิลด์ is_read มีอยู่จริงใน Model
            count = Notification.objects.filter(user=request.user, is_read=False).count()
            return Response({'unread_count': count})
        except Exception as e:
            # ถ้าพังตรงนี้ Log จะบอกสาเหตุใน Terminal ของ Django
            print(f"Error in unread_count: {e}") 
            return Response({'error': str(e)}, status=500)

    # สำหรับ POST /api/users/notifications/{id}/read/
    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

