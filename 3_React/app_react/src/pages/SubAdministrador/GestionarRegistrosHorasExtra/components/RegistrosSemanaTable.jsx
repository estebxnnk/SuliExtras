import React, { useMemo } from 'react';
import { Box, Card, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Chip, Avatar, Grid, TextField, InputAdornment } from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import { getEstadoChip, getTipoHoraNombre, getUsuario, formatearFecha, formatearHora } from '../utils/registrosUtils';
import { format, parseISO, parse } from 'date-fns';

const dayOrder = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
const dayLabel = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo'
};

const RegistrosSemanaTable = ({ data, usuarios, onToggleVista, onUsuarioChange, usuariosLista }) => {
  if (!data) return null;
  const { semana, registrosPorDia } = data;

  // Fechas precisas con date-fns
  const semanaFormatted = useMemo(() => {
    const inicio = semana?.fechaInicio ? format(parseISO(semana.fechaInicio), 'yyyy-MM-dd') : '';
    const fin = semana?.fechaFin ? format(parseISO(semana.fechaFin), 'yyyy-MM-dd') : '';
    return { inicio, fin };
  }, [semana?.fechaInicio, semana?.fechaFin]);

  const formatHora = (hhmm) => {
    if (!hhmm) return '';
    try {
      return format(parse(hhmm, 'HH:mm', new Date()), 'HH:mm');
    } catch (_) {
      return hhmm;
    }
  };

  return (
    <Card sx={{ p: 2, border: '1px solid #e0e0e0', background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(245,248,255,0.98))' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={800} color="#1976d2">Registros Semanales</Typography>
          <Typography variant="body2" color="text.secondary">{semanaFormatted.inicio} - {semanaFormatted.fin}</Typography>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Día</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell align="right">Horas</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dayOrder.map(dia => {
              const items = registrosPorDia?.[dia] || [];
              if (items.length === 0) {
                return (
                  <TableRow key={`row-${dia}`}>
                    <TableCell>{dayLabel[dia]}</TableCell>
                    <TableCell>
                      <TextField
                        value={semana?.[dia] ? format(parseISO(semana[dia]), 'yyyy-MM-dd') : ''}
                        size="small"
                        InputProps={{ startAdornment: (<InputAdornment position="start"><CalendarIcon /></InputAdornment>) }}
                        disabled
                      />
                    </TableCell>
                    <TableCell colSpan={7} style={{ color: '#999' }}>Sin registros</TableCell>
                  </TableRow>
                );
              }
              return items.map((r, idx) => {
                const estado = getEstadoChip(r.estado);
                const usuario = getUsuario(r.usuario, usuarios);
                const nombre = usuario?.persona ? `${usuario.persona.nombres} ${usuario.persona.apellidos}` : r.usuario;
                return (
                  <TableRow key={`row-${dia}-${r.id}`} hover>
                    {idx === 0 && (
                      <TableCell rowSpan={items.length} sx={{ verticalAlign: 'top' }}>{dayLabel[dia]}</TableCell>
                    )}
                    <TableCell>{r.fecha ? format(parseISO(r.fecha), 'yyyy-MM-dd') : ''}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28 }}>{nombre?.[0] || 'U'}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{nombre}</Typography>
                          <Typography variant="caption" color="text.secondary">{usuario?.email || r.usuario}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{r.ubicacion}</TableCell>
                    <TableCell>{formatHora(r.horaIngreso)}</TableCell>
                    <TableCell>{formatHora(r.horaSalida)}</TableCell>
                    <TableCell align="right">{r.cantidadHorasExtra}</TableCell>
                    <TableCell>{getTipoHoraNombre(r)}</TableCell>
                    <TableCell>
                      <Chip label={estado.label} size="small" sx={{
                        background: estado.bgColor,
                        color: estado.textColor,
                        border: `1px solid ${estado.borderColor}`
                      }} />
                    </TableCell>
                  </TableRow>
                );
              });
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default RegistrosSemanaTable;


