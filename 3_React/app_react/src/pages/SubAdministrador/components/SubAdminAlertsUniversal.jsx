import React from 'react';
import {
  Alert,
  Snackbar,
  Box,
  Typography,
  IconButton,
  Paper,
  Avatar
} from '@mui/material';
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
  title = "Operación Exitosa",
  message = "La operación se completó correctamente",
  icon = <CheckCircleIcon sx={{ fontSize: 32 }} />,
  iconColor = "#4caf50",
  showLogo = true,
  autoHideDuration = 3000
}) => {
  if (!open) return null;

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
          maxWidth: 500,
          width: '100%',
          textAlign: 'center'
        }}
      >
        {showLogo && (
          <Avatar
            sx={{
              bgcolor: iconColor,
              color: 'white',
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2
            }}
          >
            {icon}
          </Avatar>
        )}
        
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          {title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
      </Paper>
    </Box>
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
