import React from 'react';
import {
  Box,
  Typography,
  Button,
  Fade,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ConfirmDialogWithLogo = ({
  open,
  action,
  data,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirmar',
  showLogo = true
}) => {
  if (!open) return null;

  // Configuración según el tipo de acción
  const getActionConfig = (action) => {
    switch (action) {
      case 'aprobar':
        return {
          icon: CheckCircleIcon,
          color: '#4caf50',
          bgGradient: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,255,240,0.98) 100%)',
          borderColor: '#4caf50',
          shadowColor: 'rgba(76,175,80,0.3)',
          title: '¡Confirmar Aprobación!',
          message: '¿Estás seguro que deseas APROBAR este registro?'
        };
      case 'rechazar':
        return {
          icon: ErrorIcon,
          color: '#f44336',
          bgGradient: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,240,240,0.98) 100%)',
          borderColor: '#f44336',
          shadowColor: 'rgba(244,67,54,0.3)',
          title: '¡Confirmar Rechazo!',
          message: '¿Estás seguro que deseas RECHAZAR este registro?'
        };
      case 'eliminar':
        return {
          icon: ErrorIcon,
          color: '#f44336',
          bgGradient: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,240,240,0.98) 100%)',
          borderColor: '#f44336',
          shadowColor: 'rgba(244,67,54,0.3)',
          title: '¡Confirmar Eliminación!',
          message: '¿Estás seguro que deseas ELIMINAR este registro?'
        };
      default:
        return {
          icon: InfoIcon,
          color: '#1976d2',
          bgGradient: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,248,255,0.98) 100%)',
          borderColor: '#1976d2',
          shadowColor: 'rgba(25,118,210,0.3)',
          title: '¡Confirmar Acción!',
          message: '¿Estás seguro que deseas realizar esta acción?'
        };
    }
  };

  const config = getActionConfig(action);
  const ActionIcon = config.icon;

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
            background: config.bgGradient,
            borderRadius: 4,
            border: `3px solid ${config.borderColor}`,
            boxShadow: `0 20px 60px ${config.shadowColor}`,
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

          {/* Icono de confirmación con animación */}
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
                color: config.color,
                animation: 'successRing 1s ease-out'
              }}
            />
            <ActionIcon
              sx={{
                position: 'absolute',
                fontSize: 48,
                color: config.color,
                animation: 'successScale 0.6s ease-out 0.3s both'
              }}
            />
          </Box>

          {/* Título y mensaje */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h5"
              fontWeight={700}
              color={config.color}
              sx={{
                mb: 2,
                animation: 'successFadeIn 0.8s ease-out 0.5s both'
              }}
            >
              {config.title}
            </Typography>
            <Typography
              variant="body1"
              color="#333"
              sx={{
                mb: 2,
                animation: 'successFadeIn 0.8s ease-out 0.7s both'
              }}
            >
              {message || config.message}
            </Typography>
          </Box>

          {/* Botones de acción */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              animation: 'successFadeIn 0.8s ease-out 0.9s both'
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: config.color,
                color: config.color,
                fontWeight: 600,
                borderRadius: 2,
                borderWidth: 2,
                px: 3,
                py: 1.5,
                '&:hover': {
                  borderColor: config.color,
                  backgroundColor: `${config.color}10`,
                  borderWidth: 2
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={onConfirm}
              sx={{
                backgroundColor: config.color,
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1.5,
                boxShadow: `0 4px 15px ${config.shadowColor}`,
                '&:hover': {
                  backgroundColor: config.color,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 20px ${config.shadowColor}`
                }
              }}
            >
              {confirmButtonText}
            </Button>
          </Box>

          {/* Barra de progreso estática */}
          <Box
            sx={{
              width: '100%',
              height: 4,
              background: '#e0e0e0',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, ${config.color} 0%, ${config.color}80 100%)`
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
          `}
        </style>
      </Box>
    </Fade>
  );
};

export default ConfirmDialogWithLogo;
