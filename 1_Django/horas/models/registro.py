from django.db import models
from .usuario import CustomUser
from .hora import Hora

class Registro(models.Model):
    fecha = models.DateField()
    hora_ingreso = models.TimeField()
    hora_salida = models.TimeField()
    ubicacion = models.CharField(max_length=100)
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='registros')
    num_registro = models.IntegerField(unique=True)
    cantidad_horas_extra = models.DecimalField(max_digits=5, decimal_places=2)
    justificacion_hora_extra = models.TextField()
    estado = models.CharField(max_length=50)
    hora = models.ForeignKey(Hora, on_delete=models.SET_NULL, null=True) 