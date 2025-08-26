import React, { useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, IconButton, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, DoneAll as ApproveIcon, Block as RejectIcon } from '@mui/icons-material';
import { formatearFecha, formatearHora, getUsuario } from '../../utils/registrosUtils';

const dayOrder = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
const dayLabel = { lunes:'Lunes', martes:'Martes', miercoles:'Miércoles', jueves:'Jueves', viernes:'Viernes', sabado:'Sábado', domingo:'Domingo' };

const GestionSemanaDialog = ({ open, onClose, data, usuarios, onAprobarSeleccion, onRechazarSeleccion, onEditar, onEliminar }) => {
  const [seleccionados, setSeleccionados] = useState({}); // id -> boolean

  const registrosLista = useMemo(() => {
    if (!data) return [];
    const out = [];
    dayOrder.forEach(d => {
      const items = data.registrosPorDia?.[d] || [];
      items.forEach(r => out.push({ ...r, _dia: d }));
    });
    return out;
  }, [data]);

  const allChecked = registrosLista.length > 0 && registrosLista.every(r => seleccionados[r.id]);

  const toggleAll = (checked) => {
    const map = {};
    registrosLista.forEach(r => { map[r.id] = checked; });
    setSeleccionados(map);
  };

  const toggleOne = (id, checked) => {
    setSeleccionados(prev => ({ ...prev, [id]: checked }));
  };

  const idsSeleccionados = useMemo(() => registrosLista.filter(r => seleccionados[r.id]).map(r => r.id), [seleccionados, registrosLista]);

  const aprobar = () => onAprobarSeleccion?.(idsSeleccionados);
  const rechazar = () => onRechazarSeleccion?.(idsSeleccionados);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Gestionar registros semanales</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" color="success" startIcon={<ApproveIcon />} onClick={aprobar} disabled={idsSeleccionados.length === 0}>Aprobar seleccionados</Button>
            <Button variant="outlined" color="error" startIcon={<RejectIcon />} onClick={rechazar} disabled={idsSeleccionados.length === 0}>Rechazar seleccionados</Button>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox checked={allChecked} indeterminate={!allChecked && idsSeleccionados.length > 0} onChange={(e) => toggleAll(e.target.checked)} />
              </TableCell>
              <TableCell>Día</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell align="right">Horas</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrosLista.map(r => {
              const usuario = getUsuario(r.usuario, usuarios);
              const nombre = usuario?.persona ? `${usuario.persona.nombres} ${usuario.persona.apellidos}` : r.usuario;
              return (
                <TableRow key={r.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox checked={!!seleccionados[r.id]} onChange={(e) => toggleOne(r.id, e.target.checked)} />
                  </TableCell>
                  <TableCell>{dayLabel[r._dia]}</TableCell>
                  <TableCell>{formatearFecha(r.fecha)}</TableCell>
                  <TableCell>{nombre}</TableCell>
                  <TableCell>{r.ubicacion}</TableCell>
                  <TableCell>{formatearHora(r.horaIngreso)}</TableCell>
                  <TableCell>{formatearHora(r.horaSalida)}</TableCell>
                  <TableCell align="right">{r.cantidadHorasExtra}</TableCell>
                  <TableCell>{r.estado}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton color="primary" onClick={() => onEditar?.(r)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton color="error" onClick={() => onEliminar?.(r)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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

export default GestionSemanaDialog;


