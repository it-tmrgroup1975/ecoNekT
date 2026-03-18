from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer

class LoginView(TokenObtainPairView):
    """
    Login โดยใช้ SimpleJWT และเก็บ Tokens ไว้ใน HTTP-Only Cookies
    """
    permission_classes = []
    
    def post(self, request, *args, **kwargs):
        # เรียกใช้งาน Logic หลักของ SimpleJWT เพื่อตรวจสอบ User/Pass
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            # สร้าง Response ใหม่เพื่อส่งข้อมูล User กลับไป (แทนที่จะส่งแค่ Tokens)
            # เราจะไม่ส่ง Tokens กลับไปใน JSON Body เพื่อป้องกัน XSS
            response.data = {
                "message": "Login successful",
                "user": UserSerializer(request.user).data if hasattr(request, 'user') and request.user.is_authenticated else None
            }

            # 1. เก็บ Access Token ใน HTTP-Only Cookie (อายุสั้น)
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=not settings.DEBUG, # True ใน Production (HTTPS)
                samesite='Lax',
                max_age=3600 # 1 ชั่วโมง
            )

            # 2. เก็บ Refresh Token ใน HTTP-Only Cookie (อายุยาว)
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=86400 * 7 # 7 วัน
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