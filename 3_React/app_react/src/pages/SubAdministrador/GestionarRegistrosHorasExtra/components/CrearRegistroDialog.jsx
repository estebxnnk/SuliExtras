import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  MenuItem,
  InputAdornment,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Save as SaveIcon,
  CalendarToday as CalendarTodayIcon,
  Schedule as ScheduleIcon,
  Work as WorkIcon,
  AddCircle as AddCircleIcon
} from '@mui/icons-material';

export const CrearRegistroDialog = ({
  open,
  onClose,
  tiposHora,
  usuarios,
  onCrearRegistro,
  isMobile
}) => {
  const [formData, setFormData] = useState({
    fecha: '',
    horaIngreso: '',
    horaSalida: '',
    ubicacion: '',
    usuario: '',
    usuarioSeleccionado: null,
    cantidadHorasExtra: '',
    justificacionHoraExtra: '',
    tipoHoraId: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUsuarioChange = (usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    setFormData(prev => ({
      ...prev,
      usuario: usuario?.email || '',
      usuarioSeleccionado: usuario || null
    }));
  };

  const calcularHorasExtra = () => {
    if (formData.horaIngreso && formData.horaSalida) {
      const [horaInicio, minInicio] = formData.horaIngreso.split(':').map(Number);
      const [horaFin, minFin] = formData.horaSalida.split(':').map(Number);
      
      let horasExtra = (horaFin - horaInicio) + (minFin - minInicio) / 60;
      
      // Si las horas son negativas, significa que pasó la medianoche
      if (horasExtra < 0) {
        horasExtra += 24;
      }
      
      // Restar 8 horas de trabajo normal
      horasExtra = Math.max(0, horasExtra - 8);
      
      setFormData(prev => ({
        ...prev,
        cantidadHorasExtra: horasExtra > 0 ? horasExtra.toFixed(2) : '0.00'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      // Validar que se ingresen las horas extra
      if (!formData.cantidadHorasExtra || parseInt(formData.cantidadHorasExtra) < 1) {
        setMensaje('Error: Debes ingresar una cantidad válida de horas extra (mínimo 1 hora).');
        setLoading(false);
        return;
      }

      // Validar que todos los campos requeridos estén completos
      if (!formData.fecha || !formData.usuario || !formData.horaIngreso || !formData.horaSalida || !formData.ubicacion || !formData.tipoHoraId) {
        setMensaje('Error: Debes completar todos los campos requeridos.');
        setLoading(false);
        return;
      }

      // Generar número de registro único
      const numRegistro = `REG-${Date.now()}`;
      
      // Enviar el array 'horas' al backend
      const registroData = {
        ...formData,
        numRegistro,
        estado: 'pendiente',
        usuarioId: formData.usuarioSeleccionado?.id,
        horas: [
          {
            id: formData.tipoHoraId,
            cantidad: parseInt(formData.cantidadHorasExtra)
          }
        ]
      };

      // Eliminar campos innecesarios
      delete registroData.tipoHoraId;
      delete registroData.usuarioSeleccionado;

      await onCrearRegistro(registroData);
      
      // Limpiar formulario
      setFormData({
        fecha: '',
        horaIngreso: '',
        horaSalida: '',
        ubicacion: '',
        usuario: '',
        usuarioSeleccionado: null,
        cantidadHorasExtra: '',
        justificacionHoraExtra: '',
        tipoHoraId: ''
      });
      
      setMensaje('¡Registro creado exitosamente!');
      setTimeout(() => {
        onClose();
        setMensaje('');
      }, 1500);

    } catch (error) {
      setMensaje('Error al crear el registro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Limpiar formulario al cerrar
    setFormData({
      fecha: '',
      horaIngreso: '',
      horaSalida: '',
      ubicacion: '',
      usuario: '',
      usuarioSeleccionado: null,
      cantidadHorasExtra: '',
      justificacionHoraExtra: '',
      tipoHoraId: ''
    });
    setMensaje('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #4caf50, #45a049)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
          <AddCircleIcon />
        </Avatar>
        <Box>
          <Typography variant="h6">
            Crear Nuevo Registro de Horas Extra
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Completa el formulario para registrar las horas extra de un empleado
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {mensaje && (
          <Alert 
            severity={mensaje.includes('exitosamente') ? 'success' : 'error'} 
            sx={{ mb: 3 }}
            onClose={() => setMensaje('')}
          >
            {mensaje}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* Sección 1: Información Básica */}
          <Card sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', border: '1px solid #dee2e6' }}>
            <Typography variant="h6" fontWeight={700} color="#495057" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ color: '#6c757d' }} />
              Información Básica
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Fecha del Registro"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange('fecha', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Selecciona la fecha del registro"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Empleado</InputLabel>
                  <Select
                    value={formData.usuarioSeleccionado?.id || ''}
                    onChange={(e) => handleUsuarioChange(e.target.value)}
                    label="Empleado"
                    startAdornment={
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    }
                  >
                    {usuarios.map(usuario => (
                      <MenuItem key={usuario.id} value={usuario.id}>
                        {usuario.persona?.nombres} {usuario.persona?.apellidos} - {usuario.persona?.tipoDocumento}: {usuario.persona?.numeroDocumento}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            {/* Mostrar detalles del empleado seleccionado */}
            {formData.usuarioSeleccionado && (
              <Box sx={{ mt: 2, p: 2, background: '#e3f2fd', borderRadius: 2, border: '1px solid #bbdefb' }}>
                <Typography variant="subtitle1" fontWeight={600} color="#1976d2" sx={{ mb: 1 }}>
                  Empleado Seleccionado:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Nombres y Apellidos:</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formData.usuarioSeleccionado.persona?.nombres} {formData.usuarioSeleccionado.persona?.apellidos}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Documento:</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formData.usuarioSeleccionado.persona?.tipoDocumento}: {formData.usuarioSeleccionado.persona?.numeroDocumento}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Email:</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formData.usuarioSeleccionado.email}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Card>

          {/* Sección 2: Horarios de Trabajo */}
          <Card sx={{ p: 3, background: 'linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)', border: '1px solid #c3e6cb' }}>
            <Typography variant="h6" fontWeight={700} color="#155724" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkIcon sx={{ color: '#28a745' }} />
              Horarios de Trabajo
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Hora de Inicio de Trabajo"
                  type="time"
                  value={formData.horaIngreso}
                  onChange={(e) => handleInputChange('horaIngreso', e.target.value)}
                  onBlur={calcularHorasExtra}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ScheduleIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="¿A qué hora comenzó a trabajar?"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Hora de Finalización de Trabajo"
                  type="time"
                  value={formData.horaSalida}
                  onChange={(e) => handleInputChange('horaSalida', e.target.value)}
                  onBlur={calcularHorasExtra}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ScheduleIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="¿A qué hora terminó de trabajar?"
                />
              </Grid>
            </Grid>
          </Card>

          {/* Sección 3: Detalles del Registro */}
          <Card sx={{ p: 3, background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)', border: '1px solid #ffeaa7' }}>
            <Typography variant="h6" fontWeight={700} color="#856404" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon sx={{ color: '#f39c12' }} />
              Detalles del Registro
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Ubicación o Área de Trabajo"
                  value={formData.ubicacion}
                  onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="¿En qué área o ubicación trabajó?"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Cantidad de Horas Extra"
                  type="number"
                  value={formData.cantidadHorasExtra}
                  onChange={(e) => handleInputChange('cantidadHorasExtra', e.target.value)}
                  fullWidth
                  required
                  inputProps={{ min: 1, step: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">horas</InputAdornment>,
                  }}
                  helperText="Ingresa la cantidad de horas extra trabajadas (números enteros)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Hora Extra</InputLabel>
                  <Select
                    value={formData.tipoHoraId}
                    onChange={(e) => handleInputChange('tipoHoraId', e.target.value)}
                    label="Tipo de Hora Extra"
                  >
                    {tiposHora.map(tipo => (
                      <MenuItem key={tipo.id} value={tipo.id}>
                        {tipo.tipo} - {tipo.denominacion} ({(tipo.valor - 1) * 100}% recargo)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Justificación de las Horas Extra"
                  value={formData.justificacionHoraExtra}
                  onChange={(e) => handleInputChange('justificacionHoraExtra', e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Explica brevemente por qué se requirieron horas extra (opcional)"
                />
              </Grid>
            </Grid>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ px: 4, py: 1.5, fontWeight: 600 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading}
          sx={{ 
            px: 4, 
            py: 1.5, 
            fontWeight: 600,
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)' }
          }}
        >
          {loading ? 'Creando...' : 'Crear Registro'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
