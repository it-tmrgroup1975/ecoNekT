from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data['access']
            refresh_token = response.data['refresh']

            # เก็บ Access Token ใน HTTP-Only Cookie
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=not settings.DEBUG, # True เมื่อใช้ HTTPS (Production)
                samesite='Lax',
                max_age=3600 # 1 ชั่วโมง
            )
            # เก็บ Refresh Token ใน HTTP-Only Cookie
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=86400 * 7 # 7 วัน
            )
            
            # ลบ Token ออกจาก JSON Body เพื่อความปลอดภัย (ให้ Frontend ใช้จาก Cookie)
            del response.data['access']
            del response.data['refresh']
            
        return response

class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response