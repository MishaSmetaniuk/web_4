from django.shortcuts import render
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.serializers import ModelSerializer
from rest_framework.response import Response

from user.models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'id']

        extra_kwargs = {
            'username': {'read_only': True}
        }

    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ['get']


    def retrieve(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UserSerializer(user)

        return Response(serializer.data)
    
    def list(self, request):
        return Response({'detail': 'Method "GET" not allowed.'}, status=405)