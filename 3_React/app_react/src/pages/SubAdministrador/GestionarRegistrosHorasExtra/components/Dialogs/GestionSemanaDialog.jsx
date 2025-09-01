import React, { useMemo, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Checkbox, 
  IconButton, 
  Tooltip,
  TableContainer,
  Chip,
  Divider
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  DoneAll as ApproveIcon, 
  Block as RejectIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { getUsuario } from '../../utils/registrosUtils';

const dayOrder = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
const dayLabel = { 
  lunes:'Lunes', 
  martes:'Martes', 
  miercoles:'Miércoles', 
  jueves:'Jueves', 
  viernes:'Viernes', 
  sabado:'Sábado', 
  domingo:'Domingo' 
};

const GestionSemanaDialog = React.memo(({ open, onClose, data, usuarios, onAprobarSeleccion, onRechazarSeleccion, onEditar, onEliminar }) => {
  const [seleccionados, setSeleccionados] = useState({}); // id -> boolean
  const containerRef = React.useRef(null);
  const rowHeight = 52;
  const overscan = 10;
  const [range, setRange] = React.useState({ start: 0, end: 30, clientHeight: 0, scrollTop: 0 });

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

  const idsSeleccionados = useMemo(() => 
    registrosLista.filter(r => seleccionados[r.id]).map(r => r.id), 
    [seleccionados, registrosLista]
  );

  const totalCount = registrosLista.length;
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
  const visibleRows = totalCount > 0 ? registrosLista.slice(range.start, range.end) : [];

  const aprobar = () => onAprobarSeleccion?.(idsSeleccionados);
  const rechazar = () => onRechazarSeleccion?.(idsSeleccionados);

  const getEstadoChip = (estado) => {
    switch(estado?.toLowerCase()) {
      case 'aprobado': return { label: 'Aprobado', color: 'success' };
      case 'rechazado': return { label: 'Rechazado', color: 'error' };
      case 'pendiente': return { label: 'Pendiente', color: 'warning' };
      default: return { label: estado || 'N/A', color: 'default' };
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" 
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header con gradiente */}
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        p: 0
      }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon sx={{ fontSize: 24 }} />
            <Box>
              <Typography variant="h6" fontWeight={700} color="white">
                Gestión de Registros Semanales
              </Typography>
              {data && (
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {data.usuario || 'Usuario'} - Total: {registrosLista.length} registros
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton 
            onClick={() => onClose?.()}
            sx={{ color: 'white' }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Barra de acciones */}
        <Box sx={{ 
          px: 2, 
          pb: 2, 
          display: 'flex', 
          gap: 1, 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }} />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {idsSeleccionados.length} registros seleccionados
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained"
              color="success"
              size="small"
              startIcon={<ApproveIcon />} 
              onClick={aprobar} 
              disabled={idsSeleccionados.length === 0}
              sx={{ 
                bgcolor: 'rgba(76, 175, 80, 0.9)',
                '&:hover': { bgcolor: 'rgba(76, 175, 80, 1)' }
              }}
            >
              Aprobar ({idsSeleccionados.length})
            </Button>
            <Button 
              variant="contained"
              color="error"
              size="small"
              startIcon={<RejectIcon />} 
              onClick={rechazar} 
              disabled={idsSeleccionados.length === 0}
              sx={{ 
                bgcolor: 'rgba(244, 67, 54, 0.9)',
                '&:hover': { bgcolor: 'rgba(244, 67, 54, 1)' }
              }}
            >
              Rechazar ({idsSeleccionados.length})
            </Button>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(245,248,255,0.98))' }}>
        <TableContainer sx={{ maxHeight: '70vh' }} onScroll={onScroll} ref={containerRef}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' }}>
                <TableCell padding="checkbox" sx={{ color: 'white', fontWeight: 700 }}>
                  <Checkbox 
                    checked={allChecked} 
                    indeterminate={!allChecked && idsSeleccionados.length > 0} 
                    onChange={(e) => toggleAll(e.target.checked)}
                    sx={{ color: 'white' }}
                  />
                </TableCell>
                {['Día', 'Fecha', 'Empleado', 'Ubicación', 'Inicio', 'Fin', 'Horas', 'Estado', 'Acciones'].map((header, index) => (
                  <TableCell key={index} sx={{ color: 'white', fontWeight: 700 }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {topPad > 0 && (
                <TableRow style={{ height: topPad }}>
                  <TableCell colSpan={10} style={{ padding: 0, border: 'none' }} />
                </TableRow>
              )}
              {visibleRows.map((r, idx) => {
                const usuario = getUsuario(r.usuario, usuarios);
                const nombre = usuario?.persona ? `${usuario.persona.nombres} ${usuario.persona.apellidos}` : r.usuario;
                const estadoChip = getEstadoChip(r.estado);
                
                return (
                  <TableRow key={r.id} hover style={{ height: rowHeight }}>
                    <TableCell padding="checkbox">
                      <Checkbox 
                        checked={!!seleccionados[r.id]} 
                        onChange={(e) => toggleOne(r.id, e.target.checked)}
                        sx={{ color: '#1976d2' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2" fontWeight={600} color="#1976d2">
                          {dayLabel[r._dia]}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {r.fecha || ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2">
                          {nombre}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2" fontWeight={600} color="#1976d2">
                          {r.ubicacion}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2">
                          {r.horaIngreso || ''}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2">
                          {r.horaSalida || ''}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2" fontWeight={600}>
                          {r.cantidadHorasExtra} hrs
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={estadoChip.label}
                        color={estadoChip.color}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Editar registro">
                          <IconButton
                            size="small"
                            onClick={() => onEditar?.(r)}
                            sx={{ color: '#ff9800' }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar registro">
                          <IconButton
                            size="small"
                            onClick={() => onEliminar?.(r)}
                            sx={{ color: '#f44336' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {bottomPad > 0 && (
                <TableRow style={{ height: bottomPad }}>
                  <TableCell colSpan={10} style={{ padding: 0, border: 'none' }} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {registrosLista.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No hay registros disponibles para esta semana
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 2, 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderTop: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon sx={{ fontSize: 16, color: '#666' }} />
            <Typography variant="body2" color="text.secondary">
              Total de registros: {registrosLista.length}
            </Typography>
          </Box>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          >
            Cerrar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
});

export default GestionSemanaDialog;