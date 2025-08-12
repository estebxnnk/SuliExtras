import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent
} from '@mui/material';
import {
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

export const UsuarioDialog = ({
  open,
  usuario,
  registros,
  onClose,
  isMobile
}) => {
  if (!usuario) return null;

  const getEstadoColor = (estado) => {
    const estadoLower = estado?.toLowerCase();
    if (estadoLower === 'aprobado' || estadoLower === 'approved') return 'success';
    if (estadoLower === 'pendiente' || estadoLower === 'pending') return 'warning';
    if (estadoLower === 'rechazado' || estadoLower === 'rejected') return 'error';
    return 'default';
  };

  const getEstadoLabel = (estado) => {
    const estadoLower = estado?.toLowerCase();
    if (estadoLower === 'aprobado' || estadoLower === 'approved') return 'Aprobado';
    if (estadoLower === 'pendiente' || estadoLower === 'pending') return 'Pendiente';
    if (estadoLower === 'rechazado' || estadoLower === 'rejected') return 'Rechazado';
    return estado || 'Sin estado';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
          <PersonIcon />
        </Avatar>
        <Box>
          <Typography variant="h6">
            Detalles del Usuario
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {usuario.persona?.nombres} {usuario.persona?.apellidos}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Información del Usuario */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Información Personal
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">Nombre Completo</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {usuario.persona?.nombres} {usuario.persona?.apellidos}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {usuario.email}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">Documento</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {usuario.persona?.tipoDocumento}: {usuario.persona?.numeroDocumento}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">Fecha de Nacimiento</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatDate(usuario.persona?.fechaNacimiento)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Información del Sistema */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Información del Sistema
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">Rol</Typography>
                  <Chip
                    label={usuario.rol?.nombre || 'Sin rol'}
                    color="primary"
                    variant="filled"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">Estado</Typography>
                  <Chip
                    label={usuario.estado || 'Sin estado'}
                    color={usuario.estado === 'activo' ? 'success' : 'warning'}
                    variant="filled"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">Fecha de Registro</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatDate(usuario.createdAt || usuario.fechaCreacion)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Registros del Usuario */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AccessTimeIcon color="primary" />
                  <Typography variant="h6" color="primary">
                    Registros de Horas Extra
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                {registros.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Hora Ingreso</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Hora Salida</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Horas Extra</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {registros.slice(0, 10).map((registro, index) => (
                          <TableRow key={registro.id || index}>
                            <TableCell>{formatDate(registro.fecha)}</TableCell>
                            <TableCell>{registro.horaIngreso || 'N/A'}</TableCell>
                            <TableCell>{registro.horaSalida || 'N/A'}</TableCell>
                            <TableCell>{registro.cantidadHorasExtra || 'N/A'}</TableCell>
                            <TableCell>
                              <Chip
                                label={getEstadoLabel(registro.estado)}
                                size="small"
                                color={getEstadoColor(registro.estado)}
                                variant="filled"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <AccessTimeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No hay registros de horas extra
                    </Typography>
                  </Box>
                )}
                
                {registros.length > 10 && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Mostrando 10 de {registros.length} registros
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 