import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Avatar, Typography, Alert } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function TipoHoraDialog({ open, mode, data, onClose, onSave }) {
  const [form, setForm] = React.useState({ tipo: '', denominacion: '', valor: '' });
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (open) {
      setForm({
        tipo: data?.tipo || '',
        denominacion: data?.denominacion || '',
        valor: data?.valor?.toString?.() || ''
      });
    }
  }, [open, data]);

  const validate = () => {
    const e = {};
    if (!form.tipo?.trim()) e.tipo = 'El tipo es requerido';
    if (!form.denominacion?.trim()) e.denominacion = 'La denominación es requerida';
    const v = parseFloat(form.valor);
    if (Number.isNaN(v) || v <= 0) e.valor = 'Ingrese un valor numérico mayor a 0 (ej: 1.25)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload = { ...form, valor: parseFloat(form.valor) };
    onSave(payload);
  };

  const isView = mode === 'ver';
  const title = isView ? 'Detalles del Tipo de Hora' : mode === 'editar' ? 'Editar Tipo de Hora' : 'Crear Tipo de Hora';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #1976d2, #42a5f5)', color: 'white' }}>
        <AccessTimeIcon sx={{ fontSize: 36, color: 'white' }} />
        {title}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {isView ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 1 }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: '#1976d2' }}>
              <AccessTimeIcon sx={{ fontSize: 48, color: '#fff' }} />
            </Avatar>
            <Typography variant="h6" fontWeight={700} color="#222">
              {data?.tipo}
            </Typography>
            <Box sx={{ width: '100%', mt: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Denominación</Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>{data?.denominacion}</Typography>
              <Typography variant="subtitle2" color="text.secondary">Valor</Typography>
              <Typography variant="body1" fontWeight={600}>{data?.valor}</Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Tipo (ej: HED)" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} fullWidth error={!!errors.tipo} helperText={errors.tipo} required />
            <TextField label="Denominación" value={form.denominacion} onChange={(e) => setForm({ ...form, denominacion: e.target.value })} fullWidth error={!!errors.denominacion} helperText={errors.denominacion} required />
            <TextField label="Valor" type="number" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} fullWidth error={!!errors.valor} required inputProps={{ min: 0, step: 0.01 }} helperText={errors.valor || 'Porcentaje de recargo (ej: 1.25 = 125%)'} />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
        <Button onClick={onClose} variant="outlined">Cerrar</Button>
        {!isView && (
          <Button onClick={handleSave} variant="contained" color="success">
            {mode === 'crear' ? 'Crear' : 'Guardar'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default TipoHoraDialog;


