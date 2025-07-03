import React from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavbarAdminstrativo from './NavbarAdminstrativo';

function PanelAdministrativo() {
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
      <NavbarAdminstrativo />
      <Container maxWidth="md" sx={{ mt: 16 }}>
        <Box sx={{
          p: { xs: 2, md: 4 },
          minHeight: 350,
          background: 'rgba(255,255,255,0.93)',
          borderRadius: 4,
          boxShadow: '0 4px 32px rgba(25,118,210,0.10)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1976d2', mb: 1, letterSpacing: 1, textShadow: '0 2px 8px #b6d0f7' }}>
            ¡Bienvenido, Administrador!
          </Typography>
          <Typography variant="h5" sx={{ color: '#222', mb: 2, fontWeight: 500, textAlign: 'center' }}>
            Gestiona usuarios, roles, solicitudes y más desde este panel exclusivo.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, borderRadius: 2, fontWeight: 700, fontSize: '1.1rem', px: 4, py: 1.5, boxShadow: '0 2px 8px #b6d0f7' }}
            onClick={() => navigate('/registrar-usuario-administrativo')}
          >
            Crear Nuevo Usuario
          </Button>
          {/* Aquí irá el contenido principal del panel de administrador */}
        </Box>
      </Container>
    </Box>
  );
}

export default PanelAdministrativo; 