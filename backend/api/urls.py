# add default example of urls.py

# Path: backend/api/urls.py

from django.urls import path

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from products.views import ProductViewSet
from user.views import RegisterUserView
from basket.views import OrderViewSet, OrderAdminViewSet
from .views import UserViewSet

router = DefaultRouter()

router.register(r"products", ProductViewSet)
router.register(r"order", OrderViewSet)
router.register(r"order-admin", OrderAdminViewSet)
router.register(r"user", UserViewSet)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/', RegisterUserView.as_view(), name='register'),
]

urlpatterns += router.urls
