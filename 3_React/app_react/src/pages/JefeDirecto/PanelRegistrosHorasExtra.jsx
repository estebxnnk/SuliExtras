import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, MenuItem, InputAdornment, Avatar, Divider, Chip, Badge } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NavbarJefeDirecto from './NavbarJefeDirecto';

function PanelRegistrosHorasExtra() {
  const [registros, setRegistros] = useState([]);
  const [tiposHora, setTiposHora] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [modo, setModo] = useState('ver'); // 'ver', 'editar', 'crear'
  const [editData, setEditData] = useState({});
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistros();
    fetchTiposHora();
  }, []);

  const fetchRegistros = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/registros');
      const data = await response.json();
      setRegistros(data);
    } catch (error) {
      setMensaje('No se pudieron cargar los registros de horas extra.');
    }
    setLoading(false);
  };

  const fetchTiposHora = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/horas');
      const data = await response.json();
      setTiposHora(data);
    } catch (error) {
      setMensaje('No se pudieron cargar los tipos de hora.');
    }
  };

  const handleVer = async (registro) => {
    setModo('ver');
    setRegistroSeleccionado(registro);
    setOpenDialog(true);
  };

  const handleEditar = (registro) => {
    setModo('editar');
    setRegistroSeleccionado(registro);
    setEditData({
      fecha: registro.fecha,
      horaIngreso: registro.horaIngreso,
      horaSalida: registro.horaSalida,
      ubicacion: registro.ubicacion,
      cantidadHorasExtra: registro.cantidadHorasExtra,
      justificacionHoraExtra: registro.justificacionHoraExtra || '',
    });
    setOpenDialog(true);
  };

  const handleEliminar = async (registro) => {
    if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/registros/${registro.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        setMensaje('No se pudo eliminar el registro.');
        return;
      }
      setMensaje('Registro eliminado exitosamente.');
      fetchRegistros();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  const handleAprobar = async (registro) => {
    try {
      const response = await fetch(`http://localhost:3000/api/registros/${registro.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'aprobado' }),
      });
      if (!response.ok) {
        setMensaje('No se pudo aprobar el registro.');
        return;
      }
      setMensaje('Registro aprobado exitosamente.');
      fetchRegistros();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  const handleRechazar = async (registro) => {
    try {
      const response = await fetch(`http://localhost:3000/api/registros/${registro.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'rechazado' }),
      });
      if (!response.ok) {
        setMensaje('No se pudo rechazar el registro.');
        return;
      }
      setMensaje('Registro rechazado exitosamente.');
      fetchRegistros();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  const handleGuardarEdicion = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/registros/${registroSeleccionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!response.ok) {
        setMensaje('No se pudo actualizar el registro.');
        return;
      }
      setMensaje('Registro actualizado exitosamente.');
      setOpenDialog(false);
      fetchRegistros();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  const getEstadoChip = (estado) => {
    const estados = {
      pendiente: { color: 'warning', icon: <PendingIcon />, label: 'Pendiente' },
      aprobado: { color: 'success', icon: <CheckCircleIcon />, label: 'Aprobado' },
      rechazado: { color: 'error', icon: <CancelIcon />, label: 'Rechazado' }
    };
    const config = estados[estado] || estados.pendiente;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        variant="outlined"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  // Filtro de búsqueda y estado
  const registrosFiltrados = registros.filter(r => {
    const cumpleBusqueda = 
      (r.usuario && r.usuario.toLowerCase().includes(search.toLowerCase())) ||
      (r.numRegistro && r.numRegistro.toLowerCase().includes(search.toLowerCase())) ||
      (r.ubicacion && r.ubicacion.toLowerCase().includes(search.toLowerCase()));
    
    const cumpleEstado = filtroEstado === 'todos' || r.estado === filtroEstado;
    
    return cumpleBusqueda && cumpleEstado;
  });

  return (
    <Box minHeight="100vh" width="100vw" sx={{ background: "url('/img/Recepcion.jpg') no-repeat center center", backgroundSize: 'cover', p: 4 }}>
      <NavbarJefeDirecto />
      <Paper elevation={6} sx={{ borderRadius: 3, p: 4, maxWidth: 1400, margin: '120px auto 40px auto', background: 'rgba(255,255,255,0.95)', position: 'relative' }}>
        <Typography variant="h4" fontWeight={700} mb={2} color="#222">
          Registros de Horas Extra
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          sx={{ position: 'absolute', right: 32, top: 32, fontWeight: 700, borderRadius: 2, fontSize: 16, zIndex: 10 }}
          onClick={() => navigate('/crear-registro-horas')}
        >
          Crear Nuevo Registro
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Buscar por usuario, número de registro o ubicación"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ flex: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Filtrar por estado"
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="todos">Todos los estados</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="aprobado">Aprobado</MenuItem>
            <MenuItem value="rechazado">Rechazado</MenuItem>
          </TextField>
        </Box>

        {mensaje && <Alert severity="info" sx={{ mb: 2 }}>{mensaje}</Alert>}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#e3f2fd' }}>
                <TableCell>Número Registro</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Horario</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Horas Extra</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrosFiltrados.map(registro => (
                <TableRow key={registro.id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: '#e3f2fd' } }}>
                  <TableCell>{registro.numRegistro}</TableCell>
                  <TableCell>{registro.usuario}</TableCell>
                  <TableCell>{registro.fecha}</TableCell>
                  <TableCell>
                    {registro.horaIngreso} - {registro.horaSalida}
                  </TableCell>
                  <TableCell>{registro.ubicacion}</TableCell>
                  <TableCell>{registro.cantidadHorasExtra} hrs</TableCell>
                  <TableCell>{getEstadoChip(registro.estado)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleVer(registro)} title="Ver detalles" sx={{ color: 'green' }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditar(registro)} title="Editar" sx={{ color: '#1976d2' }}>
                      <EditIcon />
                    </IconButton>
                    {registro.estado === 'pendiente' && (
                      <>
                        <IconButton onClick={() => handleAprobar(registro)} title="Aprobar" sx={{ color: '#4caf50' }}>
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton onClick={() => handleRechazar(registro)} title="Rechazar" sx={{ color: '#f44336' }}>
                          <CancelIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton onClick={() => handleEliminar(registro)} title="Eliminar" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {registrosFiltrados.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center">No hay registros de horas extra.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialogo para ver/editar registro */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {modo === 'ver' && <AccessTimeIcon sx={{ fontSize: 36, color: '#1976d2' }} />}
          {modo === 'ver' ? 'Detalles del Registro' : 'Editar Registro'}
        </DialogTitle>
        <DialogContent sx={{ background: modo === 'ver' ? '#f3f7fa' : 'inherit', borderRadius: 2 }}>
          {registroSeleccionado && modo === 'ver' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 72, height: 72, bgcolor: '#1976d2', mb: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 48, color: '#fff' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={700} color="#222" mb={1}>
                Registro #{registroSeleccionado.numRegistro}
              </Typography>
              <Divider sx={{ width: '100%', mb: 2 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Usuario</Typography>
                  <Typography variant="body1" fontWeight={600}>{registroSeleccionado.usuario}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Fecha</Typography>
                  <Typography variant="body1" fontWeight={600}>{registroSeleccionado.fecha}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Hora de Ingreso</Typography>
                  <Typography variant="body1" fontWeight={600}>{registroSeleccionado.horaIngreso}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Hora de Salida</Typography>
                  <Typography variant="body1" fontWeight={600}>{registroSeleccionado.horaSalida}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Ubicación</Typography>
                  <Typography variant="body1" fontWeight={600}>{registroSeleccionado.ubicacion}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Horas Extra</Typography>
                  <Typography variant="body1" fontWeight={600}>{registroSeleccionado.cantidadHorasExtra} horas</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
                  {getEstadoChip(registroSeleccionado.estado)}
                </Box>
              </Box>
              
              {registroSeleccionado.justificacionHoraExtra && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Justificación</Typography>
                  <Typography variant="body1" sx={{ mt: 1, p: 2, background: '#f5f5f5', borderRadius: 1 }}>
                    {registroSeleccionado.justificacionHoraExtra}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          
          {registroSeleccionado && modo === 'editar' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Fecha"
                type="date"
                value={editData.fecha}
                onChange={e => setEditData({ ...editData, fecha: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Hora de Ingreso"
                  type="time"
                  value={editData.horaIngreso}
                  onChange={e => setEditData({ ...editData, horaIngreso: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Hora de Salida"
                  type="time"
                  value={editData.horaSalida}
                  onChange={e => setEditData({ ...editData, horaSalida: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <TextField
                label="Ubicación"
                value={editData.ubicacion}
                onChange={e => setEditData({ ...editData, ubicacion: e.target.value })}
                fullWidth
              />
              <TextField
                label="Cantidad de Horas Extra"
                type="number"
                value={editData.cantidadHorasExtra}
                onChange={e => setEditData({ ...editData, cantidadHorasExtra: parseFloat(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Justificación"
                value={editData.justificacionHoraExtra}
                onChange={e => setEditData({ ...editData, justificacionHoraExtra: e.target.value })}
                multiline
                rows={3}
                fullWidth
              />
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
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PanelRegistrosHorasExtra; 