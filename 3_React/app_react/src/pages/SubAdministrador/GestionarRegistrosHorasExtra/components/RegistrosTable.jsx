import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Typography, 
  Box,
  Chip,
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import LoadingSpinner from './LoadingSpinner';

function RegistrosTable({ 
  registros, 
  tiposHora, 
  usuarios, 
  loading, 
  handleVer, 
  handleEditar, 
  handleAprobar, 
  handleRechazar, 
  handleEliminar 
}) {
  const getEstadoChip = (estado) => {
    const estados = {
      pendiente: { 
        color: 'warning', 
        icon: <PendingIcon />, 
        label: 'Pendiente',
        background: 'rgba(255, 152, 0, 0.1)',
        borderColor: '#ff9800'
      },
      aprobado: { 
        color: 'success', 
        icon: <CheckCircleIcon />, 
        label: 'Aprobado',
        background: 'rgba(76, 175, 80, 0.1)',
        borderColor: '#4caf50'
      },
      rechazado: { 
        color: 'error', 
        icon: <CancelIcon />, 
        label: 'Rechazado',
        background: 'rgba(244, 67, 54, 0.1)',
        borderColor: '#f44336'
      }
    };
    const config = estados[estado] || estados.pendiente;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        variant="outlined"
        sx={{ 
          fontWeight: 700,
          fontSize: '0.85rem',
          background: config.background,
          borderColor: config.borderColor,
          borderWidth: 2,
          '&:hover': {
            background: config.background.replace('0.1', '0.2'),
            transform: 'scale(1.05)'
          },
          transition: 'all 0.2s ease'
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <LoadingSpinner message="Cargando registros..." size="medium" />
      </Box>
    );
  }

  if (registros.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 6,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,248,255,0.9) 100%)',
        borderRadius: 3,
        border: '2px dashed rgba(25, 118, 210, 0.3)'
      }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          No hay registros de horas extra
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Los registros aparecerán aquí una vez que se creen
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden',  }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ 
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              '& th': {
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                borderBottom: '2px solid rgba(255,255,255,0.2)'
              }
            }}>
              <TableCell>Nombres</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>Número de Documento</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Horas Extra</TableCell>
              <TableCell>Tipo de Hora</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
          {registros.map(registro => {
            // Buscar el tipo de hora correspondiente
            const tipoHora = tiposHora.find(tipo => tipo.id === registro.tipoHora);
            const usuario = usuarios.find(u => u.email === registro.usuario);
            
            return (
              <TableRow key={registro.id} hover sx={{ 
                transition: 'all 0.3s ease',
                '&:hover': { 
                  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.12) 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                },
                '&:nth-of-type(even)': {
                  background: 'rgba(25, 118, 210, 0.02)'
                }
              }}>
                <TableCell>{usuario?.persona?.nombres || registro.nombres || 'N/A'}</TableCell>
                <TableCell>{usuario?.persona?.apellidos || registro.apellidos || 'N/A'}</TableCell>
                <TableCell>{usuario?.persona?.numeroDocumento || registro.numeroDocumento || 'N/A'}</TableCell>
                <TableCell>{registro.fecha}</TableCell>
                <TableCell>{registro.cantidadHorasExtra} hrs</TableCell>
                <TableCell>
                  {registro.Horas && registro.Horas.length > 0 ? (
                    registro.Horas.map(hora => (
                      <Box key={hora.id}>
                        <Typography variant="body2" fontWeight={600}>{hora.tipo}</Typography>
                        <Typography variant="caption" color="text.secondary">{hora.denominacion}</Typography>
                        <Typography variant="caption" color="text.secondary">Cantidad: {hora.RegistroHora.cantidad}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No asignado</Typography>
                  )}
                </TableCell>
                <TableCell>{getEstadoChip(registro.estado)}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <IconButton 
                      onClick={() => handleVer(registro)} 
                      title="Ver detalles" 
                      sx={{ 
                        color: '#4caf50',
                        background: 'rgba(76, 175, 80, 0.1)',
                        '&:hover': {
                          background: 'rgba(76, 175, 80, 0.2)',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleEditar(registro)} 
                      title="Editar" 
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
                      <EditIcon />
                    </IconButton>
                    {registro.estado === 'pendiente' && (
                      <>
                        <IconButton 
                          onClick={() => handleAprobar(registro)} 
                          title="Aprobar" 
                          sx={{ 
                            color: '#4caf50',
                            background: 'rgba(76, 175, 80, 0.1)',
                            '&:hover': {
                              background: 'rgba(76, 175, 80, 0.2)',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleRechazar(registro)} 
                          title="Rechazar" 
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
                          <CancelIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton 
                      onClick={() => handleEliminar(registro)} 
                      title="Eliminar" 
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
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
    </Paper>
  );
}

export default RegistrosTable; 