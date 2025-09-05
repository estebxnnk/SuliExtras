import React from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, Avatar, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const DetallesRegistroDialog = ({ open, onClose, registro, getValorHora }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AccessTimeIcon sx={{ fontSize: 36, color: '#1976d2' }} />
        Detalles del Registro
      </DialogTitle>
      <DialogContent sx={{ background: '#f3f7fa', borderRadius: 2 }}>
        {registro && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: '#1976d2', mb: 2 }}>
              <AccessTimeIcon sx={{ fontSize: 48, color: '#fff' }} />
            </Avatar>
            <Typography variant="h6" fontWeight={700} color="#222" mb={1}>
              Registro #{registro.numRegistro || registro.id}
            </Typography>
            <Divider sx={{ width: '100%', mb: 2 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Fecha</Typography>
                <Typography variant="body1" fontWeight={600}>{registro.fecha}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Horas Extra</Typography>
                <Typography variant="body1" fontWeight={600}>{registro.cantidadHorasExtra}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Ubicación</Typography>
                <Typography variant="body1" fontWeight={600}>{registro.ubicacion}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
                <Typography variant="body1" fontWeight={600}>{registro.estado}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Tipo(s) de Hora</Typography>
                {registro.Horas && registro.Horas.length > 0 ? (
                  registro.Horas.map(hora => (
                    <Box key={hora.id}>
                      <Typography variant="body1" fontWeight={600}>{hora.tipo}</Typography>
                      <Typography variant="caption" color="text.secondary">{hora.denominacion}</Typography>
                      <Typography variant="caption" color="text.secondary">Cantidad: {hora.RegistroHora?.cantidad} | Valor hora: $ {getValorHora ? getValorHora(hora.valor).toLocaleString('es-CO', { minimumFractionDigits: 2 }) : '-'}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1" fontWeight={600} color="text.secondary">No asignado</Typography>
                )}
              </Box>
            </Box>
            {registro.justificacionHoraExtra && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Justificación</Typography>
                <Typography variant="body1" sx={{ mt: 1, p: 2, background: '#f5f5f5', borderRadius: 1 }}>
                  {registro.justificacionHoraExtra}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetallesRegistroDialog;


