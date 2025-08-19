import React from 'react';
import {
  Box,
  Paper,
  Typography
} from '@mui/material';

const InformacionFiltros = ({ hayFiltrosActivos, estadisticasFiltros }) => {
  if (!hayFiltrosActivos) return null;

  return (
    <Paper elevation={1} sx={{ 
      mt: 3, 
      p: 2, 
      background: 'rgba(25, 118, 210, 0.1)',
      borderRadius: 2
    }}>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        🔍 Filtros aplicados: {estadisticasFiltros.porcentajeFiltrado}% de registros ocultados
      </Typography>
    </Paper>
  );
};

export default InformacionFiltros;
