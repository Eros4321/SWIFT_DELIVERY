from django.contrib import admin

# Register your models here.
from .models import Cafeteria, MenuItem, Order, Category, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1  

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'phone_number', 'delivery_address', 'total_amount_display', 'order_time')
    inlines = [OrderItemInline]
    
    def total_amount_display(self, obj):
        return f"₦{obj.total_amount()}"
    total_amount_display.short_description = "Total Amount"

admin.site.register(Cafeteria)
admin.site.register(MenuItem)
admin.site.register(Order, OrderAdmin)
admin.site.register(Category)
admin.site.register(OrderItem)