from django.db import models

# Create your models here.
class Person(models.Model):
    name = models.CharField(max_length=255)
    notes = models.JSONField(null=True, blank=True)

class Group(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(Person, related_name='groups')