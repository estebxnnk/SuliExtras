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

export const ConfirmDialog = ({ 
  open, 
  action, 
  usuario, 
  onClose, 
  onConfirm 
}) => {
  if (!open) return null;

  const isDeleteAction = action === 'eliminar';
  
  const getDialogConfig = () => {
    if (isDeleteAction) {
      return {
        background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
        borderColor: '#f44336',
        iconColor: '#f44336',
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro que deseas ELIMINAR el usuario ${usuario?.email}?`,
        confirmButtonText: 'Eliminar',
        confirmButtonColor: '#f44336',
        confirmButtonHoverColor: '#d32f2f'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        borderColor: '#1976d2',
        iconColor: '#1976d2',
        title: 'Confirmar Cambio de Rol',
        message: `¿Estás seguro que deseas CAMBIAR el rol del usuario ${usuario?.email}?`,
        confirmButtonText: 'Cambiar Rol',
        confirmButtonColor: '#1976d2',
        confirmButtonHoverColor: '#1565c0'
      };
    }
  };

  const config = getDialogConfig();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{
          background: config.background,
          border: `2px solid ${config.borderColor}`,
          borderRadius: 3,
          p: 4,
          textAlign: 'center',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <WarningIcon sx={{ fontSize: 48, color: config.iconColor }} />
          </Box>
          
          <Typography variant="h6" fontWeight={700} mb={2} color={config.iconColor}>
            {config.title}
          </Typography>
          
          <Typography variant="body1" mb={3} color="#333">
            {config.message}
          </Typography>
          
          {isDeleteAction && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={600}>
                ⚠️ Esta acción no se puede deshacer
              </Typography>
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ 
                px: 4, 
                py: 1.5, 
                fontWeight: 600,
                borderColor: config.borderColor,
                color: config.iconColor,
                '&:hover': {
                  borderColor: config.iconColor,
                  background: `${config.iconColor}10`
                }
              }}
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
                background: config.confirmButtonColor, 
                '&:hover': { 
                  background: config.confirmButtonHoverColor 
                },
                boxShadow: `0 4px 15px ${config.confirmButtonColor}40`,

              }}
            >
              {config.confirmButtonText}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;