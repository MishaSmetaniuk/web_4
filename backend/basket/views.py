from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import Order
from .serializers import OrderSerializer, OrderAdminSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post']

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        if not (serializer.validated_data.get('status') == 0):
            raise ValidationError('You can not change status of order')
        
        if serializer.validated_data.get('order') == []:
            raise ValidationError('Basket can not be empty')

        
        serializer.save(user=self.request.user)


class OrderAdminViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderAdminSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ['get', 'post', 'delete']
    
    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user')
        order_id = request.data.get('order')
        status = request.data.get('status')

        if status not in [1, -1]:
            raise ValidationError('Status must be 1 or -1')

        order = Order.objects.get(id=order_id, user_id=user_id)
        order.status = status

        order.save()

        return Response({'status': 'success'})
