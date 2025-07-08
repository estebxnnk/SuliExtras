import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, MenuItem, InputAdornment, Avatar, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WarningIcon from '@mui/icons-material/Warning';
import NavbarAdminstrativo from './NavbarAdminstrativo';

function PanelUsuariosAdministrativo() {
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
  const [alerta, setAlerta] = useState({ tipo: '', mensaje: '' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', usuario: null });

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

  const handleEliminar = (usuario) => {
    setConfirmDialog({ open: true, action: 'eliminar', usuario });
  };

  const confirmarEliminar = async () => {
    const usuario = confirmDialog.usuario;
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuario.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        setAlerta({ tipo: 'error', mensaje: 'No se pudo eliminar el usuario.' });
        setConfirmDialog({ open: false, action: '', usuario: null });
        return;
      }
      setAlerta({ tipo: 'success', mensaje: 'Usuario eliminado exitosamente.' });
      setConfirmDialog({ open: false, action: '', usuario: null });
      fetchUsuarios();
    } catch (error) {
      setAlerta({ tipo: 'error', mensaje: 'No se pudo conectar con el servidor.' });
      setConfirmDialog({ open: false, action: '', usuario: null });
    }
  };

  const handleGuardarEdicion = async () => {
    // Construir el objeto con la estructura recomendada
    const dataToSend = {
      email: editData.email,
      rolId: editData.rolId,
      persona: {
        tipoDocumento: editData.tipoDocumento,
        numeroDocumento: editData.numeroDocumento,
        nombres: editData.nombres,
        apellidos: editData.apellidos,
        correo: editData.correo,
        fechaNacimiento: editData.fechaNacimiento,
      },
    };
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioSeleccionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        setAlerta({ tipo: 'error', mensaje: 'No se pudo actualizar el usuario.' });
        return;
      }
      setAlerta({ tipo: 'success', mensaje: 'Usuario actualizado exitosamente.' });
      setOpenDialog(false);
      fetchUsuarios();
    } catch (error) {
      setAlerta({ tipo: 'error', mensaje: 'No se pudo conectar con el servidor.' });
    }
  };

  const handleCambiarRol = (usuario) => {
    setModo('rol');
    setUsuarioSeleccionado(usuario);
    setNuevoRolId(usuario.rol?.id || '');
    setOpenDialog(true);
  };

  const confirmarCambiarRol = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioSeleccionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rolId: nuevoRolId }),
      });
      if (!response.ok) {
        setAlerta({ tipo: 'error', mensaje: 'No se pudo actualizar el rol del usuario.' });
        setConfirmDialog({ open: false, action: '', usuario: null });
        return;
      }
      setAlerta({ tipo: 'success', mensaje: 'Rol actualizado exitosamente.' });
      setConfirmDialog({ open: false, action: '', usuario: null });
      setOpenDialog(false);
      fetchUsuarios();
    } catch (error) {
      setAlerta({ tipo: 'error', mensaje: 'No se pudo conectar con el servidor.' });
      setConfirmDialog({ open: false, action: '', usuario: null });
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
      <NavbarAdminstrativo />
      <Paper elevation={6} sx={{ borderRadius: 3, p: 4, maxWidth: 1400, margin: '120px auto 40px auto', background: 'rgba(255,255,255,0.95)', position: 'relative' }}>
        <Typography variant="h4" fontWeight={700} mb={2} color="#222">
          Usuarios
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          sx={{ position: 'absolute', right: 32, top: 32, fontWeight: 700, borderRadius: 2, fontSize: 16, zIndex: 10 }}
          onClick={() => navigate('/registrar-usuario-administrativo')}
        >
          Agregar Nuevo Usuario
        </Button>
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
              <TableRow sx={{ background: '#e3f2fd' }}>
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
                <TableRow key={usuario.id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: '#e3f2fd' } }}>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.persona?.tipoDocumento}</TableCell>
                  <TableCell>{usuario.persona?.numeroDocumento}</TableCell>
                  <TableCell>{usuario.persona?.nombres}</TableCell>
                  <TableCell>{usuario.persona?.apellidos}</TableCell>
                  <TableCell>{usuario.persona?.correo}</TableCell>
                  <TableCell>{usuario.persona?.fechaNacimiento ? usuario.persona.fechaNacimiento.substring(0, 10) : ''}</TableCell>
                  <TableCell>{usuario.rol?.nombre}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleVer(usuario)} title="Ver detalles" sx={{ color: 'green' }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditar(usuario)} title="Editar" sx={{ color: '#1976d2' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEliminar(usuario)} title="Eliminar" color="error">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleCambiarRol(usuario)} title="Cambiar Rol" sx={{ color: '#ff9800' }}>
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
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#1976d2', fontWeight: 700 }}>
          {modo === 'ver' && <PersonIcon sx={{ fontSize: 36, color: '#1976d2' }} />}
          {modo === 'ver' ? 'Detalles del Usuario' : modo === 'editar' ? 'Editar Usuario' : 'Cambiar Rol del Usuario'}
        </DialogTitle>
        <DialogContent sx={{ background: modo === 'ver' ? '#f3f7fa' : 'inherit', borderRadius: 3, p: { xs: 1, sm: 3 } }}>
          {usuarioSeleccionado && modo === 'ver' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 72, height: 72, bgcolor: '#1976d2', mb: 2 }}>
                <PersonIcon sx={{ fontSize: 48, color: '#fff' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={700} color="#1976d2" mb={1}>
                {usuarioSeleccionado.persona?.nombres} {usuarioSeleccionado.persona?.apellidos}
              </Typography>
              <Divider sx={{ width: '100%', mb: 1 }} />
              <Typography><b>Email:</b> {usuarioSeleccionado.email}</Typography>
              <Typography><b>Tipo de Documento:</b> {usuarioSeleccionado.persona?.tipoDocumento}</Typography>
              <Typography><b>Número de Documento:</b> {usuarioSeleccionado.persona?.numeroDocumento}</Typography>
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
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ color: '#1976d2', mr: 1 }} />
                  ),
                }}
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
                InputProps={{
                  startAdornment: (
                    <BadgeIcon sx={{ color: '#1976d2', mr: 1 }} />
                  ),
                }}
              />
              <TextField
                label="Nombres"
                value={editData.nombres}
                onChange={e => setEditData({ ...editData, nombres: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ color: '#1976d2', mr: 1 }} />
                  ),
                }}
              />
              <TextField
                label="Apellidos"
                value={editData.apellidos}
                onChange={e => setEditData({ ...editData, apellidos: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ color: '#1976d2', mr: 1 }} />
                  ),
                }}
              />
              <TextField
                label="Correo"
                value={editData.correo}
                onChange={e => setEditData({ ...editData, correo: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ color: '#1976d2', mr: 1 }} />
                  ),
                }}
              />
              <TextField
                label="Fecha de Nacimiento"
                type="date"
                value={editData.fechaNacimiento}
                onChange={e => setEditData({ ...editData, fechaNacimiento: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <CalendarMonthIcon sx={{ color: '#1976d2', mr: 1 }} />
                  ),
                }}
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
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#1976d2', fontWeight: 700 }}>Cerrar</Button>
          {modo === 'editar' && (
            <Button onClick={handleGuardarEdicion} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700 }}>
              Guardar
            </Button>
          )}
          {modo === 'rol' && (
            <Button
              onClick={() => setConfirmDialog({ open: true, action: 'cambiarRol', usuario: usuarioSeleccionado })}
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              Cambiar Rol
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar o cambiar rol */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => setConfirmDialog({ open: false, action: '', usuario: null })}
        maxWidth="xs" 
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{
            background: confirmDialog.action === 'eliminar'
              ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
              : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            border: confirmDialog.action === 'eliminar'
              ? '2px solid #f44336'
              : '2px solid #1976d2',
            borderRadius: 3,
            p: 4,
            textAlign: 'center',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <WarningIcon sx={{ fontSize: 48, color: confirmDialog.action === 'eliminar' ? '#f44336' : '#1976d2' }} />
            </Box>
            <Typography variant="h6" fontWeight={700} mb={2} color={confirmDialog.action === 'eliminar' ? '#f44336' : '#1976d2'}>
              {confirmDialog.action === 'eliminar' ? 'Confirmar Eliminación' : 'Confirmar Cambio de Rol'}
            </Typography>
            <Typography variant="body1" mb={3} color="#333">
              {confirmDialog.action === 'eliminar'
                ? `¿Estás seguro que deseas ELIMINAR el usuario ${confirmDialog.usuario?.email}?`
                : `¿Estás seguro que deseas CAMBIAR el rol del usuario ${confirmDialog.usuario?.email}?`}
            </Typography>
            {confirmDialog.action === 'eliminar' && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600}>
                  ⚠️ Esta acción no se puede deshacer
                </Typography>
              </Alert>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setConfirmDialog({ open: false, action: '', usuario: null })}
                sx={{ px: 4, py: 1.5, fontWeight: 600 }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={confirmDialog.action === 'eliminar' ? confirmarEliminar : confirmarCambiarRol}
                sx={{ px: 4, py: 1.5, fontWeight: 600, background: confirmDialog.action === 'eliminar' ? '#f44336' : '#1976d2', '&:hover': { background: confirmDialog.action === 'eliminar' ? '#d32f2f' : '#1565c0' } }}
              >
                {confirmDialog.action === 'eliminar' ? 'Eliminar' : 'Cambiar Rol'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Alertas de éxito y error */}
      {alerta.mensaje && (
        <Alert severity={alerta.tipo} sx={{ position: 'fixed', top: 100, right: 32, zIndex: 2000, minWidth: 320, fontWeight: 600 }} onClose={() => setAlerta({ tipo: '', mensaje: '' })}>
          {alerta.mensaje}
        </Alert>
      )}
    </Box>
  );
}

export default PanelUsuariosAdministrativo; 