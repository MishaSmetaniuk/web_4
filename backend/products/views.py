from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.serializers import ValidationError

from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if Product.objects.filter(name=serializer.validated_data['name']).exists():
            raise ValidationError("Product with this name already exists")
        
        serializer.save()
