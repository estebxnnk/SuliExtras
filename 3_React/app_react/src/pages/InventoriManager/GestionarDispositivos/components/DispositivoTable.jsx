import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Stack,
  Typography,
  Avatar,
  Tooltip,
  TablePagination
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Memory as MemoryIcon
} from '@mui/icons-material';
import { 
  getEstadoInfo, 
  formatCurrency, 
  getDispositivoColor, 
  getDispositivoIcon 
} from '../utils/dispositivosUtils';

const DispositivoTable = ({
  dispositivos,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleOpenViewDialog,
  handleOpenDialog,
  handleDelete,
  handleOpenAsignacionesDialog,
  totalCount,
  asignacionesActivas
}) => {
  // Función para obtener la información del empleado asignado
  const getEmpleadoAsignado = (dispositivo) => {
    if (dispositivo.estado !== 'ASIGNADO') {
      return null;
    }
    
    const asignacionActiva = asignacionesActivas[dispositivo.dispositivoId];
    if (!asignacionActiva) {
      return null;
    }
    
    const empleado = asignacionActiva.empleado;
    if (!empleado) {
      return null;
    }
    
    return empleado;
  };

  // Función para obtener el nombre completo del empleado
  const getNombreCompleto = (empleado) => {
    if (!empleado) return 'No asignado';
    
    // Si tiene nombreCompleto, usarlo
    if (empleado.nombreCompleto) {
      return empleado.nombreCompleto;
    }
    
    // Si no, construir el nombre con nombres y apellidos
    if (empleado.nombres || empleado.apellidos) {
      const nombres = empleado.nombres || '';
      const apellidos = empleado.apellidos || '';
      return `${nombres} ${apellidos}`.trim() || 'Sin nombre';
    }
    
    // Si no tiene ninguno, usar un valor por defecto
    return empleado.cedula || empleado.empleadoId || 'Empleado sin identificar';
  };

  return (
    <Card sx={{ 
      background: 'rgba(255,255,255,0.98)', 
      backdropFilter: 'blur(20px)',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                  Dispositivo
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                  Identificación
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                  Especificaciones
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                  Estado
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                  Asignación
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                  Costo
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dispositivos.map((dispositivo, index) => {
                const estadoInfo = getEstadoInfo(dispositivo.estado);
                const empleadoAsignado = getEmpleadoAsignado(dispositivo);
                
                return (
                  <TableRow 
                    key={dispositivo.dispositivoId}
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                      bgcolor: index % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: getDispositivoColor(dispositivo.tipo),
                          color: 'white',
                          width: 42,
                          height: 42,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}>
                          {React.createElement(getDispositivoIcon(dispositivo.tipo).type)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {dispositivo.item}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dispositivo.marca} {dispositivo.modelo}
                          </Typography>
                          {dispositivo.tipo && (
                            <Typography variant="caption" color="primary" sx={{ display: 'block', fontWeight: 500 }}>
                              {dispositivo.tipo}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {dispositivo.codigoActivo || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Serial: {dispositivo.serial || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {dispositivo.tipo || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Stack spacing={1}>
                        <Chip 
                          icon={React.createElement(estadoInfo.icon.type)}
                          label={estadoInfo.label}
                          color={estadoInfo.color}
                          size="small"
                          variant="filled"
                          onClick={dispositivo.estado === 'ASIGNADO' ? () => handleOpenAsignacionesDialog(dispositivo) : undefined}
                          sx={{
                            cursor: dispositivo.estado === 'ASIGNADO' ? 'pointer' : 'default',
                            '&:hover': dispositivo.estado === 'ASIGNADO' ? {
                              transform: 'scale(1.05)',
                              boxShadow: 2
                            } : {}
                          }}
                        />
                        <Chip 
                          label={dispositivo.funcional ? 'Funcional' : 'No Funcional'}
                          color={dispositivo.funcional ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {getNombreCompleto(empleadoAsignado)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dispositivo.sede?.nombre || 'Sin sede'}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {formatCurrency(dispositivo.costo)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Ver detalles" arrow>
                          <IconButton 
                            size="small" 
                            color="info" 
                            onClick={() => handleOpenViewDialog(dispositivo)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar" arrow>
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => handleOpenDialog(dispositivo)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar" arrow>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDelete(dispositivo.dispositivoId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        {dispositivos.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <MemoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No se encontraron dispositivos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intenta ajustar los filtros de búsqueda
            </Typography>
          </Box>
        )}
        
        {/* Paginación */}
        <TablePagination
          component="div"
          count={totalCount || dispositivos.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
          sx={{
            borderTop: '1px solid rgba(224, 224, 224, 1)',
            bgcolor: 'rgba(0,0,0,0.02)'
          }}
        />
      </CardContent>
    </Card>
  );
};

export default DispositivoTable; 