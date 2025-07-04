import React from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function AdminNavbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRol');
    navigate('/');
  };
  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: '98vw', md: '98vw' },
        maxWidth: 1400,
        height: 90,
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 5,
        zIndex: 1000,
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Link to="/panel-admin">
          <Box component="img" src="/img/NuevoLogo.png" alt="Logo" sx={{ height: 72 }} />
        </Link>
        <Link to="/usuarios" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Usuarios</Typography>
        </Link>
        <Link to="/registrar-usuario" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Crear Usuario</Typography>
        </Link>
        <Link to="/panel-admin?tab=solicitudes" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Solicitudes</Typography>
        </Link>
      </Box>
      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        sx={{ fontWeight: 700, borderRadius: 2, px: 3, height: 48, fontSize: 15 }}
      >
        Cerrar sesión
      </Button>
    </Paper>
  );
}

function PanelAdmin() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: `url('/img/Recepcion.jpg') no-repeat center center`,
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: { xs: 2, md: 6 },
      }}
    >
      <AdminNavbar />
      <Container maxWidth="md" sx={{ mt: 16 }}>
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 350 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#52AB41', mb: 2 }}>
            Panel de Administración
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 2, borderRadius: 2, fontWeight: 700, fontSize: '1.1rem' }}
            onClick={() => navigate('/registrar-usuario')}
          >
            Crear Nuevo Usuario
          </Button>
          {/* Aquí irá el contenido principal del panel de administrador */}
        </Box>
      </Container>
    </Box>
  );
}

export default PanelAdmin; 