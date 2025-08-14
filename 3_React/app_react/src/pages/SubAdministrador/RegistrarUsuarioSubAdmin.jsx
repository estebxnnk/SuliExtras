import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  InputAdornment,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Badge as BadgeIcon,
  CalendarMonth as CalendarMonthIcon,
  AddCircle as AddCircleIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import NavbarSubAdmin from './NavbarSubAdmin';

const tiposDocumento = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PAS', label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT' },
  { value: 'RC', label: 'Registro Civil' },
  { value: 'PEP', label: 'Permiso Especial de Permanencia' },
];

function RegistrarUsuario() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolId, setRolId] = useState('');
  const [roles, setRoles] = useState([]);
  // Persona
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correoPersona, setCorreoPersona] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  // Otros
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [openRolDialog, setOpenRolDialog] = useState(false);
  const [nuevoRol, setNuevoRol] = useState('');
  const [mensajeRol, setMensajeRol] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      setMensaje('No se pudieron cargar los roles.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    setExito(false);
    
    if (!email || !password || !rolId || !tipoDocumento || !numeroDocumento || !nombres || !apellidos || !correoPersona || !fechaNacimiento) {
      setMensaje('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          rolId,
          persona: {
            tipoDocumento,
            numeroDocumento,
            nombres,
            apellidos,
            correo: correoPersona,
            fechaNacimiento,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMensaje(data.message || 'Error al registrar usuario');
        setLoading(false);
        return;
      }
      setExito(true);
      setMensaje('¡Usuario registrado exitosamente!');
      setTimeout(() => navigate('/panel-admin'), 1500);
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearRol = async () => {
    setMensajeRol('');
    if (!nuevoRol) {
      setMensajeRol('El nombre del rol es requerido');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoRol }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMensajeRol(data.message || 'Error al crear el rol');
        return;
      }
      setMensajeRol('¡Rol creado exitosamente!');
      setNuevoRol('');
      setOpenRolDialog(false);
      fetchRoles();
    } catch (error) {
      setMensajeRol('No se pudo conectar con el servidor.');
    }
  };

  const limpiarFormulario = () => {
    setEmail('');
    setPassword('');
    setRolId('');
    setTipoDocumento('');
    setNumeroDocumento('');
    setNombres('');
    setApellidos('');
    setCorreoPersona('');
    setFechaNacimiento('');
    setMensaje('');
    setExito(false);
  };

  return (
    <Box
      minHeight="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      sx={{
        background: "url('/img/Recepcion.jpg') no-repeat center center",
        backgroundSize: 'cover',
      }}
    >
      <NavbarSubAdmin />
      <Box sx={{ 
        flex: 1, 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        mt: { xs: 14, sm: 16 },
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            p: { xs: 3, sm: 4, md: 5 },
            minWidth: { xs: '95vw', sm: 400 },
            maxWidth: { xs: '98vw', sm: 600 },
            width: { xs: '98vw', sm: 600 },
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,248,255,0.98) 100%)',
            border: '1px solid rgba(25, 118, 210, 0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          {/* Header mejorado */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main', 
              mx: 'auto', 
              mb: 2,
              boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
            }}>
              <PersonIcon sx={{ fontSize: 48 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={800} color="primary" sx={{ 
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Registrar Usuario
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Completa el formulario para crear una nueva cuenta de usuario
            </Typography>
          </Box>

          {/* Mensajes de estado */}
          {mensaje && (
            <Alert 
              severity={exito ? 'success' : 'error'} 
              sx={{ 
                mb: 3, 
                width: '100%',
                borderRadius: 2,
                '& .MuiAlert-icon': { fontSize: 28 },
                '& .MuiAlert-message': { fontSize: '1rem', fontWeight: 600 }
              }}
              onClose={() => setMensaje('')}
            >
              {mensaje}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3 
            }}
            autoComplete="off"
          >
            
            {/* Sección 1: Información de Acceso */}
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
              border: '1px solid #dee2e6',
              borderRadius: 3
            }}>
              <Typography variant="h6" fontWeight={700} color="#495057" sx={{ 
                mb: 3, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
              }}>
                <SecurityIcon sx={{ color: '#6c757d' }} />
                Información de Acceso
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Correo electrónico (usuario)"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'rgba(255,255,255,1)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'rgba(255,255,255,1)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Rol del Usuario"
                    value={rolId}
                    onChange={e => setRolId(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SecurityIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'rgba(255,255,255,1)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                      }
                    }}
                  >
                    {roles
                      .filter(rol => rol.nombre !== 'Administrador' && rol.nombre !== 'SubAdministrador')
                      .map(rol => (
                        <MenuItem key={rol.id} value={rol.id}>
                          <Chip 
                            label={rol.nombre} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                          {rol.nombre}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
              </Grid>
            </Card>

            {/* Sección 2: Información Personal */}
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)', 
              border: '1px solid #c3e6cb',
              borderRadius: 3
            }}>
              <Typography variant="h6" fontWeight={700} color="#155724" sx={{ 
                mb: 3, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
              }}>
                <PersonIcon sx={{ color: '#28a745' }} />
                Información Personal
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Tipo de Documento"
                    value={tipoDocumento}
                    onChange={e => setTipoDocumento(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon sx={{ color: '#28a745' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'rgba(255,255,255,1)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                      }
                    }}
                  >
                    {tiposDocumento.map(tipo => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Número de Documento"
                    value={numeroDocumento}
                    onChange={e => setNumeroDocumento(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon sx={{ color: '#28a745' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'rgba(255,255,255,1)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nombres"
                    value={nombres}
                    onChange={e => setNombres(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#28a745' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'rgba(255,255,255,1)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Apellidos"
                    value={apellidos}
                    onChange={e => setApellidos(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#28a745' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'rgba(255,255,255,1)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Correo de la persona"
                    type="email"
                    value={correoPersona}
                    onChange={e => setCorreoPersona(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#28a745' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'rgba(255,255,255,1)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Fecha de Nacimiento"
                    type="date"
                    value={fechaNacimiento}
                    onChange={e => setFechaNacimiento(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon sx={{ color: '#28a745' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'rgba(255,255,255,1)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Card>

            <Divider sx={{ my: 2 }} />

            {/* Botones de acción */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={limpiarFormulario}
                startIcon={<CancelIcon />}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontWeight: 600,
                  borderRadius: 2,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Limpiar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontWeight: 700, 
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                  },
                  '&:disabled': {
                    background: 'rgba(76, 175, 80, 0.5)',
                    transform: 'none',
                    boxShadow: 'none'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Registrando...' : 'Registrar Usuario'}
              </Button>
            </Box>
          </Box>

          {/* Diálogo para crear nuevo rol */}
          <Dialog open={openRolDialog} onClose={() => setOpenRolDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{
              background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <AddCircleIcon />
              Crear Nuevo Rol
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <TextField
                label="Nombre del rol"
                value={nuevoRol}
                onChange={e => setNuevoRol(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: 2
                  }
                }}
              />
              {mensajeRol && (
                <Alert 
                  severity={mensajeRol.includes('exitosamente') ? 'success' : 'error'} 
                  sx={{ mt: 2, borderRadius: 2 }}
                  onClose={() => setMensajeRol('')}
                >
                  {mensajeRol}
                </Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
              <Button 
                onClick={() => setOpenRolDialog(false)}
                variant="outlined"
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCrearRol} 
                variant="contained" 
                color="success"
                sx={{ 
                  borderRadius: 2, 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)' }
                }}
              >
                Crear Rol
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </Box>
  );
}

export default RegistrarUsuario; 