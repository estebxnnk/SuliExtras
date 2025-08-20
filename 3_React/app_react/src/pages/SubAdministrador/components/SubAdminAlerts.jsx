import React from 'react';
import {
  Box,
  Alert,
  Snackbar,
  Typography,
  Avatar,
  Paper
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Componente de alerta individual
const SubAdminAlert = ({
  type = 'info',
  message = '',
  title = '',
  showLogo = false,
  onClose,
  autoHideDuration = 6000,
  variant = 'filled',
  elevation = 3,
  children
}) => {
  const getAlertIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getAlertColor = () => {
    switch (type) {
      case 'success':
        return '#2e7d32';
      case 'error':
        return '#d32f2f';
      case 'warning':
        return '#ed6c02';
      case 'info':
        return '#0288d1';
      default:
        return '#757575';
    }
  };

  const getAlertBgColor = () => {
    switch (type) {
      case 'success':
        return '#e8f5e8';
      case 'error':
        return '#ffebee';
      case 'warning':
        return '#fff3e0';
      case 'info':
        return '#e3f2fd';
      default:
        return '#f5f5f5';
    }
  };

  return (
    <Paper
      elevation={elevation}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${getAlertColor()}20`,
        background: `linear-gradient(135deg, ${getAlertBgColor()}, ${getAlertBgColor()}dd)`
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                     {showLogo && (
             <Avatar
               sx={{
                 bgcolor: getAlertColor(),
                 color: 'white',
                 width: 40,
                 height: 40,
                 mt: 0.5
               }}
             >
               <CheckCircleIcon />
             </Avatar>
           )}
          
          <Box sx={{ flex: 1 }}>
            {title && (
              <Typography
                variant="h6"
                fontWeight={600}
                color={getAlertColor()}
                sx={{ mb: 1 }}
              >
                {title}
              </Typography>
            )}
            
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ mb: children ? 2 : 0 }}
            >
              {message}
            </Typography>
            
            {children && (
              <Box sx={{ mt: 2 }}>
                {children}
              </Box>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getAlertIcon()}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

// Componente de alerta universal (Snackbar)
const SubAdminUniversalAlert = ({
  open = false,
  type = 'info',
  message = '',
  title = '',
  showLogo = false,
  onClose,
  autoHideDuration = 6000,
  position = { vertical: 'top', horizontal: 'right' },
  children
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={position}
      sx={{ zIndex: 9999 }}
    >
      <SubAdminAlert
        type={type}
        message={message}
        title={title}
        showLogo={showLogo}
        onClose={onClose}
        autoHideDuration={autoHideDuration}
      >
        {children}
      </SubAdminAlert>
    </Snackbar>
  );
};

// Componente de spinner de éxito
const SubAdminSuccessSpinner = ({
  open = false,
  message = 'Operación completada exitosamente',
  showLogo = false,
  onComplete,
  autoHideDuration = 3000,
  type = 'success'
}) => {
  const handleClose = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <SubAdminUniversalAlert
      open={open}
      type={type}
      message={message}
      showLogo={showLogo}
      onClose={handleClose}
      autoHideDuration={autoHideDuration}
    />
  );
};

// Componente de confirmación
const SubAdminConfirmDialog = ({
  open = false,
  title = 'Confirmar Acción',
  message = '¿Estás seguro de que deseas realizar esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'warning',
  showLogo = true
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

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
              bgcolor: type === 'warning' ? '#ed6c02' : '#1976d2',
              color: 'white',
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2
            }}
          >
            <WarningIcon sx={{ fontSize: 32 }} />
          </Avatar>
        )}
        
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          {title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Box
            component="button"
            onClick={handleCancel}
            sx={{
              px: 3,
              py: 1.5,
              border: '1px solid #dee2e6',
              borderRadius: 2,
              bgcolor: 'white',
              color: '#6c757d',
              cursor: 'pointer',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#f8f9fa'
              }
            }}
          >
            {cancelText}
          </Box>
          
          <Box
            component="button"
            onClick={handleConfirm}
            sx={{
              px: 3,
              py: 1.5,
              border: 'none',
              borderRadius: 2,
              bgcolor: type === 'warning' ? '#ed6c02' : '#1976d2',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              '&:hover': {
                bgcolor: type === 'warning' ? '#e65100' : '#1565c0'
              }
            }}
          >
            {confirmText}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export {
  SubAdminAlert,
  SubAdminUniversalAlert,
  SubAdminSuccessSpinner,
  SubAdminConfirmDialog
};
