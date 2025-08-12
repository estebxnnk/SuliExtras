import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const FiltrosUsuarios = ({
  search,
  onSearchChange,
  isMobile
}) => {
  return (
    <Card
      sx={{
        mb: 3,
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        p: { xs: 1, sm: 2 }
      }}
    >
      <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
        <TextField
          fullWidth
          size={isMobile ? 'small' : 'medium'}
          variant="outlined"
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize={isMobile ? 'small' : 'medium'} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
      </CardContent>
    </Card>

  );
}; 