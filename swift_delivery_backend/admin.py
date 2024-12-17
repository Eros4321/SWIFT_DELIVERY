from django.contrib import admin

# Register your models here.
from .models import Cafeteria, MenuItem, Order, Category

admin.site.register(Cafeteria)
admin.site.register(MenuItem)
admin.site.register(Order)
admin.site.register(Category)
