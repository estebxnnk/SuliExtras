import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Alert
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

const TableUniversal = ({
  data = [],
  columns = [],
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  loading = false,
  emptyMessage = "No hay datos para mostrar",
  showPagination = true,
  showActions = true,
  actions = ['view', 'edit', 'delete'],
  customActions = [],
  title = "Tabla de Datos",
  subtitle = "Información del módulo",
  icon: Icon = InfoIcon,
  iconColor = "#1976d2",
  gradientColors = ["#f8f9fa", "#e9ecef"],
  children
}) => {
  const handleAction = (action, row) => {
    switch (action) {
      case 'view':
        onView?.(row);
        break;
      case 'edit':
        onEdit?.(row);
        break;
      case 'delete':
        onDelete?.(row);
        break;
      case 'approve':
        onApprove?.(row);
        break;
      case 'reject':
        onReject?.(row);
        break;
      default:
        break;
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'view':
        return <VisibilityIcon />;
      case 'edit':
        return <EditIcon />;
      case 'delete':
        return <DeleteIcon />;
      case 'approve':
        return <CheckCircleIcon />;
      case 'reject':
        return <CancelIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'view':
        return '#1976d2';
      case 'edit':
        return '#ed6c02';
      case 'delete':
        return '#d32f2f';
      case 'approve':
        return '#2e7d32';
      case 'reject':
        return '#d32f2f';
      default:
        return '#757575';
    }
  };

  const getActionTooltip = (action) => {
    switch (action) {
      case 'view':
        return 'Ver detalles';
      case 'edit':
        return 'Editar';
      case 'delete':
        return 'Eliminar';
      case 'approve':
        return 'Aprobar';
      case 'reject':
        return 'Rechazar';
      default:
        return 'Acción';
    }
  };

  // Estilos para chips de rol (por nombre)
  const getRoleChipSx = (roleName) => {
    const safe = typeof roleName === 'string' ? roleName : (roleName ?? '');
    const r = safe.toLowerCase();
    if (r.includes('admin')) {
      return {
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
        color: 'white',
        border: 'none',
      };
    }
    if (r.includes('subadministrador')) {
      return {
        background: 'linear-gradient(135deg,rgb(59, 31, 162) 0%,rgb(60, 62, 167) 100%)',
        color: 'white',
        border: 'none',
      };
    }
    if (r.includes('oper') || r.includes('user') || r.includes('usuario')) {
      return {
        background: 'linear-gradient(135deg, #388e3c 0%, #43a047 100%)',
        color: 'white',
        border: 'none',
      };
    }
    return {
      background: 'rgba(25, 118, 210, 0.1)',
      borderColor: '#1976d2',
      color: '#1976d2',
      borderWidth: 2
    };
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Cargando datos...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header de la Tabla */}
      <Box sx={{
        background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
        borderRadius: 2,
        p: 2,
        mb: 2,
        border: '1px solid #dee2e6',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar sx={{ bgcolor: iconColor, color: 'white' }}>
          <Icon />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={600} color="#495057">
            {title}
          </Typography>
          <Typography variant="body2" color="#6c757d">
            {subtitle}
          </Typography>
        </Box>
      </Box>

      {/* Contenido adicional antes de la tabla */}
      {children && (
        <Box sx={{ mb: 2 }}>
          {children}
        </Box>
      )}

      {/* Tabla */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    sx={{
                      fontWeight: 600,
                      color: '#495057',
                      borderBottom: '2px solid #dee2e6'
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: '#495057',
                      borderBottom: '2px solid #dee2e6',
                      minWidth: 120
                    }}
                  >
                    Acciones
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (showActions ? 1 : 0)} align="center">
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <WarningIcon sx={{ fontSize: 48, color: '#6c757d', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        {emptyMessage}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        No se encontraron registros que coincidan con los criterios de búsqueda
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    sx={{
                      '&:nth-of-type(odd)': { bgcolor: 'rgba(25, 118, 210, 0.02)' },
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(25,118,210,0.12) 100%)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align || 'left'}
                        sx={{ 
                          py: 2,
                          transition: 'background-color 0.2s ease, transform 0.1s ease',
                          '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                        }}
                      >
                        {column.render ? (
                          column.render(row[column.id], row)
                        ) : column.id === 'usuario' ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                background: '2px solid rgba(255,255,255,0.2)',
                                color: 'white',
                                width: 36,
                                height: 36,
                                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
                              }}
                            >
                              <PersonIcon sx={{ fontSize: 20 }} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1976d2' }}>
                                {`${row.persona?.nombres || row.nombre || row.name || 'Usuario'} ${row.persona?.apellidos || ''}`.trim()}
                              </Typography>
                              {row.email && (
                                <Typography variant="caption" color="text.secondary">{row.email}</Typography>
                              )}
                            </Box>
                          </Box>
                        ) : column.id === 'rol' ? (
                          <Chip
                            label={row.rol?.nombre || row[column.id] || 'Sin rol'}
                            size="small"
                            variant={getRoleChipSx(row.rol?.nombre || row[column.id])?.border ? 'outlined' : 'filled'}
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              ...getRoleChipSx(row.rol?.nombre || row[column.id])
                            }}
                          />
                        ) : column.id === 'documento' ? (
                          <Typography 
                            variant="body2" 
                            sx={{ fontWeight: 600, color: '#666', fontFamily: 'monospace' }}
                          >
                            {(row.persona?.tipoDocumento || row.tipoDocumento || 'N/A')}: {row.persona?.numeroDocumento || row.numeroDocumento || 'Sin documento'}
                          </Typography>
                        ) : column.id === 'ubicacion' ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon sx={{ fontSize: 18, color: '#ef5350' }} />
                            <Typography variant="body2">{row[column.id] || 'No asignada'}</Typography>
                          </Box>
                        ) : column.id === 'sede' ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon sx={{ fontSize: 18, color: '#ef5350' }} />
                            <Typography variant="body2">{row.usuario?.sede?.nombre || 'No asignada'}</Typography>
                          </Box>
                        ) : column.id === 'salario' ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AttachMoneyIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {row.persona?.salario ? 
                                `$${parseFloat(row.persona.salario).toLocaleString('es-CO', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}` : 
                                'No asignado'
                              }
                            </Typography>
                          </Box>
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell align="center" sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          {/* Acciones estándar */}
                          {actions.map((action) => (
                            <Tooltip key={action} title={getActionTooltip(action)}>
                              <IconButton
                                size="small"
                                onClick={() => handleAction(action, row)}
                                sx={{
                                  color: getActionColor(action),
                                  '&:hover': {
                                    bgcolor: `${getActionColor(action)}15`
                                  }
                                }}
                              >
                                {getActionIcon(action)}
                              </IconButton>
                            </Tooltip>
                          ))}
                          
                          {/* Acciones personalizadas */}
                          {customActions.map((customAction, index) => (
                            <Tooltip key={index} title={customAction.tooltip || 'Acción personalizada'}>
                              <IconButton
                                size="small"
                                onClick={() => customAction.onClick(row)}
                                sx={{
                                  color: customAction.color || '#757575',
                                  '&:hover': {
                                    bgcolor: `${customAction.color || '#757575'}15`
                                  }
                                }}
                              >
                                {customAction.icon}
                              </IconButton>
                            </Tooltip>
                          ))}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        {showPagination && data.length > 0 && (
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
              bgcolor: '#f8f9fa',
              borderTop: '1px solid #dee2e6'
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default TableUniversal;
