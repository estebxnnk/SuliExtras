import React, { useMemo } from 'react';
import { 
  Card, 
  Box, 
  Typography, 
  Chip, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Button, 
  Checkbox,
  Paper,
  IconButton,
  Tooltip,
  TableContainer
} from '@mui/material';
import { 
  Assignment as ManageIcon, 
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  DateRange as DateIcon,
  Group as GroupIcon
} from '@mui/icons-material';
// Usar fechas como vienen del backend, sin formateo

// Componente adaptable: soporta formato antiguo por fecha (registrosPorUsuario)
// y nuevo formato semanal por usuarios (data.usuarios)
const RegistrosPorFechaTable = React.memo(({ data, onOpenGestion, onDeleteUsuariosSeleccionados }) => {
  if (!data) return null;

  const esSemanal = !!data.usuarios;

  if (esSemanal) {
    const usuariosIds = useMemo(() => Object.keys(data.usuarios || {}), [data.usuarios]);
    return (
      <Paper elevation={3} sx={{ 
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        {/* Header Card */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          p: 2,
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DateIcon sx={{ fontSize: 24 }} />
              <Box>
                <Typography variant="h6" fontWeight={700} color="white">
                  Registros Semanales por Usuario
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {data.semana?.fechaInicio} - {data.semana?.fechaFin}
                </Typography>
              </Box>
            </Box>
            <Chip 
              label={`Usuarios: ${usuariosIds.length} · Registros: ${data.totales?.totalRegistros || 0}`}
              sx={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
        </Box>

        {usuariosIds.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No hay registros semanales disponibles
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' }}>
                  {['Usuario', 'Email', 'Registros', 'Horas', 'Acciones'].map((header, index) => (
                    <TableCell key={index} sx={{ fontWeight: 700, color: '#1976d2' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {usuariosIds.map(uid => {
                  const u = data.usuarios[uid];
                  const totalRegs = u.totales?.totalRegistros || 0;
                  const totalHoras = u.totales?.totalHorasExtra || 0;
                  return (
                    <TableRow key={uid} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2" fontWeight={600}>
                            {u.usuario}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2">
                            {u.usuario}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AssignmentIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Chip
                            label={totalRegs}
                            color={totalRegs > 0 ? "primary" : "default"}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2" fontWeight={600}>
                            {totalHoras} hrs
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => onOpenGestion?.(u)}
                            sx={{ color: '#1976d2' }}
                          >
                            <ManageIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    );
  }

  // Compatibilidad con formato anterior por fecha
  const { fecha, registrosPorUsuario, totalesGenerales } = data;
  const usuariosIdsAnt = useMemo(() => Object.keys(registrosPorUsuario || {}), [registrosPorUsuario]);
  const [selected, setSelected] = React.useState({}); // usuarioId -> boolean

  const allChecked = usuariosIdsAnt.length > 0 && usuariosIdsAnt.every(uid => selected[uid]);
  const toggleAll = (checked) => setSelected(usuariosIdsAnt.reduce((acc, uid) => ({ ...acc, [uid]: checked }), {}));
  const toggleOne = (uid, checked) => setSelected(prev => ({ ...prev, [uid]: checked }));
  const selectedUserIds = usuariosIdsAnt.filter(uid => selected[uid]);
  const selectedRegistroIds = selectedUserIds.flatMap(uid => (registrosPorUsuario[uid]?.registros || []).map(r => r.id));

  return (
    <Paper elevation={3} sx={{ 
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 3,
      overflow: 'hidden'
    }}>
      {/* Header Card */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        p: 2,
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DateIcon sx={{ fontSize: 24 }} />
            <Box>
              <Typography variant="h6" fontWeight={700} color="white">
                Registros por Fecha
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {fecha}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={`Usuarios: ${totalesGenerales?.totalUsuarios || 0} · Registros: ${totalesGenerales?.totalRegistros || 0}`}
            sx={{ 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontWeight: 600
            }}
          />
        </Box>
      </Box>

      {usuariosIdsAnt.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No hay registros disponibles para esta fecha
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' }}>
                  <TableCell padding="checkbox">
                    <Checkbox 
                      checked={allChecked} 
                      indeterminate={!allChecked && selectedUserIds.length > 0} 
                      onChange={(e) => toggleAll(e.target.checked)}
                      sx={{ color: '#1976d2' }}
                    />
                  </TableCell>
                  {['Usuario', 'Email', 'Registros', 'Horas', 'Acciones'].map((header, index) => (
                    <TableCell key={index} sx={{ fontWeight: 700, color: '#1976d2' }}>
                      {header}
                    </TableCell>
                  ))}
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
                        <Checkbox 
                          checked={!!selected[uid]} 
                          onChange={(e) => toggleOne(uid, e.target.checked)}
                          sx={{ color: '#1976d2' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2" fontWeight={600}>
                            {nombre}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2">
                            {u.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AssignmentIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Chip
                            label={totalRegs}
                            color={totalRegs > 0 ? "primary" : "default"}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2" fontWeight={600}>
                            {totalHoras} hrs
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Gestionar registros">
                            <IconButton
                              size="small"
                              onClick={() => onOpenGestion?.(u)}
                              sx={{ color: '#1976d2' }}
                            >
                              <ManageIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer con acciones */}
          <Box sx={{ 
            p: 2, 
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderTop: '1px solid #e0e0e0'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupIcon sx={{ fontSize: 16, color: '#666' }} />
                <Typography variant="body2" color="text.secondary">
                  {selectedUserIds.length} usuarios seleccionados
                </Typography>
              </Box>
              <Tooltip title={`Eliminar ${selectedUserIds.length} usuarios seleccionados`}>
                <span>
                  <IconButton
                    color="error"
                    disabled={selectedRegistroIds.length === 0}
                    onClick={() => onDeleteUsuariosSeleccionados?.(selectedUserIds, selectedRegistroIds)}
                    sx={{ 
                      bgcolor: selectedRegistroIds.length > 0 ? 'rgba(244, 67, 54, 0.1)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
});

export default RegistrosPorFechaTable;