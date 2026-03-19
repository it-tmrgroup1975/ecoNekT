from rest_framework import serializers
from .models import AttendanceRecord

class AttendanceRecordSerializer(serializers.ModelSerializer):
    # ฟอร์แมตเวลาให้เหลือแค่ HH:mm เพื่อแสดงผลในมือถือ
    in_time = serializers.SerializerMethodField()
    out_time = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceRecord
        fields = ['id', 'date', 'clock_in', 'clock_out', 'status', 'source', 'in_time', 'out_time']

    def get_in_time(self, obj):
        return obj.clock_in.strftime('%H:%M') if obj.clock_in else "--:--"

    def get_out_time(self, obj):
        return obj.clock_out.strftime('%H:%M') if obj.clock_out else "--:--"