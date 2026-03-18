from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Employee, Company, Department, Position

class EmployeeInline(admin.StackedInline):
    model = Employee
    can_delete = False
    verbose_name_plural = 'Employee Profile Information'

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    ordering = ('email',)
    list_display = ('email', 'first_name', 'last_name', 'role', 'company', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Company Info', {'fields': ('company',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'first_name', 'last_name', 'role', 'is_staff', 'is_active'),
        }),
    )
    inlines = (EmployeeInline,)

admin.site.register(Company)
admin.site.register(Department)
admin.site.register(Position)