import React from 'react';
import {
  Box,
  Typography,
  Button
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const HeaderGestionRegistros = ({ 
  refreshing, 
  refrescarDatos, 
  irACrearRegistro,
  irACrearRegistrosBulk
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
      <AccessTimeIcon sx={{ fontSize: 48, color: '#1976d2' }} />
      <Box sx={{ flex: 1 }}>
        <Typography variant="h3" component="h1" fontWeight={800} color="#1976d2" sx={{ 
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Gestión de Registros de Horas Extra
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
          Administra y gestiona todos los registros de horas extra del sistema
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refrescarDatos}
          disabled={refreshing}
          sx={{ 
            fontWeight: 600,
            borderRadius: 2,
            borderWidth: 2
          }}
        >
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={irACrearRegistro}
          sx={{ 
            fontWeight: 700,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
            }
          }}
        >
          Crear Registro
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={irACrearRegistrosBulk}
          sx={{ 
            fontWeight: 700,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
            boxShadow: '0 4px 15px rgba(27, 94, 32, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1b5e20 0%, #10491a 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(27, 94, 32, 0.4)'
            }
          }}
        >
          Crear Registros (Bulk)
        </Button>
      </Box>
    </Box>
  );
};

export default HeaderGestionRegistros;
