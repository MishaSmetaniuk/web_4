from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

        extra_kwargs = {
            'user': {'read_only': True},
        }


class OrderAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
