import React from 'react';
import {
  Box,
  Typography,
  Fade
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const SuccessSpinner = ({ 
  open = false, 
  message = '¡Operación exitosa!', 
  showLogo = true,
  onComplete,
  size = 'medium'
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 60;
      case 'medium': return 80;
      case 'large': return 120;
      default: return 80;
    }
  };

  if (!open) return null;

  return (
    <Fade in={open} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            gap: 3,
            p: 4,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,255,240,0.98) 100%)',
            borderRadius: 4,
            border: '3px solid #4caf50',
            boxShadow: '0 20px 60px rgba(76,175,80,0.3)',
            backdropFilter: 'blur(20px)',
            animation: 'slideIn 0.5s ease-out',
            maxWidth: '90vw',
            width: '500px'
          }}
        >
          {/* Logo con animación */}
          {showLogo && (
            <Box
              sx={{
                width: 80,
                height: 80,
                animation: 'logoPulse 2s ease-in-out infinite'
              }}
            >
              <img
                src="/img/NuevoLogo.png"
                alt="SuliExtras Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
              />
            </Box>
          )}

          {/* Icono de éxito con animación */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: getSize(),
                color: '#4caf50',
                animation: 'successScale 0.6s ease-out 0.3s both',
                filter: 'drop-shadow(0 4px 8px rgba(76,175,80,0.4))'
              }}
            />
          </Box>

          {/* Mensaje de éxito */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h5"
              fontWeight={700}
              color="#4caf50"
              sx={{
                mb: 2,
                animation: 'successFadeIn 0.8s ease-out 0.5s both'
              }}
            >
              ¡Éxito!
            </Typography>
            <Typography
              variant="body1"
              color="#333"
              sx={{
                mb: 2,
                animation: 'successFadeIn 0.8s ease-out 0.7s both'
              }}
            >
              {message}
            </Typography>
          </Box>

          {/* Estilos CSS para las animaciones */}
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              @keyframes logoPulse {
                0%, 100% {
                  transform: scale(1);
                  opacity: 1;
                }
                50% {
                  transform: scale(1.05);
                  opacity: 0.9;
                }
              }
              
              @keyframes successScale {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); opacity: 1; }
              }
              
              @keyframes successFadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}
          </style>
        </Box>
      </Box>
    </Fade>
  );
};

export default SuccessSpinner;
