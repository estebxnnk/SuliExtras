import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  Divider,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  SwapHoriz as SwapHorizIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

export const RegistroDialog = ({
  open,
  modo,
  registro,
  editData,
  nuevoEstado,
  tiposHora,
  usuarios,
  onClose,
  onGuardarEdicion,
  onGuardarEstado,
  isMobile
}) => {
  const [localEditData, setLocalEditData] = useState({});
  const [localNuevoEstado, setLocalNuevoEstado] = useState('');

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      setLocalEditData(editData);
    }
    if (nuevoEstado) {
      setLocalNuevoEstado(nuevoEstado);
    }
  }, [editData, nuevoEstado]);

  if (!registro) return null;

  const getEstadoChip = (estado) => {
    const estados = {
      pendiente: { color: 'warning', icon: <PendingIcon />, label: 'Pendiente' },
      aprobado: { color: 'success', icon: <CheckCircleIcon />, label: 'Aprobado' },
      rechazado: { color: 'error', icon: <CancelIcon />, label: 'Rechazado' }
    };
    const config = estados[estado] || estados.pendiente;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        variant="outlined"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  const renderVerRegistro = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ width: 72, height: 72, bgcolor: '#1976d2', mb: 2 }}>
        <AccessTimeIcon sx={{ fontSize: 48, color: '#fff' }} />
      </Avatar>
      <Typography variant="h6" fontWeight={700} color="#222" mb={1}>
        Registro #{registro.numRegistro || registro.id}
      </Typography>
      <Divider sx={{ width: '100%', mb: 2 }} />
      
      {/* Buscar el usuario correspondiente */}
      {(() => {
        const usuario = usuarios.find(u => u.email === registro.usuario);
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%' }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Empleado</Typography>
              <Typography variant="body1" fontWeight={600}>
                {usuario?.persona?.nombres || registro.nombres || 'N/A'} {usuario?.persona?.apellidos || registro.apellidos || 'N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {usuario?.persona?.tipoDocumento || registro.tipoDocumento || 'N/A'}: {usuario?.persona?.numeroDocumento || registro.numeroDocumento || 'N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {registro.usuario}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Fecha</Typography>
              <Typography variant="body1" fontWeight={600}>{registro.fecha}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Hora de Ingreso</Typography>
              <Typography variant="body1" fontWeight={600}>{registro.horaIngreso}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Hora de Salida</Typography>
              <Typography variant="body1" fontWeight={600}>{registro.horaSalida}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Ubicación</Typography>
              <Typography variant="body1" fontWeight={600}>{registro.ubicacion}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Horas Extra</Typography>
              <Typography variant="body1" fontWeight={600}>{registro.cantidadHorasExtra} horas</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Tipo(s) de Hora</Typography>
              {registro.Horas && registro.Horas.length > 0 ? (
                registro.Horas.map(hora => (
                  <Box key={hora.id}>
                    <Typography variant="body1" fontWeight={600}>{hora.tipo}</Typography>
                    <Typography variant="caption" color="text.secondary">{hora.denominacion} ({(hora.valor - 1) * 100}% recargo)</Typography>
                    <Typography variant="caption" color="text.secondary">Cantidad: {hora.RegistroHora?.cantidad || 'N/A'}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" fontWeight={600} color="text.secondary">No asignado</Typography>
              )}
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
              {getEstadoChip(registro.estado)}
            </Box>
            {/* CAMPOS NUEVOS CON EL MISMO DISEÑO */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Horas Extra (reporte)</Typography>
              <Typography variant="body1" fontWeight={600}>{registro.horas_extra_divididas ?? 0} horas</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Bono Salarial</Typography>
              <Typography variant="body1" fontWeight={600}>{registro.bono_salarial ?? 0} horas</Typography>
            </Box>
          </Box>
        );
      })()}
      
      {registro.justificacionHoraExtra && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Justificación</Typography>
          <Typography variant="body1" sx={{ mt: 1, p: 2, background: '#f5f5f5', borderRadius: 1 }}>
            {registro.justificacionHoraExtra}
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderEditarRegistro = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
      <Card sx={{ p: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)', border: '1px solid #dee2e6' }}>
        <Typography variant="h6" fontWeight={700} color="#495057" sx={{ mb: 3 }}>
          Información del Registro
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Fecha"
              type="date"
              value={localEditData.fecha || ''}
              onChange={(e) => setLocalEditData({...localEditData, fecha: e.target.value})}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ background: '#fff', borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Ubicación"
              value={localEditData.ubicacion || ''}
              onChange={(e) => setLocalEditData({...localEditData, ubicacion: e.target.value})}
              fullWidth
              sx={{ background: '#fff', borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Hora de Ingreso"
              type="time"
              value={localEditData.horaIngreso || ''}
              onChange={(e) => setLocalEditData({...localEditData, horaIngreso: e.target.value})}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ background: '#fff', borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Hora de Salida"
              type="time"
              value={localEditData.horaSalida || ''}
              onChange={(e) => setLocalEditData({...localEditData, horaSalida: e.target.value})}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ background: '#fff', borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Cantidad de Horas Extra"
              type="number"
              value={localEditData.cantidadHorasExtra || ''}
              onChange={(e) => setLocalEditData({...localEditData, cantidadHorasExtra: parseFloat(e.target.value)})}
              fullWidth
              sx={{ background: '#fff', borderRadius: 2 }}
              inputProps={{ min: 1, step: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Tipo de Hora Extra"
              value={localEditData.tipoHora || ''}
              onChange={(e) => setLocalEditData({...localEditData, tipoHora: e.target.value})}
              fullWidth
              sx={{ background: '#fff', borderRadius: 2 }}
            >
              {tiposHora.map(tipo => (
                <MenuItem key={tipo.id} value={tipo.id}>
                  {tipo.tipo} - {tipo.denominacion} ({(tipo.valor - 1) * 100}% recargo)
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Horas Extra (reporte)"
              type="number"
              value={localEditData.horas_extra_divididas ?? 0}
              onChange={(e) => setLocalEditData({...localEditData, horas_extra_divididas: parseFloat(e.target.value)})}
              fullWidth
              sx={{ background: '#fff', borderRadius: 2 }}
              inputProps={{ min: 0, step: 0.01 }}
              helperText="Máximo 2 horas por registro para reporte"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Justificación"
              value={localEditData.justificacionHoraExtra || ''}
              onChange={(e) => setLocalEditData({...localEditData, justificacionHoraExtra: e.target.value})}
              multiline
              rows={3}
              fullWidth
              sx={{ background: '#fff', borderRadius: 2 }}
            />
          </Grid>
        </Grid>
      </Card>
    </Box>
  );

  const renderCambiarEstado = () => (
    <Box>
      <Typography variant="h6" fontWeight={600} color="#1976d2" mb={2}>
        Registro #{registro.numRegistro || registro.id}
      </Typography>
      {(() => {
        const usuario = usuarios.find(u => u.email === registro.usuario);
        return (
          <>
            <Typography variant="body1" mb={2}>
              <strong>Empleado:</strong> {usuario?.persona?.nombres || registro.nombres || 'N/A'} {usuario?.persona?.apellidos || registro.apellidos || 'N/A'}
            </Typography>
            <Typography variant="body2" mb={1} color="text.secondary">
              <strong>Documento:</strong> {usuario?.persona?.tipoDocumento || registro.tipoDocumento || 'N/A'}: {usuario?.persona?.numeroDocumento || registro.numeroDocumento || 'N/A'}
            </Typography>
            <Typography variant="body2" mb={2} color="text.secondary">
              <strong>Email:</strong> {registro.usuario}
            </Typography>
          </>
        );
      })()}
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          Este registro ya ha sido procesado. Solo puedes cambiar su estado.
        </Typography>
      </Alert>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Nuevo Estado</InputLabel>
        <Select
          value={localNuevoEstado}
          onChange={(e) => setLocalNuevoEstado(e.target.value)}
          label="Nuevo Estado"
          sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
        >
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="aprobado">Aprobado</MenuItem>
          <MenuItem value="rechazado">Rechazado</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  const getDialogTitle = () => {
    switch (modo) {
      case 'ver': return 'Detalles del Registro';
      case 'editar': return 'Editar Registro';
      case 'estado': return 'Cambiar Estado del Registro';
      default: return 'Registro';
    }
  };

  const getDialogContent = () => {
    switch (modo) {
      case 'ver': return renderVerRegistro();
      case 'editar': return renderEditarRegistro();
      case 'estado': return renderCambiarEstado();
      default: return null;
    }
  };

  const getDialogActions = () => {
    switch (modo) {
      case 'ver':
        return (
          <Button onClick={onClose} variant="outlined">
            Cerrar
          </Button>
        );
      case 'editar':
        return (
          <>
            <Button onClick={onClose} variant="outlined">
              Cancelar
            </Button>
            <Button 
              onClick={() => onGuardarEdicion(localEditData)} 
              variant="contained" 
              color="success"
              sx={{ 
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)' }
              }}
            >
              Guardar Cambios
            </Button>
          </>
        );
      case 'estado':
        return (
          <>
            <Button onClick={onClose} variant="outlined">
              Cancelar
            </Button>
            <Button 
              onClick={() => onGuardarEstado(localNuevoEstado)} 
              variant="contained" 
              color="primary"
              sx={{ 
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)' }
              }}
            >
              Cambiar Estado
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
          {modo === 'editar' ? <EditIcon /> : modo === 'estado' ? <SwapHorizIcon /> : <AccessTimeIcon />}
        </Avatar>
        <Box>
          <Typography variant="h6">
            {getDialogTitle()}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {registro.numRegistro || `ID: ${registro.id}`}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {getDialogContent()}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
        {getDialogActions()}
      </DialogActions>
    </Dialog>
  );
};
