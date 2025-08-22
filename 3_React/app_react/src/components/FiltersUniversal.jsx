import React from 'react';
import { Box, TextField, MenuItem, InputAdornment, Button, Paper, Typography, Chip } from '@mui/material';
import FilterIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

function FiltersUniversal({
  search = '',
  onSearchChange,
  roles = [],
  roleValue = '',
  onRoleChange,
  sedes = [],
  sedeValue = '',
  onSedeChange,
  onCreate,
  createText = 'Crear'
}) {
  const hasActive = Boolean(search || roleValue || sedeValue);

  return (
    <Paper elevation={3} sx={{
      p: 3,
      mb: 3,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)',
      border: '2px solid rgba(25, 118, 210, 0.2)',
      borderRadius: 3,
      backdropFilter: 'blur(10px)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <FilterIcon sx={{ color: '#1976d2', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={700} color="#1976d2">Filtros</Typography>
        {hasActive && (
          <Chip label="Filtros activos" color="primary" size="small" sx={{ fontWeight: 600 }} />
        )}
        {hasActive && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<ClearIcon />}
            onClick={() => {
              onSearchChange?.('');
              onRoleChange?.('');
              onSedeChange?.('');
            }}
            sx={{ ml: 'auto', fontWeight: 600, borderWidth: 2, borderRadius: 2 }}
          >
            Limpiar
          </Button>
        )}
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 2
      }}>
      <TextField
        value={search}
        onChange={(e) => onSearchChange?.(e.target.value)}
        placeholder="Buscar por nombre, email o documento"
        size="small"
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
        value={roleValue}
        onChange={(e) => onRoleChange?.(e.target.value)}
        label="Rol"
        size="small"
        SelectProps={{
          renderValue: (selected) => {
            const item = roles.find((r) => String(r.id || r) === String(selected));
            const name = item?.nombre || item || 'Todos';
            const color = getRoleColor(name);
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: color }} />
                <Typography variant="body2" fontWeight={700}>{name || 'Todos'}</Typography>
              </Box>
            );
          }
        }}
      >
        <MenuItem value="">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#9e9e9e' }} />
            <Typography variant="body2" fontWeight={700}>Todos</Typography>
          </Box>
        </MenuItem>
        {roles.map((r) => {
          const id = r.id || r;
          const name = r.nombre || r;
          const color = getRoleColor(name);
          return (
            <MenuItem key={id} value={id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: color }} />
                <Typography variant="body2" fontWeight={700}>{name}</Typography>
              </Box>
            </MenuItem>
          );
        })}
      </TextField>

      <TextField
        select
        value={sedeValue}
        onChange={(e) => onSedeChange?.(e.target.value)}
        label="Sede"
        size="small"
      >
        <MenuItem value="">Todas</MenuItem>
        {sedes.map((s) => (
          <MenuItem key={s.id || s} value={s.id || s}>{s.nombre || s}</MenuItem>
        ))}
      </TextField>

        {onCreate && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={onCreate}
              sx={{
                ml: 'auto',
                fontWeight: 700,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                }
              }}
            >
              {createText}
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

// Color por rol (similar a chips de estado/roles)
function getRoleColor(roleName = '') {
  const r = String(roleName).toLowerCase();
  if (r.includes('admin')) return '#1976d2';
  if (r.includes('sub')) return '#9c27b0';
  if (r.includes('oper') || r.includes('user') || r.includes('usuario')) return '#43a047';
  return '#9e9e9e';
}

export default FiltersUniversal;


