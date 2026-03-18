from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()

class LoginView(TokenObtainPairView):
    permission_classes = []
    
    def post(self, request, *args, **kwargs):
        # 1. เรียกใช้งาน SimpleJWT เพื่อตรวจสอบ User/Pass และสร้าง Tokens
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            # 2. ดึง User Object จริงๆ ออกมา (เพราะ SimpleJWT ไม่ได้เซต request.user ให้ในทันที)
            email = request.data.get('email')
            user = User.objects.filter(email=email).first()

            # 3. ปรับโครงสร้าง Data ที่จะส่งกลับไป
            # ต้องส่ง context={'request': request} เข้าไปใน Serializer ด้วยเพื่อให้ได้ Full URL (Absolute URI)
            response.data = {
                "message": "Login successful",
                "user": UserSerializer(user, context={'request': request}).data if user else None
            }

            # 4. เก็บ Tokens ใน HTTP-Only Cookies (เหมือนเดิม)
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=3600
            )

            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=86400 * 7
            )
            
        return response
    

class LogoutView(APIView):
    """
    Logout โดยการลบ Cookies ทั้งหมดออกจาก Browser
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        response = Response({
            "message": "Successfully logged out"
        }, status=status.HTTP_200_OK)

        # ลบ Cookies โดยการสั่ง delete_cookie
        # สำคัญ: ต้องระบุ path และ samesite ให้ตรงกับตอนสร้าง (ถ้ามีการระบุไว้)
        response.delete_cookie('access_token', samesite='Lax')
        response.delete_cookie('refresh_token', samesite='Lax')
        
        return response

class currentUserView(APIView):
    """
    API สำหรับ Check Session/Profile ของผู้ใช้ที่ Login อยู่
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)