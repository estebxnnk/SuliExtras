import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  Collapse,
  InputAdornment,
  IconButton,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { estados, getTiposDisponibles, getDispositivoIcon } from '../utils/dispositivosUtils';

const Filtros = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  loading,
  fetchData,
  clearFilters,
  dispositivos,
  sedes,
  isMobile
}) => {
  const tiposDisponibles = getTiposDisponibles(dispositivos);

  return (
    <Card sx={{ 
      background: 'rgba(255,255,255,0.98)', 
      backdropFilter: 'blur(20px)',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      mb: 3,
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar por nombre, serial, modelo, marca o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent={{ xs: 'center', md: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                size={isMobile ? "small" : "medium"}
                color={showFilters ? 'primary' : 'inherit'}
                sx={{ borderRadius: 3 }}
              >
                Filtros
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchData}
                size={isMobile ? "small" : "medium"}
                disabled={loading}
                sx={{ borderRadius: 3 }}
              >
                {loading ? 'Cargando...' : 'Actualizar'}
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Panel de filtros colapsible */}
        <Collapse in={showFilters}>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.estado}
                  onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                  label="Estado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {estados.map((estado) => (
                    <MenuItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Sede</InputLabel>
                <Select
                  value={filters.sede}
                  onChange={(e) => setFilters({ ...filters, sede: e.target.value })}
                  label="Sede"
                >
                  <MenuItem value="">Todas</MenuItem>
                  {sedes.map((sede) => (
                    <MenuItem key={sede.sedeId || 'default'} value={sede.sedeId?.toString() || ''}>
                      {sede.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Funcional</InputLabel>
                <Select
                  value={filters.funcional}
                  onChange={(e) => setFilters({ ...filters, funcional: e.target.value })}
                  label="Funcional"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">Funcional</MenuItem>
                  <MenuItem value="false">No Funcional</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Dispositivo</InputLabel>
                <Select
                  value={filters.tipoDispositivo}
                  onChange={(e) => setFilters({ ...filters, tipoDispositivo: e.target.value })}
                  label="Tipo de Dispositivo"
                >
                  {tiposDisponibles.map(({ value, label, count }) => (
                    <MenuItem key={value} value={value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        {value && React.createElement(getDispositivoIcon(value).type)}
                        <Box sx={{ flex: 1 }}>
                          {label}
                        </Box>
                        <Chip 
                          label={count} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: '20px' }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  color="secondary"
                >
                  Limpiar Filtros
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default Filtros; 