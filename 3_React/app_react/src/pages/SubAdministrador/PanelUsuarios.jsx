import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, MenuItem, InputAdornment } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';

function AdminNavbar() {
  const navigate = useNavigate();
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
        <Link to="/usuarios" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Usuarios</Typography>
        </Link>
        <Link to="/registrar-usuario" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Crear Usuario</Typography>
        </Link>
        <Link to="/panel-admin?tab=solicitudes" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Solicitudes</Typography>
        </Link>
      </Box>
      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        sx={{ fontWeight: 700, borderRadius: 2, px: 3, height: 48, fontSize: 15 }}
      >
        Cerrar sesión
      </Button>
    </Paper>
  );
}

function PanelUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modo, setModo] = useState('ver'); // 'ver', 'editar', 'rol'
  const [editData, setEditData] = useState({});
  const [nuevoRolId, setNuevoRolId] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/usuarios');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      setMensaje('No se pudieron cargar los usuarios.');
    }
    setLoading(false);
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

  const handleVer = async (usuario) => {
    setModo('ver');
    setUsuarioSeleccionado(usuario);
    setOpenDialog(true);
  };

  const handleEditar = (usuario) => {
    setModo('editar');
    setUsuarioSeleccionado(usuario);
    setEditData({
      email: usuario.email,
      tipoDocumento: usuario.persona?.tipoDocumento || '',
      numeroDocumento: usuario.persona?.numeroDocumento || '',
      nombres: usuario.persona?.nombres || '',
      apellidos: usuario.persona?.apellidos || '',
      correo: usuario.persona?.correo || '',
      fechaNacimiento: usuario.persona?.fechaNacimiento ? usuario.persona.fechaNacimiento.substring(0, 10) : '',
      rolId: usuario.rol?.id || '',
    });
    setOpenDialog(true);
  };

  const handleEliminar = async (usuario) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuario.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        setMensaje('No se pudo eliminar el usuario.');
        return;
      }
      setMensaje('Usuario eliminado exitosamente.');
      fetchUsuarios();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  const handleGuardarEdicion = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioSeleccionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!response.ok) {
        setMensaje('No se pudo actualizar el usuario.');
        return;
      }
      setMensaje('Usuario actualizado exitosamente.');
      setOpenDialog(false);
      fetchUsuarios();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  const handleCambiarRol = (usuario) => {
    setModo('rol');
    setUsuarioSeleccionado(usuario);
    setNuevoRolId(usuario.rol?.id || '');
    setOpenDialog(true);
  };

  const handleGuardarRol = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioSeleccionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rolId: nuevoRolId }),
      });
      if (!response.ok) {
        setMensaje('No se pudo actualizar el rol del usuario.');
        return;
      }
      setMensaje('Rol actualizado exitosamente.');
      setOpenDialog(false);
      fetchUsuarios();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  // Filtro de búsqueda
  const usuariosFiltrados = usuarios.filter(u =>
    (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
    (u.persona?.nombres && u.persona.nombres.toLowerCase().includes(search.toLowerCase())) ||
    (u.persona?.apellidos && u.persona.apellidos.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box minHeight="100vh" width="100vw" sx={{ background: "url('/img/Recepcion.jpg') no-repeat center center", backgroundSize: 'cover', p: 4 }}>
      <AdminNavbar />
      <Paper elevation={6} sx={{ borderRadius: 3, p: 4, maxWidth: 1400, margin: '120px auto 40px auto', background: 'rgba(255,255,255,0.95)' }}>
        <Typography variant="h4" fontWeight={700} mb={2} color="#222">
          Usuarios
        </Typography>
        <TextField
          placeholder="Buscar por email, nombre o apellido"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          sx={{ mb: 2, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {mensaje && <Alert severity="info" sx={{ mb: 2 }}>{mensaje}</Alert>}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#f5f5f5' }}>
                <TableCell>Email</TableCell>
                <TableCell>Tipo Doc.</TableCell>
                <TableCell>Número Doc.</TableCell>
                <TableCell>Nombres</TableCell>
                <TableCell>Apellidos</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Fecha Nac.</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosFiltrados.map(usuario => (
                <TableRow key={usuario.id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: '#e8f5e9' } }}>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.persona?.tipoDocumento}</TableCell>
                  <TableCell>{usuario.persona?.numeroDocumento}</TableCell>
                  <TableCell>{usuario.persona?.nombres}</TableCell>
                  <TableCell>{usuario.persona?.apellidos}</TableCell>
                  <TableCell>{usuario.persona?.correo}</TableCell>
                  <TableCell>{usuario.persona?.fechaNacimiento ? usuario.persona.fechaNacimiento.substring(0, 10) : ''}</TableCell>
                  <TableCell>{usuario.rol?.nombre}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleVer(usuario)} title="Ver detalles">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditar(usuario)} title="Editar">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEliminar(usuario)} title="Eliminar" color="error">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleCambiarRol(usuario)} title="Cambiar Rol" color="primary">
                      <SwapHorizIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {usuariosFiltrados.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={9} align="center">No hay usuarios registrados.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialogo para ver/editar/cambiar rol usuario */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {modo === 'ver' ? 'Detalles del Usuario' : modo === 'editar' ? 'Editar Usuario' : 'Cambiar Rol del Usuario'}
        </DialogTitle>
        <DialogContent>
          {usuarioSeleccionado && modo === 'ver' && (
            <Box>
              <Typography><b>Email:</b> {usuarioSeleccionado.email}</Typography>
              <Typography><b>Tipo de Documento:</b> {usuarioSeleccionado.persona?.tipoDocumento}</Typography>
              <Typography><b>Número de Documento:</b> {usuarioSeleccionado.persona?.numeroDocumento}</Typography>
              <Typography><b>Nombres:</b> {usuarioSeleccionado.persona?.nombres}</Typography>
              <Typography><b>Apellidos:</b> {usuarioSeleccionado.persona?.apellidos}</Typography>
              <Typography><b>Correo:</b> {usuarioSeleccionado.persona?.correo}</Typography>
              <Typography><b>Fecha de Nacimiento:</b> {usuarioSeleccionado.persona?.fechaNacimiento ? usuarioSeleccionado.persona.fechaNacimiento.substring(0, 10) : ''}</Typography>
              <Typography><b>Rol:</b> {usuarioSeleccionado.rol?.nombre}</Typography>
            </Box>
          )}
          {usuarioSeleccionado && modo === 'editar' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Email"
                value={editData.email}
                onChange={e => setEditData({ ...editData, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Tipo de Documento"
                value={editData.tipoDocumento}
                onChange={e => setEditData({ ...editData, tipoDocumento: e.target.value })}
                fullWidth
              />
              <TextField
                label="Número de Documento"
                value={editData.numeroDocumento}
                onChange={e => setEditData({ ...editData, numeroDocumento: e.target.value })}
                fullWidth
              />
              <TextField
                label="Nombres"
                value={editData.nombres}
                onChange={e => setEditData({ ...editData, nombres: e.target.value })}
                fullWidth
              />
              <TextField
                label="Apellidos"
                value={editData.apellidos}
                onChange={e => setEditData({ ...editData, apellidos: e.target.value })}
                fullWidth
              />
              <TextField
                label="Correo"
                value={editData.correo}
                onChange={e => setEditData({ ...editData, correo: e.target.value })}
                fullWidth
              />
              <TextField
                label="Fecha de Nacimiento"
                type="date"
                value={editData.fechaNacimiento}
                onChange={e => setEditData({ ...editData, fechaNacimiento: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                select
                label="Rol"
                value={editData.rolId}
                onChange={e => setEditData({ ...editData, rolId: e.target.value })}
                fullWidth
              >
                {roles.map(rol => (
                  <MenuItem key={rol.id} value={rol.id}>{rol.nombre}</MenuItem>
                ))}
              </TextField>
            </Box>
          )}
          {usuarioSeleccionado && modo === 'rol' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                select
                label="Nuevo Rol"
                value={nuevoRolId}
                onChange={e => setNuevoRolId(e.target.value)}
                fullWidth
              >
                {roles.map(rol => (
                  <MenuItem key={rol.id} value={rol.id}>{rol.nombre}</MenuItem>
                ))}
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
          {modo === 'editar' && (
            <Button onClick={handleGuardarEdicion} variant="contained" color="success">
              Guardar
            </Button>
          )}
          {modo === 'rol' && (
            <Button onClick={handleGuardarRol} variant="contained" color="primary">
              Cambiar Rol
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PanelUsuarios; 