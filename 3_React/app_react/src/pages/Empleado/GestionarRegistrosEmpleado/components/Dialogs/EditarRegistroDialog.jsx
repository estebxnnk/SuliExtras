import React from 'react';
import { Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const EditarRegistroDialog = ({ open, onClose, editData, setEditData, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Registro</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Fecha"
            type="date"
            value={editData.fecha || ''}
            onChange={e => setEditData({ ...editData, fecha: e.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Hora de Ingreso"
              type="time"
              value={editData.horaIngreso || ''}
              onChange={e => setEditData({ ...editData, horaIngreso: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Hora de Salida"
              type="time"
              value={editData.horaSalida || ''}
              onChange={e => setEditData({ ...editData, horaSalida: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <TextField
            label="Ubicación"
            value={editData.ubicacion || ''}
            onChange={e => setEditData({ ...editData, ubicacion: e.target.value })}
            fullWidth
          />
          <TextField
            label="Cantidad de Horas Extra"
            type="number"
            value={editData.cantidadHorasExtra || 0}
            onChange={e => setEditData({ ...editData, cantidadHorasExtra: parseFloat(e.target.value) })}
            fullWidth
          />
          <TextField
            label="Justificación"
            value={editData.justificacionHoraExtra || ''}
            onChange={e => setEditData({ ...editData, justificacionHoraExtra: e.target.value })}
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancelar</Button>
        <Button onClick={() => onSave(editData.id, editData)} variant="contained" color="success">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarRegistroDialog;


