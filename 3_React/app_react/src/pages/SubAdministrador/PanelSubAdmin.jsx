import React from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import NavbarSubAdmin from './NavbarSubAdmin';

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
      <NavbarSubAdmin />
      <Container maxWidth="md" sx={{ mt: 16 }}>
        <Box sx={{
          p: { xs: 2, md: 4 },
          minHeight: 350,
          background: 'rgba(255,255,255,0.93)',
          borderRadius: 4,
          boxShadow: '0 4px 32px rgba(82,171,65,0.10)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#52AB41', mb: 1, letterSpacing: 1, textShadow: '0 2px 8px #b6e7b0' }}>
            ¡Bienvenido, Sub Administrador!
          </Typography>
          <Typography variant="h5" sx={{ color: '#222', mb: 2, fontWeight: 500, textAlign: 'center' }}>
            Gestiona usuarios, solicitudes y más desde este panel exclusivo.
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 2, borderRadius: 2, fontWeight: 700, fontSize: '1.1rem', px: 4, py: 1.5, boxShadow: '0 2px 8px #b6e7b0' }}
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