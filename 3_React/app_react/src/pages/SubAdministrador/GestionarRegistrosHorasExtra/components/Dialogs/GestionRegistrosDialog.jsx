import React, { useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Tooltip, IconButton, Card, Grid, InputAdornment } from '@mui/material';
import { DoneAll as ApproveIcon, Block as RejectIcon, Edit as EditIcon, Delete as DeleteIcon, Person as PersonIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';

const GestionRegistrosDialog = ({ open, onClose, usuarioGrupo, onAprobarSeleccion, onRechazarSeleccion, onEditar, onEliminar }) => {
  const [seleccion, setSeleccion] = useState({});

  const registros = usuarioGrupo?.registros || [];
  const allChecked = registros.length > 0 && registros.every(r => seleccion[r.id]);
  const idsSeleccionados = useMemo(() => registros.filter(r => seleccion[r.id]).map(r => r.id), [seleccion, registros]);

  const toggleAll = (checked) => {
    const map = {};
    registros.forEach(r => { map[r.id] = checked; });
    setSeleccion(map);
  };
  const toggleOne = (id, checked) => setSeleccion(prev => ({ ...prev, [id]: checked }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #4caf50, #45a049)',
        color: 'white'
      }}>
        <Typography variant="h6">Gestionar registros del usuario</Typography>
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
          <Button variant="outlined" color="success" startIcon={<ApproveIcon />} disabled={idsSeleccionados.length===0} onClick={() => onAprobarSeleccion?.(idsSeleccionados)}>Aprobar seleccionados</Button>
          <Button variant="outlined" color="error" startIcon={<RejectIcon />} disabled={idsSeleccionados.length===0} onClick={() => onRechazarSeleccion?.(idsSeleccionados)}>Rechazar seleccionados</Button>
          <Typography variant="caption" sx={{ ml: 'auto' }}>{idsSeleccionados.length} seleccionados</Typography>
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
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registros.map((r) => {
              const fecha = new Date(r.fecha);
              const diaIndex = fecha.getDay(); // 0 dom - 6 sab
              const dayNames = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
              return (
                <TableRow key={r.id} hover>
                  <TableCell padding="checkbox"><Checkbox checked={!!seleccion[r.id]} onChange={(e)=>toggleOne(r.id, e.target.checked)} /></TableCell>
                  <TableCell>{dayNames[diaIndex]}</TableCell>
                  <TableCell>{r.fecha}</TableCell>
                  <TableCell>{r.horaIngreso}</TableCell>
                  <TableCell>{r.horaSalida}</TableCell>
                  <TableCell>{r.ubicacion}</TableCell>
                  <TableCell>{r.Horas?.[0] ? `${r.Horas[0].tipo} - ${r.Horas[0].denominacion}` : '—'}</TableCell>
                  <TableCell>{r.justificacionHoraExtra || ''}</TableCell>
                  <TableCell align="right">{r.cantidadHorasExtra}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar"><IconButton color="primary" onClick={()=>onEditar?.(r)}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Eliminar"><IconButton color="error" onClick={()=>onEliminar?.(r)}><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GestionRegistrosDialog;


