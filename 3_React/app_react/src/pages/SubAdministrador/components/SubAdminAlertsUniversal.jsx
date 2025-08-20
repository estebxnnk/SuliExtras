import React from 'react';
import {
  Alert,
  Snackbar,
  Box,
  Typography,
  IconButton,
  Paper,
  Avatar,
  Fade,
  Portal
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Spinner de éxito personalizable
export const SubAdminSuccessSpinner = ({
  open,
  onClose,
  title = '¡Éxito!',
  message = 'La operación se completó correctamente',
  icon = <CheckCircleIcon />,
  iconColor = '#4caf50',
  showLogo = true,
  size = 'medium',
  logoSrc = '/img/NuevoLogo.png',
  autoHideDuration,
  onAutoHideComplete
}) => {
  if (!open) return null;

  const getSize = () => {
    switch (size) {
      case 'small': return 60;
      case 'large': return 120;
      default: return 80;
    }
  };

  React.useEffect(() => {
    if (!open || !autoHideDuration) return;
    const t = setTimeout(() => {
      onClose?.();
      onAutoHideComplete?.();
    }, autoHideDuration);
    return () => clearTimeout(t);
  }, [open, autoHideDuration, onClose, onAutoHideComplete]);

  return (
    <Portal>
      <Fade in={open} timeout={300}>
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
            zIndex: 20000,
            p: 2
          }}
          onClick={onClose}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
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
              border: `3px solid ${iconColor}`,
              boxShadow: '0 20px 60px rgba(76,175,80,0.3)',
              backdropFilter: 'blur(20px)',
              animation: 'slideIn 0.5s ease-out',
              maxWidth: '90vw',
              width: '500px'
            }}
          >
            {showLogo && (
              <Box sx={{ width: 80, height: 80, animation: 'logoPulse 2s ease-in-out infinite' }}>
                <img
                  src={logoSrc}
                  alt="Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                />
              </Box>
            )}

            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={getSize() + 24}
                thickness={4}
                sx={{ color: iconColor, opacity: 0.35, animation: 'successRing 1s ease-out' }}
              />
              <Box sx={{ position: 'absolute' }}>
                {React.cloneElement(icon, {
                  sx: { fontSize: getSize(), color: iconColor, animation: 'successScale 0.6s ease-out 0.3s both', filter: 'drop-shadow(0 4px 8px rgba(76,175,80,0.4))' }
                })}
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h5"
                fontWeight={700}
                color={iconColor}
                sx={{ mb: 2, animation: 'successFadeIn 0.8s ease-out 0.5s both' }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                color="#333"
                sx={{ animation: 'successFadeIn 0.8s ease-out 0.7s both' }}
              >
                {message}
              </Typography>
            </Box>

            <style>{`
              @keyframes slideIn {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes logoPulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.9; }
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
            `}</style>
          </Box>
        </Box>
      </Fade>
    </Portal>
  );
};

// Alerta universal reutilizable
export const SubAdminUniversalAlert = ({
  open,
  type = 'info',
  message = '',
  title = '',
  onClose,
  showLogo = true,
  autoHideDuration = 4000
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 32 }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: 32 }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: 32 }} />;
      case 'info':
        return <InfoIcon sx={{ fontSize: 32 }} />;
      default:
        return <InfoIcon sx={{ fontSize: 32 }} />;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      default:
        return '#2196f3';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(76, 175, 80, 0.1)';
      case 'error':
        return 'rgba(244, 67, 54, 0.1)';
      case 'warning':
        return 'rgba(255, 152, 0, 0.1)';
      case 'info':
        return 'rgba(33, 150, 243, 0.1)';
      default:
        return 'rgba(33, 150, 243, 0.1)';
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: 3,
          p: 3,
          maxWidth: 500,
          width: '100%',
          background: getBackgroundColor(),
          border: `2px solid ${getIconColor()}`,
          position: 'relative'
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: getIconColor()
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {showLogo && (
            <Avatar
              sx={{
                bgcolor: getIconColor(),
                color: 'white',
                width: 48,
                height: 48
              }}
            >
              {getIcon()}
            </Avatar>
          )}
          
          <Box>
            {title && (
              <Typography variant="h6" fontWeight={600} color={getIconColor()}>
                {title}
              </Typography>
            )}
            <Typography variant="body1" color="text.primary">
              {message}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Snackbar>
  );
};

// Spinner de carga personalizable
export const SubAdminLoadingSpinner = ({
  open,
  message = "Cargando...",
  size = "medium",
  showLogo = true
}) => {
  if (!open) return null;

  const getSize = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'medium':
        return 64;
      case 'large':
        return 80;
      default:
        return 64;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        p: 2
      }}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: 3,
          p: 3,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center'
        }}
      >
        {showLogo && (
          <Box
            sx={{
              width: getSize(),
              height: getSize(),
              borderRadius: '50%',
              border: `4px solid rgba(25, 118, 210, 0.2)`,
              borderTop: `4px solid #1976d2`,
              animation: 'spin 1s linear infinite',
              mx: 'auto',
              mb: 2,
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
        )}
        
        <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
          {message}
        </Typography>
      </Paper>
    </Box>
  );
};

// Spinner de éxito específico para diferentes operaciones
export const SubAdminCreateSuccessSpinner = (props) => (
  <SubAdminSuccessSpinner
    {...props}
    title="Registro Creado"
    message="El registro se creó exitosamente"
    icon={<CheckCircleIcon sx={{ fontSize: 32 }} />}
    iconColor="#4caf50"
  />
);

export const SubAdminEditSuccessSpinner = (props) => (
  <SubAdminSuccessSpinner
    {...props}
    title="Registro Editado"
    message="El registro se editó exitosamente"
    icon={<CheckCircleIcon sx={{ fontSize: 32 }} />}
    iconColor="#2196f3"
  />
);

export const SubAdminDeleteSuccessSpinner = (props) => (
  <SubAdminSuccessSpinner
    {...props}
    title="Registro Eliminado"
    message="El registro se eliminó exitosamente"
    icon={<CheckCircleIcon sx={{ fontSize: 32 }} />}
    iconColor="#f44336"
  />
);

export const SubAdminApproveSuccessSpinner = (props) => (
  <SubAdminSuccessSpinner
    {...props}
    title="Registro Aprobado"
    message="El registro se aprobó exitosamente"
    icon={<CheckCircleIcon sx={{ fontSize: 32 }} />}
    iconColor="#4caf50"
  />
);

export const SubAdminRejectSuccessSpinner = (props) => (
  <SubAdminSuccessSpinner
    {...props}
    title="Registro Rechazado"
    message="El registro se rechazó exitosamente"
    icon={<CheckCircleIcon sx={{ fontSize: 32 }} />}
    iconColor="#ff9800"
  />
);

export const SubAdminStateChangeSuccessSpinner = (props) => (
  <SubAdminSuccessSpinner
    {...props}
    title="Estado Cambiado"
    message="El estado se cambió exitosamente"
    icon={<CheckCircleIcon sx={{ fontSize: 32 }} />}
    iconColor="#9c27b0"
  />
);

