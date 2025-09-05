import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const FiltrosUsuarios = ({ search, onSearchChange }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        placeholder="Buscar por email, nombre o apellido"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        fullWidth
        sx={{ maxWidth: 400 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default FiltrosUsuarios;
