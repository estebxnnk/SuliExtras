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
  Visibility as VisibilityIcon,
  Person as PersonIcon
} from '@mui/icons-material';

export const UsuariosTable = ({
  usuarios,
  rolFiltro,
  datePreset,
  onVerUsuario,
  isMobile
}) => {
  // Filtrar usuarios según los filtros aplicados
  const usuariosFiltrados = React.useMemo(() => {
    let filtrados = usuarios;
    
    if (rolFiltro) {
      filtrados = filtrados.filter(u => u.rol?.id === rolFiltro);
    }
    
    // Filtrar por fecha si no es 'all'
    if (datePreset !== 'all') {
      const today = new Date();
      let from = null, to = null;
      
      if (datePreset === 'today') {
        from = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        to = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      } else if (datePreset === '7d') {
        from = new Date(today);
        from.setDate(today.getDate() - 6);
        from.setHours(0,0,0,0);
        to = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      } else if (datePreset === '1m') {
        from = new Date(today);
        from.setMonth(today.getMonth() - 1);
        from.setHours(0,0,0,0);
        to = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      }
      
      if (from && to) {
        filtrados = filtrados.filter(u => {
          const fecha = new Date(u.createdAt || u.fechaCreacion || u.persona?.fechaCreacion || u.fechaRegistro);
          return fecha >= from && fecha <= to;
        });
      }
    }
    
    return filtrados;
  }, [usuarios, rolFiltro, datePreset]);

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
      height: '100%',
      background: 'rgba(255,255,255,0.98)',
      backdropFilter: 'blur(20px)',
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
          Usuarios Recientes
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                  Usuario
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                  Rol
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                  Estado
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosFiltrados.slice(0, 10).map((usuario, index) => (
                <TableRow 
                  key={usuario.id}
                  sx={{ 
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                    bgcolor: index % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 32,
                        height: 32
                      }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {usuario.persona?.nombres} {usuario.persona?.apellidos}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {usuario.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
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
                    <Tooltip title="Ver detalles" arrow>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => onVerUsuario(usuario.id)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {usuariosFiltrados.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No se encontraron usuarios
            </Typography>
          </Box>
        )}
        
        {usuariosFiltrados.length > 10 && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Mostrando 10 de {usuariosFiltrados.length} usuarios
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 