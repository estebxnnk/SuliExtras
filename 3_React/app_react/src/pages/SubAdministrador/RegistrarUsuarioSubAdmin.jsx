import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
    setMensaje('');
    setExito(false);
    if (!email || !password || !rolId || !tipoDocumento || !numeroDocumento || !nombres || !apellidos || !correoPersona || !fechaNacimiento) {
      setMensaje('Por favor, completa todos los campos.');
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
        return;
      }
      setExito(true);
      setMensaje('¡Usuario registrado exitosamente!');
      setTimeout(() => navigate('/panel-admin'), 1500);
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
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

  return (
    <Box
      minHeight="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        background: "url('/img/Recepcion.jpg') no-repeat center center",
        backgroundSize: 'cover',
      }}
    >
      <NavbarSubAdmin />
      <Box sx={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mt: { xs: 14, sm: 16 } }}>
        <Paper
          elevation={6}
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 4 },
            minWidth: { xs: '90vw', sm: 340 },
            maxWidth: { xs: '98vw', sm: 500 },
            width: { xs: '98vw', sm: 500 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.92)',
          }}
        >
          <Typography variant="h4" fontWeight={700} mb={2} color="#222" textAlign="center">
            Registrar Usuario
          </Typography>
          {mensaje && (
            <Alert severity={exito ? 'success' : 'error'} sx={{ mb: 2, width: '100%' }}>
              {mensaje}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
            autoComplete="off"
          >
            <TextField
              label="Correo electrónico (usuario)"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <TextField
              select
              label="Rol"
              value={rolId}
              onChange={e => setRolId(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            >
              {roles
                .filter(rol => rol.nombre !== 'Administrador' && rol.nombre !== 'SubAdministrador')
                .map(rol => (
                  <MenuItem key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </MenuItem>
                ))}
            </TextField>
            {/* Persona */}
            <TextField
              select
              label="Tipo de Documento"
              value={tipoDocumento}
              onChange={e => setTipoDocumento(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            >
              {tiposDocumento.map(tipo => (
                <MenuItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Número de Documento"
              value={numeroDocumento}
              onChange={e => setNumeroDocumento(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Nombres"
              value={nombres}
              onChange={e => setNombres(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Apellidos"
              value={apellidos}
              onChange={e => setApellidos(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Correo de la persona"
              type="email"
              value={correoPersona}
              onChange={e => setCorreoPersona(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Fecha de Nacimiento"
              type="date"
              value={fechaNacimiento}
              onChange={e => setFechaNacimiento(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 2, borderRadius: 2, fontWeight: 700, fontSize: '1.1rem', width: '100%' }}
            >
              Registrar
            </Button>
          </Box>
          <Dialog open={openRolDialog} onClose={() => setOpenRolDialog(false)}>
            <DialogTitle>Crear nuevo rol</DialogTitle>
            <DialogContent>
              <TextField
                label="Nombre del rol"
                value={nuevoRol}
                onChange={e => setNuevoRol(e.target.value)}
                fullWidth
                margin="normal"
              />
              {mensajeRol && <Alert severity={mensajeRol.includes('exitosamente') ? 'success' : 'error'} sx={{ mt: 2 }}>{mensajeRol}</Alert>}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenRolDialog(false)}>Cancelar</Button>
              <Button onClick={handleCrearRol} variant="contained" color="success">Crear</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </Box>
  );
}

export default RegistrarUsuario; 