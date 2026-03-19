# apps/attendance/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
# แก้ไขบรรทัดนี้: เปลี่ยนจาก AttendanceViewSet เป็น AttendanceRecordViewSet
from .views import AttendanceRecordViewSet 

router = DefaultRouter()
# แก้ไขบรรทัดนี้ด้วยเช่นกัน
router.register(r'', AttendanceRecordViewSet, basename='attendance')

urlpatterns = [
    path('', include(router.urls)),
]