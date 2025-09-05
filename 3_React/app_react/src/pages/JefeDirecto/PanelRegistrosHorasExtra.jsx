import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, MenuItem, InputAdornment, Avatar, Divider, Chip, Badge, Card, CardContent, Grid, TablePagination } from '@mui/material';
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
import SettingsIcon from '@mui/icons-material/Settings';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import NavbarJefeDirecto from './NavbarJefeDirecto';

function PanelRegistrosHorasExtra() {
  const [registros, setRegistros] = useState([]);
  const [tiposHora, setTiposHora] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [modo, setModo] = useState('ver'); // 'ver', 'editar', 'estado'
  const [editData, setEditData] = useState({});
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', registro: null });
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchRegistros();
    fetchTiposHora();
    fetchUsuarios();
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

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/usuarios');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      setMensaje('No se pudieron cargar los usuarios.');
    }
  };

  const handleVer = async (registro) => {
    setModo('ver');
    setRegistroSeleccionado(registro);
    setOpenDialog(true);
  };

  const handleEditar = (registro) => {
    // Si el estado ya fue modificado (no es pendiente), mostrar solo edición de estado
    if (registro.estado !== 'pendiente') {
      setModo('estado');
      setRegistroSeleccionado(registro);
      setNuevoEstado(registro.estado);
      setOpenDialog(true);
    } else {
      // Si es pendiente, mostrar edición completa
      setModo('editar');
      setRegistroSeleccionado(registro);
      setEditData({
        fecha: registro.fecha,
        horaIngreso: registro.horaIngreso,
        horaSalida: registro.horaSalida,
        ubicacion: registro.ubicacion,
        cantidadHorasExtra: registro.cantidadHorasExtra,
        justificacionHoraExtra: registro.justificacionHoraExtra || '',
        horas_extra_divididas: registro.horas_extra_divididas ?? 0,
        bono_salarial: registro.bono_salarial ?? 0,
        tipoHora: (registro.Horas && registro.Horas.length > 0) ? registro.Horas[0].id : '',
      });
      setOpenDialog(true);
    }
  };

  const handleAprobar = (registro) => {
    showConfirmDialog('aprobar', registro);
  };

  const handleRechazar = (registro) => {
    showConfirmDialog('rechazar', registro);
  };

  const handleEliminar = (registro) => {
    showConfirmDialog('eliminar', registro);
  };

  const handleGuardarEdicion = async () => {
    try {
      const dataToSend = {
        ...editData,
        horas: [
          {
            id: editData.tipoHora,
            cantidad: editData.cantidadHorasExtra
          }
        ]
      };
      delete dataToSend.tipoHora;
      delete dataToSend.bono_salarial;

      const response = await fetch(`http://localhost:3000/api/registros/${registroSeleccionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
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

  const handleGuardarEstado = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/registros/${registroSeleccionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!response.ok) {
        setMensaje('No se pudo actualizar el estado del registro.');
        return;
      }
      setMensaje('Estado del registro actualizado exitosamente.');
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

  // Paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const registrosPaginados = registrosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const showConfirmDialog = (action, registro) => {
    setConfirmDialog({ open: true, action, registro });
  };

  const handleConfirmAction = async () => {
    const { action, registro } = confirmDialog;
    
    try {
      let response;
      let message = '';
      
      switch (action) {
        case 'aprobar':
          response = await fetch(`http://localhost:3000/api/registros/${registro.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'aprobado' }),
          });
          message = 'Registro aprobado exitosamente.';
          break;
          
        case 'rechazar':
          response = await fetch(`http://localhost:3000/api/registros/${registro.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'rechazado' }),
          });
          message = 'Registro rechazado exitosamente.';
          break;
          
        case 'eliminar':
          response = await fetch(`http://localhost:3000/api/registros/${registro.id}`, {
            method: 'DELETE',
          });
          message = 'Registro eliminado exitosamente.';
          break;
      }
      
      if (!response.ok) {
        setMensaje(`No se pudo ${action} el registro.`);
        return;
      }
      
      setMensaje(message);
      fetchRegistros();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    } finally {
      setConfirmDialog({ open: false, action: '', registro: null });
    }
  };

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
          onClick={() => navigate('/crear-registros-horas-extra')}
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
                <TableCell>Nombres</TableCell>
                <TableCell>Apellidos</TableCell>
                <TableCell>Número de Documento</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Horas Extra</TableCell>
                <TableCell>Tipo de Hora</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrosPaginados.map(registro => {
                // Buscar el tipo de hora correspondiente
                const tipoHora = tiposHora.find(tipo => tipo.id === registro.tipoHora);
                const usuario = usuarios.find(u => u.email === registro.usuario);
                
                return (
                  <TableRow key={registro.id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: '#e3f2fd' } }}>
                    <TableCell>{usuario?.persona?.nombres || registro.nombres || 'N/A'}</TableCell>
                    <TableCell>{usuario?.persona?.apellidos || registro.apellidos || 'N/A'}</TableCell>
                    <TableCell>{usuario?.persona?.numeroDocumento || registro.numeroDocumento || 'N/A'}</TableCell>
                    <TableCell>{registro.fecha}</TableCell>
                    <TableCell>{registro.cantidadHorasExtra} hrs</TableCell>
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
              );
              })}
              {registrosFiltrados.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center">No hay registros de horas extra.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={registrosFiltrados.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Dialogo para ver/editar registro */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {modo === 'ver' && <AccessTimeIcon sx={{ fontSize: 36, color: '#1976d2' }} />}
          {modo === 'ver' ? 'Detalles del Registro' : modo === 'editar' ? 'Editar Registro' : 'Cambiar Estado del Registro'}
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
              
              {/* Buscar el usuario correspondiente */}
              {(() => {
                const usuario = usuarios.find(u => u.email === registroSeleccionado.usuario);
                return (
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%' }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Empleado</Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {usuario?.persona?.nombres || registroSeleccionado.nombres || 'N/A'} {usuario?.persona?.apellidos || registroSeleccionado.apellidos || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {usuario?.persona?.tipoDocumento || registroSeleccionado.tipoDocumento || 'N/A'}: {usuario?.persona?.numeroDocumento || registroSeleccionado.numeroDocumento || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {registroSeleccionado.usuario}
                      </Typography>
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
                      <Typography variant="subtitle2" color="text.secondary">Tipo(s) de Hora</Typography>
                      {registroSeleccionado.Horas && registroSeleccionado.Horas.length > 0 ? (
                        registroSeleccionado.Horas.map(hora => (
                          <Box key={hora.id}>
                            <Typography variant="body1" fontWeight={600}>{hora.tipo}</Typography>
                            <Typography variant="caption" color="text.secondary">{hora.denominacion} ({(hora.valor - 1) * 100}% recargo)</Typography>
                            <Typography variant="caption" color="text.secondary">Cantidad: {hora.RegistroHora.cantidad}</Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body1" fontWeight={600} color="text.secondary">No asignado</Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
                      {getEstadoChip(registroSeleccionado.estado)}
                    </Box>
                    {/* CAMPOS NUEVOS CON EL MISMO DISEÑO */}
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Horas Extra (reporte)</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.horas_extra_divididas ?? 0} horas</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Bono Salarial</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.bono_salarial ?? 0} horas</Typography>
                    </Box>
                  </Box>
                );
              })()}
              
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
          {registroSeleccionado && modo === 'estado' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Typography variant="h6" fontWeight={600} color="#1976d2" mb={2}>
                Registro #{registroSeleccionado.numRegistro}
              </Typography>
              {(() => {
                const usuario = usuarios.find(u => u.email === registroSeleccionado.usuario);
                return (
                  <>
                    <Typography variant="body1" mb={2}>
                      <strong>Empleado:</strong> {usuario?.persona?.nombres || registroSeleccionado.nombres || 'N/A'} {usuario?.persona?.apellidos || registroSeleccionado.apellidos || 'N/A'}
                    </Typography>
                    <Typography variant="body2" mb={1} color="text.secondary">
                      <strong>Documento:</strong> {usuario?.persona?.tipoDocumento || registroSeleccionado.tipoDocumento || 'N/A'}: {usuario?.persona?.numeroDocumento || registroSeleccionado.numeroDocumento || 'N/A'}
                    </Typography>
                    <Typography variant="body2" mb={2} color="text.secondary">
                      <strong>Email:</strong> {registroSeleccionado.usuario}
                    </Typography>
                  </>
                );
              })()}
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Este registro ya ha sido procesado. Solo puedes cambiar su estado.
                </Typography>
              </Alert>
              <TextField
                select
                label="Nuevo Estado"
                value={nuevoEstado}
                onChange={e => setNuevoEstado(e.target.value)}
                fullWidth
                required
              >
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="aprobado">Aprobado</MenuItem>
                <MenuItem value="rechazado">Rechazado</MenuItem>
              </TextField>
            </Box>
          )}
          
          {registroSeleccionado && modo === 'editar' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <Card sx={{ p: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)', border: '1px solid #dee2e6' }}>
                <Typography variant="h6" fontWeight={700} color="#495057" sx={{ mb: 3 }}>
                  Información del Registro
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
              <TextField
                label="Fecha"
                type="date"
                value={editData.fecha}
                onChange={e => setEditData({ ...editData, fecha: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Ubicación"
                      value={editData.ubicacion}
                      onChange={e => setEditData({ ...editData, ubicacion: e.target.value })}
                      fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                <TextField
                  label="Hora de Ingreso"
                  type="time"
                  value={editData.horaIngreso}
                  onChange={e => setEditData({ ...editData, horaIngreso: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                />
                  </Grid>
                  <Grid item xs={12} md={6}>
                <TextField
                  label="Hora de Salida"
                  type="time"
                  value={editData.horaSalida}
                  onChange={e => setEditData({ ...editData, horaSalida: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
              />
                  </Grid>
                  <Grid item xs={12} md={6}>
              <TextField
                label="Cantidad de Horas Extra"
                type="number"
                value={editData.cantidadHorasExtra}
                onChange={e => setEditData({ ...editData, cantidadHorasExtra: parseFloat(e.target.value) })}
                fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                      inputProps={{ min: 1, step: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Tipo de Hora Extra"
                      value={editData.tipoHora || ''}
                      onChange={e => setEditData({ ...editData, tipoHora: e.target.value })}
                      fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                    >
                      {tiposHora.map(tipo => (
                        <MenuItem key={tipo.id} value={tipo.id}>
                          {tipo.tipo} - {tipo.denominacion} ({(tipo.valor - 1) * 100}% recargo)
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Horas Extra (reporte)"
                      type="number"
                      value={editData.horas_extra_divididas ?? 0}
                      onChange={e => setEditData({ ...editData, horas_extra_divididas: parseFloat(e.target.value) })}
                      fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                      inputProps={{ min: 0, step: 0.01 }}
                      helperText="Máximo 2 horas por registro para reporte"
                    />
                  </Grid>
                  <Grid item xs={12}>
              <TextField
                label="Justificación"
                value={editData.justificacionHoraExtra}
                onChange={e => setEditData({ ...editData, justificacionHoraExtra: e.target.value })}
                multiline
                rows={3}
                fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
              />
                  </Grid>
                </Grid>
              </Card>
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
          {modo === 'estado' && (
            <Button onClick={handleGuardarEstado} variant="contained" color="primary">
              Cambiar Estado
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmación Personalizado */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => setConfirmDialog({ open: false, action: '', registro: null })}
        maxWidth="sm" 
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <Card sx={{ 
            background: confirmDialog.action === 'eliminar' 
              ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)' 
              : confirmDialog.action === 'aprobar'
              ? 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)'
              : 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
            border: confirmDialog.action === 'eliminar' 
              ? '2px solid #f44336' 
              : confirmDialog.action === 'aprobar'
              ? '2px solid #4caf50'
              : '2px solid #ff9800'
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                {confirmDialog.action === 'eliminar' ? (
                  <WarningIcon sx={{ fontSize: 64, color: '#f44336' }} />
                ) : confirmDialog.action === 'aprobar' ? (
                  <CheckCircleIcon sx={{ fontSize: 64, color: '#4caf50' }} />
                ) : (
                  <CancelIcon sx={{ fontSize: 64, color: '#ff9800' }} />
                )}
              </Box>
              
              <Typography variant="h5" fontWeight={700} mb={2} color="#333">
                {confirmDialog.action === 'eliminar' ? 'Confirmar Eliminación' :
                 confirmDialog.action === 'aprobar' ? 'Confirmar Aprobación' : 'Confirmar Rechazo'}
              </Typography>
              
              <Typography variant="body1" mb={3} color="#666">
                ¿Estás seguro que deseas{' '}
                <strong>
                  {confirmDialog.action === 'eliminar' ? 'ELIMINAR' :
                   confirmDialog.action === 'aprobar' ? 'APROBAR' : 'RECHAZAR'}
                </strong>{' '}
                el registro del empleado{' '}
                <strong>
                  {confirmDialog.registro?.persona?.nombres} {confirmDialog.registro?.persona?.apellidos}
                </strong>?
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
                  onClick={() => setConfirmDialog({ open: false, action: '', registro: null })}
                  sx={{ px: 4, py: 1.5, fontWeight: 600 }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirmAction}
                  sx={{ 
                    px: 4, 
                    py: 1.5, 
                    fontWeight: 600,
                    background: confirmDialog.action === 'eliminar' 
                      ? '#f44336' 
                      : confirmDialog.action === 'aprobar'
                      ? '#4caf50'
                      : '#ff9800',
                    '&:hover': {
                      background: confirmDialog.action === 'eliminar' 
                        ? '#d32f2f' 
                        : confirmDialog.action === 'aprobar'
                        ? '#388e3c'
                        : '#f57c00'
                    }
                  }}
                >
                  {confirmDialog.action === 'eliminar' ? 'Eliminar' :
                   confirmDialog.action === 'aprobar' ? 'Aprobar' : 'Rechazar'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default PanelRegistrosHorasExtra; 