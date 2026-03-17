from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # เชื่อมโยง URL ของ apps/users เข้ามาที่ Prefix 'api/users/'
    path('api/users/', include('apps.users.urls')),
    
    # หากมีแอปอื่นๆ เช่น attendance สามารถเพิ่มได้ที่นี่
    # path('api/attendance/', include('apps.attendance.urls')),
]

# ตรวจสอบว่าอยู่ใน Development Mode (DEBUG=True) ถึงจะเปิด Route สำหรับ Media
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # เพิ่มการรองรับ Static files ด้วยในกรณีที่ยังไม่ได้รัน collectstatic
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)