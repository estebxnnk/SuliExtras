import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Avatar, IconButton, Tooltip, Alert, InputAdornment } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

function Login() {
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMensaje('Por favor, completa todos los campos.');
      setExito(false);
      return;
    }
    setMensaje('');
    setExito(false);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      let data = {};
      try {
        data = await response.json();
      } catch {}
      if (!response.ok) {
        setMensaje(data.message || 'Credenciales incorrectas');
        setExito(false);
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRol', data.rol);
      if (data.usuario && data.usuario.id) {
        localStorage.setItem('userId', data.usuario.id);
      }
      setMensaje('¡Inicio de sesión exitoso! Redirigiendo...');
      setExito(true);
      setTimeout(() => {
        if (data.rol === 'SubAdministrador') {
          navigate('/panel-sub-admin');
        } else if (data.rol === 'Administrador') {
          navigate('/panel-admin');
        } else if (data.rol === 'JefeDirecto') {
          navigate('/panel-jefe-directo');
        } else if (data.rol === 'Empleado') {
          navigate('/gestionar-registros-empleado');
        } else if (data.rol === 'InventoryManager') {
          navigate('/panel-inventory-manager');
        }else {
          navigate('/');
        }
      }, 1200);
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
      setExito(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: "url('/img/Recepcion.jpg') no-repeat center center",
        backgroundSize: 'cover',
        overflow: 'hidden',
      }}
    >
      {/* Botón volver */}
      <Tooltip title="Volver al inicio">
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: { xs: 18, sm: 32 },
            left: { xs: 10, sm: 32 },
            zIndex: 10,
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 2px 8px #52AB4144',
            border: '1.5px solid #e0e0e0',
            '&:hover': {
              background: '#52AB41',
              color: '#fff',
              boxShadow: '0 4px 16px #52AB41AA',
            },
          }}
          size="large"
        >
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      {/* Overlay glassmorphism */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(82,171,65,0.18)',
        backdropFilter: 'blur(7px)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      <Paper
        elevation={16}
        sx={{
          borderRadius: 7,
          boxShadow: '0 16px 48px 0 rgba(82,171,65,0.22), 0 4px 16px rgba(0,0,0,0.12)',
          p: { xs: 3, sm: 5 },
          minWidth: { xs: '90vw', sm: 380 },
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.88)',
          position: 'relative',
          zIndex: 2,
          border: '1.5px solid #e0e0e0',
          transition: 'box-shadow 0.3s, transform 0.3s',
          animation: 'fadeInUp 1.1s cubic-bezier(.23,1.01,.32,1) both',
          '@keyframes fadeInUp': {
            '0%': { opacity: 0, transform: 'translateY(40px) scale(0.98)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
          },
          '&:hover': {
            boxShadow: '0 24px 64px 0 rgba(82,171,65,0.28), 0 8px 32px rgba(0,0,0,0.16)',
            transform: 'scale(1.018)',
          },
        }}
      >
        <Avatar
          src="/img/NuevoLogo.png"
          alt="Logo"
          sx={{
            width: 110,
            height: 110,
            mb: 2,
            boxShadow: '0 6px 24px #52AB4144',
            border: '3.5px solid #fff',
            background: 'rgba(255,255,255,0.7)',
            transition: 'transform 0.4s, box-shadow 0.4s',
            filter: 'drop-shadow(0 0 16px #52AB41AA)',
            '&:hover': {
              transform: 'scale(1.09) rotate(-8deg)',
              boxShadow: '0 12px 40px #52AB41AA',
              filter: 'drop-shadow(0 0 32px #52AB41AA)',
            },
          }}
        />
        <Typography variant="h4" fontWeight={700} color="#222" mb={2} textAlign="center" sx={{ letterSpacing: 1, textShadow: '0 2px 8px #52AB4111' }}>
          Iniciar sesión
        </Typography>
        {mensaje && (
          <Alert severity={exito ? 'success' : 'error'} sx={{ mb: 2, width: '100%', fontWeight: 600, letterSpacing: 0.5, fontSize: 16, textAlign: 'center', borderRadius: 2 }}>
            {mensaje}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }} autoComplete="off">
          <TextField
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#52AB41' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              background: 'rgba(255,255,255,0.97)',
              borderRadius: 2,
              boxShadow: '0 1px 6px #52AB4111',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'box-shadow 0.2s, border 0.2s',
                '&.Mui-focused': {
                  boxShadow: '0 0 0 2px #52AB41AA',
                  borderColor: '#52AB41',
                },
              },
            }}
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#52AB41' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              background: 'rgba(255,255,255,0.97)',
              borderRadius: 2,
              boxShadow: '0 1px 6px #52AB4111',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'box-shadow 0.2s, border 0.2s',
                '&.Mui-focused': {
                  boxShadow: '0 0 0 2px #52AB41AA',
                  borderColor: '#52AB41',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 1,
              background: 'linear-gradient(90deg, #52AB41 0%, #3fa32c 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 2,
              boxShadow: '0 2px 12px rgba(82,171,65,0.10)',
              transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
              letterSpacing: 1,
              textShadow: '0 2px 8px #52AB4111',
              '&:hover': {
                background: 'linear-gradient(90deg, #3fa32c 0%, #52AB41 100%)',
                transform: 'translateY(-2px) scale(1.05)',
                boxShadow: '0 12px 32px #52AB41AA',
              },
            }}
            fullWidth
            size="large"
          >
            Ingresar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login; 