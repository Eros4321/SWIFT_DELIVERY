from rest_framework import serializers
from .models import MenuItem, Order, Cafeteria, Category, OrderItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = MenuItem
        fields = '__all__'
        
class CafeteriaSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Cafeteria
        fields = '__all__'
        
class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.ReadOnlyField(source='menu_item.name')
    price = serializers.ReadOnlyField(source='menu_item.price')

    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source='orderitem_set', many=True, read_only=True)  # Include related order items
    order_items = serializers.ListField(write_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'
        
    def get_total_amount(self, obj):
        return sum(item.menu_item.price * item.quantity for item in obj.orderitem_set.all())  
    
    def create(self, validated_data):
        items_data = validated_data.pop('order_items', [])
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            menu_item_id = item_data['menu_item']  # Extract menu item ID
            quantity = item_data['quantity']  # Extract quantity
            menu_item = MenuItem.objects.get(id=menu_item_id)  # Retrieve menu item instance

            OrderItem.objects.create(order=order, menu_item=menu_item, quantity=quantity)
        return order
