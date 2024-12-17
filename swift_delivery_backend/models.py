from django.db import models

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
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    order_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.menu_item.name}"
