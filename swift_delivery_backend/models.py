from django.db import models
from django.db.models import Sum, F

# Create your models here.
class Cafeteria(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='cafeteria_images/', blank=True, null=True)

    def __str__(self):
        return self.name
    
class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name
    
class MenuItem(models.Model):
    cafeteria = models.ManyToManyField(Cafeteria, related_name='menu_items', null=True, blank=True)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='menu_images/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    customer_name = models.CharField(max_length=255, null=True)
    phone_number = models.CharField(max_length=20, null=True)
    delivery_address = models.TextField(null=True)
    items = models.ManyToManyField(MenuItem, through="OrderItem")
    order_time = models.DateTimeField(auto_now_add=True)
    
    def total_amount(self):
        return self.orderitem_set.aggregate(
            total=Sum(F('quantity') * F('menu_item__price'))
        )['total'] or 0

    def __str__(self):
        return f"Order {self.id} - {self.customer_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.menu_item.name} (Order {self.order.id})"

