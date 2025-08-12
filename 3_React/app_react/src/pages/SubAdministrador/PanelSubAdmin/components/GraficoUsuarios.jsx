import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import {
  PieChart,
  pieArcLabelClasses
} from '@mui/x-charts/PieChart';
import { People as PeopleIcon } from '@mui/icons-material';

export const GraficoUsuarios = ({ usuarios, isMobile }) => {
  // Calcular usuarios por rol
  const usuariosPorRol = React.useMemo(() => {
    const conteo = {};
    usuarios.forEach(u => {
      const nombreRol = u.rol?.nombre || 'Sin Rol';
      conteo[nombreRol] = (conteo[nombreRol] || 0) + 1;
    });
    
    return Object.entries(conteo).map(([rol, cantidad], i) => ({
      id: i,
      value: cantidad,
      label: rol,
      color: i === 0 ? '#1976d2' : i === 1 ? '#ffb300' : '#43a047',
    }));
  }, [usuarios]);

  // Calcular total de usuarios
  const totalUsuarios = usuarios.length;

  // Colores para el gráfico
  const colors = ['#1976d2', '#ffb300', '#43a047', '#f44336', '#9c27b0', '#00bcd4'];

  return (
    <Card sx={{
      height: '100%',
      background: 'rgba(255,255,255,0.98)',
      backdropFilter: 'blur(20px)',
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <PeopleIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600} color="primary">
              Distribución de Usuarios por Rol
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {totalUsuarios} usuarios
            </Typography>
          </Box>
        </Box>

        {usuariosPorRol.length > 0 ? (
          <Box>
            {/* Gráfico */}
            <Box sx={{ height: isMobile ? 300 : 400, mb: 2 }}>
              <PieChart
                series={[
                  {
                    data: usuariosPorRol,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                height={isMobile ? 300 : 400}
                slotProps={{
                  legend: {
                    hidden: isMobile,
                  },
                }}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: 'white',
                    fontWeight: 'bold',
                    fontSize: 14,
                  },
                }}
              />
            </Box>

            {/* Leyenda */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {usuariosPorRol.map((item, index) => (
                <Chip
                  key={item.id}
                  label={`${item.label}: ${item.value}`}
                  size="small"
                  sx={{
                    bgcolor: colors[index % colors.length],
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 2
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No hay datos para mostrar
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 