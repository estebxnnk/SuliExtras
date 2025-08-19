import React from 'react';
import {
  Box,
  Typography,
  Fade,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const EditSuccessSpinner = ({ 
  open, 
  message = 'Registro editado exitosamente', 
  showLogo = true,
  onComplete 
}) => {
  React.useEffect(() => {
    if (open && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [open, onComplete]);

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
            minHeight: '300px',
            gap: 3,
            p: 4,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,248,255,0.98) 100%)',
            borderRadius: 4,
            border: '3px solid #1976d2',
            boxShadow: '0 20px 60px rgba(25,118,210,0.3)',
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

          {/* Icono de edición exitosa con animación */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress
              variant="determinate"
              value={100}
              size={80}
              thickness={4}
              sx={{
                color: '#1976d2',
                animation: 'successRing 1s ease-out'
              }}
            />
            <EditIcon
              sx={{
                position: 'absolute',
                fontSize: 48,
                color: '#1976d2',
                animation: 'successScale 0.6s ease-out 0.3s both'
              }}
            />
          </Box>

          {/* Mensaje de éxito */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h5"
              fontWeight={700}
              color="#1976d2"
              sx={{
                mb: 1,
                animation: 'successFadeIn 0.8s ease-out 0.5s both'
              }}
            >
              ¡Editado!
            </Typography>
            <Typography
              variant="body1"
              color="#333"
              sx={{
                animation: 'successFadeIn 0.8s ease-out 0.7s both'
              }}
            >
              {message}
            </Typography>
          </Box>

          {/* Barra de progreso */}
          <Box
            sx={{
              width: '100%',
              height: 4,
              background: '#e0e0e0',
              borderRadius: 2,
              overflow: 'hidden',
              animation: 'progressBar 1.5s linear'
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                animation: 'progressBar 1.5s linear'
              }}
            />
          </Box>
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
            
            @keyframes successRing {
              0% { stroke-dasharray: 0 283; }
              100% { stroke-dasharray: 283 283; }
            }
            
            @keyframes successFadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes progressBar {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}
        </style>
      </Box>
    </Fade>
  );
};

export default EditSuccessSpinner;
