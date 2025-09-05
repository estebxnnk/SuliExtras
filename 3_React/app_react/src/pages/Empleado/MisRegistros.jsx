import React, { useEffect, useState, useMemo, useContext } from 'react';
import LayoutEmpleado from './components/LayoutEmpleado';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button, TextField, MenuItem, InputAdornment, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Divider, IconButton, TableContainer, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { SalarioMinimoContext } from '../../providers/SalarioMinimoProvider';

function MisRegistros() {
  const [registros, setRegistros] = useState([]);
  const [tiposHora, setTiposHora] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [modo, setModo] = useState('ver');
  const [editData, setEditData] = useState({});
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [confirmDialog, setConfirmDialog] = useState({ open: false, registro: null });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { salarioMinimo } = useContext(SalarioMinimoContext);

  useEffect(() => {
    fetchRegistros();
    fetchTiposHora();
  }, []);

  const fetchRegistros = async () => {
    setLoading(true);
    try {
      // Obtener todos los registros y filtrar por usuarioId en el frontend
      const response = await fetch('http://localhost:3000/api/registros');
      const data = await response.json();
      setRegistros(Array.isArray(data) ? data : []);
      setLastUpdate(Date.now());
    } catch (error) {
      setMensaje('No se pudieron cargar los registros.');
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

  // Filtro de búsqueda y estado
  const registrosFiltrados = registros.filter(r => {
    // Filtrar por usuarioId primero
    if (String(r.usuarioId) !== String(userId)) return false;
    const cumpleBusqueda =
      (r.ubicacion && r.ubicacion.toLowerCase().includes(search.toLowerCase())) ||
      (r.numRegistro && String(r.numRegistro).toLowerCase().includes(search.toLowerCase())) ||
      (r.justificacionHoraExtra && r.justificacionHoraExtra.toLowerCase().includes(search.toLowerCase()));
    const cumpleEstado = filtroEstado === 'todos' || r.estado === filtroEstado;
    const cumpleDesde = !fechaDesde || new Date(r.fecha) >= new Date(fechaDesde);
    const cumpleHasta = !fechaHasta || new Date(r.fecha) <= new Date(fechaHasta);
    return cumpleBusqueda && cumpleEstado && cumpleDesde && cumpleHasta;
  });

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

  // Acciones: ver, editar, eliminar
  const handleVer = (registro) => {
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
  const handleEliminar = (registro) => {
    setConfirmDialog({ open: true, registro });
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
  const handleConfirmEliminar = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/registros/${confirmDialog.registro.id}`, {
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
    } finally {
      setConfirmDialog({ open: false, registro: null });
    }
  };

  return (
    <LayoutEmpleado>
      <Paper elevation={6} sx={{ borderRadius: 3, p: 4, maxWidth: 1400, margin: '0 auto 40px auto', background: 'rgba(255,255,255,0.95)', position: 'relative' }}>
        <Typography variant="h4" fontWeight={700} mb={2} color="#222">
          Mis Registros de Horas Extra
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
            placeholder="Buscar por ubicación, número de registro o justificación"
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
          <TextField
            label="Desde"
            type="date"
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
          />
          <TextField
            label="Hasta"
            type="date"
            value={fechaHasta}
            onChange={e => setFechaHasta(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
          />
          <Button onClick={fetchRegistros} startIcon={<SearchIcon />} variant="outlined" color="primary" sx={{ fontWeight: 700, height: 56 }} disabled={loading}>
            Refrescar
          </Button>
        </Box>
        {mensaje && <Alert severity={mensaje.toLowerCase().includes('exitosamente') ? 'success' : mensaje.toLowerCase().includes('no se pudo') ? 'error' : 'info'} sx={{ mb: 2 }}>{mensaje}</Alert>}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#e3f2fd' }}>
                <TableCell>Fecha</TableCell>
                <TableCell>Horas Extra</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Justificación</TableCell>
                <TableCell>Tipo de Hora</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">No tienes registros de horas extra.</TableCell>
                </TableRow>
              )}
              {registrosFiltrados.map((registro) => {
                const tipoHora = tiposHora.find(tipo => tipo.id === registro.tipoHora);
                return (
                  <TableRow key={registro.id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: '#e3f2fd' } }}>
                    <TableCell>{registro.fecha}</TableCell>
                    <TableCell>{registro.cantidadHorasExtra}</TableCell>
                    <TableCell>{registro.ubicacion}</TableCell>
                    <TableCell>{registro.justificacionHoraExtra}</TableCell>
                    <TableCell>
                      {registro.Horas && registro.Horas.length > 0 ? (
                        registro.Horas.map(hora => (
                          <Box key={hora.id}>
                            <Typography variant="body2" fontWeight={600}>{hora.tipo}</Typography>
                            <Typography variant="caption" color="text.secondary">{hora.denominacion}</Typography>
                            <Typography variant="caption" color="text.secondary">Cantidad: {hora.RegistroHora.cantidad}</Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">No asignado</Typography>
                      )}
                    </TableCell>
                    <TableCell>{getEstadoChip(registro.estado)}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleVer(registro)} title="Ver detalles" sx={{ color: 'green' }}>
                        <VisibilityIcon />
                      </IconButton>
                      {registro.estado !== 'aprobado' && (
                        <>
                          <IconButton onClick={() => handleEditar(registro)} title="Editar" sx={{ color: '#1976d2' }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleEliminar(registro)} title="Eliminar" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Última actualización: {new Date(lastUpdate).toLocaleTimeString()}
        </Typography>
        {/* Diálogo de detalles, edición y confirmación de eliminación aquí... */}
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
                  Registro #{registroSeleccionado.numRegistro || registroSeleccionado.id}
                </Typography>
                <Divider sx={{ width: '100%', mb: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%' }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Fecha</Typography>
                    <Typography variant="body1" fontWeight={600}>{registroSeleccionado.fecha}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Horas Extra</Typography>
                    <Typography variant="body1" fontWeight={600}>{registroSeleccionado.cantidadHorasExtra}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Ubicación</Typography>
                    <Typography variant="body1" fontWeight={600}>{registroSeleccionado.ubicacion}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
                    {getEstadoChip(registroSeleccionado.estado)}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Tipo(s) de Hora</Typography>
                    {registroSeleccionado.Horas && registroSeleccionado.Horas.length > 0 ? (
                      registroSeleccionado.Horas.map(hora => (
                        <Box key={hora.id}>
                          <Typography variant="body1" fontWeight={600}>{hora.tipo}</Typography>
                          <Typography variant="caption" color="text.secondary">{hora.denominacion}</Typography>
                          <Typography variant="caption" color="text.secondary">Cantidad: {hora.RegistroHora.cantidad}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body1" fontWeight={600} color="text.secondary">No asignado</Typography>
                    )}
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
            <Button onClick={() => setOpenDialog(false)} variant="contained" color="primary">Cerrar</Button>
            {modo === 'editar' && (
              <Button onClick={handleGuardarEdicion} variant="contained" color="success">
                Guardar
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, registro: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: 'error.main', fontWeight: 700 }}>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography variant="body1" mb={2}>
              ¿Estás seguro que deseas eliminar este registro? Esta acción no se puede deshacer.
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                ⚠️ Esta acción no se puede deshacer
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog({ open: false, registro: null })} variant="outlined">Cancelar</Button>
            <Button onClick={handleConfirmEliminar} variant="contained" color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </LayoutEmpleado>
  );
}

export default MisRegistros;