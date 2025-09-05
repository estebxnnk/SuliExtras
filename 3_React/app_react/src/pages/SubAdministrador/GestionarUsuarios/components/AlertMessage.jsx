import React, { useEffect } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  Error as ErrorIcon, 
  Warning as WarningIcon, 
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { IconButton } from '@mui/material';

export const AlertMessage = ({ mensaje, tipo, onClose, autoHideDuration = 5000 }) => {
  if (!mensaje) return null;

  const getAlertProps = () => {
    switch (tipo) {
      case 'success':
        return {
          severity: 'success',
          icon: <CheckCircleIcon />,
          sx: {
            fontWeight: 600,
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: 28 },
            '& .MuiAlert-message': { fontSize: '1rem', fontWeight: 600 }
          }
        };
      case 'error':
        return {
          severity: 'error',
          icon: <ErrorIcon />,
          sx: {
            fontWeight: 600,
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: 28 },
            '& .MuiAlert-message': { fontSize: '1rem', fontWeight: 600 }
          }
        };
      case 'warning':
        return {
          severity: 'warning',
          icon: <WarningIcon />,
          sx: {
            fontWeight: 600,
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: 28 },
            '& .MuiAlert-message': { fontSize: '1rem', fontWeight: 600 }
          }
        };
      default:
        return {
          severity: 'info',
          icon: <InfoIcon />,
          sx: {
            fontWeight: 600,
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: 28 },
            '& .MuiAlert-message': { fontSize: '1rem', fontWeight: 600 }
          }
        };
    }
  };

  const alertProps = getAlertProps();

  return (
    <Snackbar
      open={!!mensaje}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ 
        top: 100,
        zIndex: 2000
      }}
    >
      <Alert
        {...alertProps}
        onClose={onClose}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          minWidth: 320,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          ...alertProps.sx
        }}
      >
        {mensaje}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;
