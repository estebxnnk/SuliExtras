import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, MenuItem, Select, InputLabel, FormControl, Alert, Avatar, Menu } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function NavbarAdmin({ onFiltrarPorRol }) {
  const navigate = useNavigate();
  const [openRoles, setOpenRoles] = useState(false);
  const [roles, setRoles] = useState([]);
  const [nuevoRol, setNuevoRol] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [rolFiltro, setRolFiltro] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (openRoles) fetchRoles();
  }, [openRoles]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:3000/api/usuarios/${userId}`)
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(() => setUserData(null));
    }
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

  const handleCrearRol = async () => {
    if (!nuevoRol.trim()) return;
    try {
      const response = await fetch('http://localhost:3000/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoRol }),
      });
      if (!response.ok) {
        setMensaje('No se pudo crear el rol.');
        return;
      }
      setNuevoRol('');
      setMensaje('Rol creado exitosamente.');
      fetchRoles();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  const handleEliminarRol = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este rol?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/roles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        setMensaje('No se pudo eliminar el rol.');
        return;
      }
      setMensaje('Rol eliminado exitosamente.');
      fetchRoles();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  const handleFiltrar = () => {
    if (onFiltrarPorRol) onFiltrarPorRol(rolFiltro);
    setOpenRoles(false);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRol');
    navigate('/');
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: '98vw', md: '98vw' },
        maxWidth: 1400,
        height: 90,
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 5,
        zIndex: 1000,
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Link to="/panel-admin">
          <Box component="img" src="/img/NuevoLogo.png" alt="Logo" sx={{ height: 72 }} />
        </Link>
        <Link to="/usuarios-administrativo" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Usuarios</Typography>
        </Link>
        <Link to="/registrar-usuario-administrativo" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Crear Usuario</Typography>
        </Link>
        <Link to="/panel-admin?tab=solicitudes" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Solicitudes</Typography>
        </Link>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ManageAccountsIcon />}
          sx={{ fontWeight: 700, borderRadius: 2, ml: 2 }}
          onClick={() => setOpenRoles(true)}
        >
          Gestión de Roles
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleProfileClick} size="large" sx={{ ml: 2 }}>
          <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}>
            <AccountCircleIcon sx={{ fontSize: 36, color: '#fff' }} />
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { p: 2, minWidth: 240, borderRadius: 3 } }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 1 }}>
            <Avatar sx={{ bgcolor: '#1976d2', width: 64, height: 64, mb: 1 }}>
              <AccountCircleIcon sx={{ fontSize: 40, color: '#fff' }} />
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              {userData ? `${userData.persona?.nombres || ''} ${userData.persona?.apellidos || ''}` : 'Cargando...'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData ? userData.email : ''}
            </Typography>
            <Typography variant="body2" color="#1976d2" fontWeight={700}>
              {userData ? userData.rol?.nombre : ''}
            </Typography>
            <Divider sx={{ width: '100%', my: 1 }} />
            <Button onClick={handleLogout} variant="contained" color="error" sx={{ fontWeight: 700, borderRadius: 2, px: 3, width: '100%' }}>
              Cerrar sesión
            </Button>
          </Box>
        </Menu>
      </Box>

      {/* Diálogo de gestión de roles */}
      <Dialog open={openRoles} onClose={() => setOpenRoles(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Gestión de Roles</DialogTitle>
        <DialogContent>
          {mensaje && <Alert severity="info" sx={{ mb: 2 }}>{mensaje}</Alert>}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Nuevo Rol"
              value={nuevoRol}
              onChange={e => setNuevoRol(e.target.value)}
              fullWidth
            />
            <IconButton color="success" onClick={handleCrearRol} title="Crear Rol">
              <AddIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="subtitle2" fontWeight={700} mb={1}>Roles existentes:</Typography>
          <List dense>
            {roles.map(rol => (
              <ListItem key={rol.id} secondaryAction={
                <IconButton edge="end" color="error" onClick={() => handleEliminarRol(rol.id)} title="Eliminar Rol">
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemText primary={rol.nombre} />
              </ListItem>
            ))}
            {roles.length === 0 && <ListItem><ListItemText primary="No hay roles registrados." /></ListItem>}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" fontWeight={700} mb={1}>Filtrar usuarios por rol:</Typography>
          <FormControl fullWidth>
            <InputLabel id="rol-filtro-label">Rol</InputLabel>
            <Select
              labelId="rol-filtro-label"
              value={rolFiltro}
              label="Rol"
              onChange={e => setRolFiltro(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {roles.map(rol => (
                <MenuItem key={rol.id} value={rol.id}>{rol.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoles(false)}>Cerrar</Button>
          <Button onClick={handleFiltrar} variant="contained" color="primary">Filtrar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default NavbarAdmin; 