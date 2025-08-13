import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';

export const UsuarioDialog = ({
  open,
  modo,
  usuario,
  editData,
  nuevoRolId,
  roles,
  onClose,
  onGuardarEdicion,
  onGuardarRol,
  isMobile
}) => {
  const [localEditData, setLocalEditData] = React.useState({});
  const [localNuevoRolId, setLocalNuevoRolId] = React.useState('');

  React.useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      setLocalEditData(editData);
    }
    if (nuevoRolId) {
      console.log('🔄 UsuarioDialog: nuevoRolId actualizado:', nuevoRolId);
      setLocalNuevoRolId(nuevoRolId);
    }
  }, [editData, nuevoRolId]);

  if (!usuario) return null;

  const getEstadoColor = (estado) => {
    const estadoLower = estado?.toLowerCase();
    if (estadoLower === 'activo' || estadoLower === 'active') return 'success';
    if (estadoLower === 'inactivo' || estadoLower === 'inactive') return 'error';
    if (estadoLower === 'pendiente' || estadoLower === 'pending') return 'warning';
    return 'default';
  };

  const getEstadoLabel = (estado) => {
    const estadoLower = estado?.toLowerCase();
    if (estadoLower === 'activo' || estadoLower === 'active') return 'Activo';
    if (estadoLower === 'inactivo' || estadoLower === 'inactive') return 'Inactivo';
    if (estadoLower === 'pendiente' || estadoLower === 'pending') return 'Pendiente';
    return estado || 'Sin estado';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const renderVerUsuario = () => (
    <Grid container spacing={3}>
      {/* Información del Usuario */}
      <Grid item xs={12} md={6}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Información Personal
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">Nombre Completo</Typography>
            <Typography variant="body1" fontWeight={500}>
              {usuario.persona?.nombres} {usuario.persona?.apellidos}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">Email</Typography>
            <Typography variant="body1" fontWeight={500}>
              {usuario.email}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">Documento</Typography>
            <Typography variant="body1" fontWeight={500}>
              {usuario.persona?.tipoDocumento}: {usuario.persona?.numeroDocumento}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">Fecha de Nacimiento</Typography>
            <Typography variant="body1" fontWeight={500}>
              {formatDate(usuario.persona?.fechaNacimiento)}
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Información del Sistema */}
      <Grid item xs={12} md={6}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Información del Sistema
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">Rol</Typography>
            <Chip
              label={usuario.rol?.nombre || 'Sin rol'}
              color="primary"
              variant="filled"
              sx={{ mt: 0.5 }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">Estado</Typography>
            <Chip
              label={getEstadoLabel(usuario.estado)}
              color={getEstadoColor(usuario.estado)}
              variant="filled"
              sx={{ mt: 0.5 }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">Fecha de Registro</Typography>
            <Typography variant="body1" fontWeight={500}>
              {formatDate(usuario.createdAt || usuario.fechaCreacion)}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );

  const renderEditarUsuario = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          value={localEditData.email || ''}
          onChange={(e) => setLocalEditData({...localEditData, email: e.target.value})}
          margin="normal"
          sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Tipo de Documento"
          value={localEditData.tipoDocumento || ''}
          onChange={(e) => setLocalEditData({...localEditData, tipoDocumento: e.target.value})}
          margin="normal"
          sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Número de Documento"
          value={localEditData.numeroDocumento || ''}
          onChange={(e) => setLocalEditData({...localEditData, numeroDocumento: e.target.value})}
          margin="normal"
          sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Nombres"
          value={localEditData.nombres || ''}
          onChange={(e) => setLocalEditData({...localEditData, nombres: e.target.value})}
          margin="normal"
          sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Apellidos"
          value={localEditData.apellidos || ''}
          onChange={(e) => setLocalEditData({...localEditData, apellidos: e.target.value})}
          margin="normal"
          sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Fecha de Nacimiento"
          type="date"
          value={localEditData.fechaNacimiento || ''}
          onChange={(e) => setLocalEditData({...localEditData, fechaNacimiento: e.target.value})}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Correo"
          value={localEditData.correo || ''}
          onChange={(e) => setLocalEditData({...localEditData, correo: e.target.value})}
          margin="normal"
          sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Rol</InputLabel>
          <Select
            value={localEditData.rolId || ''}
            onChange={(e) => setLocalEditData({...localEditData, rolId: e.target.value})}
            label="Rol"
            sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
          >
            {roles.map((rol) => (
              <MenuItem key={rol.id} value={rol.id}>
                {rol.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mt: 2 }}>
          Los cambios se guardarán al hacer clic en "Guardar Cambios"
        </Alert>
      </Grid>
    </Grid>
  );

  const renderCambiarRol = () => (
    <Box>
      <Typography variant="body1" gutterBottom>
        Usuario: <strong>{usuario.persona?.nombres} {usuario.persona?.apellidos}</strong>
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Rol actual: <Chip label={usuario.rol?.nombre || 'Sin rol'} size="small" color="primary" />
      </Typography>
      
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Nuevo Rol</InputLabel>
        <Select
          value={localNuevoRolId}
          onChange={(e) => setLocalNuevoRolId(e.target.value)}
          label="Nuevo Rol"
          sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
        >
          {roles.map((rol) => (
            <MenuItem key={rol.id} value={rol.id}>
              {rol.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Alert severity="warning" sx={{ mt: 2 }}>
        El cambio de rol se aplicará inmediatamente al hacer clic en "Guardar Rol"
      </Alert>
    </Box>
  );

  const getDialogTitle = () => {
    switch (modo) {
      case 'ver': return 'Ver Usuario';
      case 'editar': return 'Editar Usuario';
      case 'rol': return 'Cambiar Rol';
      default: return 'Usuario';
    }
  };

  const getDialogContent = () => {
    switch (modo) {
      case 'ver': return renderVerUsuario();
      case 'editar': return renderEditarUsuario();
      case 'rol': return renderCambiarRol();
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
              color="primary"
              sx={{ 
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)' }
              }}
            >
              Guardar Cambios
            </Button>
          </>
        );
      case 'rol':
        return (
          <>
            <Button onClick={onClose} variant="outlined">
              Cancelar
            </Button>
            <Button 
              onClick={() => onGuardarRol(localNuevoRolId)} 
              variant="contained" 
              color="warning"
              sx={{ 
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)' }
              }}
            >
              Guardar Rol
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
          {modo === 'editar' ? <EditIcon /> : modo === 'rol' ? <SwapHorizIcon /> : <PersonIcon />}
        </Avatar>
        <Box>
          <Typography variant="h6">
            {getDialogTitle()}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {usuario.persona?.nombres} {usuario.persona?.apellidos}
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

export default UsuarioDialog;