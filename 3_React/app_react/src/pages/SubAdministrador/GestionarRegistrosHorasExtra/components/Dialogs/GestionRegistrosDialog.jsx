import React, { useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Tooltip, IconButton, Card, Grid, Chip } from '@mui/material';
import { DoneAll as ApproveIcon, Block as RejectIcon, Edit as EditIcon, Delete as DeleteIcon, Person as PersonIcon, CalendarToday as CalendarIcon, Close as CloseIcon } from '@mui/icons-material';
import { getEstadoChip } from '../../utils/registrosUtils';

const GestionRegistrosDialog = React.memo(({ open, onClose, usuarioGrupo, onAprobarSeleccion, onRechazarSeleccion, onEditar, onEliminar }) => {
  const [seleccion, setSeleccion] = useState({});
  const [processing, setProcessing] = useState(false);

  const registros = usuarioGrupo?.registros || [];
  const containerRef = React.useRef(null);
  const rowHeight = 52;
  const overscan = 10;
  const [range, setRange] = React.useState({ start: 0, end: 30, clientHeight: 0, scrollTop: 0 });
  const allChecked = registros.length > 0 && registros.every(r => seleccion[r.id]);
  const idsSeleccionados = useMemo(() => registros.filter(r => seleccion[r.id]).map(r => r.id), [seleccion, registros]);

  const toggleAll = (checked) => {
    const map = {};
    registros.forEach(r => { map[r.id] = checked; });
    setSeleccion(map);
  };
  const toggleOne = (id, checked) => setSeleccion(prev => ({ ...prev, [id]: checked }));

  const aprobar = async () => {
    if (idsSeleccionados.length === 0) return;
    try {
      setProcessing(true);
      await onAprobarSeleccion?.(idsSeleccionados);
    } finally {
      setProcessing(false);
    }
  };
  const rechazar = async () => {
    if (idsSeleccionados.length === 0) return;
    try {
      setProcessing(true);
      await onRechazarSeleccion?.(idsSeleccionados);
    } finally {
      setProcessing(false);
    }
  };

  const totalCount = registros.length;
  const onScroll = (e) => {
    const el = e.currentTarget;
    const clientHeight = el.clientHeight || 0;
    const scrollTop = el.scrollTop || 0;
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visibleCount = Math.ceil(clientHeight / rowHeight) + 2 * overscan;
    const end = Math.min(totalCount, start + visibleCount);
    setRange({ start, end, clientHeight, scrollTop });
  };
  const topPad = range.start * rowHeight;
  const bottomPad = Math.max(0, (totalCount - range.end) * rowHeight);
  const visibleRows = totalCount > 0 ? registros.slice(range.start, range.end) : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth keepMounted>
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #4caf50, #388e3c)',
        color: 'white',
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Gestionar registros del usuario</Typography>
          <IconButton onClick={() => onClose?.()} sx={{ color: 'white' }} aria-label="Cerrar">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Card sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', border: '1px solid #dee2e6' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Usuario</Typography>
                  <Typography variant="body1" fontWeight={700}>{usuarioGrupo?.nombre !== 'N/A' ? `${usuarioGrupo?.nombre} ${usuarioGrupo?.apellido}` : usuarioGrupo?.email}</Typography>
                  <Typography variant="caption" color="text.secondary">Email: {usuarioGrupo?.email}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Totales</Typography>
                  <Typography variant="body1" fontWeight={700}>Registros: {usuarioGrupo?.totales?.totalRegistros || usuarioGrupo?.registros?.length || 0} · Horas: {usuarioGrupo?.totales?.totalHorasExtra || 0}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Button variant="contained" color="success" startIcon={<ApproveIcon />} disabled={idsSeleccionados.length===0 || processing} onClick={aprobar}>Aprobar seleccionados</Button>
          <Button variant="contained" color="error" startIcon={<RejectIcon />} disabled={idsSeleccionados.length===0 || processing} onClick={rechazar}>Rechazar seleccionados</Button>
          <Chip size="small" label={`Seleccionados: ${idsSeleccionados.length}`} sx={{ ml: 'auto' }} />
        </Box>
        {/* Layout tipo semanal (filas = días, columnas = campos) */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox checked={allChecked} indeterminate={!allChecked && idsSeleccionados.length>0} onChange={(e)=>toggleAll(e.target.checked)} /></TableCell>
              <TableCell>Día</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Tipo Hora</TableCell>
              <TableCell>Justificación</TableCell>
              <TableCell align="right">Horas</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topPad > 0 && (
              <TableRow style={{ height: topPad }}>
                <TableCell colSpan={11} style={{ padding: 0, border: 'none' }} />
              </TableRow>
            )}
            {visibleRows.map((r) => {
              const dayNames = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
              const diaIndex = (() => {
                // Usar el día del backend si viene; si no, intentar derivar, y si no, mostrar '—'
                if (r._dia) {
                  const map = { lunes:1, martes:2, miercoles:3, jueves:4, viernes:5, sabado:6, domingo:0 };
                  return map[r._dia] ?? null;
                }
                try {
                  const fecha = new Date(r.fecha);
                  const idx = fecha.getDay();
                  return Number.isNaN(idx) ? null : idx;
                } catch (_) { return null; }
              })();
              return (
                <TableRow key={r.id} hover style={{ height: rowHeight }}>
                  <TableCell padding="checkbox"><Checkbox checked={!!seleccion[r.id]} onChange={(e)=>toggleOne(r.id, e.target.checked)} /></TableCell>
                  <TableCell>{diaIndex === null ? '—' : dayNames[diaIndex]}</TableCell>
                  <TableCell>{r.fecha || ''}</TableCell>
                  <TableCell>{r.horaIngreso || ''}</TableCell>
                  <TableCell>{r.horaSalida || ''}</TableCell>
                  <TableCell>{r.ubicacion}</TableCell>
                  <TableCell>{r.Horas?.[0] ? `${r.Horas[0].tipo} - ${r.Horas[0].denominacion}` : '—'}</TableCell>
                  <TableCell>{r.justificacionHoraExtra || ''}</TableCell>
                  <TableCell align="right">{r.cantidadHorasExtra}</TableCell>
                  <TableCell>
                    {(() => {
                      const estado = getEstadoChip(r.estado);
                      return (
                        <Chip label={estado.label} size="small" sx={{
                          background: estado.bgColor,
                          color: estado.textColor,
                          border: `1px solid ${estado.borderColor}`
                        }} />
                      );
                    })()}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar"><IconButton color="primary" onClick={()=>onEditar?.(r)}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Eliminar"><IconButton color="error" onClick={()=>onEliminar?.(r)}><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {bottomPad > 0 && (
              <TableRow style={{ height: bottomPad }}>
                <TableCell colSpan={11} style={{ padding: 0, border: 'none' }} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" startIcon={<CloseIcon />} onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
});

export default GestionRegistrosDialog;


