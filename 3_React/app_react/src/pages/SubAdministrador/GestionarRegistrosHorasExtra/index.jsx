import React, { useState, useEffect } from 'react';
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
  InputAdornment,
  Avatar,
  Divider,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Cancel as RechazarIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NavbarSubAdmin from '../NavbarSubAdmin';
import { 
  LoadingSpinner, 
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
import { useUniversalAlerts, useFiltrosAvanzados } from './hooks';
import { gestionarRegistrosHorasExtraService } from './services/gestionarRegistrosHorasExtraService';

function GestionarRegistrosHorasExtra() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // Estados principales
  const [registros, setRegistros] = useState([]);
  const [tiposHora, setTiposHora] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estados para diálogos
  const [openDialog, setOpenDialog] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [modo, setModo] = useState('ver'); // 'ver', 'editar'
  const [editData, setEditData] = useState({});

  // Estados para confirmaciones
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: '',
    registro: null,
    title: '',
    message: ''
  });

  // Hooks personalizados
  const { 
    alertState, 
    showSuccess, 
    showError, 
    showInfo,
    hideAlert 
  } = useUniversalAlerts();

  const {
    filtros,
    registrosFiltrados,
    actualizarFiltro,
    limpiarFiltros,
    estadisticasFiltros,
    hayFiltrosActivos
  } = useFiltrosAvanzados(registros);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar registros y tipos de hora en paralelo
      const [registrosData, tiposHoraData, usuariosData] = await Promise.all([
        gestionarRegistrosHorasExtraService.getRegistros(),
        gestionarRegistrosHorasExtraService.getTiposHora(),
        gestionarRegistrosHorasExtraService.getUsuarios()
      ]);

      setRegistros(registrosData);
      setTiposHora(tiposHoraData);
      setUsuarios(usuariosData);
      
      showSuccess(`Datos cargados exitosamente: ${registrosData.length} registros, ${tiposHoraData.length} tipos de hora y ${usuariosData.length} usuarios`);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showError('Error al cargar los datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const refrescarDatos = async () => {
    try {
      setRefreshing(true);
      await cargarDatos();
      showSuccess('Datos actualizados correctamente');
    } catch (error) {
      showError('Error al refrescar los datos');
    } finally {
      setRefreshing(false);
    }
  };

  const irACrearRegistro = () => {
    navigate('/crear-registro-horas-extra-subadmin');
  };

  // Calcular estadísticas adicionales
  const estadisticasAdicionales = {
    totalRegistros: registros.length,
    registrosFiltrados: registrosFiltrados.length,
    registrosPendientes: registros.filter(r => r.estado === 'pendiente').length,
    registrosAprobados: registros.filter(r => r.estado === 'aprobado').length,
    registrosRechazados: registros.filter(r => r.estado === 'rechazado').length,
    filtrosActivos: estadisticasFiltros.filtrosActivos
  };

  // Paginación
  const registrosPaginados = registrosFiltrados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Funciones de acción
  const handleVer = (registro) => {
    setModo('ver');
    setRegistroSeleccionado(registro);
    setOpenDialog(true);
  };

  const handleEditar = (registro) => {
    // Si el registro está aprobado, solo permitir cambiar el estado
    if (registro.estado === 'aprobado') {
      setModo('editar');
      setRegistroSeleccionado(registro);
      setEditData({
        estado: 'pendiente' // Solo permitir cambiar a pendiente
      });
      setOpenDialog(true);
      return;
    }

    // Para registros no aprobados, permitir edición completa
    setModo('editar');
    setRegistroSeleccionado(registro);
    
    // Obtener el tipo de hora del registro (como en PanelRegistrosHorasExtra.jsx)
    const tipoHoraId = (registro.Horas && registro.Horas.length > 0) ? registro.Horas[0].id : '';
    
    setEditData({
      fecha: registro.fecha,
      horaIngreso: registro.horaIngreso,
      horaSalida: registro.horaSalida,
      ubicacion: registro.ubicacion,
      cantidadHorasExtra: registro.cantidadHorasExtra,
      justificacionHoraExtra: registro.justificacionHoraExtra || '',
      tipoHoraId: tipoHoraId
    });
    setOpenDialog(true);
  };

  const handleAprobar = (registro) => {
    setConfirmDialog({
      open: true,
      action: 'aprobar',
      registro: registro,
      title: 'Confirmar Aprobación',
      message: `¿Estás seguro que deseas APROBAR el registro ${registro.numRegistro}?`
    });
  };

  const handleRechazar = (registro) => {
    setConfirmDialog({
      open: true,
      action: 'rechazar',
      registro: registro,
      title: 'Confirmar Rechazo',
      message: `¿Estás seguro que deseas RECHAZAR el registro ${registro.numRegistro}?`
    });
  };

  const handleEliminar = (registro) => {
    setConfirmDialog({
      open: true,
      action: 'eliminar',
      registro: registro,
      title: 'Confirmar Eliminación',
      message: `¿Estás seguro que deseas ELIMINAR el registro ${registro.numRegistro}?`
    });
  };

  // Guardar edición
  const handleGuardarEdicion = async () => {
    try {
      // Si solo se está editando el estado (registro aprobado)
      if (registroSeleccionado.estado === 'aprobado' && Object.keys(editData).length === 1 && editData.estado) {
        await gestionarRegistrosHorasExtraService.updateRegistro(registroSeleccionado.id, { estado: editData.estado });
        showSuccess('Estado del registro cambiado exitosamente');
        setOpenDialog(false);
        await cargarDatos();
        return;
      }

      // Para edición completa de registros no aprobados
      const dataToSend = {
        ...editData,
        horas: [
          {
            id: editData.tipoHoraId,
            cantidad: editData.cantidadHorasExtra
          }
        ]
      };
      delete dataToSend.tipoHoraId;

      await gestionarRegistrosHorasExtraService.updateRegistro(registroSeleccionado.id, dataToSend);
      showSuccess('Registro editado exitosamente');
      setOpenDialog(false);
      await cargarDatos();
    } catch (error) {
      showError('Error al actualizar el registro: ' + error.message);
    }
  };

  // Confirmar acción
  const confirmarAccion = async () => {
    const { action, registro } = confirmDialog;
    
    try {
      // Cerrar el diálogo de confirmación primero
      setConfirmDialog({ open: false, action: '', registro: null, title: '', message: '' });
      
      // Pequeña pausa para que se cierre el diálogo antes de mostrar el éxito
      await new Promise(resolve => setTimeout(resolve, 100));
      
      switch (action) {
        case 'aprobar':
          await gestionarRegistrosHorasExtraService.aprobarRegistro(registro.id);
          showSuccess('Registro aprobado exitosamente');
          break;
        case 'rechazar':
          await gestionarRegistrosHorasExtraService.rechazarRegistro(registro.id);
          showSuccess('Registro rechazado exitosamente');
          break;
        case 'eliminar':
          await gestionarRegistrosHorasExtraService.deleteRegistro(registro.id);
          showSuccess('Registro eliminado exitosamente');
          break;
        default:
          showError('Acción no reconocida');
          return;
      }
      
      // Recargar datos después de la acción
      await cargarDatos();
      
    } catch (error) {
      console.error(`Error al ${action} registro:`, error);
      showError(`Error al ${action} el registro: ${error.message}`);
    }
  };

  // Cerrar diálogo de confirmación
  const cerrarConfirmDialog = () => {
    setConfirmDialog({ open: false, action: '', registro: null, title: '', message: '' });
  };

  // Cerrar diálogo principal
  const cerrarDialog = () => {
    setOpenDialog(false);
    setRegistroSeleccionado(null);
    setEditData({});
  };

  // Obtener chip de estado
  const getEstadoChip = (estado) => {
    const estados = {
      pendiente: { color: 'warning', label: 'Pendiente' },
      aprobado: { color: 'success', label: 'Aprobado' },
      rechazado: { color: 'error', label: 'Rechazado' }
    };
    const config = estados[estado] || estados.pendiente;
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="outlined"
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  // Obtener nombre del tipo de hora (como en PanelRegistrosHorasExtra.jsx)
  const getTipoHoraNombre = (registro) => {
    if (registro.Horas && registro.Horas.length > 0) {
      return (
        <Box>
          {registro.Horas.map(hora => (
            <Box key={hora.id}>
              <Typography variant="body2" fontWeight={600} color="#9c27b0">
                {hora.tipo}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {hora.denominacion}
              </Typography>
              {hora.RegistroHora && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Cantidad: {hora.RegistroHora.cantidad}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      );
    }
    return (
      <Typography variant="body2" color="text.secondary">
        No asignado
      </Typography>
    );
  };

  // Obtener usuario por email (como en PanelRegistrosHorasExtra.jsx)
  const getUsuario = (email) => {
    return usuarios.find(u => u.email === email);
  };

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
        <LoadingSpinner message="Cargando módulo de gestión de registros..." size="large" />
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
        {/* Header */}
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
          
          {/* Botones de acción */}
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

        {/* Estadísticas */}
        <Paper elevation={2} sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
          border: '2px solid rgba(25, 118, 210, 0.2)',
          borderRadius: 3
        }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="#1976d2">
                  {estadisticasAdicionales.totalRegistros}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Registros
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="#4caf50">
                  {estadisticasAdicionales.registrosFiltrados}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registros Filtrados
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="#ff9800">
                  {estadisticasAdicionales.registrosPendientes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Por Aprobar
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="#4caf50">
                  {estadisticasAdicionales.registrosAprobados}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Aprobados
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="#f44336">
                  {estadisticasAdicionales.registrosRechazados}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rechazados
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="#9c27b0">
                  {tiposHora.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tipos de Hora
                </Typography>
              </Box>
            </Grid>
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

        {/* Tabla de Registros */}
        <Paper elevation={3} sx={{ 
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Ubicación</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Empleado</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Fecha</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Horas Extra</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Tipo de Hora</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Estado</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrosPaginados.length > 0 ? (
                  registrosPaginados.map((registro) => {
                    const usuario = getUsuario(registro.usuario);
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
                          {getEstadoChip(registro.estado)}
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
                const usuario = getUsuario(registroSeleccionado.usuario);
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
                      {getEstadoChip(registroSeleccionado.estado)}
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
        open={alertState.open}
        type={alertState.type}
        message={alertState.message}
        title={alertState.title}
        onClose={hideAlert}
        autoHideDuration={alertState.autoHideDuration}
        showLogo={true}
      />

      {/* Spinners de Éxito Específicos */}
      {/* Spinner de Cambio de Estado Exitoso (debe ir primero para evitar conflictos) */}
      <StateChangeSuccessSpinner
        open={alertState.type === 'success' && alertState.open && alertState.message.includes('Estado del registro cambiado') && !confirmDialog.open}
        message={alertState.message}
        showLogo={true}
        onComplete={hideAlert}
      />

      {/* Spinner de Eliminación Exitosa */}
      <DeleteSuccessSpinner
        open={alertState.type === 'success' && alertState.open && alertState.message.includes('eliminado') && !confirmDialog.open}
        message={alertState.message}
        showLogo={true}
        onComplete={hideAlert}
      />

      {/* Spinner de Edición Exitosa */}
      <EditSuccessSpinner
        open={alertState.type === 'success' && alertState.open && alertState.message.includes('editado') && !confirmDialog.open}
        message={alertState.message}
        showLogo={true}
        onComplete={hideAlert}
      />

      {/* Spinner de Aprobación Exitosa */}
      <ApproveSuccessSpinner
        open={alertState.type === 'success' && alertState.open && alertState.message.includes('aprobado') && !confirmDialog.open}
        message={alertState.message}
        showLogo={true}
        onComplete={hideAlert}
      />

      {/* Spinner de Rechazo Exitoso */}
      <RejectSuccessSpinner
        open={alertState.type === 'success' && alertState.open && alertState.message.includes('rechazado') && !confirmDialog.open}
        message={alertState.message}
        showLogo={true}
        onComplete={hideAlert}
      />

      {/* Spinner de Creación Exitosa */}
      <CreateSuccessSpinner
        open={alertState.type === 'success' && alertState.open && alertState.message.includes('creado') && !confirmDialog.open}
        message={alertState.message}
        showLogo={true}
        onComplete={hideAlert}
      />

      {/* Spinner de Éxito General (para otros casos) */}
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