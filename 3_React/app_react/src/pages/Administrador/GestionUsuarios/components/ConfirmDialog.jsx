import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Alert
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const ConfirmDialog = ({ 
  open, 
  action, 
  data, 
  onClose, 
  onConfirm, 
  color = '#f44336' 
}) => {
  if (!open || !data) return null;

  const getActionText = () => {
    switch (action) {
      case 'eliminar':
        return {
          title: 'Confirmar Eliminación',
          message: `¿Estás seguro que deseas ELIMINAR el usuario ${data.email}?`,
          buttonText: 'Eliminar',
          warning: 'Esta acción no se puede deshacer'
        };
      case 'cambiarRol':
        return {
          title: 'Confirmar Cambio de Rol',
          message: `¿Estás seguro que deseas CAMBIAR el rol del usuario ${data.email}?`,
          buttonText: 'Cambiar Rol',
          warning: null
        };
      case 'cambiarSede':
        return {
          title: 'Confirmar Cambio de Sede',
          message: `¿Estás seguro que deseas CAMBIAR la sede del usuario ${data.email}?`,
          buttonText: 'Cambiar Sede',
          warning: null
        };
      default:
        return {
          title: 'Confirmar Acción',
          message: '¿Estás seguro de realizar esta acción?',
          buttonText: 'Confirmar',
          warning: null
        };
    }
  };

  const actionText = getActionText();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs" 
      fullWidth
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{
          background: action === 'eliminar'
            ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          border: action === 'eliminar'
            ? '2px solid #f44336'
            : '2px solid #1976d2',
          borderRadius: 3,
          p: 4,
          textAlign: 'center',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <WarningIcon sx={{ fontSize: 48, color: color }} />
          </Box>
          <Typography variant="h6" fontWeight={700} mb={2} color={color}>
            {actionText.title}
          </Typography>
          <Typography variant="body1" mb={3} color="#333">
            {actionText.message}
          </Typography>
          {actionText.warning && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={600}>
                ⚠️ {actionText.warning}
              </Typography>
            </Alert>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ px: 4, py: 1.5, fontWeight: 600 }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={onConfirm}
              sx={{ 
                px: 4, 
                py: 1.5, 
                fontWeight: 600, 
                background: color, 
                '&:hover': { 
                  background: action === 'eliminar' ? '#d32f2f' : '#1565c0' 
                } 
              }}
            >
              {actionText.buttonText}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
