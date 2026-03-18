from rest_framework import serializers
from django.utils.timezone import now
from .models import LeaveRequest, Employee, Company, Position, Notification
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    # 1. ต้องประกาศฟิลด์นี้เป็น SerializerMethodField เพื่อเชื่อมกับฟังก์ชันด้านล่าง
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        # 2. ระบุฟิลด์ที่ต้องการส่งออกไปให้ Frontend
        fields = ['id', 'email', 'first_name', 'last_name', 'avatar_url', 'role']
        read_only_fields = ['id', 'email', 'role']

    # 3. ชื่อฟังก์ชันต้องเป็น get_<ชื่อฟิลด์> และรับพารามิเตอร์ (self, obj)
    def get_avatar_url(self, obj):
        # เช็คก่อนว่ามี attribute 'avatar' จริงๆ หรือไม่ (ป้องกัน API พังถ้าลืม migrate)
        if not hasattr(obj, 'avatar'):
            return None
            
        # เช็คว่ามีไฟล์ถูกอัปโหลดไว้หรือไม่
        if obj.avatar:
            try:
                request = self.context.get('request')
                if request is not None:
                    return request.build_absolute_uri(obj.avatar.url)
                return obj.avatar.url
            except (ValueError, AttributeError):
                # กรณีมีชื่อไฟล์ในฐานข้อมูลแต่ไฟล์จริงหายไป
                return None
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
    # ดึง Email จาก User Model มาแสดง
    email = serializers.EmailField(source='user.email', read_only=True)
    position_details = PositionSerializer(source='position', read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'employee_code', 'email', 'position', 
            'position_details', 'avatar', 'skills', 'joined_at'
        ]

    def update(self, instance, validated_data):
        # รองรับการอัปเดตข้อมูล User ผ่าน Employee Serializer (ถ้าจำเป็น)
        user_data = validated_data.pop('user', None)
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        return super().update(instance, validated_data)
    

class LeaveRequestSerializer(serializers.ModelSerializer):
    # ฟิลด์สำหรับแสดงผลข้อมูลพนักงานใน UI (Read-only)
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
        
        # จุดสำคัญ: กำหนด employee เป็น read_only เพื่อให้ perform_create ใน ViewSet จัดการเอง
        # และกำหนด status กับ rejection_reason เป็น read_only เพื่อป้องกันพนักงานแก้สถานะเอง
        read_only_fields = ['status', 'employee', 'rejection_reason', 'created_at']

    def validate(self, data):
        """
        Business Logic Validation: ตรวจสอบความถูกต้องของข้อมูลใบลา
        """
        # 1. ตรวจสอบว่าวันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError({
                "end_date": "วันที่สิ้นสุดต้องไม่มาก่อนวันที่เริ่มต้น"
            })

        # 2. ป้องกันการลากิจหรือพักร้อนย้อนหลัง (ยกเว้นลาป่วย)
        if data['start_date'] < now().date() and data['leave_type'] != 'sick':
            raise serializers.ValidationError({
                "start_date": "ไม่สามารถลากิจหรือลาพักร้อนย้อนหลังได้"
            })

        return data

    def create(self, validated_data):
        """
        บันทึกข้อมูลโดยผูกกับ Employee โปรไฟล์ของผู้ใช้งานที่ Login อยู่โดยอัตโนมัติ
        """
        user = self.context['request'].user
        try:
            # ดึงโปรไฟล์ Employee ที่เชื่อมกับ User ปัจจุบัน
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