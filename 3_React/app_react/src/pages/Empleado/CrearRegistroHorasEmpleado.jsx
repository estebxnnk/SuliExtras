import { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Grid, MenuItem, InputAdornment, Avatar, Divider, FormControl, InputLabel, Select, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WorkIcon from '@mui/icons-material/Work';
import NavbarEmpleado from './NavbarEmpleado';

function CrearRegistroHorasEmpleado() {
  const [formData, setFormData] = useState({
    fecha: '',
    horaIngreso: '',
    horaSalida: '',
    ubicacion: '',
    cantidadHorasExtra: '',
    justificacionHoraExtra: '',
    tipoHoraId: ''
  });
  const [tiposHora, setTiposHora] = useState([]);
  const [userData, setUserData] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTiposHora();
    // Obtener datos del usuario autenticado
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:3000/api/usuarios/${userId}`)
        .then(res => res.json())
        .then(data => setUserData(data));
    }
  }, []);

  const fetchTiposHora = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/horas');
      const data = await response.json();
      setTiposHora(data);
    } catch (error) {
      setMensaje('No se pudieron cargar los tipos de hora.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calcularHorasExtra = () => {
    if (formData.horaIngreso && formData.horaSalida) {
      const [horaInicio, minInicio] = formData.horaIngreso.split(':').map(Number);
      const [horaFin, minFin] = formData.horaSalida.split(':').map(Number);
      let horasExtra = (horaFin - horaInicio) + (minFin - minInicio) / 60;
      if (horasExtra < 0) {
        horasExtra += 24;
      }
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
    try {
      if (!formData.cantidadHorasExtra || parseInt(formData.cantidadHorasExtra) < 1) {
        setMensaje('Error: Debes ingresar una cantidad válida de horas extra (mínimo 1 hora).');
        setLoading(false);
        return;
      }
      if (!formData.fecha || !formData.horaIngreso || !formData.horaSalida || !formData.ubicacion || !formData.tipoHoraId) {
        setMensaje('Error: Debes completar todos los campos requeridos.');
        setLoading(false);
        return;
      }
      const userId = localStorage.getItem('userId');
      const numRegistro = `REG-${Date.now()}`;
      const registroData = {
        ...formData,
        numRegistro,
        estado: 'pendiente',
        usuarioId: userId,
        horas: [
          {
            id: formData.tipoHoraId,
            cantidad: parseInt(formData.cantidadHorasExtra)
          }
        ]
      };
      delete registroData.tipoHoraId;
      const response = await fetch('http://localhost:3000/api/registros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registroData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear el registro');
      }
      setMensaje('¡Registro creado exitosamente! Redirigiendo a Mis Registros...');
      setTimeout(() => {
        navigate('/mis-registros');
      }, 1500);
    } catch (error) {
      setMensaje('Error al crear el registro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" width="100vw" sx={{ background: "url('/img/Recepcion.jpg') no-repeat center center", backgroundSize: 'cover', p: 4 }}>
      <NavbarEmpleado />
      <Paper elevation={6} sx={{ borderRadius: 3, p: 4, maxWidth: 800, margin: '120px auto 40px auto', background: 'rgba(255,255,255,0.95)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/mis-registros')}
            sx={{ color: '#0d47a1' }}
          >
            Volver
          </Button>
          <Box>
            <Typography variant="h4" fontWeight={700} color="#222">
              Crear Nuevo Registro de Horas Extra
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Completa el formulario para registrar tus horas extra
            </Typography>
          </Box>
        </Box>

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
                  helperText="Selecciona la fecha o escribe directamente (YYYY-MM-DD)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {/* Usuario autenticado, solo mostrar info */}
                {userData && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, background: '#e3f2fd', borderRadius: 2, p: 2, border: '1px solid #bbdefb' }}>
                    <Avatar sx={{ bgcolor: '#0d47a1' }}>{userData.persona?.nombres?.[0]}</Avatar>
                    <Box>
                      <Typography fontWeight={700} sx={{ fontSize: 16, color: '#0d47a1' }}>
                        Estás creando este registro como:
                      </Typography>
                      <Typography fontWeight={700} sx={{ fontSize: 17 }}>
                        {userData.persona?.nombres} {userData.persona?.apellidos}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 15 }}>
                        {userData.email}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
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
                  helperText="¿En qué área o ubicación trabajaste?"
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

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/mis-registros')}
              sx={{ px: 4, py: 1.5, fontWeight: 600 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{ px: 4, py: 1.5, fontWeight: 600 }}
            >
              {loading ? 'Creando...' : 'Crear Registro'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default CrearRegistroHorasEmpleado;