import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Alert, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  useMediaQuery, Card, Grid, Avatar, Divider, InputAdornment, Chip
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

// Componente universal, controlado por props para URLS, textos y callbacks
function RegistrarUsuarioUniversal({
  rolesEndpoint = 'http://localhost:3000/api/roles',
  registerEndpoint = 'http://localhost:3000/api/auth/register',
  onSuccess,
  title = 'Registrar Usuario',
  subtitle = 'Completa el formulario para crear una nueva cuenta de usuario',
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolId, setRolId] = useState('');
  const [roles, setRoles] = useState([]);
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correoPersona, setCorreoPersona] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [openRolDialog, setOpenRolDialog] = useState(false);
  const [nuevoRol, setNuevoRol] = useState('');
  const [mensajeRol, setMensajeRol] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tiposDocumento = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'PAS', label: 'Pasaporte' },
    { value: 'NIT', label: 'NIT' },
    { value: 'RC', label: 'Registro Civil' },
    { value: 'PEP', label: 'Permiso Especial de Permanencia' },
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(rolesEndpoint);
        const data = await response.json();
        setRoles(Array.isArray(data) ? data : []);
      } catch (_) {
        setMensaje('No se pudieron cargar los roles.');
      }
    })();
  }, [rolesEndpoint]);

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
      const response = await fetch(registerEndpoint, {
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
      onSuccess?.(data);
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
      const response = await fetch(rolesEndpoint, {
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
      // recargar roles
      const rec = await fetch(rolesEndpoint);
      setRoles(await rec.json());
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
        backdropFilter: 'blur(10px)'
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
          <PersonIcon sx={{ fontSize: 48 }} />
        </Avatar>
        <Typography variant="h4" fontWeight={800} color="primary" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          {subtitle}
        </Typography>
      </Box>

      {mensaje && (
        <Alert 
          severity={exito ? 'success' : 'error'} 
          sx={{ mb: 3 }}
          onClose={() => setMensaje('')}
        >
          {mensaje}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }} autoComplete="off">
        <Card sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', border: '1px solid #dee2e6', borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} color="#495057" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
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
                InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon sx={{ color: 'primary.main' }} /></InputAdornment>) }}
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
                InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon sx={{ color: 'primary.main' }} /></InputAdornment>) }}
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
                InputProps={{ startAdornment: (<InputAdornment position="start"><SecurityIcon sx={{ color: 'primary.main' }} /></InputAdornment>) }}
              >
                {roles.filter(rol => rol.nombre !== 'Administrador' && rol.nombre !== 'SubAdministrador').map(rol => (
                  <MenuItem key={rol.id} value={rol.id}>
                    <Chip label={rol.nombre} size="small" color="primary" variant="outlined" sx={{ mr: 1 }} />
                    {rol.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ p: 3, background: 'linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)', border: '1px solid #c3e6cb', borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} color="#155724" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ color: '#28a745' }} />
            Información Personal
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField select label="Tipo de Documento" value={tipoDocumento} onChange={e => setTipoDocumento(e.target.value)} variant="outlined" fullWidth required InputProps={{ startAdornment: (<InputAdornment position="start"><BadgeIcon sx={{ color: '#28a745' }} /></InputAdornment>) }}>
                {[
                  { value: 'CC', label: 'Cédula de Ciudadanía' },
                  { value: 'TI', label: 'Tarjeta de Identidad' },
                  { value: 'CE', label: 'Cédula de Extranjería' },
                  { value: 'PAS', label: 'Pasaporte' },
                  { value: 'NIT', label: 'NIT' },
                  { value: 'RC', label: 'Registro Civil' },
                  { value: 'PEP', label: 'Permiso Especial de Permanencia' },
                ].map(tipo => (<MenuItem key={tipo.value} value={tipo.value}>{tipo.label}</MenuItem>))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Número de Documento" value={numeroDocumento} onChange={e => setNumeroDocumento(e.target.value)} variant="outlined" fullWidth required InputProps={{ startAdornment: (<InputAdornment position="start"><BadgeIcon sx={{ color: '#28a745' }} /></InputAdornment>) }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Nombres" value={nombres} onChange={e => setNombres(e.target.value)} variant="outlined" fullWidth required InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon sx={{ color: '#28a745' }} /></InputAdornment>) }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Apellidos" value={apellidos} onChange={e => setApellidos(e.target.value)} variant="outlined" fullWidth required InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon sx={{ color: '#28a745' }} /></InputAdornment>) }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Correo de la persona" type="email" value={correoPersona} onChange={e => setCorreoPersona(e.target.value)} variant="outlined" fullWidth required InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon sx={{ color: '#28a745' }} /></InputAdornment>) }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Fecha de Nacimiento" type="date" value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} InputLabelProps={{ shrink: true }} variant="outlined" fullWidth required InputProps={{ startAdornment: (<InputAdornment position="start"><CalendarMonthIcon sx={{ color: '#28a745' }} /></InputAdornment>) }} />
            </Grid>
          </Grid>
        </Card>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button type="button" variant="outlined" onClick={limpiarFormulario} startIcon={<CancelIcon />} sx={{ px: 4, py: 1.5, fontWeight: 600, borderRadius: 2 }}>
            Limpiar
          </Button>
          <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={loading} sx={{ px: 4, py: 1.5, fontWeight: 700 }}>
            {loading ? 'Registrando...' : 'Registrar Usuario'}
          </Button>
        </Box>
      </Box>

      <Dialog open={openRolDialog} onClose={() => setOpenRolDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #1976d2, #42a5f5)', color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
          <AddCircleIcon />
          Crear Nuevo Rol
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField label="Nombre del rol" value={nuevoRol} onChange={e => setNuevoRol(e.target.value)} fullWidth margin="normal" variant="outlined" />
          {mensajeRol && (
            <Alert severity={mensajeRol.includes('exitosamente') ? 'success' : 'error'} sx={{ mt: 2 }} onClose={() => setMensajeRol('')}>
              {mensajeRol}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenRolDialog(false)} variant="outlined">Cancelar</Button>
          <Button onClick={handleCrearRol} variant="contained" color="success">Crear Rol</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default RegistrarUsuarioUniversal;


