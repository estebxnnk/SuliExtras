import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  SwapHoriz as SwapHorizIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import LoadingSpinner from './LoadingSpinner';

export const UsuariosTable = ({
  usuarios,
  search,
  onVer,
  onEditar,
  onEliminar,
  onCambiarRol,
  isMobile
}) => {
  const usuariosFiltrados = React.useMemo(() => {
    if (!search) return usuarios;
    const searchLower = search.toLowerCase();
    return usuarios.filter(usuario => {
      const nombre = `${usuario.persona?.nombres || ''} ${usuario.persona?.apellidos || ''}`.toLowerCase();
      const email = (usuario.email || '').toLowerCase();
      const documento = (usuario.persona?.numeroDocumento || '').toLowerCase();
      return (
        nombre.includes(searchLower) ||
        email.includes(searchLower) ||
        documento.includes(searchLower)
      );
    });
  }, [usuarios, search]);

  const getEstadoColor = (estado) => {
    const estadoLower = estado?.toLowerCase();
    if (estadoLower === 'activo' || estadoLower === 'active') return 'success';
    if (estadoLower === 'inactivo' || estadoLower === 'inactive') return 'error';
    if (estadoLower === 'pendiente' || estadoLower === 'pending') return 'warning';
    return 'default';
  };

  const getEstadoLabel = (estado) => {
    const estadoLower = estado?.toLowerCase();
    if (estadoLower === 'activo' || estadoLower === 'active') return 'Activo';
    if (estadoLower === 'inactivo' || estadoLower === 'inactive') return 'Inactivo';
    if (estadoLower === 'pendiente' || estadoLower === 'pending') return 'Pendiente';
    return estado || 'Sin estado';
  };

  return (
    <Box>
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(25, 118, 210, 0.1)' }}>
        <Typography
          variant="h5"
          color="#1976d2"
          fontWeight={700}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          <PersonIcon sx={{ color: '#1976d2' }} />
          Lista de Usuarios ({usuariosFiltrados.length})
        </Typography>
      </Box>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '& th': {
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  borderBottom: '2px solid rgba(255,255,255,0.2)',
                  whiteSpace: 'nowrap'
                }
              }}
            >
              <TableCell>Usuario</TableCell>
              {!isMobile && <TableCell>Documento</TableCell>}
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {usuariosFiltrados.map((usuario) => (
              <TableRow
                key={usuario.id}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.12) 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  },
                  '&:nth-of-type(even)': {
                    background: 'rgba(25, 118, 210, 0.02)'
                  }
                }}
              >
                <TableCell>
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
                        {usuario.persona?.nombres} {usuario.persona?.apellidos}
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
                          {usuario.email}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>

                {!isMobile && (
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#666',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem'
                      }}
                    >
                      {usuario.persona?.tipoDocumento}: {usuario.persona?.numeroDocumento}
                    </Typography>
                  </TableCell>
                )}

                <TableCell>
                  <Chip
                    label={usuario.rol?.nombre || 'Sin rol'}
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
                </TableCell>

                <TableCell>
                  <Chip
                    label={getEstadoLabel(usuario.estado)}
                    size="small"
                    color={getEstadoColor(usuario.estado)}
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
                </TableCell>

                <TableCell align="center">
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 1,
                      flexWrap: 'wrap'
                    }}
                  >
                    <Tooltip title="Ver detalles" arrow>
                      <IconButton
                        size={isMobile ? 'small' : 'medium'}
                        onClick={() => onVer(usuario)}
                        sx={{
                          color: '#2196f3',
                          background: 'rgba(33, 150, 243, 0.1)',
                          '&:hover': {
                            background: 'rgba(33, 150, 243, 0.2)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ViewIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Editar" arrow>
                      <IconButton
                        size={isMobile ? 'small' : 'medium'}
                        onClick={() => onEditar(usuario)}
                        sx={{
                          color: '#1976d2',
                          background: 'rgba(25, 118, 210, 0.1)',
                          '&:hover': {
                            background: 'rgba(25, 118, 210, 0.2)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Cambiar rol" arrow>
                      <IconButton
                        size={isMobile ? 'small' : 'medium'}
                        onClick={() => onCambiarRol(usuario)}
                        sx={{
                          color: '#ff9800',
                          background: 'rgba(255, 152, 0, 0.1)',
                          '&:hover': {
                            background: 'rgba(255, 152, 0, 0.2)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <SwapHorizIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar" arrow>
                      <IconButton
                        size={isMobile ? 'small' : 'medium'}
                        onClick={() => onEliminar(usuario)}
                        sx={{
                          color: '#f44336',
                          background: 'rgba(244, 67, 54, 0.1)',
                          '&:hover': {
                            background: 'rgba(244, 67, 54, 0.2)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {usuariosFiltrados.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,248,255,0.9) 100%)',
            borderRadius: 3,
            border: '2px dashed rgba(25, 118, 210, 0.3)',
            m: 3
          }}
        >
          <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {search
              ? 'No se encontraron usuarios que coincidan con la búsqueda'
              : 'No hay usuarios registrados'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {search
              ? 'Intenta con otros términos de búsqueda'
              : 'Los usuarios aparecerán aquí una vez que se registren'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
