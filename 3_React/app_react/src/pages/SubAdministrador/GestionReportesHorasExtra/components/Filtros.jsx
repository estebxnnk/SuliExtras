import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const Filtros = ({ search, onSearchChange, isMobile }) => {
  return (
    <Box sx={{ 
      mb: 3,
      p: 3,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)',
      borderRadius: 3,
      border: '1px solid rgba(25, 118, 210, 0.15)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <FilterListIcon sx={{ color: '#1976d2', fontSize: 28 }} />
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Filtros de Búsqueda
          </h3>
        </Box>
      </Box>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar por nombre, apellido, documento o email..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#1976d2' }} />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            background: 'rgba(255,255,255,0.9)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(25, 118, 210, 0.3)',
              borderWidth: 2
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(25, 118, 210, 0.5)'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2',
              borderWidth: 2
            }
          }
        }}
        sx={{
          '& .MuiInputLabel-root': {
            color: '#1976d2',
            fontWeight: 600
          },
          '& .MuiInputBase-input': {
            fontSize: isMobile ? '0.9rem' : '1rem',
            fontWeight: 500
          }
        }}
      />
    </Box>
  );
};

export default Filtros;
