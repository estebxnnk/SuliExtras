import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import NavbarJefeDirecto from './NavbarJefeDirecto';

function PanelJefeDirecto() {
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
      <NavbarJefeDirecto />
      <Container maxWidth="md" sx={{ mt: 16 }}>
        <Box sx={{
          p: { xs: 2, md: 4 },
          minHeight: 350,
          background: 'rgba(255,255,255,0.93)',
          borderRadius: 4,
          boxShadow: '0 4px 32px rgba(13,71,161,0.10)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#0d47a1', mb: 1, letterSpacing: 1, textShadow: '0 2px 8px #b6d0f7' }}>
            ¡Bienvenido, Jefe Directo!
          </Typography>
          <Typography variant="h5" sx={{ color: '#222', mb: 2, fontWeight: 500, textAlign: 'center' }}>
            Gestiona registros y usuarios con rol de empleado desde este panel exclusivo.
          </Typography>
          {/* Aquí irá el contenido principal del panel de Jefe Directo */}
        </Box>
      </Container>
    </Box>
  );
}

export default PanelJefeDirecto; 