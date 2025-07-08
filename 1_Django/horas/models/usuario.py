from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    TIPO_DOCUMENTO_CHOICES = [
        ('CC', 'Cédula de Ciudadanía'),
        ('TI', 'Tarjeta de Identidad'),
        ('CE', 'Cédula de Extranjería'),
    ]

    ROL_CHOICES = [
        ('Empleado', 'Empleado'),
        ('Jefe', 'Jefe Directo'),
        ('SubAdmin', 'Sub Administrador'),
        ('Admin', 'Administrador'),
    ]

    tipo_documento = models.CharField(max_length=2, choices=TIPO_DOCUMENTO_CHOICES)
    num_documento = models.CharField(max_length=20, unique=True)
    rol = models.CharField(max_length=20, choices=ROL_CHOICES)
    ubicacion = models.CharField(max_length=100)
    salario = models.DecimalField(max_digits=10, decimal_places=2)
    reg_horas = models.BooleanField(default=False)
    horario_trabajo = models.CharField(max_length=100)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.username

class Usuario(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)  # En producción, usa hash de contraseñas

    def __str__(self):
        return self.username

    def ser_enviado(self):
        pass

    def ser_aprobado(self):
        pass

    def ser_editado(self):
        pass 