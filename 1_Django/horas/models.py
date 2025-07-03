from django.db import models
from django.contrib.auth.models import AbstractUser

class Empresa(models.Model):
    direccion = models.CharField(max_length=200)
    areas = models.TextField()

    def __str__(self):
        return self.direccion

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

class Hora(models.Model):
    tipo = models.CharField(max_length=50)
    valor = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.tipo} - {self.valor}"

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


# models.py

from django.db import models

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

    def __str__(self):
        return f"Registro {self.num_registro} - {self.usuario}"

class JefeDirecto(models.Model):
    usuario = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'rol': 'Jefe'})

    def aprobar_registro(self, registro):
        pass

    def denegar_registro(self, registro):
        pass

    def registrar_empleado(self, empleado):
        pass

    def inactivar_empleado(self, empleado):
        pass

    def __str__(self):
        return f"Jefe {self.usuario.username}"

class Empleado(models.Model):
    usuario = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'rol': 'Empleado'})
    jefe_directo = models.ForeignKey(JefeDirecto, on_delete=models.SET_NULL, null=True, blank=True, related_name='empleados')

    def __str__(self):
        return f"Empleado {self.usuario.username}"

class SubAdmin(models.Model):
    usuario = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'rol': 'SubAdmin'})

    def gestionar_usuarios(self):
        pass

    def gestionar_registros(self):
        pass

    def asignar_jefe_directo(self, empleado, jefe):
        pass

    def __str__(self):
        return f"SubAdmin {self.usuario.username}"

class Admin(models.Model):
    usuario = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'rol': 'Admin'})

    def gestionar_admin(self):
        pass

    def __str__(self):
        return f"Admin {self.usuario.username}"
