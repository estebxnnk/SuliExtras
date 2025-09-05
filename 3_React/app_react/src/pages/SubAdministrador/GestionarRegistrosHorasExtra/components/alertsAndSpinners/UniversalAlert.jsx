import React from 'react';
import {
  Box,
  Alert,
  Slide,
  Typography,
  IconButton
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const UniversalAlert = ({
  open,
  type = 'info',
  message,
  title,
  onClose,
  autoHideDuration = 6000,
  showLogo = false
}) => {
  if (!open) return null;

  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: SuccessIcon,
          color: '#4caf50',
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(76, 175, 80, 0.9) 100%)',
          borderColor: '#4caf50',
          iconColor: '#fff'
        };
      case 'error':
        return {
          icon: ErrorIcon,
          color: '#f44336',
          background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.95) 0%, rgba(244, 67, 54, 0.9) 100%)',
          borderColor: '#f44336',
          iconColor: '#fff'
        };
      case 'warning':
        return {
          icon: WarningIcon,
          color: '#ff9800',
          background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.95) 0%, rgba(255, 152, 0, 0.9) 100%)',
          borderColor: '#ff9800',
          iconColor: '#fff'
        };
      case 'info':
      default:
        return {
          icon: InfoIcon,
          color: '#2196f3',
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.95) 0%, rgba(33, 150, 243, 0.9) 100%)',
          borderColor: '#2196f3',
          iconColor: '#fff'
        };
    }
  };

  const config = getAlertConfig();
  const IconComponent = config.icon;

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          minWidth: 400,
          maxWidth: 600,
          width: '90vw'
        }}
      >
        <Box
          sx={{
            background: config.background,
            border: `3px solid ${config.borderColor}`,
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            animation: 'slideIn 0.5s ease-out'
          }}
        >
          {/* Header con logo y título */}
          <Box sx={{
            p: 3,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            {showLogo && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
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
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <IconComponent sx={{ fontSize: 32, color: config.iconColor }} />
              <Typography variant="h6" fontWeight={700} color="#fff">
                {title || (type === 'success' ? 'Éxito' : type === 'error' ? 'Error' : type === 'warning' ? 'Advertencia' : 'Información')}
              </Typography>
            </Box>

            <IconButton
              onClick={onClose}
              sx={{
                color: '#fff',
                '&:hover': { background: 'rgba(255,255,255,0.2)' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Contenido del mensaje */}
          <Box sx={{ p: 3, background: 'rgba(255,255,255,0.95)' }}>
            <Typography variant="body1" color="#333" sx={{ lineHeight: 1.6, textAlign: 'center' }}>
              {message}
            </Typography>
          </Box>
        </Box>

        {/* Estilos CSS para las animaciones */}
        <style>
          {`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translate(-50%, -60%);
              }
              to {
                opacity: 1;
                transform: translate(-50%, -50%);
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
          `}
        </style>
      </Box>
    </Slide>
  );
};

export default UniversalAlert;
