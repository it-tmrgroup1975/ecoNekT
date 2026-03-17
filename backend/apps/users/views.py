from rest_framework import viewsets, permissions
from .models import Employee, User
from .serializers import EmployeeSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().select_related('user', 'position', 'position__department')
    serializer_class = EmployeeSerializer
    # เบื้องต้นอนุญาตให้เข้าถึงได้ทุกคนเพื่อทดสอบ (ควรเปลี่ยนเป็น IsAuthenticated ในภายหลัง)
    permission_classes = [permissions.AllowAny] 

    def get_queryset(self):
        # กรองข้อมูลตามบริษัทของ User ที่ Login อยู่ (Multi-tenancy)
        user = self.request.user
        if user.is_authenticated and user.role != 'admin':
            return self.queryset.filter(user__company=user.company)
        return self.queryset