import React, { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
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

import {
  emptyRow,
  calcularHorasExtraRow,
  validateRow,
  validateNoOverlaps,
  addDays,
  formatDate,
  isWeekend,
  computeWeekFromMondayStr,
  parseLocalISODate,
  toMondayDateString
} from '../../utils/horasExtrasUtils';
import { FixedSizeList as List } from 'react-window';

const CrearRegistrosSemanalesSubAdmin = ({
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
  const tableContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);

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

  // Derivar filas con horas calculadas (performance-friendly)
  const derivedRows = useMemo(() => {
    return rows.map(r => {
      if (r.horaIngreso && r.horaSalida) {
        const calc = calcularHorasExtraRow(r);
        return calc !== r.cantidadHorasExtra ? { ...r, cantidadHorasExtra: calc } : r;
      }
      return r;
    });
  }, [rows]);

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
        const activos = derivedWeekRows
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
        if (!derivedRows.length) throw new Error('Agrega al menos un registro');
        derivedRows.forEach((row, idx) => validateRow(row, idx));
        validateNoOverlaps(derivedRows);
        registros = derivedRows.map(r => ({
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

  const generarSemana = () => {
    setMensaje('');
    const { fechaInicio, dias, soloHabiles, horaIngreso, horaSalida, ubicacion, tipoHoraId, justificacionHoraExtra } = genOpts;
    if (!fechaInicio || !horaIngreso || !horaSalida || !ubicacion || !tipoHoraId) {
      setMensaje('Completa los campos de generación: fecha, horas, ubicación y tipo');
      return;
    }
    const start = parseLocalISODate(fechaInicio);
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

  useEffect(() => {
    if (vistaSemanal && fechaLunes) {
      // Validación: fechaLunes debe ser lunes real (zona local) y guardia de loop
      const fecha = parseLocalISODate(fechaLunes);
      const mondayStr = toMondayDateString(fecha);
      if (mondayStr !== fechaLunes) {
        setFechaLunes(mondayStr);
        return; // esperar siguiente efecto con fecha corregida
      }
      setWeekRows(prev => {
        const base = computeWeekFromMondayStr(fechaLunes);
        let changed = false;
        const merged = base.map((d, i) => {
          const combinado = {
            ...d,
            horaIngreso: prev[i]?.horaIngreso || genOpts.horaIngreso || '',
            horaSalida: prev[i]?.horaSalida || genOpts.horaSalida || '',
            ubicacion: prev[i]?.ubicacion || genOpts.ubicacion || '',
            tipoHoraId: prev[i]?.tipoHoraId || genOpts.tipoHoraId || '',
            justificacionHoraExtra: prev[i]?.justificacionHoraExtra || genOpts.justificacionHoraExtra || ''
          };
          const antes = prev[i] || emptyRow();
          if (
            antes.fecha !== combinado.fecha ||
            antes.horaIngreso !== combinado.horaIngreso ||
            antes.horaSalida !== combinado.horaSalida ||
            antes.ubicacion !== combinado.ubicacion ||
            antes.tipoHoraId !== combinado.tipoHoraId ||
            antes.justificacionHoraExtra !== combinado.justificacionHoraExtra
          ) {
            changed = true;
          }
          return combinado;
        });
        return changed ? merged : prev;
      });
    }
  }, [vistaSemanal, fechaLunes]);

  // Derivar weekRows con horas calculadas (performance-friendly)
  const derivedWeekRows = useMemo(() => {
    if (!vistaSemanal) return weekRows;
    return weekRows.map(r => {
      if (r.horaIngreso && r.horaSalida) {
        const calc = calcularHorasExtraRow(r);
        return calc !== r.cantidadHorasExtra ? { ...r, cantidadHorasExtra: calc } : r;
      }
      return r;
    });
  }, [weekRows, vistaSemanal]);

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
    const target = vistaSemanal ? derivedWeekRows : derivedRows;
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
  }, [vistaSemanal, derivedWeekRows, derivedRows]);

  // Medir ancho del contenedor para virtualización
  useEffect(() => {
    const el = tableContainerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth || 800);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const shouldVirtualize = useMemo(() => !vistaSemanal && derivedRows.length > 100, [vistaSemanal, derivedRows.length]);
  const TBody = useMemo(() => forwardRef(function TBody(props, ref) { return <tbody ref={ref} {...props} />; }), []);

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
                  {derivedWeekRows.map((r, i) => (
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
                <TableBody ref={tableContainerRef}>
                  {(!shouldVirtualize ? derivedRows : []).map((row, index) => (
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
                  {shouldVirtualize && (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ p: 0 }}>
                        <div style={{ width: '100%' }}>
                          <List
                            height={480}
                            itemCount={derivedRows.length}
                            itemSize={64}
                            width={containerWidth}
                          >
                            {({ index, style }) => {
                              const row = derivedRows[index];
                              return (
                                <div style={style}>
                                  <Table size="small">
                                    <TableBody>
                                      <TableRow hover>
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
                                            InputProps={{ startAdornment: (<InputAdornment position="start"><ScheduleIcon /></InputAdornment>) }}
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
                                            InputProps={{ startAdornment: (<InputAdornment position="start"><ScheduleIcon /></InputAdornment>) }}
                                            size="small"
                                            fullWidth
                                          />
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 160 }}>
                                          <TextField
                                            value={row.ubicacion}
                                            onChange={(e) => updateRow(index, 'ubicacion', e.target.value)}
                                            InputProps={{ startAdornment: (<InputAdornment position="start"><WorkIcon /></InputAdornment>) }}
                                            size="small"
                                            fullWidth
                                          />
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 190 }}>
                                          <FormControl fullWidth size="small">
                                            <Select value={row.tipoHoraId} onChange={(e) => updateRow(index, 'tipoHoraId', e.target.value)} displayEmpty>
                                              <MenuItem value=""><em>Selecciona</em></MenuItem>
                                              {tiposHora.map(tipo => (<MenuItem key={tipo.id} value={tipo.id}>{tipo.tipo} - {tipo.denominacion}</MenuItem>))}
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
                                              startAdornment: (<InputAdornment position="start"><AccessTimeIcon /></InputAdornment>),
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
                                          <Tooltip title="Duplicar fila"><IconButton color="primary" onClick={() => duplicateRow(index)}><DuplicateIcon /></IconButton></Tooltip>
                                          <Tooltip title="Eliminar fila"><IconButton color="error" onClick={() => removeRow(index)} disabled={rows.length === 1}><DeleteIcon /></IconButton></Tooltip>
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              );
                            }}
                          </List>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
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

export default CrearRegistrosSemanalesSubAdmin;


