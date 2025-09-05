import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
  Stack,
  Avatar,
  Box,
  Divider,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { 
  getEstadoInfo, 
  formatCurrency, 
  getDispositivoIcon 
} from '../utils/dispositivosUtils';

const ViewDialog = ({
  open,
  onClose,
  dispositivo,
  handleOpenDialog,
  isMobile
}) => {
  const theme = useTheme();
  
  if (!dispositivo) return null;
  
  const estadoInfo = getEstadoInfo(dispositivo.estado);
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
          {React.createElement(getDispositivoIcon(dispositivo.tipo).type)}
        </Avatar>
        <Box>
          <Typography variant="h6">{dispositivo.item}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {dispositivo.marca} {dispositivo.modelo}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Estado y estado funcional */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Chip 
                icon={React.createElement(estadoInfo.icon.type)}
                label={estadoInfo.label}
                color={estadoInfo.color}
                variant="filled"
                size="medium"
              />
              <Chip 
                icon={dispositivo.funcional ? <CheckCircleIcon /> : <WarningIcon />}
                label={dispositivo.funcional ? 'Funcional' : 'No Funcional'}
                color={dispositivo.funcional ? 'success' : 'error'}
                variant="filled"
                size="medium"
              />
            </Stack>
          </Grid>

          {/* Información General */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom>
              Información General
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Código de Activo</Typography>
              <Typography variant="body1">{dispositivo.codigoActivo || 'N/A'}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Serial</Typography>
              <Typography variant="body1">{dispositivo.serial || 'N/A'}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Tipo</Typography>
              <Typography variant="body1">{dispositivo.tipo || 'N/A'}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Clasificación</Typography>
              <Typography variant="body1">{dispositivo.clasificacion || 'N/A'}</Typography>
            </Box>
          </Grid>

          {/* Especificaciones Técnicas */}
          {(dispositivo.sistemaOperativo || dispositivo.procesador || dispositivo.memoria || dispositivo.almacenamiento) && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Especificaciones Técnicas
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              {dispositivo.sistemaOperativo && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Sistema Operativo</Typography>
                    <Typography variant="body1">{dispositivo.sistemaOperativo}</Typography>
                  </Box>
                </Grid>
              )}
              
              {dispositivo.procesador && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Procesador</Typography>
                    <Typography variant="body1">{dispositivo.procesador}</Typography>
                  </Box>
                </Grid>
              )}
              
              {dispositivo.memoria && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Memoria RAM</Typography>
                    <Typography variant="body1">{dispositivo.memoria}</Typography>
                  </Box>
                </Grid>
              )}
              
              {dispositivo.almacenamiento && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Almacenamiento</Typography>
                    <Typography variant="body1">{dispositivo.almacenamiento}</Typography>
                  </Box>
                </Grid>
              )}
              
              {dispositivo.direccionIP && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Dirección IP</Typography>
                    <Typography variant="body1">{dispositivo.direccionIP}</Typography>
                  </Box>
                </Grid>
              )}
              
              {dispositivo.direccionMAC && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Dirección MAC</Typography>
                    <Typography variant="body1">{dispositivo.direccionMAC}</Typography>
                  </Box>
                </Grid>
              )}
            </>
          )}

          {/* Ubicación y Asignación */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              Ubicación y Asignación
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Sede</Typography>
              <Typography variant="body1">{dispositivo.sede?.nombre || 'No asignada'}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Ubicación Detallada</Typography>
              <Typography variant="body1">{dispositivo.ubicacionDetallada || 'No especificada'}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box>
              <Typography variant="caption" color="text.secondary">Empleado Asignado</Typography>
              <Typography variant="body1">
                {dispositivo.empleadoAsignado ? 
                  `${dispositivo.empleadoAsignado.nombreCompleto} (${dispositivo.empleadoAsignado.cedula})` : 
                  'No asignado'
                }
              </Typography>
            </Box>
          </Grid>

          {/* Información Financiera */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              Información Financiera
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Costo</Typography>
              <Typography variant="h6" color="success.main" fontWeight={600}>
                {formatCurrency(dispositivo.costo)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Proveedor</Typography>
              <Typography variant="body1">{dispositivo.proveedor || 'N/A'}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Número de Factura</Typography>
              <Typography variant="body1">{dispositivo.numeroFactura || 'N/A'}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Fecha de Adquisición</Typography>
              <Typography variant="body1">
                {dispositivo.fechaAdquisicion ? 
                  new Date(dispositivo.fechaAdquisicion).toLocaleDateString('es-CO') : 
                  'N/A'
                }
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Fin de Garantía</Typography>
              <Typography variant="body1">
                {dispositivo.fechaFinGarantia ? 
                  new Date(dispositivo.fechaFinGarantia).toLocaleDateString('es-CO') : 
                  'N/A'
                }
              </Typography>
            </Box>
          </Grid>

          {/* Observaciones */}
          {dispositivo.observaciones && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Observaciones
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    {dispositivo.observaciones}
                  </Typography>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>
          Cerrar
        </Button>
        <Button onClick={() => {
          onClose();
          handleOpenDialog(dispositivo);
        }} variant="contained" startIcon={<EditIcon />}>
          Editar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDialog; 