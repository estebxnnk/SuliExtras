import React, { useEffect, useContext, useMemo, useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Divider, 
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Grid,
  Checkbox,
  FormGroup,
  MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LayoutAdministrador from '../components/LayoutAdministrador';
import { 
  SubAdminUniversalAlertUniversal,
  StatsUniversal,
  SubAdminLoadingSpinner,
  SubAdminCreateSuccessSpinner,
  SubAdminEditSuccessSpinner,
  SubAdminDeleteSuccessSpinner
} from '../../../components';

import {
  HeaderGestionSedes,
  TablaSedes
} from './components';
import { useGestionSedes } from './hooks/useGestionSedes.js';
import { useAccionesSedes } from './hooks/useAccionesSedes.js';
import { useAlertasSedes } from './hooks/useAlertasSedes.js';

import { gestionSedesService } from './services';

function GestionSedes() {
  // Hooks personalizados
  const {
    sedes,
    setSedes,
    openDialog,
    setOpenDialog,
    sedeSeleccionada,
    setSedeSeleccionada,
    openHorarios,
    setOpenHorarios,
    horarios,
    setHorarios,
    loadingHorarios,
    setLoadingHorarios,
    page,
    rowsPerPage,
    openFormulario,
    setOpenFormulario,
    modoEdicion,
    setModoEdicion,
    sedesPagina,
    handleChangePage,
    handleChangeRowsPerPage,
    search,
    setSearch,
    openHorarioDialog,
    setOpenHorarioDialog,
    nuevoHorario,
    setNuevoHorario,
    showCreateHorarioSpinner,
    setShowCreateHorarioSpinner,
    showHorarioAlert,
    setShowHorarioAlert,
    horarioAlertMessage,
    setHorarioAlertMessage
  } = useGestionSedes();

  // Estados para formulario
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    email: '',
    descripcion: '',
    estado: true
  });

  // Sedes filtradas por búsqueda
  const sedesConFiltros = useMemo(() => {
    return sedes.filter(sede => {
      const searchMatch = !search || 
        (sede.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
        (sede.ciudad || '').toLowerCase().includes(search.toLowerCase()) ||
        (sede.direccion || '').toLowerCase().includes(search.toLowerCase());
      return searchMatch;
    });
  }, [sedes, search]);

  const {
    alertState,
    setAlertState,
    hideAlert,
    loadingState,
    setLoadingState,
    hideLoading,
    successState,
    setSuccessState,
    hideSuccess
  } = useAlertasSedes();

  const {
    handleRefresh,
    handleVerDetalles,
    handleVerHorarios,
    handleEditarSede,
    handleEliminarSede,
    handleCrearSede,
    handleActualizarSede
  } = useAccionesSedes(setAlertState, setLoadingState, setSedes, setSuccessState);

  const fetchSedes = useCallback(async () => {
    try {
      const data = await gestionSedesService.fetchSedes();
      setSedes(data);
      return data; // Return the fetched data
    } catch (error) {
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al cargar sedes: ' + error.message,
        title: 'Error'
      });
      return []; // Return empty array in case of error
    }
  }, [setSedes, setAlertState]);

  useEffect(() => {
    fetchSedes();
  }, [fetchSedes]);

  const handleOpenFormulario = (sede = null) => {
    if (sede) {
      setModoEdicion(true);
      setSedeSeleccionada(sede);
      setFormData({
        nombre: sede.nombre || '',
        direccion: sede.direccion || '',
        ciudad: sede.ciudad || '',
        telefono: sede.telefono || '',
        email: sede.email || '',
        descripcion: sede.descripcion || '',
        estado: sede.estado !== false
      });
    } else {
      setModoEdicion(false);
      setSedeSeleccionada(null);
      setFormData({
        nombre: '',
        direccion: '',
        ciudad: '',
        telefono: '',
        email: '',
        descripcion: '',
        estado: true
      });
    }
    setOpenFormulario(true);
  };

  const handleSubmitFormulario = async () => {
    try {
      if (modoEdicion) {
        await handleActualizarSede(sedeSeleccionada.id, formData);
      } else {
        await handleCrearSede(formData);
      }
      setOpenFormulario(false);
      fetchSedes();
    } catch (error) {
      // Error ya manejado en las acciones
    }
  };

  // Días de la semana para el checklist de horarios
  const diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];

  // Eliminar un horario de la sede seleccionada
  const handleEliminarHorario = async (horarioIndex) => {
    if (!sedeSeleccionada) return;
    const confirmar = window.confirm('¿Seguro que deseas eliminar este horario?');
    if (!confirmar) return;

    try {
      setLoadingState({ open: true, message: 'Eliminando horario...', size: 'medium' });
      await gestionSedesService.eliminarHorario(sedeSeleccionada.id, horarioIndex);

      // Refrescar sedes y mantener el diálogo abierto con datos actualizados
      const sedesActualizadas = await fetchSedes();
      const sedeActualizada = sedesActualizadas.find(s => s.id === sedeSeleccionada.id);
      if (sedeActualizada) {
        setSedeSeleccionada(sedeActualizada);
        // Actualizar lista local de horarios si existe en el estado del hook
        const horariosActualizados = Array.isArray(sedeActualizada.horarios)
          ? sedeActualizada.horarios
          : (Array.isArray(sedeActualizada.horariosSedeData) ? sedeActualizada.horariosSedeData : []);
        setHorarios(horariosActualizados);
      }

      hideLoading();
      setSuccessState({ open: true, type: 'delete', message: 'Horario eliminado correctamente' });
      // Asegurar que el diálogo permanezca abierto
      setOpenHorarios(true);
    } catch (error) {
      hideLoading();
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al eliminar el horario: ' + error.message,
        title: 'Error'
      });
    }
  };

  return (
    <LayoutAdministrador>
      <HeaderGestionSedes
        title="Gestión de Sedes"
        subtitle="Administra las sedes y sus horarios de trabajo"
        refreshing={false}
        onRefresh={() => handleRefresh(fetchSedes)}
        search={search}
        onSearchChange={setSearch}
        onNuevaSede={() => handleOpenFormulario()}
      />

      {/* Estadísticas del módulo */}
      <StatsUniversal
        stats={[
          { 
            type: 'total', 
            label: 'Total Sedes', 
            value: sedes.length, 
            description: 'Sedes registradas en el sistema' 
          },
          { 
            type: 'empleados', 
            label: 'Sedes Activas', 
            value: sedes.filter(s => s.estado === true).length, 
            description: 'Sedes con estado activo' 
          },
          { 
            type: 'horas', 
            label: 'Con Horarios', 
            value: sedes.filter(s => s.horarios && s.horarios.length > 0).length, 
            description: 'Sedes con horarios configurados' 
          },
          { 
            type: 'aprobado', 
            label: 'Ciudades', 
            value: new Set(sedes.map(s => s.ciudad).filter(Boolean)).size, 
            description: 'Ciudades con presencia' 
          }
        ]}
        title="Resumen del Sistema de Sedes"
        subtitle="Métricas importantes de gestión de sedes"
        iconColor="#1976d2"
      />

      <TablaSedes
        data={sedesPagina}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={sedesConFiltros.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        customActions={[
          {
            icon: <VisibilityIcon />,
            tooltip: 'Ver detalles de la sede',
            color: '#1976d2',
            onClick: (sede) => handleVerDetalles(sede, setSedeSeleccionada, setOpenDialog)
          },
          {
            icon: <ScheduleIcon />,
            tooltip: 'Ver horarios de la sede',
            color: '#4caf50',
            onClick: (sede) => handleVerHorarios(sede, setSedeSeleccionada, setOpenHorarios)
          },
          {
            icon: <EditIcon />,
            tooltip: 'Editar sede',
            color: '#ff9800',
            onClick: (sede) => handleOpenFormulario(sede)
          },
          {
            icon: <DeleteIcon />,
            tooltip: 'Eliminar sede',
            color: '#f44336',
            onClick: (sede) => handleEliminarSede(sede.id, fetchSedes)
          }
        ]}
      />

      {/* Diálogo de detalles de sede */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          background: 'linear-gradient(135deg, #1976d2, #1565c0)',
          color: 'white'
        }}>
          <BusinessIcon />
          Detalles de la Sede
          <IconButton onClick={() => setOpenDialog(false)} sx={{ ml: 'auto', color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, maxHeight: '80vh', overflow: 'auto' }}>
          {sedeSeleccionada && (
            <Box sx={{ 
              p: 3, 
              background: 'rgba(25, 118, 210, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(25, 118, 210, 0.2)'
            }}>
              <Typography variant="h5" fontWeight={600} mb={3} color="#1976d2">
                {sedeSeleccionada.nombre}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 2, 
                    background: 'white', 
                    borderRadius: 1, 
                    border: '1px solid #e0e0e0',
                    mb: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOnIcon color="primary" />
                      <Typography variant="body1" fontWeight={600} color="text.primary">
                        Dirección
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {sedeSeleccionada.direccion}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Ciudad:</strong> {sedeSeleccionada.ciudad}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 2, 
                    background: 'white', 
                    borderRadius: 1, 
                    border: '1px solid #e0e0e0',
                    mb: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <PhoneIcon color="primary" />
                      <Typography variant="body1" fontWeight={600} color="text.primary">
                        Contacto
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Teléfono:</strong> {sedeSeleccionada.telefono || 'No especificado'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Email:</strong> {sedeSeleccionada.email || 'No especificado'}
                    </Typography>
                  </Box>
                </Grid>
                
                {sedeSeleccionada.descripcion && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 2, 
                      background: 'white', 
                      borderRadius: 1, 
                      border: '1px solid #e0e0e0',
                      mb: 2
                    }}>
                      <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                        Descripción
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {sedeSeleccionada.descripcion}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    background: 'white', 
                    borderRadius: 1, 
                    border: '1px solid #e0e0e0'
                  }}>
                    <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                      Estado y Fechas
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Chip 
                        label={sedeSeleccionada.estado ? 'Activa' : 'Inactiva'} 
                        color={sedeSeleccionada.estado ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Creada:</strong> {sedeSeleccionada.createdAt ? new Date(sedeSeleccionada.createdAt).toLocaleString('es-ES') : 'No disponible'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Actualizada:</strong> {sedeSeleccionada.updatedAt ? new Date(sedeSeleccionada.updatedAt).toLocaleString('es-ES') : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de horarios de sede */}
      <Dialog open={openHorarios} onClose={() => setOpenHorarios(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: 2,
          background: 'linear-gradient(135deg, #4caf50, #388e3c)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ScheduleIcon />
            <Typography variant="h6" fontWeight={600}>Horarios de la Sede</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => {
                setOpenHorarios(false);
                setOpenHorarioDialog(true);
              }}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                px: 3,
                py: 1,
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              + Agregar Horario
            </Button>
            <IconButton onClick={() => setOpenHorarios(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, maxHeight: '80vh', overflow: 'auto' }}>
          {sedeSeleccionada && (
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              background: 'rgba(76, 175, 80, 0.1)', 
              borderRadius: 2,
              border: '1px solid rgba(76, 175, 80, 0.2)'
            }}>
              <Typography variant="h6" fontWeight={600} color="#4caf50">
                {sedeSeleccionada.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Ciudad:</strong> {sedeSeleccionada.ciudad} | <strong>Dirección:</strong> {sedeSeleccionada.direccion}
              </Typography>
            </Box>
          )}
          
          {/* Horarios de la sede */}
          {sedeSeleccionada?.horarios && sedeSeleccionada.horarios.length > 0 ? (
            <Box sx={{ 
              background: '#f8f9fa', 
              borderRadius: 2, 
              overflow: 'hidden',
              border: '1px solid #dee2e6'
            }}>
              <Box sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, #4caf50, #388e3c)', 
                color: 'white'
              }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Horarios Configurados ({sedeSeleccionada.horarios.length})
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  {sedeSeleccionada.horarios.map((horario, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box sx={{ 
                        p: 2, 
                        background: 'white', 
                        borderRadius: 1, 
                        border: '1px solid #dee2e6',
                        '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600} color="#4caf50">
                            {horario.nombre}
                          </Typography>
                          <IconButton 
                            aria-label="Eliminar horario" 
                            size="small" 
                            onClick={() => handleEliminarHorario(index)}
                            sx={{ color: '#f44336' }}
                            title="Eliminar horario"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="body2">
                            <strong>Tipo:</strong> 
                            <Chip 
                              label={horario.tipo} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              sx={{ ml: 1, fontSize: '0.7rem' }}
                            />
                          </Typography>
                          <Typography variant="body2">
                            <strong>Horario:</strong> {horario.horaEntrada} - {horario.horaSalida}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Jornada:</strong> {horario.horasJornada}h (Real: {horario.horasJornadaReal}h)
                          </Typography>
                          <Typography variant="body2">
                            <strong>Almuerzo:</strong> {horario.tiempoAlmuerzo} min
                          </Typography>
                          <Typography variant="body2">
                            <strong>Días trabajados:</strong>
                            <Box component="span" sx={{ ml: 1, display: 'inline-flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {Array.isArray(horario.diasTrabajados) && horario.diasTrabajados.length > 0
                                ? horario.diasTrabajados.map((d, i) => (
                                    <Chip key={i} label={d} size="small" variant="outlined" />
                                  ))
                                : <Chip label="Sin días" size="small" color="warning" />
                              }
                            </Box>
                          </Typography>
                          <Typography variant="body2">
                            <strong>Estado:</strong> 
                            <Chip 
                              label={horario.activo ? 'Activo' : 'Inactivo'} 
                              size="small" 
                              color={horario.activo ? 'success' : 'error'}
                              variant="filled"
                              sx={{ ml: 1, fontSize: '0.7rem' }}
                            />
                          </Typography>
                          {horario.descripcion && (
                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                              <strong>Descripción:</strong> {horario.descripcion}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <ScheduleIcon sx={{ fontSize: 64, color: '#ccc', mb: 3 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                Sin horarios configurados
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Esta sede no tiene horarios asignados
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => {
                  setOpenHorarios(false);
                  setOpenHorarioDialog(true);
                }}
                sx={{ 
                  borderRadius: 3, 
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Crear Primer Horario
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear horario */}
      <Dialog open={openHorarioDialog} onClose={() => setOpenHorarioDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          background: 'linear-gradient(135deg, #4caf50, #388e3c)',
          color: 'white'
        }}>
          <AddIcon />
          Agregar Horario a: {sedeSeleccionada?.nombre}
          <IconButton onClick={() => setOpenHorarioDialog(false)} sx={{ ml: 'auto', color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del horario"
                value={nuevoHorario.nombre}
                onChange={(e) => setNuevoHorario({...nuevoHorario, nombre: e.target.value})}
                required
                placeholder="ej: Horario Administrativo"
                InputProps={{
                  startAdornment: <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Tipo de horario"
                value={nuevoHorario.tipo}
                onChange={(e) => setNuevoHorario({...nuevoHorario, tipo: e.target.value})}
                required
              >
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="nocturno">Nocturno</MenuItem>
                <MenuItem value="especial">Especial</MenuItem>
                <MenuItem value="festivo">Festivo</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hora de entrada"
                type="time"
                value={nuevoHorario.horaEntrada}
                onChange={(e) => setNuevoHorario({...nuevoHorario, horaEntrada: e.target.value})}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hora de salida"
                type="time"
                value={nuevoHorario.horaSalida}
                onChange={(e) => setNuevoHorario({...nuevoHorario, horaSalida: e.target.value})}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Días trabajados</Typography>
              <FormGroup row>
                {diasSemana.map(dia => (
                  <FormControlLabel
                    key={dia}
                    control={
                      <Checkbox
                        checked={Array.isArray(nuevoHorario.diasTrabajados) && nuevoHorario.diasTrabajados.includes(dia)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setNuevoHorario(prev => {
                            const actual = Array.isArray(prev.diasTrabajados) ? prev.diasTrabajados : [];
                            if (checked) {
                              return { ...prev, diasTrabajados: [...new Set([...actual, dia])] };
                            } else {
                              return { ...prev, diasTrabajados: actual.filter(d => d !== dia) };
                            }
                          });
                        }}
                        color="primary"
                      />
                    }
                    label={dia}
                  />
                ))}
              </FormGroup>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tiempo de almuerzo (minutos)"
                type="number"
                value={nuevoHorario.tiempoAlmuerzo}
                onChange={(e) => setNuevoHorario({...nuevoHorario, tiempoAlmuerzo: parseInt(e.target.value) || 0})}
                inputProps={{ min: 0, max: 180 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={nuevoHorario.activo}
                    onChange={(e) => setNuevoHorario({...nuevoHorario, activo: e.target.checked})}
                    color="primary"
                  />
                }
                label="Horario activo"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={nuevoHorario.descripcion}
                onChange={(e) => setNuevoHorario({...nuevoHorario, descripcion: e.target.value})}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={() => setOpenHorarioDialog(false)} variant="outlined">
              Cancelar
            </Button>
            <Button 
              onClick={async () => {
                if (!nuevoHorario.nombre || !nuevoHorario.horaEntrada || !nuevoHorario.horaSalida) {
                  setAlertState({
                    open: true,
                    type: 'error',
                    message: 'Por favor complete los campos requeridos',
                    title: 'Error de validación'
                  });
                  return;
                }
                if (!Array.isArray(nuevoHorario.diasTrabajados) || nuevoHorario.diasTrabajados.length === 0) {
                  setAlertState({
                    open: true,
                    type: 'error',
                    message: 'Seleccione al menos un día trabajado',
                    title: 'Error de validación'
                  });
                  return;
                }
                
                try {
                  setShowCreateHorarioSpinner(true);
                  
                  // Calcular horas de jornada
                  const calcularHorasJornada = (horaEntrada, horaSalida) => {
                    if (!horaEntrada || !horaSalida) return 8;
                    const [entradaHoras, entradaMinutos] = horaEntrada.split(':').map(Number);
                    const [salidaHoras, salidaMinutos] = horaSalida.split(':').map(Number);
                    const entradaEnMinutos = entradaHoras * 60 + entradaMinutos;
                    const salidaEnMinutos = salidaHoras * 60 + salidaMinutos;
                    let diferenciaMinutos = salidaEnMinutos - entradaEnMinutos;
                    if (diferenciaMinutos < 0) diferenciaMinutos += 24 * 60;
                    return diferenciaMinutos / 60;
                  };

                  const horasJornada = calcularHorasJornada(nuevoHorario.horaEntrada, nuevoHorario.horaSalida);
                  const horasJornadaReal = horasJornada - (nuevoHorario.tiempoAlmuerzo / 60);
                  
                  // Preparar datos del horario
                  const horarioData = {
                    nombre: nuevoHorario.nombre,
                    tipo: nuevoHorario.tipo,
                    horaEntrada: nuevoHorario.horaEntrada,
                    horaSalida: nuevoHorario.horaSalida,
                    horasJornada: horasJornada,
                    horasJornadaReal: horasJornadaReal,
                    tiempoAlmuerzo: nuevoHorario.tiempoAlmuerzo,
                    diasTrabajados: Array.isArray(nuevoHorario.diasTrabajados) ? nuevoHorario.diasTrabajados : [],
                    activo: nuevoHorario.activo,
                    descripcion: nuevoHorario.descripcion
                  };
                  
                  console.log('🚀 Enviando horario al backend:', {
                    sedeId: sedeSeleccionada.id,
                    sedeName: sedeSeleccionada.nombre,
                    horarioData: horarioData
                  });
                  
                  // Llamar al servicio para agregar horario
                  const response = await gestionSedesService.agregarHorario(sedeSeleccionada.id, horarioData);
                  
                  // Cerrar el diálogo de horarios temporalmente para forzar la actualización
                  setOpenHorarioDialog(false);
                  
                  // Refrescar datos de sedes
                  const sedesActualizadas = await fetchSedes();
                  
                  // Encontrar la sede actualizada en la respuesta
                  const sedeActualizada = sedesActualizadas.find(s => s.id === sedeSeleccionada.id);
                  if (sedeActualizada) {
                    // Actualizar la sede seleccionada
                    setSedeSeleccionada(sedeActualizada);
                    
                    // Actualizar la lista de horarios
                    const horariosActualizados = Array.isArray(sedeActualizada.horariosSedeData) 
                      ? [...sedeActualizada.horariosSedeData] 
                      : [];
                      
                    console.log('📋 Horarios actualizados:', horariosActualizados);
                    setHorarios(horariosActualizados);
                    
                      // Resetear el formulario
                    setNuevoHorario({
                      nombre: '',
                      tipo: 'normal',
                      horaEntrada: '',
                      horaSalida: '',
                      tiempoAlmuerzo: 60,
                      diasTrabajados: diasSemana,
                      activo: true,
                      descripcion: ''
                    });
                    
                    // Mostrar mensaje de éxito y actualizar UI
                    setShowCreateHorarioSpinner(false);
                    setHorarioAlertMessage(`Horario "${nuevoHorario.nombre}" agregado exitosamente a ${sedeActualizada.nombre}`);
                    setShowHorarioAlert(true);
                    
                    // Reabrir el diálogo de horarios con los datos actualizados después de un breve retraso
                    setTimeout(() => {
                      setOpenHorarios(true);
                    }, 500);
                  }
                } catch (error) {
                  setShowCreateHorarioSpinner(false);
                  setAlertState({
                    open: true,
                    type: 'error',
                    message: 'Error al crear el horario: ' + error.message,
                    title: 'Error'
                  });
                }
              }}
              variant="contained"
              disabled={!nuevoHorario.nombre || !nuevoHorario.horaEntrada || !nuevoHorario.horaSalida}
              sx={{
                background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #388e3c, #2e7d32)'
                }
              }}
            >
              Crear Horario
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Diálogo de formulario crear/editar sede */}
      <Dialog 
        open={openFormulario} 
        onClose={() => setOpenFormulario(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }
        }}
      >
        {/* Header mejorado con gradiente y efectos */}
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          background: modoEdicion 
            ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 50%, #ef6c00 100%)' 
            : 'linear-gradient(135deg, #4caf50 0%, #388e3c 50%, #2e7d32 100%)',
          color: 'white',
          p: 3,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            position: 'relative',
            zIndex: 1
          }}>
            <Box sx={{
              p: 1.5,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {modoEdicion ? <EditIcon sx={{ fontSize: 28 }} /> : <AddIcon sx={{ fontSize: 28 }} />}
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {modoEdicion ? 'Editar Sede' : 'Nueva Sede'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                {modoEdicion ? 'Modifica la información de la sede' : 'Completa los datos para crear una nueva sede'}
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={() => setOpenFormulario(false)} 
            sx={{ 
              ml: 'auto', 
              color: 'white',
              background: 'rgba(255,255,255,0.1)',
              '&:hover': {
                background: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ 
          p: 0,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          minHeight: '500px'
        }}>
          {/* Contenido principal con diseño mejorado */}
          <Box sx={{ p: 4 }}>
            {/* Sección de información básica */}
            <Box sx={{ 
              mb: 4, 
              p: 3, 
              background: 'white', 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon />
                Información Básica
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre de la Sede"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4caf50',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4caf50',
                          borderWidth: 2,
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: <BusinessIcon sx={{ mr: 1, color: '#4caf50' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ciudad"
                    value={formData.ciudad}
                    onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4caf50',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4caf50',
                          borderWidth: 2,
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: <LocationOnIcon sx={{ mr: 1, color: '#4caf50' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dirección Completa"
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    required
                    multiline
                    rows={2}
                    variant="outlined"
                    placeholder="Ingresa la dirección completa de la sede"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4caf50',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4caf50',
                          borderWidth: 2,
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: <LocationOnIcon sx={{ mr: 1, color: '#4caf50', alignSelf: 'flex-start', mt: 1 }} />
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Sección de contacto */}
            <Box sx={{ 
              mb: 4, 
              p: 3, 
              background: 'white', 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon />
                Información de Contacto
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    variant="outlined"
                    placeholder="Ej: +57 300 123 4567"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4caf50',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4caf50',
                          borderWidth: 2,
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: '#4caf50' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    variant="outlined"
                    placeholder="Ej: sede@empresa.com"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4caf50',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4caf50',
                          borderWidth: 2,
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: '#4caf50' }} />
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Sección de descripción y estado */}
            <Box sx={{ 
              mb: 4, 
              p: 3, 
              background: 'white', 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon />
                Información Adicional
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción de la Sede"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    multiline
                    rows={3}
                    variant="outlined"
                    placeholder="Describe las características especiales, servicios o información relevante de esta sede"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4caf50',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4caf50',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    background: 'rgba(76, 175, 80, 0.05)', 
                    borderRadius: 2,
                    border: '1px solid rgba(76, 175, 80, 0.2)'
                  }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.estado}
                          onChange={(e) => setFormData({...formData, estado: e.target.checked})}
                          color="success"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#4caf50',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#4caf50',
                            },
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={600} color="text.primary">
                            Sede Activa
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formData.estado ? 'La sede está disponible para operaciones' : 'La sede está temporalmente deshabilitada'}
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
          
          {/* Footer con botones mejorados */}
          <Box sx={{ 
            p: 3, 
            background: 'white',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 2
          }}>
            <Typography variant="body2" color="text.secondary">
              {modoEdicion ? 'Modifica los campos necesarios y guarda los cambios' : 'Completa todos los campos requeridos para crear la sede'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                onClick={() => setOpenFormulario(false)} 
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderColor: '#ccc',
                  color: '#666',
                  '&:hover': {
                    borderColor: '#999',
                    background: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmitFormulario} 
                variant="contained"
                size="large"
                disabled={!formData.nombre || !formData.direccion || !formData.ciudad}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  background: modoEdicion 
                    ? 'linear-gradient(135deg, #ff9800, #f57c00)' 
                    : 'linear-gradient(135deg, #4caf50, #388e3c)',
                  boxShadow: modoEdicion 
                    ? '0 4px 12px rgba(255, 152, 0, 0.3)' 
                    : '0 4px 12px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    background: modoEdicion 
                      ? 'linear-gradient(135deg, #f57c00, #ef6c00)' 
                      : 'linear-gradient(135deg, #388e3c, #2e7d32)',
                    boxShadow: modoEdicion 
                      ? '0 6px 16px rgba(255, 152, 0, 0.4)' 
                      : '0 6px 16px rgba(76, 175, 80, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    background: '#e0e0e0',
                    color: '#9e9e9e',
                    boxShadow: 'none'
                  }
                }}
              >
                {modoEdicion ? 'Actualizar Sede' : 'Crear Sede'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Alerta universal reutilizable */}
      <SubAdminUniversalAlertUniversal
        open={alertState.open}
        type={alertState.type}
        message={alertState.message}
        title={alertState.title}
        onClose={hideAlert}
        showLogo={true}
        autoHideDuration={4000}
      />

      {/* Spinner de carga */}
      <SubAdminLoadingSpinner
        open={loadingState.open}
        message={loadingState.message}
        size={loadingState.size}
        showLogo={true}
      />

      {/* Spinner de éxito */}
      {successState.type === 'create' && (
        <SubAdminCreateSuccessSpinner
          open={successState.open}
          message={successState.message}
          onClose={hideSuccess}
          showLogo={true}
        />
      )}
      {successState.type === 'edit' && (
        <SubAdminEditSuccessSpinner
          open={successState.open}
          message={successState.message}
          onClose={hideSuccess}
          showLogo={true}
        />
      )}
      {successState.type === 'delete' && (
        <SubAdminDeleteSuccessSpinner
          open={successState.open}
          message={successState.message}
          onClose={hideSuccess}
          showLogo={true}
        />
      )}

      {/* Spinner de éxito para horarios */}
      <SubAdminCreateSuccessSpinner
        open={showCreateHorarioSpinner}
        onClose={() => setShowCreateHorarioSpinner(false)}
        title="¡Horario Creado!"
        message={`Horario "${nuevoHorario.nombre}" agregado exitosamente`}
        size="medium"
        showLogo={true}
      />

      {/* Alerta de éxito para horarios */}
      <SubAdminUniversalAlertUniversal
        open={showHorarioAlert}
        type="success"
        title="Operación Exitosa"
        message={horarioAlertMessage}
        onClose={() => setShowHorarioAlert(false)}
        showLogo={true}
        autoHideDuration={4000}
      />
    </LayoutAdministrador>
  );
}

export default GestionSedes;
