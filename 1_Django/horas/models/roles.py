from django.db import models
from .usuario import CustomUser

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