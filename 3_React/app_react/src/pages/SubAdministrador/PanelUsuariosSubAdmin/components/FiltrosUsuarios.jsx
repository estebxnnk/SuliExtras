import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

export const FiltrosUsuarios = ({
  search,
  onSearchChange,
  isMobile
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <FilterListIcon sx={{ color: '#1976d2', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={600} color="#1976d2">
          Filtros de Búsqueda
        </Typography>
      </Box>
      
      <TextField
        fullWidth
        size={isMobile ? 'small' : 'medium'}
        variant="outlined"
        placeholder="Buscar usuarios por nombre, email o documento..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#1976d2' }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}; 