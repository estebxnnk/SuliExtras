import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  Divider,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Memory as MemoryIcon,
  Mouse as MouseIcon,
  Keyboard as KeyboardIcon,
  Cable as CableIcon,
  Headset as HeadsetIcon,
  Extension as ExtensionIcon,
  ExpandMore as ExpandMoreIcon,
  AccountCircle as AccountCircleIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Computer as ComputerIcon,
  Print as PrintIcon,
  Phone as PhoneIcon,
  Router as RouterIcon,
  Storage as StorageIcon,
  Tablet as TabletIcon,
  Monitor as MonitorIcon,
  Scanner as ScannerIcon,
  Videocam as VideocamIcon,
  Camera as CameraIcon,
  Tv as TvIcon,
  Speaker as SpeakerIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

const AsignacionesDialog = ({ 
  open, 
  onClose, 
  dispositivo,
  asignaciones,
  loadingAsignaciones,
  isMobile
}) => {
  if (!dispositivo) return null;

  const asignacionActual = asignaciones.find(a => a.estado === 'ACTIVA');
  const asignacionesHistoricas = asignaciones.filter(a => a.estado !== 'ACTIVA');

  // Función para obtener el icono del dispositivo principal
  const getDispositivoIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'laptop':
      case 'computador':
      case 'computadora':
      case 'pc':
      case 'desktop':
        return <ComputerIcon />;
      case 'impresora':
      case 'printer':
        return <PrintIcon />;
      case 'teléfono':
      case 'telefono':
      case 'celular':
      case 'móvil':
      case 'movil':
      case 'smartphone':
        return <PhoneIcon />;
      case 'tablet':
      case 'tableta':
        return <TabletIcon />;
      case 'router':
      case 'switch':
      case 'modem':
        return <RouterIcon />;
      case 'servidor':
      case 'server':
        return <StorageIcon />;
      case 'monitor':
      case 'pantalla':
      case 'display':
        return <MonitorIcon />;
      case 'scanner':
      case 'escáner':
      case 'escaner':
        return <ScannerIcon />;
      case 'cámara':
      case 'camara':
      case 'camera':
        return <CameraIcon />;
      case 'videocámara':
      case 'videocamara':
      case 'videocam':
        return <VideocamIcon />;
      case 'televisor':
      case 'tv':
      case 'television':
        return <TvIcon />;
      case 'parlante':
      case 'altavoz':
      case 'speaker':
      case 'bocina':
        return <SpeakerIcon />;
      case 'cámara de seguridad':
      case 'camara de seguridad':
      case 'security camera':
      case 'cctv':
        return <SecurityIcon />;
      default:
        return <MemoryIcon />;
    }
  };

  // Función para obtener el icono del accesorio
  const getAccesorioIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'mouse':
      case 'ratón':
        return <MouseIcon />;
      case 'teclado':
      case 'keyboard':
        return <KeyboardIcon />;
      case 'cable':
      case 'cables':
        return <CableIcon />;
      case 'audífonos':
      case 'audifonos':
      case 'headset':
        return <HeadsetIcon />;
      case 'memoria':
      case 'usb':
      case 'pendrive':
        return <MemoryIcon />;
      default:
        return <ExtensionIcon />;
    }
  };

  // Componente para mostrar accesorios
  const AccesoriosList = ({ accesorios, title = "Accesorios Asignados" }) => {
    if (!accesorios || accesorios.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No hay accesorios asignados
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
          {title}
        </Typography>
        <List dense sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
          {accesorios.map((accesorio, index) => (
            <ListItem key={index} sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1, mb: 1 }}>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                  {getAccesorioIcon(accesorio.tipo || accesorio.tipoAccesorio)}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={accesorio.nombre || accesorio.item || 'Accesorio'}
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">
                      {accesorio.marca && `Marca: ${accesorio.marca}`}
                      {accesorio.modelo && ` | Modelo: ${accesorio.modelo}`}
                    </Typography>
                    {accesorio.serial && (
                      <Typography variant="caption" display="block">
                        Serial: {accesorio.serial}
                      </Typography>
                    )}
                    {(accesorio.estado || accesorio.estadoAccesorio) && (
                      <Chip
                        label={accesorio.estado || accesorio.estadoAccesorio}
                        size="small"
                        color={accesorio.estado === 'FUNCIONAL' || accesorio.estadoAccesorio === 'FUNCIONAL' ? 'success' : 'default'}
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
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
        background: 'linear-gradient(135deg, #0d47a1, #1976d2)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', width: 48, height: 48 }}>
            {getDispositivoIcon(dispositivo.tipo)}
          </Avatar>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', width: 32, height: 32 }}>
            <AssignmentIcon fontSize="small" />
          </Avatar>
        </Box>
        <Box>
          <Typography variant="h6">Asignaciones y Accesorios</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {dispositivo.item} - {dispositivo.codigoActivo || 'Sin código'}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip 
              label={dispositivo.tipo || 'Dispositivo'}
              size="small"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                fontSize: '0.7rem',
                height: '20px'
              }}
            />
            Historial completo de asignaciones y accesorios
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loadingAsignaciones ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {/* Asignación Actual */}
            <Typography variant="h6" color="primary" gutterBottom>
              Asignación Actual
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {asignacionActual ? (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">Empleado</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {asignacionActual.empleado.nombreCompleto}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {asignacionActual.empleado.cedula}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">Ubicación</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {asignacionActual.sede.nombre} - {asignacionActual.area.nombre}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">Fecha de Asignación</Typography>
                      <Typography variant="body1">
                        {new Date(asignacionActual.fechaAsignacion).toLocaleDateString('es-CO')}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">Estado</Typography>
                      <Chip 
                        label={asignacionActual.estado}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Grid>

                    {/* Campos adicionales */}
                    {asignacionActual.tipoAsignacion && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">Tipo de Asignación</Typography>
                        <Typography variant="body1">
                          {asignacionActual.tipoAsignacion}
                        </Typography>
                      </Grid>
                    )}

                    {asignacionActual.fechaVencimiento && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">Fecha de Vencimiento</Typography>
                        <Typography variant="body1">
                          {new Date(asignacionActual.fechaVencimiento).toLocaleDateString('es-CO')}
                        </Typography>
                      </Grid>
                    )}

                    {asignacionActual.responsableAsignacion && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">Responsable de Asignación</Typography>
                        <Typography variant="body1">
                          {asignacionActual.responsableAsignacion.nombreCompleto || asignacionActual.responsableAsignacion}
                        </Typography>
                      </Grid>
                    )}

                    {asignacionActual.prioridad && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">Prioridad</Typography>
                        <Chip 
                          label={asignacionActual.prioridad}
                          color={asignacionActual.prioridad === 'ALTA' ? 'error' : asignacionActual.prioridad === 'MEDIA' ? 'warning' : 'default'}
                          size="small"
                        />
                      </Grid>
                    )}

                    {asignacionActual.condicionesUso && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Condiciones de Uso</Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          {asignacionActual.condicionesUso}
                        </Typography>
                      </Grid>
                    )}

                    {asignacionActual.observaciones && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Observaciones</Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          {asignacionActual.observaciones}
                        </Typography>
                      </Grid>
                    )}

                    {/* Sección de Accesorios */}
                    <Grid item xs={12}>
                      <AccesoriosList accesorios={asignacionActual.accesorios || asignacionActual.accesoriosAsignados} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  No hay asignación activa actualmente
                </Typography>
              </Box>
            )}

            {/* Historial de Asignaciones */}
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 3 }}>
              Historial de Asignaciones
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {asignacionesHistoricas.length > 0 ? (
              <Box>
                {asignacionesHistoricas.map((asignacion) => (
                  <Card key={asignacion.asignacionId} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Empleado</Typography>
                          <Typography variant="body1">
                            {asignacion.empleado.nombreCompleto}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Ubicación</Typography>
                          <Typography variant="body1">
                            {asignacion.sede.nombre} - {asignacion.area.nombre}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Typography variant="caption" color="text.secondary">Fecha Asignación</Typography>
                          <Typography variant="body2">
                            {new Date(asignacion.fechaAsignacion).toLocaleDateString('es-CO')}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Typography variant="caption" color="text.secondary">Fecha Finalización</Typography>
                          <Typography variant="body2">
                            {asignacion.fechaFinalizacion ? 
                              new Date(asignacion.fechaFinalizacion).toLocaleDateString('es-CO') : 'N/A'}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Typography variant="caption" color="text.secondary">Estado</Typography>
                          <Chip 
                            label={asignacion.estado}
                            color={asignacion.estado === 'FINALIZADA' ? 'secondary' : 'default'}
                            size="small"
                          />
                        </Grid>

                        {asignacion.motivoFinalizacion && (
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">Motivo Finalización</Typography>
                            <Typography variant="body2">
                              {asignacion.motivoFinalizacion}
                            </Typography>
                          </Grid>
                        )}

                        {/* Campos adicionales en historial */}
                        {asignacion.tipoAsignacion && (
                          <Grid item xs={12} md={4}>
                            <Typography variant="caption" color="text.secondary">Tipo Asignación</Typography>
                            <Typography variant="body2">
                              {asignacion.tipoAsignacion}
                            </Typography>
                          </Grid>
                        )}

                        {asignacion.responsableAsignacion && (
                          <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="text.secondary">Responsable</Typography>
                            <Typography variant="body2">
                              {asignacion.responsableAsignacion.nombreCompleto || asignacion.responsableAsignacion}
                            </Typography>
                          </Grid>
                        )}

                        {asignacion.prioridad && (
                          <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="text.secondary">Prioridad</Typography>
                            <Chip 
                              label={asignacion.prioridad}
                              color={asignacion.prioridad === 'ALTA' ? 'error' : asignacion.prioridad === 'MEDIA' ? 'warning' : 'default'}
                              size="small"
                            />
                          </Grid>
                        )}

                        {asignacion.condicionesUso && (
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">Condiciones de Uso</Typography>
                            <Typography variant="body2">
                              {asignacion.condicionesUso}
                            </Typography>
                          </Grid>
                        )}

                        {asignacion.observaciones && (
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">Observaciones</Typography>
                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                              {asignacion.observaciones}
                            </Typography>
                          </Grid>
                        )}

                        {/* Accesorios en historial */}
                        {(asignacion.accesorios || asignacion.accesoriosAsignados) && (asignacion.accesorios?.length > 0 || asignacion.accesoriosAsignados?.length > 0) && (
                          <Grid item xs={12}>
                            <Accordion sx={{ mt: 1 }}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle2" color="primary">
                                  Accesorios Asignados ({(asignacion.accesorios || asignacion.accesoriosAsignados)?.length || 0})
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <AccesoriosList 
                                  accesorios={asignacion.accesorios || asignacion.accesoriosAsignados} 
                                  title=""
                                />
                              </AccordionDetails>
                            </Accordion>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  No hay asignaciones históricas registradas
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AsignacionesDialog;