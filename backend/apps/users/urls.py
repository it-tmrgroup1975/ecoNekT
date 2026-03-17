from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet
from .auth_views import LoginView, LogoutView # นำเข้า View ที่จัดการ Cookie

# 1. จัดการ Route สำหรับ API มาตรฐาน (เช่น /api/users/employees/)
router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')

urlpatterns = [
    # API หลักสำหรับจัดการข้อมูลพนักงาน
    path('', include(router.urls)),
    
    # 2. API สำหรับ Authentication (จัดการ JWT ผ่าน Cookies)
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]