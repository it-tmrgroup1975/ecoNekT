from rest_framework import serializers
from .models import Payroll

class PayrollListSerializer(serializers.ModelSerializer):
    """ใช้แสดงในหน้าประวัติ 4 งวดล่าสุด (ส่งข้อมูลไปน้อยๆ เพื่อความเร็ว)"""
    class Meta:
        model = Payroll
        fields = ['id', 'period_no', 'period_date', 'net_pay']

class PayrollDetailSerializer(serializers.ModelSerializer):
    """ใช้แสดงสลิปฉบับเต็ม (ส่งข้อมูลทั้งหมดรวมถึง data_json)"""
    class Meta:
        model = Payroll
        fields = '__all__'