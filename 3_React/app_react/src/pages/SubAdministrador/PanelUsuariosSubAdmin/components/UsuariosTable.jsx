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

export const UsuariosTable = ({
  usuarios,
  search,
  onVer,
  onEditar,
  onEliminar,
  onCambiarRol,
  isMobile
}) => {
  // Filtrar usuarios según la búsqueda
  const usuariosFiltrados = React.useMemo(() => {
    if (!search) return usuarios;

    const searchLower = search.toLowerCase();
    return usuarios.filter(usuario => {
      const nombre = `${usuario.persona?.nombres || ''} ${usuario.persona?.apellidos || ''}`.toLowerCase();
      const email = (usuario.email || '').toLowerCase();
      const documento = (usuario.persona?.numeroDocumento || '').toLowerCase();

      return nombre.includes(searchLower) ||
        email.includes(searchLower) ||
        documento.includes(searchLower);
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
    <Card sx={{
      background: 'rgba(255,255,255,0.98)',
      backdropFilter: 'blur(20px)',
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
          Lista de Usuarios ({usuariosFiltrados.length})
        </Typography>

        <TableContainer sx={{ overflowX: 'auto', width: '100vw', height: '100vh', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    bgcolor: 'primary.main',
                    color: 'white',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Usuario
                </TableCell>

                {/* Ocultar Documento en móviles */}
                {!isMobile && (
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white', whiteSpace: 'nowrap' }}>
                    Documento
                  </TableCell>
                )}

                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white', whiteSpace: 'nowrap' }}>
                  Rol
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white', whiteSpace: 'nowrap' }}>
                  Estado
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    bgcolor: 'primary.main',
                    color: 'white',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {usuariosFiltrados.map((usuario, index) => (
                <TableRow
                  key={usuario.id}
                  sx={{
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                    bgcolor: index % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          width: isMobile ? 32 : 40,
                          height: isMobile ? 32 : 40
                        }}
                      >
                        <PersonIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {usuario.persona?.nombres} {usuario.persona?.apellidos}
                        </Typography>
                        {!isMobile && (
                          <Typography variant="caption" color="text.secondary">
                            {usuario.email}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2">
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
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getEstadoLabel(usuario.estado)}
                      size="small"
                      color={getEstadoColor(usuario.estado)}
                      variant="filled"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 0 : 0.5 }}>
                      <Tooltip title="Ver detalles" arrow>
                        <IconButton size={isMobile ? 'small' : 'medium'} color="info" onClick={() => onVer(usuario)}>
                          <ViewIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar" arrow>
                        <IconButton size={isMobile ? 'small' : 'medium'} color="primary" onClick={() => onEditar(usuario)}>
                          <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cambiar rol" arrow>
                        <IconButton size={isMobile ? 'small' : 'medium'} color="warning" onClick={() => onCambiarRol(usuario)}>
                          <SwapHorizIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar" arrow>
                        <IconButton size={isMobile ? 'small' : 'medium'} color="error" onClick={() => onEliminar(usuario)}>
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
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              {search ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios registrados'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 