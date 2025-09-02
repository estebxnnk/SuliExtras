import React from 'react';
import { Box, TextField, MenuItem, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const FiltrosAvanzadosEmpleado = ({
  search,
  onSearchChange,
  filtroEstado,
  onFiltroEstadoChange,
  fechaDesde,
  onFechaDesdeChange,
  fechaHasta,
  onFechaHastaChange,
  onRefresh,
  disabled
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <TextField
        placeholder="Buscar por ubicación, número o justificación"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        sx={{ flex: 1, maxWidth: 400 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
      <TextField
        select
        label="Filtrar por estado"
        value={filtroEstado}
        onChange={e => onFiltroEstadoChange(e.target.value)}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="todos">Todos los estados</MenuItem>
        <MenuItem value="pendiente">Pendiente</MenuItem>
        <MenuItem value="aprobado">Aprobado</MenuItem>
        <MenuItem value="rechazado">Rechazado</MenuItem>
      </TextField>
      <TextField
        label="Desde"
        type="date"
        value={fechaDesde}
        onChange={e => onFechaDesdeChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 140 }}
      />
      <TextField
        label="Hasta"
        type="date"
        value={fechaHasta}
        onChange={e => onFechaHastaChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 140 }}
      />
      <Button onClick={onRefresh} startIcon={<SearchIcon />} variant="outlined" color="primary" sx={{ fontWeight: 700, height: 56 }} disabled={disabled}>
        Refrescar
      </Button>
    </Box>
  );
};

export default FiltrosAvanzadosEmpleado;


