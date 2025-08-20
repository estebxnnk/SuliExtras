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
  Info as InfoIcon
} from '@mui/icons-material';

const SubAdminTable = ({
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
                      '&:nth-of-type(odd)': { bgcolor: '#f8f9fa' },
                      '&:hover': { bgcolor: '#e3f2fd' },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align || 'left'}
                        sx={{ py: 2 }}
                      >
                        {column.render ? column.render(row[column.id], row) : row[column.id]}
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

export default SubAdminTable;
