from rest_framework import viewsets, permissions
from .models import Payroll
from .serializers import PayrollListSerializer, PayrollDetailSerializer
from django.template.loader import render_to_string
from django.http import HttpResponse
from weasyprint import HTML
import tempfile

class PayrollViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet สำหรับดึงข้อมูลเงินเดือน (อ่านอย่างเดียว)
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # ดึงข้อมูลเฉพาะของ User ที่ล็อกอินอยู่ และเรียงจากงวดล่าสุด
        return Payroll.objects.filter(user=self.request.user).order_by('-period_date', '-period_no')

    def get_serializer_class(self):
        # ถ้าเป็นการดูรายละเอียด (Retrieve) ให้ใช้ตัว Detail
        if self.action == 'retrieve':
            return PayrollDetailSerializer
        # ถ้าเป็นการดูรายการทั้งหมด (List) ให้ใช้ตัว List
        return PayrollListSerializer


def download_payroll_pdf(request, pk):
    payroll = Payroll.objects.get(pk=pk, user=request.user)
    
    # 1. Render HTML พร้อมส่งข้อมูลไป
    html_string = render_to_string('admin/payroll/pdf_slip.html', { # ลบ payroll/ ออก
        'payroll': payroll,
        'user': request.user
    })
    
    # 2. สร้าง PDF ด้วย WeasyPrint
    html = HTML(string=html_string)
    result = html.write_pdf()

    # 3. ส่งไฟล์กลับไปที่ Browser
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="Slip_{payroll.period_no}_{payroll.period_date}.pdf"'
    response.write(result)
    
    return response