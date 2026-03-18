from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, LeaveRequestViewSet, NotificationViewSet
from .auth_views import LoginView, LogoutView, currentUserView

# 1. จัดการ Route สำหรับ API มาตรฐาน (เช่น /api/users/employees/)
router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'leaves', LeaveRequestViewSet, basename='leave')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    # API หลักสำหรับจัดการข้อมูลพนักงาน
    path('', include(router.urls)),    
    path('me/', currentUserView.as_view(), name='current-user'),
    
    # 2. API สำหรับ Authentication (จัดการ JWT ผ่าน Cookies)
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]