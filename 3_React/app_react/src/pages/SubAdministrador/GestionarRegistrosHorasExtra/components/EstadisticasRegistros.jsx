import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

const EstadisticasRegistros = ({ estadisticas, tiposHoraCount }) => {
  const stats = [
    { 
      label: 'Total de Registros', 
      value: estadisticas.totalRegistros, 
      color: '#1976d2',
      icon: AssessmentIcon,
      gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
    },
    { 
      label: 'Registros Filtrados', 
      value: estadisticas.registrosFiltrados, 
      color: '#4caf50',
      icon: TrendingUpIcon,
      gradient: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
    },
    { 
      label: 'Por Aprobar', 
      value: estadisticas.registrosPendientes, 
      color: '#ff9800',
      icon: ScheduleIcon,
      gradient: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
    },
    { 
      label: 'Aprobados', 
      value: estadisticas.registrosAprobados, 
      color: '#4caf50',
      icon: CheckCircleIcon,
      gradient: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
    },
    { 
      label: 'Rechazados', 
      value: estadisticas.registrosRechazados, 
      color: '#f44336',
      icon: CancelIcon,
      gradient: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
    },
    { 
      label: 'Tipos de Hora', 
      value: tiposHoraCount, 
      color: '#9c27b0',
      icon: CategoryIcon,
      gradient: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)'
    }
  ];

  return (
    <Paper elevation={2} sx={{ 
      p: 3, 
      mb: 3, 
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)',
      border: '2px solid rgba(25, 118, 210, 0.15)',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <Grid container spacing={3}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Grid item xs={12} md={2} key={index}>
              <Box sx={{ 
                textAlign: 'center',
                p: 2,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.8)',
                border: `2px solid ${stat.color}20`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 24px ${stat.color}30`,
                  background: 'rgba(255,255,255,0.95)'
                }
              }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2
                }}>
                  <Box sx={{
                    p: 1.5,
                    borderRadius: '50%',
                    background: stat.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 16px ${stat.color}40`
                  }}>
                    <IconComponent sx={{ 
                      fontSize: 28, 
                      color: 'white',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }} />
                  </Box>
                </Box>
                
                <Typography variant="h3" fontWeight={800} sx={{ 
                  color: stat.color,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  mb: 1,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}>
                  {stat.value}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ 
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  lineHeight: 1.2
                }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default EstadisticasRegistros;
