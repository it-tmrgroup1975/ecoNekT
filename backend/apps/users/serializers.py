from rest_framework import serializers
from .models import User, Employee, Company, Department, Position

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