from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # ดึง access_token จาก cookie ที่เรา set ไว้ตอน Login
        raw_token = request.COOKIES.get('access_token') or None

        if raw_token is None:
            return None

        # นำ token ไปตรวจสอบตามมาตรฐาน JWT
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token