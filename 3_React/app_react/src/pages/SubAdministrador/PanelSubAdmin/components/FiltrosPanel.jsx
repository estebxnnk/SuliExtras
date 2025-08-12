import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';

export const FiltrosPanel = ({
  rolFiltro,
  datePreset,
  roles,
  onRolChange,
  onDatePresetChange,
  isMobile
}) => {
  const presets = [
    { value: 'today', label: 'Hoy' },
    { value: '7d', label: 'Últimos 7 días' },
    { value: '1m', label: 'Último mes' },
    { value: 'all', label: 'Todos' }
  ];

  return (
    <Card sx={{ 
      mb: 3,
      background: 'rgba(255,255,255,0.98)',
      backdropFilter: 'blur(20px)',
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
          Filtros
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrar por Rol</InputLabel>
              <Select
                value={rolFiltro}
                onChange={onRolChange}
                label="Filtrar por Rol"
              >
                <MenuItem value="">Todos los roles</MenuItem>
                {roles.map((rol) => (
                  <MenuItem key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Rango de Fechas</InputLabel>
              <Select
                value={datePreset}
                onChange={(e) => onDatePresetChange(e.target.value)}
                label="Rango de Fechas"
              >
                {presets.map((preset) => (
                  <MenuItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}; 