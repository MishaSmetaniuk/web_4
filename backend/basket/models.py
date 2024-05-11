from django.db import models


class Order(models.Model):
    user = models.ForeignKey('user.User', null=True, on_delete=models.SET_NULL)
    order = models.JSONField()
    status = models.IntegerField(default=0)
