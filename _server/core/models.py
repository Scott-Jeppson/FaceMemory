from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Person(models.Model):
    name = models.CharField(max_length=255)
    notes = models.JSONField(null=True, blank=True)
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='people')

class Group(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    members = models.ManyToManyField(Person, related_name='groups')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='people_groups')