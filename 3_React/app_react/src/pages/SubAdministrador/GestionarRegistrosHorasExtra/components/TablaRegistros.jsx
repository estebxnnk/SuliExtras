import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TablePagination
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Cancel as RechazarIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const TablaRegistros = ({
  registrosPaginados,
  registrosFiltrados,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleVer,
  handleEditar,
  handleAprobar,
  handleRechazar,
  handleEliminar,
  getTipoHoraNombre,
  getEstadoChip,
  getUsuario,
  usuarios,
  hayFiltrosActivos
}) => {
  return (
    <Paper elevation={3} sx={{ 
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 3,
      overflow: 'hidden'
    }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' }}>
              {['Ubicación', 'Empleado', 'Fecha', 'Horas Extra', 'Tipo de Hora', 'Estado', 'Acciones'].map((header, index) => (
                <TableCell key={index} sx={{ color: 'white', fontWeight: 700 }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {registrosPaginados.length > 0 ? (
              registrosPaginados.map((registro) => {
                const usuario = getUsuario(registro.usuario, usuarios);
                return (
                  <TableRow key={registro.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2" fontWeight={600} color="#1976d2">
                          {registro.ubicacion}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2">
                          {usuario?.persona?.nombres || registro.nombres || 'N/A'} {usuario?.persona?.apellidos || registro.apellidos || ''}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {registro.fecha}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2" fontWeight={600}>
                          {registro.cantidadHorasExtra} hrs
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {getTipoHoraNombre(registro)}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const estadoChip = getEstadoChip(registro.estado);
                        return (
                          <Chip
                            label={estadoChip.label}
                            color={estadoChip.color}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => handleVer(registro)}
                            sx={{ color: '#1976d2' }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={registro.estado === 'aprobado' ? 'Cambiar Estado' : 'Editar'}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditar(registro)}
                            sx={{ color: '#ff9800' }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {registro.estado === 'pendiente' && (
                          <>
                            <Tooltip title="Aprobar">
                              <IconButton
                                size="small"
                                onClick={() => handleAprobar(registro)}
                                sx={{ color: '#4caf50' }}
                              >
                                <ApproveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Rechazar">
                              <IconButton
                                size="small"
                                onClick={() => handleRechazar(registro)}
                                sx={{ color: '#f44336' }}
                              >
                                <RechazarIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => handleEliminar(registro)}
                            sx={{ color: '#f44336' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    {hayFiltrosActivos 
                      ? 'No se encontraron registros con los filtros aplicados'
                      : 'No hay registros de horas extra disponibles'
                    }
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      {registrosFiltrados.length > 0 && (
        <TablePagination
          component="div"
          count={registrosFiltrados.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontWeight: 600,
              color: '#1976d2'
            }
          }}
        />
      )}
    </Paper>
  );
};

export default TablaRegistros;
