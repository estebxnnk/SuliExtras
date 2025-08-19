import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
  Divider,
  Card
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Cancel as RechazarIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NavbarSubAdmin from '../NavbarSubAdmin';

// Hooks personalizados optimizados
import { 
  useGestionarRegistros, 
  useAccionesRegistros, 
  useEstadosRegistros,
  useUniversalAlerts,
  useFiltrosAvanzados
} from './hooks';

// Componentes optimizados
import { 
  UniversalAlert, 
  SuccessSpinner,
  DeleteSuccessSpinner,
  EditSuccessSpinner,
  ApproveSuccessSpinner,
  RejectSuccessSpinner,
  CreateSuccessSpinner,
  StateChangeSuccessSpinner,
  FiltrosAvanzados,
  ConfirmDialogWithLogo
} from './components';

// Utilidades
import { getEstadoChip, getTipoHoraNombre, getUsuario, calcularEstadisticas } from './utils/registrosUtils';

function GestionarRegistrosHorasExtra() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // Hooks personalizados optimizados
  const {
    registros,
    tiposHora,
    usuarios,
    loading,
    refreshing,
    cargarDatos,
    refrescarDatos
  } = useGestionarRegistros();

  const {
    alertState,
    showSuccess,
    showError,
    hideAlert
  } = useUniversalAlerts();

  const {
    aprobarRegistro,
    rechazarRegistro,
    eliminarRegistro,
    editarRegistro
  } = useAccionesRegistros(cargarDatos, showSuccess, showError);

  const {
    openDialog,
    registroSeleccionado,
    modo,
    editData,
    confirmDialog,
    page,
    rowsPerPage,
    setEditData,
    abrirDialog,
    cerrarDialog,
    abrirConfirmDialog,
    cerrarConfirmDialog,
    handleChangePage,
    handleChangeRowsPerPage
  } = useEstadosRegistros();

  const {
    filtros,
    registrosFiltrados,
    estadisticasFiltros,
    hayFiltrosActivos,
    actualizarFiltro,
    limpiarFiltros
  } = useFiltrosAvanzados(registros);

  // Calcular estadísticas
  const estadisticasAdicionales = calcularEstadisticas(registros, registrosFiltrados, estadisticasFiltros);

  // Paginación
  const registrosPaginados = registrosFiltrados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Funciones de acción optimizadas
  const handleVer = (registro) => abrirDialog(registro, 'ver');
  const handleEditar = (registro) => abrirDialog(registro, 'editar');
  const handleAprobar = (registro) => abrirConfirmDialog('aprobar', registro, 'Confirmar Aprobación', `¿Estás seguro que deseas APROBAR el registro ${registro.numRegistro}?`);
  const handleRechazar = (registro) => abrirConfirmDialog('rechazar', registro, 'Confirmar Rechazo', `¿Estás seguro que deseas RECHAZAR el registro ${registro.numRegistro}?`);
  const handleEliminar = (registro) => abrirConfirmDialog('eliminar', registro, 'Confirmar Eliminación', `¿Estás seguro que deseas ELIMINAR el registro ${registro.numRegistro}?`);

  const handleGuardarEdicion = async () => {
    try {
      const soloEstado = registroSeleccionado.estado === 'aprobado' && Object.keys(editData).length === 1 && editData.estado;
      await editarRegistro(registroSeleccionado.id, editData, soloEstado);
      cerrarDialog();
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  const confirmarAccion = async () => {
    const { action, registro } = confirmDialog;
    
    try {
      cerrarConfirmDialog();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      let resultado = false;
      switch (action) {
        case 'aprobar':
          resultado = await aprobarRegistro(registro);
          break;
        case 'rechazar':
          resultado = await rechazarRegistro(registro);
          break;
        case 'eliminar':
          resultado = await eliminarRegistro(registro);
          break;
        default:
          showError('Acción no reconocida');
          return;
      }
    } catch (error) {
      // Los errores ya se manejan en los hooks
    }
  };

  const irACrearRegistro = () => {
    navigate('/crear-registro-horas-extra-subadmin');
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos().catch(error => {
      showError('Error al cargar los datos: ' + error.message);
    });
  }, [cargarDatos, showError]);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        width: '100vw',
        background: "url('/img/Recepcion.jpg') no-repeat center center", 
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <SuccessSpinner message="Cargando módulo de gestión de registros..." size="large" />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw',
      background: "url('/img/Recepcion.jpg') no-repeat center center", 
      backgroundSize: 'cover',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <NavbarSubAdmin />
      
      <Paper elevation={8} sx={{ 
        borderRadius: 4, 
        p: 4,
        margin: '120px auto 40px auto', 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,248,255,0.98) 100%)',
        border: '1px solid rgba(25, 118, 210, 0.2)',
        position: 'relative',
        backdropFilter: 'blur(10px)',
        width: '95vw',
        maxWidth: 1400,
        overflow: 'hidden'
      }}>
        {/* Header optimizado */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <AccessTimeIcon sx={{ fontSize: 48, color: '#1976d2' }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" component="h1" fontWeight={800} color="#1976d2" sx={{ 
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Gestión de Registros de Horas Extra
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
              Administra y gestiona todos los registros de horas extra del sistema
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={refrescarDatos}
              disabled={refreshing}
              sx={{ 
                fontWeight: 600,
                borderRadius: 2,
                borderWidth: 2
              }}
            >
              {refreshing ? 'Actualizando...' : 'Actualizar'}
            </Button>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={irACrearRegistro}
              sx={{ 
                fontWeight: 700,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                }
              }}
            >
              Crear Registro
            </Button>
          </Box>
        </Box>

        {/* Estadísticas optimizadas */}
        <Paper elevation={2} sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
          border: '2px solid rgba(25, 118, 210, 0.2)',
          borderRadius: 3
        }}>
          <Grid container spacing={3}>
            {[
              { label: 'Total de Registros', value: estadisticasAdicionales.totalRegistros, color: '#1976d2' },
              { label: 'Registros Filtrados', value: estadisticasAdicionales.registrosFiltrados, color: '#4caf50' },
              { label: 'Por Aprobar', value: estadisticasAdicionales.registrosPendientes, color: '#ff9800' },
              { label: 'Aprobados', value: estadisticasAdicionales.registrosAprobados, color: '#4caf50' },
              { label: 'Rechazados', value: estadisticasAdicionales.registrosRechazados, color: '#f44336' },
              { label: 'Tipos de Hora', value: tiposHora.length, color: '#9c27b0' }
            ].map((stat, index) => (
              <Grid item xs={12} md={2} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Filtros Avanzados */}
        <FiltrosAvanzados
          search={filtros.search}
          onSearchChange={(valor) => actualizarFiltro('search', valor)}
          tipoHoraId={filtros.tipoHoraId}
          onTipoHoraChange={(valor) => actualizarFiltro('tipoHoraId', valor)}
          fechaInicio={filtros.fechaInicio}
          onFechaInicioChange={(valor) => actualizarFiltro('fechaInicio', valor)}
          fechaFin={filtros.fechaFin}
          onFechaFinChange={(valor) => actualizarFiltro('fechaFin', valor)}
          estado={filtros.estado}
          onEstadoChange={(valor) => actualizarFiltro('estado', valor)}
          tiposHora={tiposHora}
          onClearFilters={limpiarFiltros}
          isMobile={isMobile}
        />

        {/* Tabla de Registros optimizada */}
        <Paper elevation={3} sx={{ 
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' }}>
                  {['Ubicación', 'Empleado', 'Fecha', 'Horas Extra', 'Tipo de Hora', 'Estado', 'Acciones'].map((header, index) => (
                    <TableCell key={index} sx={{ color: 'white', fontWeight: 700 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {registrosPaginados.length > 0 ? (
                  registrosPaginados.map((registro) => {
                    const usuario = getUsuario(registro.usuario, usuarios);
                    return (
                      <TableRow key={registro.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2" fontWeight={600} color="#1976d2">
                              {registro.ubicacion}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2">
                              {usuario?.persona?.nombres || registro.nombres || 'N/A'} {usuario?.persona?.apellidos || registro.apellidos || ''}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {registro.fecha}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScheduleIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2" fontWeight={600}>
                              {registro.cantidadHorasExtra} hrs
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {getTipoHoraNombre(registro)}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const estadoChip = getEstadoChip(registro.estado);
                            return (
                              <Chip
                                label={estadoChip.label}
                                color={estadoChip.color}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            );
                          })()}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton
                                size="small"
                                onClick={() => handleVer(registro)}
                                sx={{ color: '#1976d2' }}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={registro.estado === 'aprobado' ? 'Cambiar Estado' : 'Editar'}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditar(registro)}
                                sx={{ color: '#ff9800' }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            {registro.estado === 'pendiente' && (
                              <>
                                <Tooltip title="Aprobar">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleAprobar(registro)}
                                    sx={{ color: '#4caf50' }}
                                  >
                                    <ApproveIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Rechazar">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRechazar(registro)}
                                    sx={{ color: '#f44336' }}
                                  >
                                    <RechazarIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                onClick={() => handleEliminar(registro)}
                                sx={{ color: '#f44336' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6" color="text.secondary">
                        {hayFiltrosActivos 
                          ? 'No se encontraron registros con los filtros aplicados'
                          : 'No hay registros de horas extra disponibles'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          {registrosFiltrados.length > 0 && (
            <TablePagination
              component="div"
              count={registrosFiltrados.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontWeight: 600,
                  color: '#1976d2'
                }
              }}
            />
          )}
        </Paper>

        {/* Información de filtros */}
        {hayFiltrosActivos && (
          <Paper elevation={1} sx={{ 
            mt: 3, 
            p: 2, 
            background: 'rgba(25, 118, 210, 0.1)',
            borderRadius: 2
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              🔍 Filtros aplicados: {estadisticasFiltros.porcentajeFiltrado}% de registros ocultados
            </Typography>
          </Paper>
        )}
      </Paper>

      {/* Diálogo para ver/editar registro */}
      <Dialog open={openDialog} onClose={cerrarDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {modo === 'ver' && <AccessTimeIcon sx={{ fontSize: 36, color: '#1976d2' }} />}
          {modo === 'ver' ? 'Detalles del Registro' : 
            (registroSeleccionado?.estado === 'aprobado' ? 'Cambiar Estado del Registro' : 'Editar Registro')}
        </DialogTitle>
        <DialogContent sx={{ background: modo === 'ver' ? '#f3f7fa' : 'inherit', borderRadius: 2 }}>
          {registroSeleccionado && modo === 'ver' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 72, height: 72, bgcolor: '#1976d2', mb: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 48, color: '#fff' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={700} color="#222" mb={1}>
                Registro #{registroSeleccionado.numRegistro}
              </Typography>
              <Divider sx={{ width: '100%', mb: 2 }} />
              
              {/* Información del usuario */}
              {(() => {
                const usuario = getUsuario(registroSeleccionado.usuario, usuarios);
                return (
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%' }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Empleado</Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {usuario?.persona?.nombres || registroSeleccionado.nombres || 'N/A'} {usuario?.persona?.apellidos || registroSeleccionado.apellidos || ''}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {usuario?.persona?.tipoDocumento || registroSeleccionado.tipoDocumento || 'N/A'}: {usuario?.persona?.numeroDocumento || registroSeleccionado.numeroDocumento || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {registroSeleccionado.usuario}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Fecha</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.fecha}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Hora de Ingreso</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.horaIngreso}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Hora de Salida</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.horaSalida}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Ubicación</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.ubicacion}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Horas Extra</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.cantidadHorasExtra} horas</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Bono Salarial</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.bono_salarial} horas extra de bono</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Horas a Mostrar</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.horas_extra_divididas} horas extra a mostrar</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Tipo(s) de Hora</Typography>
                      {registroSeleccionado.Horas && registroSeleccionado.Horas.length > 0 ? (
                        registroSeleccionado.Horas.map(hora => (
                          <Box key={hora.id}>
                            <Typography variant="body1" fontWeight={600} color="#9c27b0">
                              {hora.tipo}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {hora.denominacion} ({(hora.valor - 1) * 100}% recargo)
                            </Typography>
                            {hora.RegistroHora && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                Cantidad: {hora.RegistroHora.cantidad}
                              </Typography>
                            )}
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body1" fontWeight={600} color="text.secondary">
                          No asignado
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
                      {(() => {
                        const estadoChip = getEstadoChip(registroSeleccionado.estado);
                        return (
                          <Chip
                            label={estadoChip.label}
                            color={estadoChip.color}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        );
                      })()}
                    </Box>
                  </Box>
                );
              })()}
              
              {registroSeleccionado.justificacionHoraExtra && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Justificación</Typography>
                  <Typography variant="body1" sx={{ mt: 1, p: 2, background: '#f5f5f5', borderRadius: 1 }}>
                    {registroSeleccionado.justificacionHoraExtra}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          
          {registroSeleccionado && modo === 'editar' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              {/* Si el registro está aprobado, solo mostrar cambio de estado */}
              {registroSeleccionado.estado === 'aprobado' ? (
                <Card sx={{ p: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)', border: '1px solid #dee2e6' }}>
                  <Typography variant="h6" fontWeight={700} color="#495057" sx={{ mb: 3 }}>
                    Cambiar Estado del Registro
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Este registro está aprobado. Solo puedes cambiar su estado a pendiente para permitir futuras ediciones.
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        label="Nuevo Estado"
                        value={editData.estado || 'pendiente'}
                        onChange={e => setEditData({ ...editData, estado: e.target.value })}
                        fullWidth
                        sx={{ background: '#fff', borderRadius: 2 }}
                      >
                        <MenuItem value="pendiente">Pendiente</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Card>
              ) : (
                /* Para registros no aprobados, mostrar edición completa */
                <Card sx={{ p: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)', border: '1px solid #dee2e6' }}>
                  <Typography variant="h6" fontWeight={700} color="#495057" sx={{ mb: 3 }}>
                    Información del Registro
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Fecha"
                        type="date"
                        value={editData.fecha}
                        onChange={e => setEditData({ ...editData, fecha: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        sx={{ background: '#fff', borderRadius: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ubicación"
                        value={editData.ubicacion}
                        onChange={e => setEditData({ ...editData, ubicacion: e.target.value })}
                        fullWidth
                        sx={{ background: '#fff', borderRadius: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Hora de Ingreso"
                        type="time"
                        value={editData.horaIngreso}
                        onChange={e => setEditData({ ...editData, horaIngreso: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        sx={{ background: '#fff', borderRadius: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Hora de Salida"
                        type="time"
                        value={editData.horaSalida}
                        onChange={e => setEditData({ ...editData, horaSalida: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        sx={{ background: '#fff', borderRadius: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Cantidad de Horas Extra"
                        type="number"
                        value={editData.cantidadHorasExtra}
                        onChange={e => setEditData({ ...editData, cantidadHorasExtra: parseFloat(e.target.value) })}
                        fullWidth
                        sx={{ background: '#fff', borderRadius: 2 }}
                        inputProps={{ min: 1, step: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        label="Tipo de Hora Extra"
                        value={editData.tipoHoraId || ''}
                        onChange={e => setEditData({ ...editData, tipoHoraId: e.target.value })}
                        fullWidth
                        sx={{ background: '#fff', borderRadius: 2 }}
                      >
                        {tiposHora.map(tipo => (
                          <MenuItem key={tipo.id} value={tipo.id}>
                            {tipo.tipo} - {tipo.denominacion} ({(tipo.valor - 1) * 100}% recargo)
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Justificación"
                        value={editData.justificacionHoraExtra}
                        onChange={e => setEditData({ ...editData, justificacionHoraExtra: e.target.value })}
                        multiline
                        rows={3}
                        fullWidth
                        sx={{ background: '#fff', borderRadius: 2 }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialog}>Cerrar</Button>
          {modo === 'editar' && (
            <Button onClick={handleGuardarEdicion} variant="contained" color="success">
              {registroSeleccionado?.estado === 'aprobado' ? 'Cambiar Estado' : 'Guardar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Alertas Universales */}
      <UniversalAlert
        open={alertState.open && !confirmDialog.open}
        type={alertState.type}
        message={alertState.message}
        title={alertState.title}
        onClose={hideAlert}
        autoHideDuration={alertState.autoHideDuration}
        showLogo={true}
      />

      {/* Spinners de Éxito Específicos */}
      <StateChangeSuccessSpinner
        open={alertState.type === 'success' && alertState.open && alertState.message.includes('Estado del registro cambiado') && !confirmDialog.open}
        message={alertState.message}
        showLogo={true}
        onComplete={hideAlert}
      />

      <DeleteSuccessSpinner
        open={alertState.type === 'success' && alertState.open && alertState.message.includes('eliminado') && !confirmDialog.open}
        message={alertState.message}
        showLogo={true}
        onComplete={hideAlert}
      />

      <EditSuccessSpinner
        open={alertState.type === 'success' && alertState.open && alertState.message.includes('editado') && !confirmDialog.open}
        message={alertState.message}
        showLogo={true}
        onComplete={hideAlert}
      />

      <ApproveSuccessSpinner
        open={alertState.type === 'success' && alertState.open && alertState.message.includes('aprobado') && !confirmDialog.open}
        message={alertState.message}
        showLogo={true}
        onComplete={hideAlert}
      />

      <RejectSuccessSpinner
        open={alertState.type === 'success' && alertState.open && alertState.message.includes('rechazado') && !confirmDialog.open}
        message={alertState.message}
        showLogo={true}
        onComplete={hideAlert}
      />

      <CreateSuccessSpinner
        open={alertState.type === 'success' && alertState.open && alertState.message.includes('creado') && !confirmDialog.open}
        message={alertState.message}
        showLogo={true}
        onComplete={hideAlert}
      />

      <SuccessSpinner
        open={alertState.type === 'success' && alertState.open && 
              !alertState.message.includes('eliminado') && 
              !alertState.message.includes('editado') && 
              !alertState.message.includes('aprobado') && 
              !alertState.message.includes('rechazado') && 
              !alertState.message.includes('creado') &&
              !alertState.message.includes('Estado del registro cambiado') &&
              !confirmDialog.open}
        message={alertState.message}
        showLogo={true}
        onComplete={hideAlert}
      />

      {/* Diálogo de Confirmación */}
      <ConfirmDialogWithLogo
        open={confirmDialog.open}
        action={confirmDialog.action}
        data={confirmDialog.registro}
        onClose={cerrarConfirmDialog}
        onConfirm={confirmarAccion}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmButtonText={
          confirmDialog.action === 'aprobar' ? 'Aprobar' :
          confirmDialog.action === 'rechazar' ? 'Rechazar' :
          confirmDialog.action === 'eliminar' ? 'Eliminar' : 'Confirmar'
        }
      />
    </Box>
  );
}

export default GestionarRegistrosHorasExtra; 