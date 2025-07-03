from django.db import models

class Hora(models.Model):
    tipo = models.CharField(max_length=50)
    valor = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.tipo} - {self.valor}" 