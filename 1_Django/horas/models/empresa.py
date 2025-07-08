from django.db import models

class Empresa(models.Model):
    direccion = models.CharField(max_length=200)
    areas = models.TextField()

    def __str__(self):
        return self.direccion 