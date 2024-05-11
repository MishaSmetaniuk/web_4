from django.db import models
from django.contrib.auth.models import AbstractUser

from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
