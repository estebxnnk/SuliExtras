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
  LocationOn as LocationIcon
} from '@mui/icons-material';

const FiltrosAvanzados = ({
  search,
  onSearchChange,
  // Opcionales: si no se envían, no se renderizan
  tipoHoraId,
  onTipoHoraChange,
  fechaInicio,
  onFechaInicioChange,
  fechaFin,
  onFechaFinChange,
  ubicacion,
  onUbicacionChange,
  tiposHora = [],
  ubicaciones = [],
  onClearFilters,
  isMobile = false
}) => {
  const hasActiveFilters = Boolean(
    (search && search.trim()) ||
    (typeof tipoHoraId !== 'undefined' && tipoHoraId !== 'todos') ||
    (typeof fechaInicio !== 'undefined' && fechaInicio) ||
    (typeof fechaFin !== 'undefined' && fechaFin) ||
    (typeof ubicacion !== 'undefined' && ubicacion !== 'todos')
  );

  const handleClearFilters = () => {
    onSearchChange?.('');
    if (typeof onTipoHoraChange === 'function') onTipoHoraChange('todos');
    if (typeof onFechaInicioChange === 'function') onFechaInicioChange('');
    if (typeof onFechaFinChange === 'function') onFechaFinChange('');
    if (typeof onUbicacionChange === 'function') onUbicacionChange('todos');
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
          Filtros Avanzados para Reportes
        </Typography>
        {hasActiveFilters && (
          <Chip
            label={`${[search, (tipoHoraId && tipoHoraId !== 'todos'), fechaInicio, fechaFin, (ubicacion && ubicacion !== 'todos')].filter(Boolean).length} filtros activos`}
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
        <Grid item xs={12} md={6} lg={3}>
          <TextField
            fullWidth
            label="Buscar usuarios"
            placeholder="Buscar por nombre, email, documento..."
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

        {/* Filtro por tipo de hora (opcional) */}
        {typeof tipoHoraId !== 'undefined' && typeof onTipoHoraChange === 'function' && (
          <Grid item xs={12} md={6} lg={3}>
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
        )}

        {/* Filtro por ubicación (opcional) */}
        {typeof ubicacion !== 'undefined' && typeof onUbicacionChange === 'function' && (
          <Grid item xs={12} md={6} lg={3}>
            <FormControl fullWidth>
              <InputLabel>Ubicación</InputLabel>
              <Select
                value={ubicacion}
                onChange={(e) => onUbicacionChange(e.target.value)}
                label="Ubicación"
                startAdornment={
                  <LocationIcon sx={{ color: '#1976d2', mr: 1 }} />
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
                  <em>Todas las ubicaciones</em>
                </MenuItem>
                {ubicaciones.map((ubic) => (
                  <MenuItem key={ubic} value={ubic}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: ubic === 'Medellín' ? '#4caf50' : 
                                     ubic === 'Bogotá' ? '#2196f3' : 
                                     ubic === 'Cali' ? '#ff9800' : 
                                     ubic === 'Barranquilla' ? '#9c27b0' : '#666'
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {ubic}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

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

      {/* Información adicional de filtros */}
      {hasActiveFilters && (
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(25, 118, 210, 0.2)' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Los filtros se aplicarán a los reportes y registros mostrados. 
            Solo se pueden descargar reportes de registros aprobados.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FiltrosAvanzados;
