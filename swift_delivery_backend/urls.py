from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuItemViewSet, OrderViewSet, CafeteriaViewSet

router = DefaultRouter()
router.register(r'menu-items', MenuItemViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'cafeterias', CafeteriaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
