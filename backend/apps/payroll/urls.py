from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PayrollViewSet, download_payroll_pdf

router = DefaultRouter()
router.register(r'my-payrolls', PayrollViewSet, basename='my-payrolls')

urlpatterns = [
    path('', include(router.urls)),
    path('my-payrolls/<int:pk>/pdf/', download_payroll_pdf, name='payroll-pdf'),
]