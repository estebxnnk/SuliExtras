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
import NavbarSubAdmin from '../NavbarSubAdmin';
import { gestionarRegistrosHorasExtraService } from './services/gestionarRegistrosHorasExtraService';
import { LoadingSpinner, UniversalAlert, SuccessSpinner } from './components';

function CrearRegistroHorasExtraSubAdmin() {
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
  const [tiposHora, setTiposHora] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    console.log(`🔄 Campo ${field} cambiado a:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUsuarioChange = (usuarioId) => {
    console.log('👤 Usuario seleccionado ID:', usuarioId);
    const usuario = usuarios.find(u => u.id === usuarioId);
    console.log('👤 Usuario encontrado:', usuario);
    setFormData(prev => ({
      ...prev,
      usuario: usuario?.email || '',
      usuarioSeleccionado: usuario || null
    }));
  };

  const handleTipoHoraChange = (tipoHoraId) => {
    console.log('⏰ Tipo de hora seleccionado ID:', tipoHoraId);
    const tipoHora = tiposHora.find(t => t.id === tipoHoraId);
    console.log('⏰ Tipo de hora encontrado:', tipoHora);
    
    if (tipoHora) {
      console.log('✅ Tipo de hora válido seleccionado:', tipoHora);
      setFormData(prev => ({
        ...prev,
        tipoHoraId: tipoHoraId
      }));
    } else {
      console.warn('⚠️ Tipo de hora no encontrado en la lista');
      setFormData(prev => ({
        ...prev,
        tipoHoraId: tipoHoraId
      }));
    }
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
      
      console.log('⏰ Horas extra calculadas:', horasExtra);
      setFormData(prev => ({
        ...prev,
        cantidadHorasExtra: horasExtra > 0 ? horasExtra.toFixed(2) : '0.00'
      }));
    }
  };

  // Calcular horas extra cuando cambien las horas
  useEffect(() => {
    if (formData.horaIngreso && formData.horaSalida) {
      calcularHorasExtra();
    }
  }, [formData.horaIngreso, formData.horaSalida]);

  useEffect(() => {
    fetchTiposHora();
    fetchUsuarios();
  }, []);

  const fetchTiposHora = async () => {
    try {
      console.log('🔄 Obteniendo tipos de hora...');
      const data = await gestionarRegistrosHorasExtraService.getTiposHora();
      console.log('✅ Tipos de hora obtenidos:', data);
      
      // Verificar que los datos tengan la estructura esperada
      if (Array.isArray(data)) {
        console.log('✅ Datos de tipos de hora son un array válido');
        setTiposHora(data);
      } else {
        console.error('❌ Los tipos de hora no son un array:', typeof data);
        setTiposHora([]);
        throw new Error('Formato de datos inválido para tipos de hora');
      }
    } catch (error) {
      console.error('❌ Error al obtener tipos de hora:', error);
      setAlertType('error');
      setAlertMessage('No se pudieron cargar los tipos de hora: ' + error.message);
      setShowAlert(true);
      setTiposHora([]);
    }
  };

  const fetchUsuarios = async () => {
    try {
      console.log('🔄 Obteniendo usuarios...');
      const data = await gestionarRegistrosHorasExtraService.getUsuarios();
      console.log('✅ Usuarios obtenidos:', data);
      
      if (Array.isArray(data)) {
        console.log('✅ Datos de usuarios son un array válido');
        setUsuarios(data);
      } else {
        console.error('❌ Los usuarios no son un array:', typeof data);
        setUsuarios([]);
        throw new Error('Formato de datos inválido para usuarios');
      }
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
      setAlertType('error');
      setAlertMessage('No se pudieron cargar los usuarios: ' + error.message);
      setShowAlert(true);
      setUsuarios([]);
    }
  };

  const mostrarAlerta = (tipo, mensaje) => {
    setAlertType(tipo);
    setAlertMessage(mensaje);
    setShowAlert(true);
  };

  const mostrarExito = (mensaje) => {
    setSuccessMessage(mensaje);
    setShowSuccess(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('📝 Iniciando envío del formulario...');
    console.log('📝 Datos del formulario:', formData);
    console.log('📝 Tipos de hora disponibles:', tiposHora);
    console.log('📝 Tipo de hora seleccionado ID:', formData.tipoHoraId);
    
    try {
      // Validar que se ingresen las horas extra
      if (!formData.cantidadHorasExtra || parseFloat(formData.cantidadHorasExtra) < 1) {
        mostrarAlerta('warning', 'Debes ingresar una cantidad válida de horas extra (mínimo 1 hora).');
        setLoading(false);
        return;
      }
      
      // Validar que todos los campos requeridos estén completos
      if (!formData.fecha || !formData.usuarioSeleccionado || !formData.horaIngreso || !formData.horaSalida || !formData.ubicacion || !formData.tipoHoraId) {
        console.log('❌ Campos faltantes:', {
          fecha: !!formData.fecha,
          usuario: !!formData.usuarioSeleccionado,
          horaIngreso: !!formData.horaIngreso,
          horaSalida: !!formData.horaSalida,
          ubicacion: !!formData.ubicacion,
          tipoHoraId: !!formData.tipoHoraId
        });
        mostrarAlerta('warning', 'Debes completar todos los campos requeridos.');
        setLoading(false);
        return;
      }
      
      // Validar que el tipo de hora sea válido
      const tipoHoraSeleccionado = tiposHora.find(t => t.id === formData.tipoHoraId);
      if (!tipoHoraSeleccionado) {
        console.error('❌ Tipo de hora no válido:', formData.tipoHoraId);
        mostrarAlerta('error', 'El tipo de hora seleccionado no es válido. Por favor, selecciona otro tipo.');
        setLoading(false);
        return;
      }
      
      console.log('✅ Tipo de hora válido:', tipoHoraSeleccionado);
      
      // Generar número de registro único
      const numRegistro = `REG-${Date.now()}`;
      
      // Preparar datos para enviar
      const registroData = {
        fecha: formData.fecha,
        horaIngreso: formData.horaIngreso,
        horaSalida: formData.horaSalida,
        ubicacion: formData.ubicacion,
        usuarioId: formData.usuarioSeleccionado.id,
        cantidadHorasExtra: parseFloat(formData.cantidadHorasExtra),
        justificacionHoraExtra: formData.justificacionHoraExtra,
        tipoHoraId: formData.tipoHoraId,
        numRegistro,
        estado: 'pendiente'
      };
      
      console.log('📤 Datos a enviar:', registroData);
      
      // Enviar al backend
      const resultado = await gestionarRegistrosHorasExtraService.createRegistro(registroData);
      console.log('✅ Registro creado exitosamente:', resultado);
      
      // Mostrar éxito
      mostrarExito('¡Registro creado exitosamente! Redirigiendo al panel de registros...');
      
      setTimeout(() => {
        navigate('/subadmin/gestionar-registros-horas-extra');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Error al crear el registro:', error);
      mostrarAlerta('error', 'Error al crear el registro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" width="100vw" sx={{ background: "url('/img/Recepcion.jpg') no-repeat center center", backgroundSize: 'cover', p: 4 }}>
      <NavbarSubAdmin />
      <Paper elevation={8} sx={{ 
        borderRadius: 4, 
        p: 4, 
        maxWidth: 900, 
        margin: '120px auto 40px auto', 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,248,255,0.98) 100%)',
        border: '1px solid rgba(25, 118, 210, 0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/subadmin/gestionar-registros-horas-extra')}
            sx={{ 
              color: '#1976d2',
              background: 'rgba(25, 118, 210, 0.1)',
              borderRadius: 2,
              px: 3,
              py: 1,
              '&:hover': {
                background: 'rgba(25, 118, 210, 0.2)',
                transform: 'translateX(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Volver
          </Button>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <AccessTimeIcon sx={{ fontSize: 48, color: '#1976d2' }} />
              <Typography variant="h3" fontWeight={800} color="#1976d2" sx={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Crear Nuevo Registro de Horas Extra
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontWeight: 500, fontSize: '1.1rem' }}>
              Completa el formulario para registrar las horas extra de un empleado
            </Typography>
          </Box>
        </Box>

        {showAlert && (
          <UniversalAlert 
            severity={alertType} 
            message={alertMessage} 
            onClose={() => setShowAlert(false)}
          />
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* Sección 1: Información Básica */}
          <Card sx={{ 
            p: 4, 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)', 
            border: '2px solid rgba(25, 118, 210, 0.2)',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}>
            <Typography variant="h5" fontWeight={700} color="#1976d2" sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              <PersonIcon sx={{ color: '#1976d2', fontSize: 32 }} />
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        background: 'rgba(255,255,255,1)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1976d2',
                          borderWidth: 2
                        }
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255,255,255,1)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1976d2',
                          borderWidth: 2
                        }
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon sx={{ color: '#1976d2' }} />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Selecciona la fecha o escribe directamente (YYYY-MM-DD)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Empleado</InputLabel>
                  <Select
                    value={formData.usuarioSeleccionado?.id || ''}
                    onChange={(e) => handleUsuarioChange(e.target.value)}
                    label="Empleado"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.9)',
                        '&:hover': {
                          background: 'rgba(255,255,255,1)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          }
                        },
                        '&.Mui-focused': {
                          background: 'rgba(255,255,255,1)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          }
                        }
                      }
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#1976d2' }} />
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
              <Box sx={{ 
                mt: 3, 
                p: 3, 
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)', 
                borderRadius: 3, 
                border: '2px solid rgba(25, 118, 210, 0.3)',
                boxShadow: '0 2px 10px rgba(25, 118, 210, 0.1)'
              }}>
                <Typography variant="h6" fontWeight={700} color="#1976d2" sx={{ 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <PersonIcon sx={{ color: '#1976d2' }} />
                  Empleado Seleccionado
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
          <Card sx={{ 
            p: 4, 
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)', 
            border: '2px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}>
            <Typography variant="h5" fontWeight={700} color="#2e7d32" sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              <WorkIcon sx={{ color: '#2e7d32', fontSize: 32 }} />
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
          <Card sx={{ 
            p: 4, 
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)', 
            border: '2px solid rgba(255, 193, 7, 0.3)',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}>
            <Typography variant="h5" fontWeight={700} color="#f57f17" sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              <AccessTimeIcon sx={{ color: '#f57f17', fontSize: 32 }} />
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
                    onChange={(e) => handleTipoHoraChange(e.target.value)}
                    label="Tipo de Hora Extra"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.9)',
                        '&:hover': {
                          background: 'rgba(255,255,255,1)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#f57f17',
                            borderWidth: 2
                          }
                        },
                        '&.Mui-focused': {
                          background: 'rgba(255,255,255,1)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#f57f17',
                            borderWidth: 2
                          }
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTimeIcon sx={{ color: '#f57f17' }} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {tiposHora.map(tipo => (
                      <MenuItem key={tipo.id} value={tipo.id}>
                        {tipo.tipo} - {tipo.denominacion} ({(tipo.valor - 1) * 100}% recargo)
                      </MenuItem>
                    ))}
                  </Select>
                  {tiposHora.length === 0 && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      No hay tipos de hora disponibles
                    </Typography>
                  )}
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

          <Divider sx={{ 
            my: 4, 
            borderWidth: 2,
            borderColor: 'rgba(25, 118, 210, 0.3)',
            '&::before, &::after': {
              borderColor: 'rgba(25, 118, 210, 0.3)'
            }
          }} />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/subadmin/gestionar-registros-horas-extra')}
              sx={{ 
                px: 5, 
                py: 2, 
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: 3,
                borderWidth: 2,
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  borderWidth: 3,
                  background: 'rgba(25, 118, 210, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <LoadingSpinner size="small" /> : <SaveIcon />}
              disabled={loading}
              sx={{ 
                px: 5, 
                py: 2, 
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                },
                '&:disabled': {
                  background: 'rgba(0,0,0,0.12)',
                  transform: 'none',
                  boxShadow: 'none'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Creando...' : 'Crear Registro'}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Alerta Universal */}
      <UniversalAlert
        open={showAlert}
        type={alertType}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
        autoHideDuration={alertType === 'success' ? 3000 : 5000}
        showLogo={true}
      />

      {/* Alerta de Éxito */}
      <SuccessSpinner
        open={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
        autoHideDuration={3000}
      />
    </Box>
  );
}

export default CrearRegistroHorasExtraSubAdmin; 