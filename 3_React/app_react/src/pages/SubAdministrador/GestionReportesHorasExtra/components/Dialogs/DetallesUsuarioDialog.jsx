import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';

const DetallesUsuarioDialog = ({ open, onClose, usuario }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #1976d2, #1565c0)', color: 'white' }}>
        <VisibilityIcon />
        Detalles del Usuario
        <IconButton onClick={onClose} sx={{ ml: 'auto', color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, maxHeight: '80vh', overflow: 'auto' }}>
        {usuario && (
          <Box sx={{ p: 3, background: 'rgba(25, 118, 210, 0.05)', borderRadius: 2, border: '1px solid rgba(25, 118, 210, 0.2)' }}>
            <Typography variant="h5" fontWeight={600} mb={3} color="#1976d2">
              {usuario.persona?.nombres} {usuario.persona?.apellidos}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2, background: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="body1" fontWeight={600} color="text.primary">Documento de Identidad</Typography>
                <Typography variant="body2" color="text.secondary">
                  {usuario.persona?.tipoDocumento}: {usuario.persona?.numeroDocumento}
                </Typography>
              </Box>
              <Box sx={{ p: 2, background: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="body1" fontWeight={600} color="text.primary">Información de Contacto</Typography>
                <Typography variant="body2" color="text.secondary">{usuario.email}</Typography>
              </Box>
              <Box sx={{ p: 2, background: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="body1" fontWeight={600} color="text.primary">Fecha de Registro</Typography>
                <Typography variant="body2" color="text.secondary">
                  {usuario.createdAt ? new Date(usuario.createdAt).toLocaleString('es-ES', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' }) : 'No disponible'}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetallesUsuarioDialog;


