import os
from rest_framework import serializers
from django.utils.timezone import now
from .models import LeaveRequest, Employee, Company, Position, Notification
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    # ประกาศ SerializerMethodField เพื่อสร้าง Full URL ของรูปภาพ
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        # ระบุฟิลด์ที่ต้องการส่งออกไปให้ Frontend
        fields = ['id', 'email', 'first_name', 'last_name', 'avatar_url', 'role']
        read_only_fields = ['id', 'email', 'role']

    def get_avatar_url(self, obj):
        """สร้าง Full URL สำหรับรูปภาพโปรไฟล์จากโมเดล Employee"""
        try:
            # ดึง Employee Profile ที่เชื่อมกับ User (One-to-One)
            employee = getattr(obj, 'employee_profile', None)
            if employee and employee.avatar:
                request = self.context.get('request')
                if request is not None:
                    # คืนค่าเป็น http://localhost:8000/media/avatars/...
                    return request.build_absolute_uri(employee.avatar.url)
                # Fallback กรณีไม่มี request context
                return employee.avatar.url
        except Exception:
            pass
        return None


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'tax_id']


class PositionSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')
    
    class Meta:
        model = Position
        fields = ['id', 'title', 'department_name']


class EmployeeSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    position_details = PositionSerializer(source='position', read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'employee_code', 'email', 'position', 
            'position_details', 'avatar', 'skills', 'joined_at'
        ]

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        return super().update(instance, validated_data)
    

class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source='employee.user.first_name')
    employee_code = serializers.ReadOnlyField(source='employee.employee_code')
    department_name = serializers.ReadOnlyField(source='employee.position.department.name')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    leave_type_display = serializers.CharField(source='get_leave_type_display', read_only=True)

    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'employee', 'employee_name', 'employee_code', 'department_name',
            'leave_type', 'leave_type_display', 'start_date', 'end_date', 
            'reason', 'status', 'status_display', 'rejection_reason', 'created_at'
        ]
        read_only_fields = ['status', 'employee', 'rejection_reason', 'created_at']

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError({
                "end_date": "วันที่สิ้นสุดต้องไม่มาก่อนวันที่เริ่มต้น"
            })

        if data['start_date'] < now().date() and data['leave_type'] != 'sick':
            raise serializers.ValidationError({
                "start_date": "ไม่สามารถลากิจหรือลาพักร้อนย้อนหลังได้"
            })
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        try:
            employee = user.employee_profile 
            validated_data['employee'] = employee
            return super().create(validated_data)
        except Employee.DoesNotExist:
            raise serializers.ValidationError({
                "detail": "ไม่พบโปรไฟล์พนักงานสำหรับผู้ใช้งานนี้"
            })
        
        
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'is_read', 'created_at']