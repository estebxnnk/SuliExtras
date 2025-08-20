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
  IconButton,
  Tooltip,
  TablePagination,
  Avatar,
  Chip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';

/**
 * Tabla universal que se basa 100% en el estilo de TablaRegistros
 * Mantiene la misma estética visual y estructura
 */
const SubAdminTableUniversal = ({
  // Datos y paginación
  data = [],
  columns = [],
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  
  // Título y descripción
  title = "Tabla Universal",
  subtitle = "Tabla personalizable con acciones",
  
  // Acciones estándar
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  
  // Acciones personalizadas
  customActions = [],
  
  // Personalización visual
  headerColor = "#1976d2",
  emptyMessage = "No se encontraron datos",
  
  // Estados
  loading = false,
  showPagination = true,
  
  // Configuración de usuario
  isUserTable = false,
  isMobile = false
}) => {
  // Generar acciones estándar
  const standardActions = [];
  
  if (onView) {
    standardActions.push({
      icon: <ViewIcon />,
      tooltip: 'Ver detalles',
      color: '#1976d2',
      onClick: onView
    });
  }
  
  if (onEdit) {
    standardActions.push({
      icon: <EditIcon />,
      tooltip: 'Editar',
      color: '#ff9800',
      onClick: onEdit
    });
  }
  
  if (onApprove) {
    standardActions.push({
      icon: <ApproveIcon />,
      tooltip: 'Aprobar',
      color: '#4caf50',
      onClick: onApprove
    });
  }
  
  if (onReject) {
    standardActions.push({
      icon: <RejectIcon />,
      tooltip: 'Rechazar',
      color: '#f44336',
      onClick: onReject
    });
  }
  
  if (onDelete) {
    standardActions.push({
      icon: <DeleteIcon />,
      tooltip: 'Eliminar',
      color: '#d32f2f',
      onClick: onDelete
    });
  }
  
  // Combinar acciones estándar con personalizadas
  const allActions = [...standardActions, ...customActions];
  
  return (
    <Paper elevation={3} sx={{ 
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 3,
      overflow: 'hidden',
      border: '1px solid rgba(25, 118, 210, 0.1)',
      boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)'
    }}>
      {/* Header de la tabla */}
      <Box sx={{ 
        p: 3, 
        background: `linear-gradient(135deg, ${headerColor} 0%, ${headerColor}dd 100%)`,
        color: 'white'
      }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      
      {/* Tabla */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ 
              background: `linear-gradient(135deg, ${headerColor} 0%, ${headerColor}dd 100%)`,
              '& th': {
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                borderBottom: '2px solid rgba(255,255,255,0.2)',
                whiteSpace: 'nowrap'
              }
            }}>
              {/* Columnas dinámicas */}
              {columns.map((column, index) => (
                <TableCell key={index} sx={{ color: 'white', fontWeight: 700 }}>
                  {column.label}
                </TableCell>
              ))}
              
              {/* Columna de acciones si hay acciones */}
              {allActions.length > 0 && (
                <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}>
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} hover sx={{ 
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.12) 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  },
                  '&:nth-of-type(odd)': { backgroundColor: 'rgba(25, 118, 210, 0.02)' }
                }}>
                  {/* Celdas de datos */}
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {isUserTable && column.id === 'usuario' ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                              color: 'white',
                              width: isMobile ? 32 : 40,
                              height: isMobile ? 32 : 40,
                              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <PersonIcon fontSize={isMobile ? 'small' : 'medium'} />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              color="#1976d2"
                              sx={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                            >
                              {row.persona?.nombres} {row.persona?.apellidos}
                            </Typography>
                            {!isMobile && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  fontWeight: 500,
                                  fontStyle: 'italic'
                                }}
                              >
                                {row.email}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ) : isUserTable && column.id === 'documento' ? (
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#666',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem'
                          }}
                        >
                          {row.persona?.tipoDocumento}: {row.persona?.numeroDocumento}
                        </Typography>
                      ) : isUserTable && column.id === 'rol' ? (
                        <Chip
                          label={row.rol?.nombre || 'Sin rol'}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            background: 'rgba(25, 118, 210, 0.1)',
                            borderColor: '#1976d2',
                            borderWidth: 2,
                            '&:hover': {
                              background: 'rgba(25, 118, 210, 0.2)',
                              transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        />
                      ) : isUserTable && column.id === 'estado' ? (
                        <Chip
                          label={row.estado === 'activo' ? 'Activo' : row.estado === 'inactivo' ? 'Inactivo' : row.estado || 'Sin estado'}
                          size="small"
                          color={row.estado === 'activo' ? 'success' : row.estado === 'inactivo' ? 'error' : 'default'}
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        />
                      ) : (
                        column.render ? column.render(row[column.id], row) : row[column.id]
                      )}
                    </TableCell>
                  ))}
                  
                  {/* Celdas de acciones */}
                  {allActions.length > 0 && (
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: 1,
                        flexWrap: 'wrap'
                      }}>
                        {allActions.map((action, actionIndex) => (
                          <Tooltip key={actionIndex} title={action.tooltip} arrow>
                            <IconButton
                              size="medium"
                              onClick={() => action.onClick(row)}
                              sx={{ 
                                color: action.color,
                                background: `${action.color}15`,
                                '&:hover': {
                                  background: `${action.color}30`,
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (allActions.length > 0 ? 1 : 0)} sx={{ textAlign: 'center', py: 6 }}>
                  <Box sx={{
                    textAlign: 'center',
                    py: 6,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,248,255,0.9) 100%)',
                    borderRadius: 3,
                    border: '2px dashed rgba(25, 118, 210, 0.3)',
                    m: 3
                  }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      {loading ? 'Cargando datos...' : emptyMessage}
                    </Typography>
                    {!loading && (
                      <Typography variant="body2" color="text.secondary">
                        No se encontraron registros para mostrar
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Paginación */}
      {showPagination && onPageChange && onRowsPerPageChange && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          sx={{
            backgroundColor: 'rgba(25, 118, 210, 0.02)',
            borderTop: '1px solid rgba(25, 118, 210, 0.1)',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontWeight: 600,
              color: 'text.primary'
            },
            '& .MuiTablePagination-select': {
              fontWeight: 600
            }
          }}
        />
      )}
    </Paper>
  );
};

export default SubAdminTableUniversal;
