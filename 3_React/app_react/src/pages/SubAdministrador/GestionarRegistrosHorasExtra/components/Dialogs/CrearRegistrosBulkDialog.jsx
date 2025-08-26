import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  MenuItem,
  InputAdornment,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  Card,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  AddCircle as AddCircleIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  Schedule as ScheduleIcon,
  Work as WorkIcon,
  AccessTime as AccessTimeIcon,
  Save as SaveIcon,
  ContentCopy as DuplicateIcon,
  Delete as DeleteIcon,
  PlaylistAdd as PlaylistAddIcon,
  ViewWeek as ViewWeekIcon
} from '@mui/icons-material';

const emptyRow = () => ({
  fecha: '',
  horaIngreso: '',
  horaSalida: '',
  ubicacion: '',
  cantidadHorasExtra: '',
  justificacionHoraExtra: '',
  tipoHoraId: ''
});

const CrearRegistrosBulkDialog = ({
  open,
  onClose,
  tiposHora = [],
  usuarios = [],
  onCrearRegistrosBulk,
  loading: loadingProp = false,
  isMobile
}) => {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [rows, setRows] = useState([emptyRow()]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [genOpts, setGenOpts] = useState({
    fechaInicio: '',
    dias: 5,
    soloHabiles: true,
    horaIngreso: '',
    horaSalida: '',
    ubicacion: '',
    tipoHoraId: '',
    justificacionHoraExtra: ''
  });
  const [vistaSemanal, setVistaSemanal] = useState(true);
  const [fechaLunes, setFechaLunes] = useState('');
  const [weekRows, setWeekRows] = useState([
    emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow()
  ]);
  const [weekInclude, setWeekInclude] = useState([true, true, true, true, true, true, true]);

  const usuarioId = useMemo(() => usuarioSeleccionado?.id || null, [usuarioSeleccionado]);

  const handleUsuarioChange = (usuarioIdValue) => {
    const usuario = usuarios.find(u => u.id === usuarioIdValue) || null;
    setUsuarioSeleccionado(usuario);
  };

  const updateRow = (index, field, value) => {
    setRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  const addRow = () => setRows(prev => [...prev, emptyRow()]);
  const removeRow = (index) => setRows(prev => prev.filter((_, i) => i !== index));
  const duplicateRow = (index) => setRows(prev => {
    const copy = { ...prev[index] };
    return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)];
  });

  const calcularHorasExtraRow = (row) => {
    if (!row.horaIngreso || !row.horaSalida) return row.cantidadHorasExtra;
    const [hIn, mIn] = row.horaIngreso.split(':').map(Number);
    const [hOut, mOut] = row.horaSalida.split(':').map(Number);
    let horas = (hOut - hIn) + (mOut - mIn) / 60;
    if (horas < 0) horas += 24;
    horas = Math.max(0, horas - 8);
    return horas > 0 ? horas.toFixed(2) : '0.00';
  };

  // Auto-calc per row when times change
  useEffect(() => {
    setRows(prev => prev.map(r => {
      if (r.horaIngreso && r.horaSalida) {
        const calc = calcularHorasExtraRow(r);
        if (calc !== r.cantidadHorasExtra) {
          return { ...r, cantidadHorasExtra: calc };
        }
      }
      return r;
    }));
  }, [rows.map(r => `${r.horaIngreso}-${r.horaSalida}`).join('|')]);

  const validateRow = (row, index) => {
    if (!row.fecha || !row.horaIngreso || !row.horaSalida || !row.ubicacion || !row.tipoHoraId) {
      throw new Error(`Fila ${index + 1}: campos requeridos incompletos`);
    }

    const f = new Date(row.fecha);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (f > today) throw new Error(`Fila ${index + 1}: la fecha no puede ser futura`);

    if (row.horaIngreso >= row.horaSalida) {
      throw new Error(`Fila ${index + 1}: la hora de salida debe ser mayor a la de ingreso`);
    }

    const cant = parseFloat(row.cantidadHorasExtra);
    if (isNaN(cant) || cant < 0.5) {
      throw new Error(`Fila ${index + 1}: cantidad de horas extra mínima 0.5`);
    }
  };

  const timeToMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  const validateNoOverlaps = (rowsToValidate) => {
    const byDate = rowsToValidate.reduce((acc, row, idx) => {
      if (!row.fecha || !row.horaIngreso || !row.horaSalida) return acc;
      const start = timeToMinutes(row.horaIngreso);
      let end = timeToMinutes(row.horaSalida);
      if (end <= start) end += 24 * 60; // cruza medianoche
      (acc[row.fecha] = acc[row.fecha] || []).push({ start, end, idx });
      return acc;
    }, {});

    for (const fecha of Object.keys(byDate)) {
      const list = byDate[fecha].sort((a, b) => a.start - b.start);
      for (let i = 1; i < list.length; i++) {
        if (list[i].start < list[i - 1].end) {
          const a = list[i - 1].idx + 1;
          const b = list[i].idx + 1;
          throw new Error(`Solapamiento de horas en ${fecha} entre filas ${a} y ${b}`);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setMensaje('');
    setLoading(true);

    try {
      if (!usuarioId) {
        throw new Error('Debes seleccionar un empleado');
      }
      let registros = [];
      if (vistaSemanal) {
        if (!fechaLunes) throw new Error('Selecciona la fecha de Lunes');
        // Construir desde weekRows
        const activos = weekRows
          .map((d, i) => ({ ...d, _i: i }))
          .filter((d, i) => weekInclude[i])
          .filter(d => d.fecha && d.horaIngreso && d.horaSalida && d.ubicacion && d.tipoHoraId);
        if (!activos.length) throw new Error('Completa al menos un día de la semana');
        activos.forEach((r, idx) => validateRow(r, idx));
        validateNoOverlaps(activos);
        registros = activos.map(r => ({
          fecha: r.fecha,
          horaIngreso: r.horaIngreso,
          horaSalida: r.horaSalida,
          ubicacion: r.ubicacion,
          cantidadHorasExtra: parseFloat(r.cantidadHorasExtra || 0),
          justificacionHoraExtra: r.justificacionHoraExtra || '',
          tipoHoraId: r.tipoHoraId ? parseInt(r.tipoHoraId) : undefined
        }));
      } else {
        if (!rows.length) throw new Error('Agrega al menos un registro');
        rows.forEach((row, idx) => validateRow(row, idx));
        validateNoOverlaps(rows);
        registros = rows.map(r => ({
          fecha: r.fecha,
          horaIngreso: r.horaIngreso,
          horaSalida: r.horaSalida,
          ubicacion: r.ubicacion,
          cantidadHorasExtra: parseFloat(r.cantidadHorasExtra),
          justificacionHoraExtra: r.justificacionHoraExtra || '',
          tipoHoraId: r.tipoHoraId ? parseInt(r.tipoHoraId) : undefined
        }));
      }

      const payload = { usuarioId, registros };

      const result = await onCrearRegistrosBulk(payload);
      if (result) {
        setMensaje('¡Registros creados exitosamente!');
        setRows([emptyRow()]);
        setWeekRows([emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow()]);
        setTimeout(() => {
          onClose?.();
          setMensaje('');
        }, 1500);
      }
    } catch (error) {
      setMensaje(error.message || 'Error al crear los registros');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRows([emptyRow()]);
    setUsuarioSeleccionado(null);
    setMensaje('');
    setWeekRows([emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow()]);
    setFechaLunes('');
    setWeekInclude([true, true, true, true, true, true, true]);
    onClose?.();
  };

  const handleGenOptChange = (field, value) => {
    setGenOpts(prev => ({ ...prev, [field]: value }));
  };

  const isWeekend = (date) => {
    const d = date.getDay();
    return d === 0 || d === 6;
  };

  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const generarSemana = () => {
    setMensaje('');
    const { fechaInicio, dias, soloHabiles, horaIngreso, horaSalida, ubicacion, tipoHoraId, justificacionHoraExtra } = genOpts;
    if (!fechaInicio || !horaIngreso || !horaSalida || !ubicacion || !tipoHoraId) {
      setMensaje('Completa los campos de generación: fecha, horas, ubicación y tipo');
      return;
    }
    const start = new Date(fechaInicio);
    const generadas = [];
    let count = 0;
    let offset = 0;
    while (count < Number(dias) && offset < 31) { // tope seguridad
      const d = addDays(start, offset);
      offset += 1;
      if (soloHabiles && isWeekend(d)) continue;
      const base = {
        fecha: formatDate(d),
        horaIngreso,
        horaSalida,
        ubicacion,
        tipoHoraId,
        justificacionHoraExtra: justificacionHoraExtra || ''
      };
      const cantidadHorasExtra = calcularHorasExtraRow(base);
      generadas.push({ ...base, cantidadHorasExtra });
      count += 1;
    }

    if (!generadas.length) {
      setMensaje('No se generaron filas. Verifica rango y filtros.');
      return;
    }

    setRows(generadas);
  };

  // Semana: helpers
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const computeWeekFromMonday = (mondayStr) => {
    if (!mondayStr) return [emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow()];
    const start = new Date(mondayStr);
    const newWeek = new Array(7).fill(0).map((_, i) => ({ ...emptyRow(), fecha: formatDate(addDays(start, i)) }));
    return newWeek;
  };

  useEffect(() => {
    if (vistaSemanal && fechaLunes) {
      setWeekRows(prev => {
        const nueva = computeWeekFromMonday(fechaLunes);
        // mantener horas comunes si existen en genOpts
        return nueva.map((d, i) => ({
          ...d,
          horaIngreso: prev[i]?.horaIngreso || genOpts.horaIngreso || '',
          horaSalida: prev[i]?.horaSalida || genOpts.horaSalida || '',
          ubicacion: prev[i]?.ubicacion || genOpts.ubicacion || '',
          tipoHoraId: prev[i]?.tipoHoraId || genOpts.tipoHoraId || '',
          justificacionHoraExtra: prev[i]?.justificacionHoraExtra || genOpts.justificacionHoraExtra || ''
        }));
      });
    }
  }, [vistaSemanal, fechaLunes]);

  useEffect(() => {
    if (!vistaSemanal) return;
    // recalcular horas extra cuando cambian horas en la semana
    setWeekRows(prev => prev.map(r => {
      if (r.horaIngreso && r.horaSalida) {
        const calc = calcularHorasExtraRow(r);
        if (calc !== r.cantidadHorasExtra) return { ...r, cantidadHorasExtra: calc };
      }
      return r;
    }));
  }, [weekRows.map(r => `${r.horaIngreso}-${r.horaSalida}`).join('|')]);

  const updateWeekCell = (index, field, value) => {
    setWeekRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  const toggleWeekInclude = (index, checked) => {
    setWeekInclude(prev => prev.map((v, i) => i === index ? checked : v));
  };

  const toggleAllWeekInclude = (checked) => {
    setWeekInclude(new Array(7).fill(checked));
  };

  // Resumen
  const { totalHoras, validCount, invalidCount } = useMemo(() => {
    const target = vistaSemanal ? weekRows : rows;
    let total = 0;
    let valid = 0;
    let invalid = 0;
    target.forEach((r, idx) => {
      const hasData = r.fecha || r.horaIngreso || r.horaSalida || r.ubicacion || r.tipoHoraId || r.cantidadHorasExtra;
      if (!hasData) return;
      try {
        validateRow(r, idx);
        valid += 1;
        const c = parseFloat(r.cantidadHorasExtra || 0);
        if (!isNaN(c)) total += c;
      } catch (_) {
        invalid += 1;
      }
    });
    return { totalHoras: total, validCount: valid, invalidCount: invalid };
  }, [vistaSemanal, weekRows, rows]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #4caf50, #45a049)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
          <PlaylistAddIcon />
        </Avatar>
        <Box>
          <Typography variant="h6">
            Crear Registros de Horas Extra (Múltiples)
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Carga y edita varios registros a la vez para un empleado
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {mensaje && (
          <Alert 
            severity={mensaje.includes('exitosamente') ? 'success' : 'error'} 
            sx={{ mb: 3 }}
            onClose={() => setMensaje('')}
          >
            {mensaje}
          </Alert>
        )}

        {/* Resumen */}
        <Card sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #eef2ff 0%, #e3f2fd 100%)', border: '1px solid #bbdefb' }}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon color="primary" />
              <Typography variant="body1"><b>Total horas:</b> {totalHoras.toFixed(2)}</Typography>
            </Box>
            <Typography variant="body1"><b>Válidos:</b> {validCount}</Typography>
            <Typography variant="body1"><b>Inválidos:</b> {invalidCount}</Typography>
          </Box>
        </Card>

        {/* Sección: Empleado */}
        <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', border: '1px solid #dee2e6' }}>
          <Typography variant="h6" fontWeight={700} color="#495057" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ color: '#6c757d' }} />
            Empleado
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Empleado</InputLabel>
                <Select
                  value={usuarioSeleccionado?.id || ''}
                  onChange={(e) => handleUsuarioChange(e.target.value)}
                  label="Empleado"
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  }
                >
                  {usuarios.map(usuario => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {usuario.persona?.nombres} {usuario.persona?.apellidos} - {usuario.persona?.tipoDocumento}: {usuario.persona?.numeroDocumento}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {/* Eliminado: Generación semanal de filas */}

        {/* Vista semanal (7 días) */}
        <Card sx={{ p: 2, mb: 3, background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)', border: '1px solid #e1bee7' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" fontWeight={700} color="#6a1b9a" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ViewWeekIcon /> Semana (Lunes a Domingo)
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Fecha Lunes"
                type="date"
                value={fechaLunes}
                onChange={(e) => setFechaLunes(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <FormControl size="small">
                <InputLabel>Modo</InputLabel>
                <Select value={vistaSemanal ? 'semanal' : 'lista'} label="Modo" onChange={(e) => setVistaSemanal(e.target.value === 'semanal')}>
                  <MenuItem value="semanal">Semanal</MenuItem>
                  <MenuItem value="lista">Lista</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {vistaSemanal && (
            <TableContainer component={Paper} sx={{ maxHeight: 520 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <input type="checkbox" checked={weekInclude.every(Boolean)} onChange={(e) => toggleAllWeekInclude(e.target.checked)} />
                    </TableCell>
                    <TableCell>Día</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Inicio</TableCell>
                    <TableCell>Fin</TableCell>
                    <TableCell>Ubicación</TableCell>
                    <TableCell>Tipo Hora</TableCell>
                    <TableCell>Justificación</TableCell>
                    <TableCell align="right">Horas Extra</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weekRows.map((r, i) => (
                    <TableRow key={`dayrow-${i}`}>
                      <TableCell align="center">
                        <input type="checkbox" checked={weekInclude[i]} onChange={(e) => toggleWeekInclude(i, e.target.checked)} />
                      </TableCell>
                      <TableCell>{dayNames[i]}</TableCell>
                      <TableCell sx={{ minWidth: 140 }}>
                        <TextField value={r.fecha || ''} size="small" fullWidth disabled />
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <TextField
                          type="time"
                          value={r.horaIngreso}
                          onChange={(e) => updateWeekCell(i, 'horaIngreso', e.target.value)}
                          size="small"
                          fullWidth
                          InputProps={{ startAdornment: (<InputAdornment position="start"><ScheduleIcon /></InputAdornment>) }}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <TextField
                          type="time"
                          value={r.horaSalida}
                          onChange={(e) => updateWeekCell(i, 'horaSalida', e.target.value)}
                          size="small"
                          fullWidth
                          InputProps={{ startAdornment: (<InputAdornment position="start"><ScheduleIcon /></InputAdornment>) }}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 160 }}>
                        <TextField
                          value={r.ubicacion}
                          onChange={(e) => updateWeekCell(i, 'ubicacion', e.target.value)}
                          size="small"
                          fullWidth
                          InputProps={{ startAdornment: (<InputAdornment position="start"><WorkIcon /></InputAdornment>) }}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 190 }}>
                        <FormControl fullWidth size="small">
                          <Select value={r.tipoHoraId} onChange={(e) => updateWeekCell(i, 'tipoHoraId', e.target.value)} displayEmpty>
                            <MenuItem value=""><em>Selecciona</em></MenuItem>
                            {tiposHora.map(tipo => (
                              <MenuItem key={tipo.id} value={tipo.id}>{tipo.tipo} - {tipo.denominacion}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell sx={{ minWidth: 220 }}>
                        <TextField
                          value={r.justificacionHoraExtra}
                          onChange={(e) => updateWeekCell(i, 'justificacionHoraExtra', e.target.value)}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 140 }}>
                        <TextField
                          type="number"
                          value={r.cantidadHorasExtra}
                          onChange={(e) => updateWeekCell(i, 'cantidadHorasExtra', e.target.value)}
                          size="small"
                          fullWidth
                          inputProps={{ min: 0.5, step: 0.5, max: 24 }}
                          InputProps={{
                            startAdornment: (<InputAdornment position="start"><AccessTimeIcon /></InputAdornment>),
                            endAdornment: <InputAdornment position="end">h</InputAdornment>
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>

        {/* Sección: Tabla editable (lista) */}
        {!vistaSemanal && (
          <Card sx={{ p: 2, background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)', border: '1px solid #ffeaa7' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" fontWeight={700} color="#856404" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon sx={{ color: '#28a745' }} /> Registros
              </Typography>
              <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={addRow}>
                Agregar fila
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 480 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Inicio</TableCell>
                    <TableCell>Fin</TableCell>
                    <TableCell>Ubicación</TableCell>
                    <TableCell>Tipo Hora</TableCell>
                    <TableCell align="right">Horas Extra</TableCell>
                    <TableCell>Justificación</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell sx={{ minWidth: 140 }}>
                        <TextField
                          type="date"
                          value={row.fecha}
                          onChange={(e) => updateRow(index, 'fecha', e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarTodayIcon />
                              </InputAdornment>
                            ),
                            inputProps: { max: new Date().toISOString().split('T')[0] }
                          }}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <TextField
                          type="time"
                          value={row.horaIngreso}
                          onChange={(e) => updateRow(index, 'horaIngreso', e.target.value)}
                          onBlur={() => updateRow(index, 'cantidadHorasExtra', calcularHorasExtraRow(row))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ScheduleIcon />
                              </InputAdornment>
                            )
                          }}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <TextField
                          type="time"
                          value={row.horaSalida}
                          onChange={(e) => updateRow(index, 'horaSalida', e.target.value)}
                          onBlur={() => updateRow(index, 'cantidadHorasExtra', calcularHorasExtraRow(row))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ScheduleIcon />
                              </InputAdornment>
                            )
                          }}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 160 }}>
                        <TextField
                          value={row.ubicacion}
                          onChange={(e) => updateRow(index, 'ubicacion', e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <WorkIcon />
                              </InputAdornment>
                            )
                          }}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 190 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={row.tipoHoraId}
                            onChange={(e) => updateRow(index, 'tipoHoraId', e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>Selecciona</em>
                            </MenuItem>
                            {tiposHora.map(tipo => (
                              <MenuItem key={tipo.id} value={tipo.id}>
                                {tipo.tipo} - {tipo.denominacion}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 140 }}>
                        <TextField
                          type="number"
                          value={row.cantidadHorasExtra}
                          onChange={(e) => updateRow(index, 'cantidadHorasExtra', e.target.value)}
                          inputProps={{ min: 0.5, step: 0.5, max: 24 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccessTimeIcon />
                              </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">horas</InputAdornment>
                          }}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 220 }}>
                        <TextField
                          value={row.justificacionHoraExtra}
                          onChange={(e) => updateRow(index, 'justificacionHoraExtra', e.target.value)}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 140 }}>
                        <Tooltip title="Duplicar fila">
                          <IconButton color="primary" onClick={() => duplicateRow(index)}>
                            <DuplicateIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar fila">
                          <IconButton color="error" onClick={() => removeRow(index)} disabled={rows.length === 1}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={addRow}>
                Agregar fila
              </Button>
            </Box>
          </Card>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ px: 4, py: 1.5, fontWeight: 600 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading || loadingProp}
          sx={{ 
            px: 4, 
            py: 1.5, 
            fontWeight: 600,
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)' }
          }}
        >
          {loading || loadingProp ? 'Creando...' : 'Crear Registros'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearRegistrosBulkDialog;


