import React from 'react';
import { Card, Box, Typography, Chip, Table, TableHead, TableRow, TableCell, TableBody, Button, Checkbox } from '@mui/material';
import { Assignment as ManageIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { formatearFecha } from '../utils/registrosUtils';

// Componente adaptable: soporta formato antiguo por fecha (registrosPorUsuario)
// y nuevo formato semanal por usuarios (data.usuarios)
const RegistrosPorFechaTable = ({ data, onOpenGestion, onDeleteUsuariosSeleccionados }) => {
  if (!data) return null;

  const esSemanal = !!data.usuarios;

  if (esSemanal) {
    const usuariosIds = Object.keys(data.usuarios || {});
    return (
      <Card sx={{ p: 2, border: '1px solid #e0e0e0', background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(245,248,255,0.98))' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#1976d2">Registros semanales por usuario</Typography>
            <Typography variant="body2" color="text.secondary">{data.semana?.fechaInicio} - {data.semana?.fechaFin}</Typography>
          </Box>
          <Chip label={`Usuarios: ${usuariosIds.length} · Registros: ${data.totales?.totalRegistros || 0}`} />
        </Box>

        {usuariosIds.length === 0 ? (
          <Typography variant="body2" color="text.secondary">Sin registros</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Registros</TableCell>
                <TableCell>Horas</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosIds.map(uid => {
                const u = data.usuarios[uid];
                const totalRegs = u.totales?.totalRegistros || 0;
                const totalHoras = u.totales?.totalHorasExtra || 0;
                return (
                  <TableRow key={uid} hover>
                    <TableCell>{u.usuario}</TableCell>
                    <TableCell>{u.usuario}</TableCell>
                    <TableCell>{totalRegs}</TableCell>
                    <TableCell>{totalHoras}</TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" startIcon={<ManageIcon />} onClick={() => onOpenGestion?.(u)}>
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    );
  }

  // Compatibilidad con formato anterior por fecha
  const { fecha, registrosPorUsuario, totalesGenerales } = data;
  const usuariosIdsAnt = Object.keys(registrosPorUsuario || {});
  const [selected, setSelected] = React.useState({}); // usuarioId -> boolean

  const allChecked = usuariosIdsAnt.length > 0 && usuariosIdsAnt.every(uid => selected[uid]);
  const toggleAll = (checked) => setSelected(usuariosIdsAnt.reduce((acc, uid) => ({ ...acc, [uid]: checked }), {}));
  const toggleOne = (uid, checked) => setSelected(prev => ({ ...prev, [uid]: checked }));
  const selectedUserIds = usuariosIdsAnt.filter(uid => selected[uid]);
  const selectedRegistroIds = selectedUserIds.flatMap(uid => (registrosPorUsuario[uid]?.registros || []).map(r => r.id));

  return (
    <Card sx={{ p: 2, border: '1px solid #e0e0e0', background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(245,248,255,0.98))' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={800} color="#1976d2">Registros por Fecha</Typography>
          <Typography variant="body2" color="text.secondary">{formatearFecha(fecha)}</Typography>
        </Box>
        <Chip label={`Usuarios: ${totalesGenerales?.totalUsuarios || 0} · Registros: ${totalesGenerales?.totalRegistros || 0}`} />
      </Box>

      {usuariosIdsAnt.length === 0 ? (
        <Typography variant="body2" color="text.secondary">Sin registros</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox checked={allChecked} indeterminate={!allChecked && selectedUserIds.length>0} onChange={(e)=>toggleAll(e.target.checked)} />
              </TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Registros</TableCell>
              <TableCell>Horas</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuariosIdsAnt.map(uid => {
              const u = registrosPorUsuario[uid];
              const nombre = u.nombre !== 'N/A' ? `${u.nombre} ${u.apellido}` : u.email;
              const totalRegs = u.totales?.totalRegistros || u.registros.length;
              const totalHoras = u.totales?.totalHorasExtra || 0;
              return (
                <TableRow key={uid} hover>
                  <TableCell padding="checkbox">
                    <Checkbox checked={!!selected[uid]} onChange={(e)=>toggleOne(uid, e.target.checked)} />
                  </TableCell>
                  <TableCell>{nombre}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{totalRegs}</TableCell>
                  <TableCell>{totalHoras}</TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined" startIcon={<ManageIcon />} onClick={() => onOpenGestion?.(u)}>
                      Gestionar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {usuariosIdsAnt.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
            disabled={selectedRegistroIds.length === 0}
            onClick={() => onDeleteUsuariosSeleccionados?.(selectedUserIds, selectedRegistroIds)}
          >
            Eliminar usuarios seleccionados ({selectedUserIds.length})
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default RegistrosPorFechaTable;


