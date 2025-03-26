from django.shortcuts import render

# Create your views here.
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets
from .models import MenuItem, Order, Cafeteria
from .serializers import MenuItemSerializer, OrderSerializer, CafeteriaSerializer

class CafeteriaViewSet(viewsets.ModelViewSet):
    queryset = Cafeteria.objects.all()
    serializer_class = CafeteriaSerializer
    
    @action(detail=True, methods=['get'], url_path='menu')
    def menu(self, request, pk=None):
        """Retrieve menu items specific to this cafeteria."""
        cafeteria = get_object_or_404(Cafeteria, pk=pk)
        category_id = request.query_params.get('category_id')
        
        menu_items = MenuItem.objects.filter(cafeteria=cafeteria)
        if category_id:
            menu_items = menu_items.filter(category_id=category_id)
        
        serializer = MenuItemSerializer(menu_items, many=True)
        return Response(serializer.data)

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
