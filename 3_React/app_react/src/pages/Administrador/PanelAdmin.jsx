import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Divider
} from '@mui/material';

function PanelAdmin() {
  const [tab, setTab] = useState(0);

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
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Paper elevation={6} sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.95)' }}>
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            variant="fullWidth"
            sx={{
              borderRadius: '16px 16px 0 0',
              background: 'rgba(255,255,255,0.92)',
              boxShadow: 2,
              minHeight: 60,
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: { xs: '1rem', md: '1.1rem' },
                color: '#3B394F',
                minHeight: 60,
              },
              '& .Mui-selected': {
                color: '#52AB41',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#52AB41',
                height: 4,
                borderRadius: 2,
              },
            }}
          >
            <Tab label="Gestión de Usuarios y Roles" />
            <Tab label="Crear Nuevo Usuario" />
            <Tab label="Solicitudes de Contactanos" />
          </Tabs>
          <Divider />
          <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 350 }}>
            {tab === 0 && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#52AB41', mb: 2 }}>
                  Gestión de Usuarios y Roles
                </Typography>
                <Typography variant="body1" sx={{ color: '#333', mb: 2 }}>
                  Aquí podrás ver, editar y asignar roles a los usuarios (Jefe directo, Empleado).
                </Typography>
                {/* Aquí irá la tabla/listado de usuarios y controles de rol */}
              </Box>
            )}
            {tab === 1 && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#52AB41', mb: 2 }}>
                  Crear Nuevo Usuario
                </Typography>
                <Typography variant="body1" sx={{ color: '#333', mb: 2 }}>
                  Formulario para registrar un nuevo usuario en el sistema.
                </Typography>
                {/* Aquí irá el formulario de creación de usuario */}
              </Box>
            )}
            {tab === 2 && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#52AB41', mb: 2 }}>
                  Solicitudes de Contactanos
                </Typography>
                <Typography variant="body1" sx={{ color: '#333', mb: 2 }}>
                  Visualiza aquí los mensajes recibidos desde el formulario de contacto de la página principal.
                </Typography>
                {/* Aquí irá la lista de solicitudes de contacto */}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default PanelAdmin; 