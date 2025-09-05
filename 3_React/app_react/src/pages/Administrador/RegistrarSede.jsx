import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  useMediaQuery,
  Chip,
  FormControlLabel,
  Switch,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NavbarAdminstrativo from './NavbarAdminstrativo';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WorkIcon from '@mui/icons-material/Work';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';

function RegistrarSede() {
  // Sede fields
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState(true);
  const [descripcion, setDescripcion] = useState('');
  
  // HorarioSede management
  const [horariosCreados, setHorariosCreados] = useState([]);
  const [openHorarioDialog, setOpenHorarioDialog] = useState(false);
  const [openSelectHorarioDialog, setOpenSelectHorarioDialog] = useState(false);
  const [existingHorarios, setExistingHorarios] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [errorExisting, setErrorExisting] = useState('');
  const [sedesAll, setSedesAll] = useState([]);
  
  // New HorarioSede fields
  const [nuevoHorario, setNuevoHorario] = useState({
    nombre: '',
    tipo: 'normal',
    horaEntrada: '',
    horaSalida: '',
    horasJornada: 8,
    tiempoAlmuerzo: 60,
    diasTrabajados: 5,
    activo: true,
    descripcion: ''
  });
  
  // UI states
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [mensajeHorario, setMensajeHorario] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tiposHorario = [
    { value: 'normal', label: 'Normal' },
    { value: 'nocturno', label: 'Nocturno' },
    { value: 'especial', label: 'Especial' },
    { value: 'festivo', label: 'Festivo' }
  ];

  // Calculate horasJornadaReal when horasJornada or tiempoAlmuerzo changes
  const calcularHorasJornadaReal = (horasJornada, tiempoAlmuerzo) => {
    return horasJornada - (tiempoAlmuerzo / 60);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setExito(false);

    if (!nombre || !direccion || !ciudad) {
      setMensaje('Por favor, completa los campos obligatorios (nombre, dirección, ciudad).');
      return;
    }

    try {
      const sedeData = {
        nombre,
        direccion,
        ciudad,
        telefono: telefono || null,
        email: email || null,
        estado,
        descripcion: descripcion || null,
        horarios: horariosCreados
      };

      const response = await fetch('http://localhost:3000/api/sedes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sedeData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.message || 'Error al registrar sede');
        return;
      }

      setExito(true);
      setMensaje('¡Sede registrada exitosamente!');
      setTimeout(() => navigate('/sedes'), 2000);
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  const handleCrearHorario = () => {
    setMensajeHorario('');
    
    if (!nuevoHorario.nombre || !nuevoHorario.horaEntrada || !nuevoHorario.horaSalida) {
      setMensajeHorario('Los campos nombre, hora de entrada y hora de salida son requeridos');
      return;
    }

    if (nuevoHorario.horaEntrada >= nuevoHorario.horaSalida) {
      setMensajeHorario('La hora de entrada debe ser menor que la hora de salida');
      return;
    }

    // Check if tipo already exists
    if (horariosCreados.some(h => h.tipo === nuevoHorario.tipo)) {
      setMensajeHorario(`Ya existe un horario de tipo "${nuevoHorario.tipo}" para esta sede`);
      return;
    }

    const horasJornadaReal = calcularHorasJornadaReal(nuevoHorario.horasJornada, nuevoHorario.tiempoAlmuerzo);
    
    const horarioCompleto = {
      ...nuevoHorario,
      horasJornadaReal,
      id: Date.now() // Temporary ID for local management
    };

    setHorariosCreados(prev => [...prev, horarioCompleto]);
    setMensajeHorario('¡Horario agregado exitosamente!');
    setNuevoHorario({
      nombre: '',
      tipo: 'normal',
      horaEntrada: '',
      horaSalida: '',
      horasJornada: 8,
      tiempoAlmuerzo: 60,
      diasTrabajados: 5,
      activo: true,
      descripcion: ''
    });
    
    setTimeout(() => {
      setOpenHorarioDialog(false);
      setMensajeHorario('');
    }, 1500);
  };

  const handleEliminarHorario = (horarioId) => {
    setHorariosCreados(prev => prev.filter(h => h.id !== horarioId));
  };

  const handleHorarioChange = (field, value) => {
    setNuevoHorario(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculate horasJornadaReal if horasJornada or tiempoAlmuerzo changed
      if (field === 'horasJornada' || field === 'tiempoAlmuerzo') {
        updated.horasJornadaReal = calcularHorasJornadaReal(
          field === 'horasJornada' ? value : updated.horasJornada,
          field === 'tiempoAlmuerzo' ? value : updated.tiempoAlmuerzo
        );
      }
      
      return updated;
    });
  };

  // Helper para parsear listas desde diferentes formatos de respuesta
  const parseList = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.items)) return raw.items;
    if (Array.isArray(raw?.horarios)) return raw.horarios;
    return [];
  };

  const openSelectExistingDialog = async () => {
    setOpenSelectHorarioDialog(true);
    setErrorExisting('');
    setLoadingExisting(true);
    try {
      // Iniciar fetch de sedes en paralelo
      const ctrlSedes = new AbortController();
      const sedesTimeout = setTimeout(() => ctrlSedes.abort(), 8000);
      const sedesPromise = fetch('/api/sedes', { signal: ctrlSedes.signal })
        .then(r => Promise.all([Promise.resolve(r), r.json().catch(() => ({}))]))
        .catch(() => [null, null]);

      // Resolver horarios probando rutas candidatas
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 8000);
      const candidates = ['/api/horarioSede', '/api/horarios', '/api/horario-sede', '/api/horarios-sede'];
      let ok = false; let data = {}; let lastStatus = 0;
      for (const url of candidates) {
        const resp = await fetch(url, { signal: controller.signal });
        lastStatus = resp.status;
        let parsed = {};
        try { parsed = await resp.json(); } catch { parsed = {}; }
        if (resp.ok) { ok = true; data = parsed; break; }
      }
      clearTimeout(t);

      // Resolver sedes
      const [respS, dataS] = await sedesPromise;
      clearTimeout(sedesTimeout);
      if (respS && respS.ok) {
        setSedesAll(parseList(dataS));
      }

      if (!ok) {
        setErrorExisting(`No se pudieron cargar los horarios existentes (HTTP ${lastStatus})`);
        setExistingHorarios([]);
      } else {
        setExistingHorarios(parseList(data));
      }
    } catch (e) {
      setErrorExisting(e?.name === 'AbortError' ? 'Tiempo de espera agotado al cargar horarios' : (e?.message || 'No se pudo conectar con el servidor.'));
      setExistingHorarios([]);
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleAgregarHorarioExistente = (h) => {
    // Evitar duplicar tipo en la lista local
    const yaExisteTipo = (horariosCreados || []).some(x => x.tipo === h.tipo);
    if (yaExisteTipo) {
      setErrorExisting(`Ya agregaste un horario de tipo "${h.tipo}"`);
      return;
    }
    // Clonar horario existente para uso local en el registro
    const jornada = Number(h.horasJornada ?? 0);
    const almuerzo = Number(h.tiempoAlmuerzo ?? 0);
    const calcReal = (total, lunch) => {
      const real = (Number(total) || 0) - ((Number(lunch) || 0) / 60);
      return Math.max(0, Number.isFinite(real) ? real : 0);
    };
    const clone = {
      nombre: h.nombre,
      tipo: h.tipo,
      horaEntrada: h.horaEntrada,
      horaSalida: h.horaSalida,
      horasJornada: jornada,
      tiempoAlmuerzo: almuerzo,
      horasJornadaReal: h.horasJornadaReal ?? calcReal(jornada, almuerzo),
      diasSeleccionados: Array.isArray(h.diasSeleccionados) ? h.diasSeleccionados : [],
      diasTrabajados: (h.diasSeleccionados?.length ?? h.diasTrabajados ?? 0),
      descripcion: h.descripcion || '',
      activo: !!h.activo,
      id: Date.now() + Math.random() // id temporal local
    };
    setHorariosCreados(prev => [...prev, clone]);
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
            minWidth: { xs: '95vw', sm: 600 },
            maxWidth: { xs: '99vw', sm: 800 },
            width: { xs: '99vw', sm: 800 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.97)',
            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.10)',
            position: 'relative',
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/sedes')}
            sx={{
              position: 'absolute',
              left: 16,
              top: 16,
              color: '#1976d2',
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Volver
          </Button>

          <Typography variant="h4" fontWeight={700} mb={2} color="#1976d2" textAlign="center">
            Registrar Sede
          </Typography>

          {mensaje && (
            <Alert severity={exito ? 'success' : 'error'} sx={{ mb: 2, width: '100%' }}>
              {mensaje}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 1 }}
            autoComplete="off"
          >
            {/* Información básica de la sede */}
            <Typography variant="h6" fontWeight={600} color="#1976d2" sx={{ alignSelf: 'flex-start', mb: 1 }}>
              Información de la Sede
            </Typography>

            <TextField
              label="Nombre de la sede *"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <BusinessIcon sx={{ color: '#1976d2', mr: 1 }} />
                ),
              }}
            />

            <TextField
              label="Dirección completa *"
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              multiline
              rows={2}
              required
              InputProps={{
                startAdornment: (
                  <LocationOnIcon sx={{ color: '#1976d2', mr: 1 }} />
                ),
              }}
            />

            <TextField
              label="Ciudad *"
              value={ciudad}
              onChange={e => setCiudad(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <LocationCityIcon sx={{ color: '#1976d2', mr: 1 }} />
                ),
              }}
            />

            <TextField
              label="Teléfono"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              InputProps={{
                startAdornment: (
                  <PhoneIcon sx={{ color: '#1976d2', mr: 1 }} />
                ),
              }}
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              InputProps={{
                startAdornment: (
                  <EmailIcon sx={{ color: '#1976d2', mr: 1 }} />
                ),
              }}
            />

            <TextField
              label="Descripción"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              multiline
              rows={3}
              InputProps={{
                startAdornment: (
                  <DescriptionIcon sx={{ color: '#1976d2', mr: 1 }} />
                ),
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={estado}
                  onChange={e => setEstado(e.target.checked)}
                  color="primary"
                />
              }
              label="Sede activa"
              sx={{ alignSelf: 'flex-start', mt: 1 }}
            />

            <Divider sx={{ width: '100%', my: 2 }} />

            {/* Gestión de horarios de sede */}
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600} color="#1976d2">
                  Horarios de la Sede
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setOpenHorarioDialog(true)}
                  variant="outlined"
                  color="primary"
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Agregar Horario
                </Button>
                <Button
                  startIcon={<LibraryAddOutlinedIcon />}
                  onClick={openSelectExistingDialog}
                  variant="outlined"
                  color="secondary"
                  sx={{ borderRadius: 2, textTransform: 'none', ml: 1 }}
                >
                  Asignar horario existente
                </Button>
              </Box>

              {/* Horarios creados */}
              {horariosCreados.length > 0 ? (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Horarios configurados:
                  </Typography>
                  <List dense sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    {horariosCreados.map(horario => (
                      <ListItem key={horario.id}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={horario.tipo}
                                color="primary"
                                size="small"
                                variant="outlined"
                              />
                              <Typography fontWeight={600}>{horario.nombre}</Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                {horario.horaEntrada} - {horario.horaSalida} | 
                                Jornada: {horario.horasJornada}h | 
                                Real: {horario.horasJornadaReal}h | 
                                Días: {horario.diasTrabajados}
                              </Typography>
                              {horario.descripcion && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                  {horario.descripcion}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleEliminarHorario(horario.id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3, border: '1px dashed #ccc', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay horarios configurados para esta sede
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Agrega al menos un horario para completar el registro
                  </Typography>
                </Box>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={horariosCreados.length === 0}
              sx={{ 
                mt: 3, 
                borderRadius: 3, 
                fontWeight: 700, 
                fontSize: '1.1rem', 
                width: '100%', 
                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.10)' 
              }}
            >
              Registrar Sede
            </Button>
          </Box>

          {/* Dialog para crear nuevo horario de sede */}
          <Dialog open={openHorarioDialog} onClose={() => setOpenHorarioDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ color: '#1976d2', fontWeight: 700 }}>
              Crear Horario de Sede
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                  label="Nombre del horario *"
                  value={nuevoHorario.nombre}
                  onChange={e => handleHorarioChange('nombre', e.target.value)}
                  fullWidth
                  required
                  placeholder="ej: Horario Administrativo, Horario Operativo"
                  InputProps={{
                    startAdornment: <ScheduleIcon sx={{ color: '#1976d2', mr: 1 }} />
                  }}
                />

                <TextField
                  select
                  label="Tipo de horario *"
                  value={nuevoHorario.tipo}
                  onChange={e => handleHorarioChange('tipo', e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <WorkIcon sx={{ color: '#1976d2', mr: 1 }} />
                  }}
                >
                  {tiposHorario.map(tipo => (
                    <MenuItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </MenuItem>
                  ))}
                </TextField>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Hora de entrada *"
                    type="time"
                    value={nuevoHorario.horaEntrada}
                    onChange={e => handleHorarioChange('horaEntrada', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                  />

                  <TextField
                    label="Hora de salida *"
                    type="time"
                    value={nuevoHorario.horaSalida}
                    onChange={e => handleHorarioChange('horaSalida', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Horas de jornada"
                    type="number"
                    value={nuevoHorario.horasJornada}
                    onChange={e => handleHorarioChange('horasJornada', parseFloat(e.target.value) || 0)}
                    fullWidth
                    inputProps={{ min: 1, max: 24, step: 0.5 }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">horas</InputAdornment>
                    }}
                  />

                  <TextField
                    label="Tiempo de almuerzo"
                    type="number"
                    value={nuevoHorario.tiempoAlmuerzo}
                    onChange={e => handleHorarioChange('tiempoAlmuerzo', parseInt(e.target.value) || 0)}
                    fullWidth
                    inputProps={{ min: 0, max: 180 }}
                    InputProps={{
                      startAdornment: <RestaurantIcon sx={{ color: '#1976d2', mr: 1 }} />,
                      endAdornment: <InputAdornment position="end">min</InputAdornment>
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Horas jornada real"
                    value={calcularHorasJornadaReal(nuevoHorario.horasJornada, nuevoHorario.tiempoAlmuerzo).toFixed(2)}
                    fullWidth
                    disabled
                    InputProps={{
                      endAdornment: <InputAdornment position="end">horas</InputAdornment>
                    }}
                    helperText="Se calcula automáticamente"
                  />

                  <TextField
                    label="Días trabajados"
                    type="number"
                    value={nuevoHorario.diasTrabajados}
                    onChange={e => handleHorarioChange('diasTrabajados', parseInt(e.target.value) || 0)}
                    fullWidth
                    inputProps={{ min: 1, max: 7 }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">días</InputAdornment>
                    }}
                  />
                </Box>

                <TextField
                  label="Descripción (opcional)"
                  value={nuevoHorario.descripcion}
                  onChange={e => handleHorarioChange('descripcion', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Descripción adicional del horario..."
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={nuevoHorario.activo}
                      onChange={e => handleHorarioChange('activo', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Horario activo"
                />

                {mensajeHorario && (
                  <Alert 
                    severity={mensajeHorario.includes('exitosamente') ? 'success' : 'error'} 
                    sx={{ mt: 2 }}
                  >
                    {mensajeHorario}
                  </Alert>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => {
                  setOpenHorarioDialog(false);
                  setMensajeHorario('');
                  setNuevoHorario({
                    nombre: '',
                    tipo: 'normal',
                    horaEntrada: '',
                    horaSalida: '',
                    horasJornada: 8,
                    tiempoAlmuerzo: 60,
                    diasTrabajados: 5,
                    activo: true,
                    descripcion: ''
                  });
                }} 
                sx={{ color: '#1976d2', fontWeight: 700 }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCrearHorario} 
                variant="contained" 
                color="primary" 
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                Agregar Horario
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog para seleccionar/asignar horario existente */}
          <Dialog open={openSelectHorarioDialog} onClose={() => setOpenSelectHorarioDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ color: '#1976d2', fontWeight: 700 }}>
              Asignar horario existente
            </DialogTitle>
            <DialogContent>
              {loadingExisting ? (
                <Typography variant="body2" color="text.secondary">Cargando horarios...</Typography>
              ) : errorExisting ? (
                <Alert severity="error">{errorExisting}</Alert>
              ) : existingHorarios.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No hay horarios guardados disponibles.</Typography>
              ) : (
                <List dense sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  {existingHorarios.map(h => (
                    <ListItem key={h.id} alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label={h.tipo} color="primary" size="small" variant="outlined" />
                            <Typography fontWeight={600}>{h.nombre}</Typography>
                            {!h.activo && <Chip label="Inactivo" color="default" size="small" />}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {h.horaEntrada} - {h.horaSalida} | Jornada: {Number(h.horasJornada).toFixed(2)}h | Real: {Number(h.horasJornadaReal ?? 0).toFixed(2)}h | Días: {(h.diasSeleccionados?.length ?? h.diasTrabajados ?? 0)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Origen: {sedesAll.find(s => s.id === h.sedeId)?.nombre || `Sede ${h.sedeId ?? '-'}`}
                            </Typography>
                            {Array.isArray(h.diasSeleccionados) && h.diasSeleccionados.length > 0 && (
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                {h.diasSeleccionados.map(d => (
                                  <Chip key={d} label={d} size="small" />
                                ))}
                              </Box>
                            )}
                            {h.descripcion && (
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                {h.descripcion}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Button size="small" variant="contained" onClick={() => handleAgregarHorarioExistente(h)}>Añadir</Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenSelectHorarioDialog(false)} sx={{ color: '#1976d2', fontWeight: 700 }}>Cerrar</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </Box>
  );
}

export default RegistrarSede;
