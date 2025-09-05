import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const LoadingSpinner = ({ message = 'Cargando...', size = 'medium' }) => {
  const getSizeConfig = () => {
    switch (size) {
      case 'large':
        return {
          logoSize: 120,
          spinnerSize: 80,
          fontSize: '1.5rem'
        };
      case 'small':
        return {
          logoSize: 60,
          spinnerSize: 40,
          fontSize: '1rem'
        };
      default: // medium
        return {
          logoSize: 80,
          spinnerSize: 60,
          fontSize: '1.2rem'
        };
    }
  };

  const { logoSize, spinnerSize, fontSize } = getSizeConfig();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 4,
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(25, 118, 210, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 50%, #1976d2 100%)',
          animation: 'shimmer 2s ease-in-out infinite'
        }
      }}
    >
      {/* Logo con animación de pulso */}
      <Box
        sx={{
          position: 'relative',
          animation: 'pulse 2s ease-in-out infinite',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: logoSize + 20,
            height: logoSize + 20,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite 0.5s'
          }
        }}
      >
        <img
          src="/img/NuevoLogo.png"
          alt="Logo"
          style={{
            width: logoSize,
            height: logoSize,
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
          }}
        />
      </Box>

      {/* Spinner doble */}
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          size={spinnerSize}
          thickness={4}
          sx={{
            color: '#1976d2',
            animation: 'spin 1.5s linear infinite'
          }}
        />
        <CircularProgress
          size={spinnerSize - 20}
          thickness={4}
          sx={{
            color: '#42a5f5',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'spin 1.5s linear infinite reverse'
          }}
        />
      </Box>

      {/* Mensaje con animación de fade */}
      <Typography
        variant="body1"
        sx={{
          fontSize,
          fontWeight: 600,
          color: '#1976d2',
          textAlign: 'center',
          animation: 'fadeInOut 2s ease-in-out infinite',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}
      >
        {message}
      </Typography>

      {/* Estilos de animación */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.8;
            }
          }
          
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          
          @keyframes fadeInOut {
            0%, 100% {
              opacity: 0.7;
            }
            50% {
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default LoadingSpinner;
