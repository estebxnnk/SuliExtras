from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import LoginForm
from .models import Usuario


# Create your views here.


def home(request):
    return render(request, 'home.html')


def login(request):
    return render(request, 'login.html')

def contactanos(request):
    return render(request, 'contactanos.html')

def login(request):
    mensaje = ''
    if request.method == 'POST':
        formulario = LoginForm(request.POST)
        if formulario.is_valid():
            username = formulario.cleaned_data['username']
            password = formulario.cleaned_data['password']
            # Verifica usuario (esto es solo un ejemplo simple)
            try:
                usuario = Usuario.objects.get(username=username, password=password)
                # Aquí podrías iniciar sesión con Django, pero esto es un ejemplo básico
                return redirect('home')
            except Usuario.DoesNotExist:
                mensaje = 'Usuario o contraseña incorrectos'
    else:
        formulario = LoginForm()
    return render(request, 'login.html', {'formulario': formulario, 'mensaje': mensaje})