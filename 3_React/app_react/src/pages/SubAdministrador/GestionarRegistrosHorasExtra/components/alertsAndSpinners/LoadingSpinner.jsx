import React from 'react';
import {
  Box,
  CircularProgress,
  Typography
} from '@mui/material';

const LoadingSpinner = ({ message = 'Cargando...', size = 'medium' }) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'medium': return 40;
      case 'large': return 60;
      default: return 40;
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      p: 3
    }}>
      <CircularProgress 
        size={getSize()} 
        sx={{ 
          color: '#1976d2',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }} 
      />
      {message && (
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            textAlign: 'center',
            fontWeight: 500
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner; 