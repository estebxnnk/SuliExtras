import React from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, TableContainer } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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

const TablaRegistrosEmpleado = ({ data, tiposHora, onVer, onEditar, onEliminar }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ background: '#e3f2fd' }}>
            <TableCell>Fecha</TableCell>
            <TableCell>Horas Extra</TableCell>
            <TableCell>Ubicación</TableCell>
            <TableCell>Justificación</TableCell>
            <TableCell>Tipo de Hora</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!data || data.length === 0) && (
            <TableRow>
              <TableCell colSpan={7} align="center">No tienes registros de horas extra.</TableCell>
            </TableRow>
          )}
          {data && data.map((registro) => {
            const tipoHora = tiposHora.find(tipo => tipo.id === registro.tipoHora);
            return (
              <TableRow key={registro.id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: '#e3f2fd' } }}>
                <TableCell>{registro.fecha}</TableCell>
                <TableCell>{registro.cantidadHorasExtra}</TableCell>
                <TableCell>{registro.ubicacion}</TableCell>
                <TableCell>{registro.justificacionHoraExtra}</TableCell>
                <TableCell>
                  {registro.Horas && registro.Horas.length > 0 ? (
                    registro.Horas.map(hora => (
                      <Box key={hora.id}>
                        <Typography variant="body2" fontWeight={600}>{hora.tipo}</Typography>
                        <Typography variant="caption" color="text.secondary">{hora.denominacion}</Typography>
                        <Typography variant="caption" color="text.secondary">Cantidad: {hora.RegistroHora?.cantidad}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No asignado</Typography>
                  )}
                </TableCell>
                <TableCell>{getEstadoChip(registro.estado)}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onVer(registro)} title="Ver detalles" sx={{ color: 'green' }}>
                    <VisibilityIcon />
                  </IconButton>
                  {registro.estado !== 'aprobado' && (
                    <>
                      <IconButton onClick={() => onEditar(registro)} title="Editar" sx={{ color: '#1976d2' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => onEliminar(registro)} title="Eliminar" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaRegistrosEmpleado;


