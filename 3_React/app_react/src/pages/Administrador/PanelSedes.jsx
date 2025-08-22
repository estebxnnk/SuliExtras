import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Switch,
  FormControlLabel,
  MenuItem,
  Tooltip,
  CircularProgress,
  InputAdornment,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NavbarAdminstrativo from './NavbarAdminstrativo';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WorkIcon from '@mui/icons-material/Work';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';

function PanelSedes() {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);

  // Dialogs and selections
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openHorarioDialog, setOpenHorarioDialog] = useState(false);
  const [openHorariosListDialog, setOpenHorariosListDialog] = useState(false);
  const [openSelectHorarioDialog, setOpenSelectHorarioDialog] = useState(false);

  const [selectedSede, setSelectedSede] = useState(null);

  // Edit Sede form
  const [editForm, setEditForm] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    email: '',
    estado: true,
    descripcion: ''
  });

  // Horario creation form
  const [mensajeHorario, setMensajeHorario] = useState('');
  const [nuevoHorario, setNuevoHorario] = useState({
    nombre: '',
    tipo: 'normal',
    horaEntrada: '',
    horaSalida: '',
    horasJornada: 8,
    tiempoAlmuerzo: 60,
    diasTrabajados: 0,
    diasSeleccionados: [],
    activo: true,
    descripcion: ''
  });

  // Select existing horarios
  const [existingHorarios, setExistingHorarios] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [errorExisting, setErrorExisting] = useState('');

  const tiposHorario = [
    { value: 'normal', label: 'Normal' },
    { value: 'nocturno', label: 'Nocturno' },
    { value: 'especial', label: 'Especial' },
    { value: 'festivo', label: 'Festivo' }
  ];

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchSedes();
  }, []);

  // ===== Helpers =====
  const parseHorariosList = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.horarios)) return raw.horarios;
    if (Array.isArray(raw?.items)) return raw.items;
    return [];
  };

  const calcularHorasJornadaReal = (horasJornada, tiempoAlmuerzo) => {
    return horasJornada - (tiempoAlmuerzo / 60);
  };

  const calcularHorasEntreHorarios = (horaEntrada, horaSalida) => {
    if (!horaEntrada || !horaSalida) return 0;
    const [entradaHoras, entradaMinutos] = String(horaEntrada).split(':').map(Number);
    const [salidaHoras, salidaMinutos] = String(horaSalida).split(':').map(Number);
    const entradaEnMinutos = entradaHoras * 60 + entradaMinutos;
    const salidaEnMinutos = salidaHoras * 60 + salidaMinutos;
    let diferenciaMinutos = salidaEnMinutos - entradaEnMinutos;
    if (diferenciaMinutos < 0) diferenciaMinutos += 24 * 60; // cruza medianoche
    return diferenciaMinutos / 60;
  };

  const validarNuevoHorario = (h) => {
    if (!h.nombre || !h.horaEntrada || !h.horaSalida) {
      return { ok: false, message: 'Los campos nombre, hora de entrada y hora de salida son requeridos' };
    }
    const toMin = (t) => { const [hh, mm] = String(t).split(':').map(Number); return hh * 60 + mm; };
    const ent = toMin(h.horaEntrada);
    const sal = toMin(h.horaSalida);
    const diff = ((sal - ent) + 24 * 60) % (24 * 60);
    if (diff === 0) return { ok: false, message: 'La hora de entrada y salida no pueden ser iguales' };
    if ((h.tiempoAlmuerzo ?? 0) < 0 || (h.tiempoAlmuerzo ?? 0) > 180) {
      return { ok: false, message: 'El tiempo de almuerzo debe estar entre 0 y 180 minutos' };
    }
    return { ok: true };
  };

  const armarPayloadHorario = (h, sedeId) => {
    const horas = calcularHorasEntreHorarios(h.horaEntrada, h.horaSalida);
    const horasJornadaReal = calcularHorasJornadaReal(horas, h.tiempoAlmuerzo ?? 0);
    return {
      nombre: h.nombre,
      tipo: h.tipo || 'normal',
      horaEntrada: h.horaEntrada,
      horaSalida: h.horaSalida,
      horasJornada: horas,
      tiempoAlmuerzo: h.tiempoAlmuerzo ?? 0,
      horasJornadaReal,
      diasTrabajados: (h.diasSeleccionados?.length ?? h.diasTrabajados ?? 0),
      diasSeleccionados: h.diasSeleccionados || [],
      activo: !!h.activo,
      descripcion: h.descripcion || '',
      sedeId,
    };
  };

  const postWithTimeout = async (url, body, timeoutMs = 8000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const data = await resp.json().catch(() => ({}));
      return { resp, data };
    } finally {
      clearTimeout(timer);
    }
  };

  const resetNuevoHorarioState = () => {
    setNuevoHorario({
      nombre: '',
      tipo: 'normal',
      horaEntrada: '',
      horaSalida: '',
      horasJornada: 8,
      tiempoAlmuerzo: 60,
      diasTrabajados: 0,
      diasSeleccionados: [],
      activo: true,
      descripcion: ''
    });
  };

  // ===== Data fetching =====
  const fetchSedes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/sedes');
      const data = await response.json();
      setSedes(data);
      setExito(false);
      setMensaje('');
    } catch (error) {
      setMensaje('Error al cargar las sedes');
      setExito(false);
    } finally {
      setLoading(false);
    }
  };

  // ===== Sede CRUD =====
  const handleEdit = (sede) => {
    setSelectedSede(sede);
    setEditForm({
      nombre: sede.nombre || '',
      direccion: sede.direccion || '',
      ciudad: sede.ciudad || '',
      telefono: sede.telefono || '',
      email: sede.email || '',
      estado: !!sede.estado,
      descripcion: sede.descripcion || ''
    });
    setOpenEditDialog(true);
  };

  const handleDelete = (sede) => {
    setSelectedSede(sede);
    setOpenDeleteDialog(true);
  };

  const handleUpdateSede = async () => {
    setMensaje('');
    setExito(false);

    if (!editForm.nombre || !editForm.direccion || !editForm.ciudad) {
      setMensaje('Los campos nombre, dirección y ciudad son obligatorios');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/sedes/${selectedSede.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          telefono: editForm.telefono || null,
          email: editForm.email || null,
          descripcion: editForm.descripcion || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.message || 'Error al actualizar la sede');
        return;
      }

      setExito(true);
      setMensaje('¡Sede actualizada exitosamente!');
      setOpenEditDialog(false);
      fetchSedes();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor');
    }
  };

  const handleDeleteSede = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/sedes/${selectedSede.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        setMensaje(data.message || 'Error al eliminar la sede');
        setExito(false);
        return;
      }

      setExito(true);
      setMensaje('¡Sede eliminada exitosamente!');
      setOpenDeleteDialog(false);
      fetchSedes();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor');
      setExito(false);
    }
  };

  // ===== Horario create/assign =====
  const handleAgregarHorario = (sede) => {
    setSelectedSede(sede);
    setOpenHorarioDialog(true);
  };

  const handleVerHorarios = (sede) => {
    setSelectedSede(sede);
    setOpenHorariosListDialog(true);
  };

  const handleHorarioChange = (field, value) => {
    setNuevoHorario(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'horasJornada' || field === 'tiempoAlmuerzo') {
        updated.horasJornadaReal = calcularHorasJornadaReal(
          field === 'horasJornada' ? value : updated.horasJornada,
          field === 'tiempoAlmuerzo' ? value : updated.tiempoAlmuerzo
        );
      } else if (field === 'horaEntrada' || field === 'horaSalida') {
        updated.horasJornada = calcularHorasEntreHorarios(updated.horaEntrada, updated.horaSalida);
      }
      return updated;
    });
  };

  const handleCrearHorarioSede = async () => {
    setMensajeHorario('');

    const { ok, message } = validarNuevoHorario(nuevoHorario);
    if (!ok) {
      setMensajeHorario(message);
      return;
    }

    try {
      const payload = armarPayloadHorario(nuevoHorario, selectedSede.id);
      const { resp, data } = await postWithTimeout('http://localhost:3000/api/horarios-sede', payload, 8000);

      if (!resp.ok) {
        setMensajeHorario(data?.message || `Error al crear el horario (HTTP ${resp.status})`);
        return;
      }

      setMensajeHorario('¡Horario creado exitosamente!');
      resetNuevoHorarioState();
      setTimeout(async () => {
        setOpenHorarioDialog(false);
        setMensajeHorario('');
        await fetchSedes();
        setSelectedSede(prev => (sedes || []).find(s => s.id === prev?.id) || prev);
      }, 1200);
    } catch (error) {
      setMensajeHorario(error?.name === 'AbortError' ? 'Tiempo de espera agotado' : 'No se pudo conectar con el servidor.');
    }
  };

  const openSelectExistingDialog = async () => {
    setOpenSelectHorarioDialog(true);
    setErrorExisting('');
    setLoadingExisting(true);
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch('http://localhost:3000/api/horarios-sede', { signal: controller.signal });
      const data = await resp.json().catch(() => ({}));
      clearTimeout(t);
      if (!resp.ok) {
        setErrorExisting(`No se pudieron cargar los horarios (HTTP ${resp.status})`);
        setExistingHorarios([]);
      } else {
        setExistingHorarios(parseHorariosList(data));
      }
    } catch (e) {
      setErrorExisting(e?.name === 'AbortError' ? 'Tiempo de espera agotado al cargar horarios' : (e?.message || 'No se pudo conectar con el servidor'));
      setExistingHorarios([]);
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleAsignarHorarioExistente = async (h) => {
    if (!selectedSede) return;
    try {
      const payload = armarPayloadHorario(h, selectedSede.id);
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch('http://localhost:3000/api/horarios-sede', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const data = await resp.json().catch(() => ({}));
      clearTimeout(t);
      if (!resp.ok) {
        setMensaje(`${data.message || 'Error al asignar horario'} (HTTP ${resp.status})`);
        setExito(false);
        return;
      }
      setExito(true);
      setMensaje('¡Horario asignado exitosamente!');
      setOpenSelectHorarioDialog(false);
      await fetchSedes();
      setSelectedSede(prev => (sedes || []).find(s => s.id === (prev?.id)) || prev);
    } catch (e) {
      setMensaje(e?.name === 'AbortError' ? 'Tiempo de espera agotado al asignar horario' : (e?.message || 'No se pudo conectar con el servidor'));
      setExito(false);
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
      <NavbarAdminstrativo />

      <Box sx={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mt: { xs: 14, sm: 16 } }}>
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            p: { xs: 2, sm: 4 },
            minWidth: { xs: '95vw', sm: '90vw' },
            maxWidth: { xs: '99vw', sm: '95vw' },
            width: { xs: '99vw', sm: '95vw' },
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255,255,255,0.97)',
            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.10)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700} color="#1976d2">
              Gestión de Sedes
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/registrar-sede')}
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                px: 3,
                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.10)'
              }}
            >
              Nueva Sede
            </Button>
          </Box>

          {mensaje && (
            <Alert severity={exito ? 'success' : 'error'} sx={{ mb: 2 }}>
              {mensaje}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Ciudad</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Dirección</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Contacto</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sedes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          No hay sedes registradas
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sedes.map((sede) => (
                      <TableRow key={sede.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                            <Typography fontWeight={600}>{sede.nombre}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationCityIcon sx={{ color: '#666', fontSize: 18 }} />
                            {sede.ciudad}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={sede.direccion}>
                            <Typography variant="body2" sx={{ 
                              maxWidth: 200, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {sede.direccion}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {sede.telefono && (
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PhoneIcon sx={{ fontSize: 14 }} />
                                {sede.telefono}
                              </Typography>
                            )}
                            {sede.email && (
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 14 }} />
                                {sede.email}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={sede.estado ? <CheckCircleIcon /> : <CancelIcon />}
                            label={sede.estado ? 'Activa' : 'Inactiva'}
                            color={sede.estado ? 'success' : 'error'}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Editar sede">
                              <IconButton color="primary" onClick={() => handleEdit(sede)} size="small">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Agregar horario">
                              <IconButton color="success" onClick={() => handleAgregarHorario(sede)} size="small">
                                <AddIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar sede">
                              <IconButton color="error" onClick={() => handleDelete(sede)} size="small">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Ver horarios">
                              <IconButton color="info" onClick={() => handleVerHorarios(sede)} size="small">
                                <ScheduleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Asignar horario existente">
                              <IconButton color="secondary" onClick={() => { setSelectedSede(sede); openSelectExistingDialog(); }} size="small">
                                <LibraryAddOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Dialog Editar Sede */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#1976d2', fontWeight: 700 }}>
          Editar Sede: {selectedSede?.nombre}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre de la sede *"
              value={editForm.nombre}
              onChange={e => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
              fullWidth
              required
              InputProps={{ startAdornment: <BusinessIcon sx={{ color: '#1976d2', mr: 1 }} /> }}
            />

            <TextField
              label="Dirección completa *"
              value={editForm.direccion}
              onChange={e => setEditForm(prev => ({ ...prev, direccion: e.target.value }))}
              fullWidth
              multiline
              rows={2}
              required
              InputProps={{ startAdornment: <LocationOnIcon sx={{ color: '#1976d2', mr: 1 }} /> }}
            />

            <TextField
              label="Ciudad *"
              value={editForm.ciudad}
              onChange={e => setEditForm(prev => ({ ...prev, ciudad: e.target.value }))}
              fullWidth
              required
              InputProps={{ startAdornment: <LocationCityIcon sx={{ color: '#1976d2', mr: 1 }} /> }}
            />

            <TextField
              label="Teléfono"
              value={editForm.telefono}
              onChange={e => setEditForm(prev => ({ ...prev, telefono: e.target.value }))}
              fullWidth
              InputProps={{ startAdornment: <PhoneIcon sx={{ color: '#1976d2', mr: 1 }} /> }}
            />

            <TextField
              label="Email"
              type="email"
              value={editForm.email}
              onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              fullWidth
              InputProps={{ startAdornment: <EmailIcon sx={{ color: '#1976d2', mr: 1 }} /> }}
            />

            <TextField
              label="Descripción"
              value={editForm.descripcion}
              onChange={e => setEditForm(prev => ({ ...prev, descripcion: e.target.value }))}
              fullWidth
              multiline
              rows={2}
              InputProps={{ startAdornment: <DescriptionIcon sx={{ color: '#1976d2', mr: 1 }} /> }}
            />

            <FormControlLabel
              control={<Switch checked={editForm.estado} onChange={e => setEditForm(prev => ({ ...prev, estado: e.target.checked }))} color="primary" />}
              label="Sede activa"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} sx={{ color: '#1976d2', fontWeight: 700 }}>Cancelar</Button>
          <Button onClick={handleUpdateSede} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700 }}>Actualizar Sede</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Confirmar Eliminación */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 700 }}>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar la sede "{selectedSede?.nombre}"?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Esta acción no se puede deshacer y eliminará todos los horarios asociados.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: '#1976d2', fontWeight: 700 }}>Cancelar</Button>
          <Button onClick={handleDeleteSede} variant="contained" color="error" sx={{ borderRadius: 2, fontWeight: 700 }}>Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Crear Horario */}
      <Dialog open={openHorarioDialog} onClose={() => setOpenHorarioDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#1976d2', fontWeight: 700 }}>Agregar Horario a: {selectedSede?.nombre}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre del horario *"
              value={nuevoHorario.nombre}
              onChange={e => handleHorarioChange('nombre', e.target.value)}
              fullWidth
              required
              placeholder="ej: Horario Administrativo, Horario Operativo"
              InputProps={{ startAdornment: <ScheduleIcon sx={{ color: '#1976d2', mr: 1 }} /> }}
            />

            <TextField select label="Tipo de horario *" value={nuevoHorario.tipo} onChange={e => handleHorarioChange('tipo', e.target.value)} fullWidth required InputProps={{ startAdornment: <WorkIcon sx={{ color: '#1976d2', mr: 1 }} /> }}>
              {tiposHorario.map(tipo => (
                <MenuItem key={tipo.value} value={tipo.value}>{tipo.label}</MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Hora de entrada *" type="time" value={nuevoHorario.horaEntrada} onChange={e => handleHorarioChange('horaEntrada', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} required />
              <TextField label="Hora de salida *" type="time" value={nuevoHorario.horaSalida} onChange={e => handleHorarioChange('horaSalida', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} required />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Horas de jornada" type="number" value={Math.floor(calcularHorasEntreHorarios(nuevoHorario.horaEntrada, nuevoHorario.horaSalida))} disabled fullWidth inputProps={{ min: 1, max: 24, step: 1 }} InputProps={{ endAdornment: <InputAdornment position="end">horas</InputAdornment> }} helperText="Se calcula automáticamente (números enteros)" />
              {calcularHorasEntreHorarios(nuevoHorario.horaEntrada, nuevoHorario.horaSalida) % 1 !== 0 && (
                <TextField label="Horas exactas (decimal)" value={calcularHorasEntreHorarios(nuevoHorario.horaEntrada, nuevoHorario.horaSalida).toFixed(2)} disabled fullWidth InputProps={{ endAdornment: <InputAdornment position="end">horas</InputAdornment> }} helperText="Valor exacto con decimales" />
              )}
              <TextField label="Tiempo de almuerzo" type="number" value={nuevoHorario.tiempoAlmuerzo} onChange={e => handleHorarioChange('tiempoAlmuerzo', parseInt(e.target.value) || 0)} fullWidth inputProps={{ min: 0, max: 180 }} InputProps={{ startAdornment: <RestaurantIcon sx={{ color: '#1976d2', mr: 1 }} />, endAdornment: <InputAdornment position="end">min</InputAdornment> }} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Horas jornada real" value={calcularHorasJornadaReal(calcularHorasEntreHorarios(nuevoHorario.horaEntrada, nuevoHorario.horaSalida), nuevoHorario.tiempoAlmuerzo).toFixed(2)} fullWidth disabled InputProps={{ endAdornment: <InputAdornment position="end">horas</InputAdornment> }} helperText="Se calcula automáticamente" />
              <TextField label="Días trabajados" type="number" value={nuevoHorario.diasSeleccionados.length} disabled fullWidth InputProps={{ endAdornment: <InputAdornment position="end">días</InputAdornment> }} helperText="Se calcula a partir de los días seleccionados" />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHorarioDialog(false)} sx={{ color: '#1976d2', fontWeight: 700 }}>Cancelar</Button>
          <Button onClick={handleCrearHorarioSede} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700 }}>Crear</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Ver/Seleccionar Horarios existentes */}
      <Dialog open={openSelectHorarioDialog} onClose={() => setOpenSelectHorarioDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#1976d2', fontWeight: 700 }}>Asignar horario existente</DialogTitle>
        <DialogContent>
          {loadingExisting ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress /></Box>
          ) : errorExisting ? (
            <Alert severity="error">{errorExisting}</Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              {existingHorarios.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No hay horarios para seleccionar.</Typography>
              ) : (
                existingHorarios.map(h => (
                  <Box key={h.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1, border: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography fontWeight={600}>{h.nombre}</Typography>
                      <Typography variant="caption" color="text.secondary">{h.tipo} • {h.horaEntrada} - {h.horaSalida}</Typography>
                    </Box>
                    <Button variant="outlined" size="small" onClick={() => handleAsignarHorarioExistente(h)}>Asignar</Button>
                  </Box>
                ))
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSelectHorarioDialog(false)} sx={{ color: '#1976d2', fontWeight: 700 }}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Lista de horarios de la sede (solo lectura simple) */}
      <Dialog open={openHorariosListDialog} onClose={() => setOpenHorariosListDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#1976d2', fontWeight: 700 }}>Horarios de {selectedSede?.nombre}</DialogTitle>
        <DialogContent>
          {!selectedSede ? (
            <Typography variant="body2" color="text.secondary">No hay sede seleccionada.</Typography>
          ) : (Array.isArray(selectedSede.horariosSedeData) && selectedSede.horariosSedeData.length > 0) ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              {selectedSede.horariosSedeData.map(h => (
                <Box key={h.id} sx={{ p: 1, borderRadius: 1, border: '1px solid #eee' }}>
                  <Typography fontWeight={600}>{h.nombre}</Typography>
                  <Typography variant="caption" color="text.secondary">{h.tipo} • {h.horaEntrada} - {h.horaSalida} • {h.activo ? 'Activo' : 'Inactivo'}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">Esta sede no tiene horarios.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHorariosListDialog(false)} sx={{ color: '#1976d2', fontWeight: 700 }}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PanelSedes;
