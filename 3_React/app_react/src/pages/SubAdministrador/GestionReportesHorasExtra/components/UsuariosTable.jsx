import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Typography,
  Box
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import LoadingSpinner from './LoadingSpinner';

const UsuariosTable = ({ 
  usuarios, 
  search, 
  onVer, 
  onVerRegistros, 
  onVerReporte, 
  isMobile 
}) => {
  if (!usuarios || usuarios.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 8,
        background: 'rgba(255,255,255,0.8)',
        borderRadius: 3,
        border: '1px solid rgba(25, 118, 210, 0.1)'
      }}>
        {search ? (
          <>
            <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No se encontraron usuarios que coincidan con la búsqueda
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intenta con otros términos de búsqueda
            </Typography>
          </>
        ) : (
          <LoadingSpinner message="Cargando usuarios..." size="medium" />
        )}
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 3,
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid rgba(25, 118, 210, 0.15)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'auto'
      }}
    >
      <Table sx={{ minWidth: isMobile ? 300 : 650 }}>
        <TableHead>
          <TableRow sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            '& th': {
              color: 'white',
              fontWeight: 700,
              fontSize: isMobile ? '0.8rem' : '1rem',
              textAlign: 'center',
              borderBottom: '2px solid rgba(255,255,255,0.3)'
            }
          }}>
            <TableCell>Usuario</TableCell>
            <TableCell>Documento</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map((usuario, index) => (
            <TableRow 
              key={usuario.id} 
              sx={{ 
                '&:nth-of-type(odd)': { 
                  background: 'rgba(25, 118, 210, 0.02)' 
                },
                '&:hover': { 
                  background: 'rgba(25, 118, 210, 0.05)',
                  transform: 'scale(1.01)',
                  transition: 'all 0.2s ease'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: '#1976d2',
                      width: isMobile ? 32 : 40,
                      height: isMobile ? 32 : 40,
                      fontSize: isMobile ? '0.8rem' : '1rem',
                      fontWeight: 600
                    }}
                  >
                    {usuario.persona?.nombres?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#1976d2',
                        fontSize: isMobile ? '0.8rem' : '1rem'
                      }}
                    >
                      {usuario.persona?.nombres || 'Sin nombre'} {usuario.persona?.apellidos || ''}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
                    >
                      ID: {usuario.id}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              
              <TableCell>
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: isMobile ? '0.75rem' : '0.875rem'
                    }}
                  >
                    {usuario.persona?.tipoDocumento || 'N/A'}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: isMobile ? '0.7rem' : '0.75rem',
                      fontFamily: 'monospace'
                    }}
                  >
                    {usuario.persona?.numeroDocumento || 'Sin documento'}
                  </Typography>
                </Box>
              </TableCell>
              
              <TableCell>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#1976d2',
                    fontWeight: 500,
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  }}
                >
                  {usuario.email || 'Sin email'}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Chip 
                  label={usuario.rol?.nombre || 'Sin rol'} 
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: isMobile ? '0.7rem' : '0.75rem'
                  }}
                />
              </TableCell>
              
              <TableCell>
                <Chip 
                  label={usuario.estado || 'Activo'} 
                  size={isMobile ? "small" : "medium"}
                  color={usuario.estado === 'activo' ? 'success' : 'default'}
                  sx={{ 
                    fontWeight: 600,
                    fontSize: isMobile ? '0.7rem' : '0.75rem'
                  }}
                />
              </TableCell>
              
              <TableCell align="center">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Tooltip title="Ver detalles">
                    <IconButton
                      onClick={() => onVer(usuario)}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        color: '#1976d2',
                        '&:hover': {
                          background: 'rgba(25, 118, 210, 0.1)',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Ver registros de horas extra">
                    <IconButton
                      onClick={() => onVerRegistros(usuario)}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        color: '#4caf50',
                        '&:hover': {
                          background: 'rgba(76, 175, 80, 0.1)',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ListAltIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Generar reporte">
                    <IconButton
                      onClick={() => onVerReporte(usuario)}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        color: '#ff9800',
                        '&:hover': {
                          background: 'rgba(255, 152, 0, 0.1)',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ReceiptLongIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsuariosTable;
