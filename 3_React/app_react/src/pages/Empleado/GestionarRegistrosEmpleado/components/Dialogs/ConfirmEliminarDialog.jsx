import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert } from '@mui/material';

const ConfirmEliminarDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'error.main', fontWeight: 700 }}>Confirmar Eliminación</DialogTitle>
      <DialogContent>
        <Typography variant="body1" mb={2}>
          ¿Estás seguro que deseas eliminar este registro? Esta acción no se puede deshacer.
        </Typography>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600}>
            ⚠️ Esta acción no se puede deshacer
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancelar</Button>
        <Button onClick={() => onConfirm()} variant="contained" color="error">Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmEliminarDialog;


