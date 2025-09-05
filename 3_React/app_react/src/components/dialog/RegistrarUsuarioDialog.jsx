import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Alert, 
  MenuItem, 
  Box,
  Typography,
  useMediaQuery 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const tiposDocumento = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PAS', label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT' },
  { value: 'RC', label: 'Registro Civil' },
  { value: 'PEP', label: 'Permiso Especial de Permanencia' },
];

const RegistrarUsuarioDialog = ({ 
  open, 
  onClose, 
  onSuccess,
  formatSalaryInput,
  sedes = []
}) => {
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
  const [salario, setSalario] = useState('');
  const [sedeId, setSedeId] = useState('');
  
  // Estados de mensajes
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open) {
      fetchRoles();
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setRolId('');
    setTipoDocumento('');
    setNumeroDocumento('');
    setNombres('');
    setApellidos('');
    setCorreoPersona('');
    setFechaNacimiento('');
    setSalario('');
    setSedeId('');
    setMensaje('');
    setExito(false);
  };

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
    setLoading(true);
    
    if (!email || !password || !rolId || !tipoDocumento || !numeroDocumento || !nombres || !apellidos || !correoPersona || !fechaNacimiento) {
      setMensaje('Por favor, completa todos los campos requeridos.');
      setLoading(false);
      return;
    }
    
    try {
      const requestData = {
        email,
        password,
        rolId,
        sedeId: sedeId || null,
        persona: {
          tipoDocumento,
          numeroDocumento,
          nombres,
          apellidos,
          correo: correoPersona,
          fechaNacimiento,
          salario: salario ? parseFloat(salario) : null,
        },
      };
      
      console.log('🚀 Enviando datos de registro:', requestData);
      
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setMensaje(data.message || 'Error al registrar usuario');
        setLoading(false);
        return;
      }
      
      setExito(true);
      setMensaje('¡Usuario registrado exitosamente!');
      setLoading(false);
      
      // Llamar callback de éxito y cerrar después de un delay
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
      
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(255,255,255,0.98)',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 3
      }}>
        <PersonIcon sx={{ fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Registrar Nuevo Usuario
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Complete la información del usuario
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {mensaje && (
          <Alert 
            severity={exito ? 'success' : 'error'} 
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {mensaje}
          </Alert>
        )}
        
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            '& .MuiTextField-root': {
              background: 'rgba(255,255,255,0.9)',
              borderRadius: 1
            }
          }}
        >
          {/* Información de Usuario */}
          <Typography variant="h6" color="primary" fontWeight={600} sx={{ mt: 1, mb: 1 }}>
            Información de Usuario
          </Typography>
          
          <TextField
            label="Correo electrónico (usuario)"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            required
            disabled={loading}
            InputProps={{
              startAdornment: (
                <EmailIcon sx={{ color: '#1976d2', mr: 1 }} />
              ),
            }}
          />
          
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            variant="outlined"
            fullWidth
            required
            disabled={loading}
            InputProps={{
              startAdornment: (
                <LockIcon sx={{ color: '#1976d2', mr: 1 }} />
              ),
            }}
          />
          
          <TextField
            select
            label="Rol"
            value={rolId}
            onChange={e => setRolId(e.target.value)}
            variant="outlined"
            fullWidth
            required
            disabled={loading}
          >
            {roles.map(rol => (
              <MenuItem key={rol.id} value={rol.id}>
                {rol.nombre}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            label="Sede (Opcional)"
            value={sedeId}
            onChange={e => setSedeId(e.target.value)}
            variant="outlined"
            fullWidth
            disabled={loading}
          >
            <MenuItem value="">
              <em>Sin sede asignada</em>
            </MenuItem>
            {sedes.map(sede => (
              <MenuItem key={sede.id} value={sede.id}>
                {sede.nombre}
              </MenuItem>
            ))}
          </TextField>

          {/* Información Personal */}
          <Typography variant="h6" color="primary" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
            Información Personal
          </Typography>
          
          <TextField
            select
            label="Tipo de Documento"
            value={tipoDocumento}
            onChange={e => setTipoDocumento(e.target.value)}
            variant="outlined"
            fullWidth
            required
            disabled={loading}
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
            fullWidth
            required
            disabled={loading}
            InputProps={{
              startAdornment: (
                <BadgeIcon sx={{ color: '#1976d2', mr: 1 }} />
              ),
            }}
          />
          
          <TextField
            label="Nombres"
            value={nombres}
            onChange={e => setNombres(e.target.value)}
            variant="outlined"
            fullWidth
            required
            disabled={loading}
            InputProps={{
              startAdornment: (
                <PersonIcon sx={{ color: '#1976d2', mr: 1 }} />
              ),
            }}
          />
          
          <TextField
            label="Apellidos"
            value={apellidos}
            onChange={e => setApellidos(e.target.value)}
            variant="outlined"
            fullWidth
            required
            disabled={loading}
            InputProps={{
              startAdornment: (
                <PersonIcon sx={{ color: '#1976d2', mr: 1 }} />
              ),
            }}
          />
          
          <TextField
            label="Correo de la persona"
            type="email"
            value={correoPersona}
            onChange={e => setCorreoPersona(e.target.value)}
            variant="outlined"
            fullWidth
            required
            disabled={loading}
            InputProps={{
              startAdornment: (
                <EmailIcon sx={{ color: '#1976d2', mr: 1 }} />
              ),
            }}
          />
          
          <TextField
            label="Fecha de Nacimiento"
            type="date"
            value={fechaNacimiento}
            onChange={e => setFechaNacimiento(e.target.value)}
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
            disabled={loading}
            InputProps={{
              startAdornment: (
                <CalendarMonthIcon sx={{ color: '#1976d2', mr: 1 }} />
              ),
            }}
          />
          
          <TextField
            label="Salario (Opcional)"
            value={salario}
            onChange={e => {
              const formattedValue = formatSalaryInput ? formatSalaryInput(e.target.value) : e.target.value;
              setSalario(formattedValue);
            }}
            variant="outlined"
            fullWidth
            placeholder="Ej: 1500000.00"
            helperText="Máximo 9 dígitos antes del punto decimal y 2 decimales"
            disabled={loading}
            InputProps={{
              startAdornment: (
                <AttachMoneyIcon sx={{ color: '#1976d2', mr: 1 }} />
              ),
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          disabled={loading}
          sx={{ 
            px: 3, 
            py: 1.5, 
            fontWeight: 600,
            borderRadius: 2
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          color="primary"
          disabled={loading}
          sx={{ 
            px: 3, 
            py: 1.5, 
            fontWeight: 600,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            '&:hover': { 
              background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)' 
            }
          }}
        >
          {loading ? 'Registrando...' : 'Registrar Usuario'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegistrarUsuarioDialog;
