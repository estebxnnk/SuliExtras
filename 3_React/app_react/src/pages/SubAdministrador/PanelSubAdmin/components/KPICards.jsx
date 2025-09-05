import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

export const KPICards = ({
  usuarios,
  registros,
  datePreset,
  isMobile
}) => {
  // Calcular métricas
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(u => u.estado === 'activo' || u.estado === 'ACTIVO').length;
  const usuariosInactivos = usuarios.filter(u => u.estado === 'inactivo' || u.estado === 'INACTIVO').length;
  const usuariosPendientes = usuarios.filter(u => u.estado === 'pendiente' || u.estado === 'PENDIENTE').length;
  
  const totalRegistros = registros.length;
  const registrosAprobados = registros.filter(r => r.estado === 'aprobado' || r.estado === 'APROBADO').length;
  const registrosPendientes = registros.filter(r => r.estado === 'pendiente' || r.estado === 'PENDIENTE').length;
  const registrosRechazados = registros.filter(r => r.estado === 'rechazado' || r.estado === 'RECHAZADO').length;

  const kpis = [
    {
      title: 'Total Usuarios',
      value: totalUsuarios,
      icon: PeopleIcon,
      color: 'primary.main',
      bgColor: 'primary.light',
      subtitle: 'Usuarios registrados'
    },
    {
      title: 'Usuarios Activos',
      value: usuariosActivos,
      icon: CheckCircleIcon,
      color: 'success.main',
      bgColor: 'success.light',
      subtitle: 'Usuarios activos en el sistema'
    },
    {
      title: 'Usuarios Pendientes',
      value: usuariosPendientes,
      icon: PendingIcon,
      color: 'warning.main',
      bgColor: 'warning.light',
      subtitle: 'Usuarios pendientes de activación'
    },
    {
      title: 'Total Registros',
      value: totalRegistros,
      icon: AccessTimeIcon,
      color: 'info.main',
      bgColor: 'info.light',
      subtitle: 'Registros de horas extra'
    },
    {
      title: 'Registros Aprobados',
      value: registrosAprobados,
      icon: CheckCircleIcon,
      color: 'success.main',
      bgColor: 'success.light',
      subtitle: 'Registros aprobados'
    },
    {
      title: 'Registros Pendientes',
      value: registrosPendientes,
      icon: WarningIcon,
      color: 'warning.main',
      bgColor: 'warning.light',
      subtitle: 'Registros pendientes de revisión'
    }
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {kpis.map((kpi, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <Card sx={{
            height: '100%',
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
            }
          }}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: kpi.bgColor,
                    color: kpi.color,
                    width: 48,
                    height: 48
                  }}
                >
                  <kpi.icon fontSize="large" />
                </Avatar>
              </Box>
              
              <Typography variant="h4" component="div" fontWeight="bold" color={kpi.color} gutterBottom>
                {kpi.value}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {kpi.title}
              </Typography>
              
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                {kpi.subtitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}; 