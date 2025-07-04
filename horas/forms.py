# forms.py

from django import forms

class LoginForm(forms.Form):
    username = forms.CharField(label='Usuario', max_length=150)
    password = forms.CharField(label='Contraseña', widget=forms.PasswordInput)
    remember_me = forms.BooleanField(label='Recuérdame', required=False)    