from django.db import models

CATEGORY_CHOICES = (
    ('audi', 'Audi'),
    ('bmw', 'BMW'),
)

class Product(models.Model):
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    year = models.IntegerField()
    img_path = models.CharField(max_length=100)
