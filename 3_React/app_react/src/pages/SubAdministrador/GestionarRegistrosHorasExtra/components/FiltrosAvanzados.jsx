import React from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  DateRange as DateRangeIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  CheckCircle as StatusIcon
} from '@mui/icons-material';

const FiltrosAvanzados = ({
  search,
  onSearchChange,
  tipoHoraId,
  onTipoHoraChange,
  fechaInicio,
  onFechaInicioChange,
  fechaFin,
  onFechaFinChange,
  estado,
  onEstadoChange,
  tiposHora,
  onClearFilters,
  isMobile = false
}) => {
  const hasActiveFilters = search || (tipoHoraId && tipoHoraId !== 'todos') || fechaInicio || fechaFin || (estado && estado !== 'todos');

  const handleClearFilters = () => {
    onSearchChange('');
    onTipoHoraChange('todos');
    onFechaInicioChange('');
    onFechaFinChange('');
    onEstadoChange('todos');
    onClearFilters?.();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)',
        border: '2px solid rgba(25, 118, 210, 0.2)',
        borderRadius: 3,
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Header de filtros */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <FilterIcon sx={{ color: '#1976d2', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={700} color="#1976d2">
          Filtros Avanzados
        </Typography>
        {hasActiveFilters && (
          <Chip
            label={`${[search, (tipoHoraId && tipoHoraId !== 'todos'), fechaInicio, fechaFin, (estado && estado !== 'todos')].filter(Boolean).length} filtros activos`}
            color="primary"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        )}
        
        {/* Botón de limpiar filtros prominente */}
        {hasActiveFilters && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            sx={{
              ml: 'auto',
              fontWeight: 600,
              borderWidth: 2,
              borderRadius: 2,
              '&:hover': {
                borderWidth: 2,
                background: 'rgba(244, 67, 54, 0.1)'
              }
            }}
          >
            Limpiar Filtros
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Búsqueda general */}
        <Grid item xs={12} md={6} lg={2}>
          <TextField
            fullWidth
            label="Buscar registros"
            placeholder="Buscar por empleado, ubicación, número..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: '#1976d2', mr: 1 }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255,255,255,0.9)',
                '&:hover': {
                  background: 'rgba(255,255,255,1)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                    borderWidth: 2
                  }
                },
                '&.Mui-focused': {
                  background: 'rgba(255,255,255,1)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                    borderWidth: 2
                  }
                }
              }
            }}
          />
        </Grid>

        {/* Filtro por tipo de hora */}
        <Grid item xs={12} md={6} lg={2}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Hora Extra</InputLabel>
            <Select
              value={tipoHoraId}
              onChange={(e) => onTipoHoraChange(e.target.value)}
              label="Tipo de Hora Extra"
              startAdornment={
                <TimeIcon sx={{ color: '#1976d2', mr: 1 }} />
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.9)',
                  '&:hover': {
                    background: 'rgba(255,255,255,1)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                      borderWidth: 2
                    }
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255,255,255,1)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                      borderWidth: 2
                    }
                  }
                }
              }}
            >
              <MenuItem value="todos">
                <em>Todos los tipos</em>
              </MenuItem>
              {tiposHora.map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {tipo.tipo}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {tipo.denominacion} ({(tipo.valor - 1) * 100}% recargo)
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Filtro por estado */}
        <Grid item xs={12} md={6} lg={2}>
          <FormControl fullWidth>
            <InputLabel>Estado del Registro</InputLabel>
            <Select
              value={estado}
              onChange={(e) => onEstadoChange(e.target.value)}
              label="Estado del Registro"
              startAdornment={
                <StatusIcon sx={{ color: '#1976d2', mr: 1 }} />
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.9)',
                  '&:hover': {
                    background: 'rgba(255,255,255,1)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                      borderWidth: 2
                    }
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255,255,255,1)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                      borderWidth: 2
                    }
                  }
                }
              }}
            >
              <MenuItem value="todos">
                <em>Todos los estados</em>
              </MenuItem>
              <MenuItem value="pendiente">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#ff9800' }} />
                  <Typography variant="body2" fontWeight={600}>
                    Pendiente
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="aprobado">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#4caf50' }} />
                  <Typography variant="body2" fontWeight={600}>
                    Aprobado
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="rechazado">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#f44336' }} />
                  <Typography variant="body2" fontWeight={600}>
                    Rechazado
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Filtro por fecha de inicio */}
        <Grid item xs={12} md={6} lg={3}>
          <TextField
            fullWidth
            label="Fecha de Inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => onFechaInicioChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <DateRangeIcon sx={{ color: '#1976d2', mr: 1 }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255,255,255,0.9)',
                '&:hover': {
                  background: 'rgba(255,255,255,1)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                    borderWidth: 2
                  }
                },
                '&.Mui-focused': {
                  background: 'rgba(255,255,255,1)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                    borderWidth: 2
                  }
                }
              }
            }}
          />
        </Grid>

        {/* Filtro por fecha de fin */}
        <Grid item xs={12} md={6} lg={3}>
          <TextField
            fullWidth
            label="Fecha de Fin"
            type="date"
            value={fechaFin}
            onChange={(e) => onFechaFinChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <DateRangeIcon sx={{ color: '#1976d2', mr: 1 }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255,255,255,0.9)',
                '&:hover': {
                  background: 'rgba(255,255,255,1)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                    borderWidth: 2
                  }
                },
                '&.Mui-focused': {
                  background: 'rgba(255,255,255,1)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                    borderWidth: 2
                  }
                }
              }
            }}
          />
        </Grid>
      </Grid>

      {/* Información de filtros activos */}
      {hasActiveFilters && (
        <>
          <Divider sx={{ my: 2, borderColor: 'rgba(25, 118, 210, 0.3)' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Filtros aplicados:
            </Typography>
            
            {search && (
              <Chip
                label={`Búsqueda: "${search}"`}
                color="primary"
                variant="outlined"
                size="small"
                onDelete={() => onSearchChange('')}
                sx={{ '& .MuiChip-deleteIcon': { color: '#1976d2' } }}
              />
            )}
            
                         {tipoHoraId && tipoHoraId !== 'todos' && (
               <Chip
                 label={`Tipo: ${tiposHora.find(t => t.id === tipoHoraId)?.tipo || tipoHoraId}`}
                 color="secondary"
                 variant="outlined"
                 size="small"
                 onDelete={() => onTipoHoraChange('todos')}
                 sx={{ '& .MuiChip-deleteIcon': { color: '#9c27b0' } }}
               />
             )}

                         {estado && estado !== 'todos' && (
               <Chip
                 label={`Estado: ${estado}`}
                 color="info"
                 variant="outlined"
                 size="small"
                 onDelete={() => onEstadoChange('todos')}
                 sx={{ '& .MuiChip-deleteIcon': { color: '#2196f3' } }}
               />
             )}
            
            {fechaInicio && (
              <Chip
                label={`Desde: ${fechaInicio}`}
                color="info"
                variant="outlined"
                size="small"
                onDelete={() => onFechaInicioChange('')}
                sx={{ '& .MuiChip-deleteIcon': { color: '#2196f3' } }}
              />
            )}
            
            {fechaFin && (
              <Chip
                label={`Hasta: ${fechaFin}`}
                color="info"
                variant="outlined"
                size="small"
                onDelete={() => onFechaFinChange('')}
                sx={{ '& .MuiChip-deleteIcon': { color: '#2196f3' } }}
              />
            )}
          </Box>
        </>
      )}

      {/* Información adicional sobre filtros de fecha */}
      {fechaInicio && fechaFin && (
        <Box sx={{ mt: 2, p: 2, background: 'rgba(25, 118, 210, 0.1)', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            📅 Mostrando registros entre el {fechaInicio} y el {fechaFin}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FiltrosAvanzados;
