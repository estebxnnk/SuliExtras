import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon
} from '@mui/icons-material';

/**
 * Componente de estadísticas universal que se basa 100% en el estilo del módulo
 * Mantiene la misma estética visual y estructura
 */
const StatsUniversal = ({ 
  stats = [],
  title = "Estadísticas del Módulo",
  subtitle = "Resumen de datos importantes",
  iconColor = "#1976d2"
}) => {
  // Iconos por tipo de estadística
  const getIcon = (type) => {
    switch (type) {
      case 'total':
        return <TrendingUpIcon />;
      case 'usuarios':
      case 'empleados':
        return <PeopleIcon />;
      case 'horas':
      case 'tiempo':
        return <ScheduleIcon />;
      case 'aprobados':
      case 'exitosos':
        return <CheckCircleIcon />;
      case 'rechazados':
      case 'fallidos':
        return <CancelIcon />;
      case 'pendientes':
        return <PendingIcon />;
      default:
        return <TrendingUpIcon />;
    }
  };

  // Colores por tipo de estadística
  const getColor = (type) => {
    switch (type) {
      case 'total':
        return '#1976d2';
      case 'usuarios':
      case 'empleados':
        return '#9c27b0';
      case 'horas':
      case 'tiempo':
        return '#ff9800';
      case 'aprobados':
      case 'exitosos':
        return '#4caf50';
      case 'rechazados':
      case 'fallidos':
        return '#f44336';
      case 'pendientes':
        return '#ff9800';
      default:
        return iconColor;
    }
  };

  return (
    <Paper elevation={3} sx={{ 
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 3,
      p: 3,
      mb: 3
    }}>
      {/* Header de estadísticas */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color={iconColor} sx={{ mb: 1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      
      {/* Grid de estadísticas */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              p: 2,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.8)',
              border: `2px solid ${getColor(stat.type)}20`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${getColor(stat.type)}30`,
                borderColor: `${getColor(stat.type)}40`
              }
            }}>
              {/* Icono */}
              <Box sx={{ 
                mb: 1,
                p: 1,
                borderRadius: '50%',
                backgroundColor: `${getColor(stat.type)}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {React.cloneElement(getIcon(stat.type), { 
                  sx: { 
                    fontSize: 32, 
                    color: getColor(stat.type) 
                  } 
                })}
              </Box>
              
              {/* Valor */}
              <Typography variant="h4" fontWeight={800} color={getColor(stat.type)} sx={{ mb: 0.5 }}>
                {stat.value}
              </Typography>
              
              {/* Etiqueta */}
              <Typography variant="body2" color="text.secondary" fontWeight={600} textAlign="center">
                {stat.label}
              </Typography>
              
              {/* Descripción adicional si existe */}
              {stat.description && (
                <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 0.5 }}>
                  {stat.description}
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
      
      {/* Mensaje si no hay estadísticas */}
      {stats.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No hay estadísticas disponibles
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default StatsUniversal;
