import React, { useEffect, useContext, useMemo, useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Divider, 
  Button 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { SalarioMinimoContext } from '../../../providers/SalarioMinimoProvider';
import SalarioMinimoEditor from '../../../SalarioMinimoEditor';
import { 
  LayoutUniversal, 
  SubAdminUniversalAlertUniversal,
  StatsUniversal,
  SubAdminLoadingSpinner,
  SubAdminCreateSuccessSpinner,
  SubAdminEditSuccessSpinner,
  SubAdminDeleteSuccessSpinner,
  SubAdminSuccessSpinnerUniversal,
  InitialPageLoader
} from '../../../components';

import {
  FiltrosAvanzados,
  TablaResumenDescarga
} from './components';
import { 
  HeaderGestionReportes,
  TablaUsuarios
} from './components';
import { useGestionReportes } from './hooks/useGestionReportes';
import { useAccionesReportes } from './hooks/useAccionesReportes';
import { useAlertasReportes } from './hooks/useAlertasReportes';

import { gestionReportesService } from './services';

function GestionReportesHorasExtra() {
  const { salarioMinimo } = useContext(SalarioMinimoContext);
  
  // Hooks personalizados
  const {
    usuarios,
    setUsuarios,
    openDialog,
    setOpenDialog,
    usuarioSeleccionado,
    setUsuarioSeleccionado,
    openRegistros,
    setOpenRegistros,
    registros,
    setRegistros,
    loadingRegistros,
    setLoadingRegistros,
    page,
    rowsPerPage,
    openReporte,
    setOpenReporte,
    reporteData,
    setReporteData,
    openSalario,
    setOpenSalario,
    valorHoraOrdinaria,
    usuariosPagina,
    handleChangePage,
    handleChangeRowsPerPage,
    // Filtro simple
    search,
    setSearch
  } = useGestionReportes();

  // Filtros SOLO para el diálogo de reporte
  const [tipoHoraDialog, setTipoHoraDialog] = useState('todos');
  const [fechaInicioDialog, setFechaInicioDialog] = useState('');
  const [fechaFinDialog, setFechaFinDialog] = useState('');
  const [ubicacionDialog, setUbicacionDialog] = useState('todos');

  const ubicacionesDialog = useMemo(() => {
    const setU = new Set(registros.map(r => r.ubicacion).filter(Boolean));
    return Array.from(setU).sort();
  }, [registros]);

  const tiposHoraDialog = useMemo(() => {
    const mapTipos = new Map();
    registros.forEach(reg => {
      if (Array.isArray(reg.Horas)) {
        reg.Horas.forEach(h => {
          const key = String(h.id ?? h.tipoHoraId ?? h.tipo);
          if (!mapTipos.has(key)) {
            mapTipos.set(key, {
              id: h.id ?? h.tipoHoraId ?? key,
              tipo: h.tipo || 'Tipo',
              denominacion: h.denominacion || '',
            });
          }
        });
      }
    });
    return Array.from(mapTipos.values());
  }, [registros]);

  // Usuarios filtrados por búsqueda
  const usuariosConFiltros = useMemo(() => {
    return usuarios.filter(usuario => {
      const searchMatch = !search || 
        `${usuario.persona?.nombres || ''} ${usuario.persona?.apellidos || ''}`.toLowerCase().includes(search.toLowerCase()) ||
        (usuario.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (usuario.persona?.numeroDocumento || '').toLowerCase().includes(search.toLowerCase());
      return searchMatch;
    });
  }, [usuarios, search]);

  // Aplicar filtros del diálogo al conjunto de registros
  const registrosDialogFiltrados = useMemo(() => {
    return registros.filter(reg => {
      // Filtro ubicación
      const ubicMatch = ubicacionDialog === 'todos' || reg.ubicacion === ubicacionDialog;

      // Filtro fechas
      const fechaOk = (() => {
        if (!fechaInicioDialog && !fechaFinDialog) return true;
        const d = reg.fecha ? new Date(reg.fecha) : null;
        if (!d) return false;
        const startOk = !fechaInicioDialog || d >= new Date(fechaInicioDialog);
        const endOk = !fechaFinDialog || d <= new Date(fechaFinDialog);
        return startOk && endOk;
      })();

      // Filtro tipo de hora (si existe en el registro)
      const tipoOk = (() => {
        if (tipoHoraDialog === 'todos') return true;
        if (!Array.isArray(reg.Horas)) return true;
        return reg.Horas.some(h => String(h.id ?? h.tipoHoraId) === String(tipoHoraDialog));
      })();

      return ubicMatch && fechaOk && tipoOk;
    });
  }, [registros, ubicacionDialog, fechaInicioDialog, fechaFinDialog, tipoHoraDialog]);

  // Recalcular los totales del reporte cuando cambian los filtros del diálogo
  useEffect(() => {
    if (!openReporte) return;
    let totalHorasDivididas = 0;
    let totalPagarDivididas = 0;
    let totalHorasBono = 0;
    let totalPagarBono = 0;
    const detalles = [];

    registrosDialogFiltrados.forEach(registro => {
      const cantidadDividida = registro.horas_extra_divididas ?? 0;
      const cantidadBono = registro.bono_salarial ?? 0;

      if (Array.isArray(registro.Horas) && registro.Horas.length > 0) {
        registro.Horas.forEach((hora, index) => {
          const recargo = hora.valor;
          const valorHoraExtra = valorHoraOrdinaria * recargo;
          const valorTotalDivididas = cantidadDividida * valorHoraExtra;

          totalHorasDivididas += cantidadDividida;
          totalPagarDivididas += valorTotalDivididas;

          const bonoEnFila = index === 0 ? cantidadBono : 0;
          const valorTotalBono = bonoEnFila * valorHoraExtra;
          totalHorasBono += bonoEnFila;
          totalPagarBono += valorTotalBono;

          detalles.push({
            fecha: registro.fecha,
            tipo: hora.tipo,
            denominacion: hora.denominacion,
            cantidadDividida,
            valorTotalDivididas: Number(valorTotalDivididas.toFixed(2)),
            cantidadBono: bonoEnFila,
            valorTotalBono: Number(valorTotalBono.toFixed(2)),
            recargo,
            valorHoraExtra: Number(valorHoraExtra.toFixed(2)),
            registroOriginal: registro
          });
        });
      } else if ((cantidadBono ?? 0) > 0) {
        // Sin horas: sumar solo a totales, no crear fila
        totalHorasBono += cantidadBono;
        totalPagarBono += cantidadBono * valorHoraOrdinaria;
      }
    });



    setReporteData({
      totalHorasDivididas,
      totalPagarDivididas,
      totalHorasBono,
      totalPagarBono,
      totalPagar: totalPagarDivididas + totalPagarBono,
      detalles
    });
  }, [openReporte, registrosDialogFiltrados, valorHoraOrdinaria, setReporteData]);

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await gestionReportesService.fetchUsuarios();
        if (active) setUsuarios(data);
      } catch (e) {
        // error inicial silencioso; las alertas se manejarán luego con setAlertState si es necesario
        console.error('Error inicial cargando usuarios:', e);
      } finally {
        if (active) setInitialLoading(false);
      }
    })();
    return () => { active = false; };
  }, [setUsuarios]);

  // No early return para no romper el orden de hooks; mostramos loader vía Portal

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
  } = useAlertasReportes();

  const {
    handleRefresh,
    handleVerDetalles,
    handleVerRegistros,
    handleVerReporte,
    handleDescargarWord,
    handleDescargarExcel
  } = useAccionesReportes(setAlertState, setLoadingState, setRegistros, setReporteData, valorHoraOrdinaria, setSuccessState);

  const fetchUsuarios = useCallback(async () => {
    try {
      const data = await gestionReportesService.fetchUsuarios();
      setUsuarios(data);
    } catch (error) {
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al cargar usuarios: ' + error.message,
        title: 'Error'
      });
    }
  }, [setUsuarios, setAlertState]);

  // Ya cargamos usuarios en el efecto de initialLoading

  // Loader inicial si aún no hay usuarios y está cargando (puedes ajustar condición)
  if (usuarios.length === 0 && !reporteData.detalles && !openDialog && !openRegistros && !openReporte) {
    // No tengo un flag de loading global aquí, así que mostramos loader breve inicial opcional
  }

  return (
    <LayoutUniversal>
      {initialLoading && (
        <InitialPageLoader open title="Cargando Registros" subtitle="Preparando datos y componentes" iconColor="#1976d2" />
      )}
      <HeaderGestionReportes
        title="Gestión de Reportes de Horas Extra"
        subtitle="Genera y visualiza reportes detallados de horas extra por usuario"
        refreshing={false}
        onRefresh={() => handleRefresh(fetchUsuarios)}
        onOpenSalario={() => setOpenSalario(true)}
      />

      {/* Filtro principal (solo búsqueda) */}
      <FiltrosAvanzados
        search={search}
        onSearchChange={setSearch}
      />

      {/* Estadísticas del módulo */}
      <StatsUniversal
        stats={[
          { 
            type: 'total', 
            label: 'Total Usuarios', 
            value: usuarios.length, 
            description: 'Usuarios registrados en el sistema' 
          },
          { 
            type: 'empleados', 
            label: 'Usuarios Activos', 
            value: usuarios.filter(u => u.estado === 'activo').length, 
            description: 'Usuarios con estado activo' 
          },
          { 
            type: 'horas', 
            label: 'Registros Cargados', 
            value: registros.length, 
            description: 'Total de registros de horas extra' 
          },
          { 
            type: 'aprobado', 
            label: 'Reportes Generados', 
            value: reporteData.detalles?.length || 0, 
            description: 'Reportes de horas extra generados' 
          }
        ]}
        title="Resumen del Sistema de Reportes"
        subtitle="Métricas importantes de gestión de horas extra"
        iconColor="#9c27b0"
      />

      <TablaUsuarios
        data={usuariosPagina}
          page={page}
        rowsPerPage={rowsPerPage}
        totalCount={usuariosConFiltros.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        customActions={[
          {
            icon: <VisibilityIcon />,
            tooltip: 'Ver detalles del usuario',
            color: '#1976d2',
            onClick: (usuario) => handleVerDetalles(usuario, setUsuarioSeleccionado, setOpenDialog)
          },
          {
            icon: <ListAltIcon />,
            tooltip: 'Ver registros del usuario',
            color: '#4caf50',
            onClick: (usuario) => handleVerRegistros(usuario, setUsuarioSeleccionado, setOpenRegistros)
          },
          {
            icon: <AssessmentIcon />,
            tooltip: 'Generar reporte del usuario',
            color: '#9c27b0',
            onClick: (usuario) => handleVerReporte(usuario, setUsuarioSeleccionado, setOpenReporte)
          }
        ]}
      />

      {/* Diálogo de detalles de usuario */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          background: 'linear-gradient(135deg, #1976d2, #1565c0)',
          color: 'white'
        }}>
          <VisibilityIcon />
          Detalles del Usuario
          <IconButton onClick={() => setOpenDialog(false)} sx={{ ml: 'auto', color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, maxHeight: '80vh', overflow: 'auto' }}>
          {usuarioSeleccionado && (
            <Box sx={{ 
              p: 3, 
              background: 'rgba(25, 118, 210, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(25, 118, 210, 0.2)'
            }}>
              <Typography variant="h5" fontWeight={600} mb={3} color="#1976d2">
                {usuarioSeleccionado.persona?.nombres} {usuarioSeleccionado.persona?.apellidos}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ 
                  p: 2, 
                  background: 'white', 
                  borderRadius: 1, 
                  border: '1px solid #e0e0e0'
                }}>
                  <Typography variant="body1" fontWeight={600} color="text.primary">
                    Documento de Identidad
              </Typography>
              <Typography variant="body2" color="text.secondary">
                    {usuarioSeleccionado.persona?.tipoDocumento}: {usuarioSeleccionado.persona?.numeroDocumento}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  background: 'white', 
                  borderRadius: 1, 
                  border: '1px solid #e0e0e0'
                }}>
                  <Typography variant="body1" fontWeight={600} color="text.primary">
                    Información de Contacto
              </Typography>
              <Typography variant="body2" color="text.secondary">
                    {usuarioSeleccionado.email}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  background: 'white', 
                  borderRadius: 1, 
                  border: '1px solid #e0e0e0'
                }}>
                  <Typography variant="body1" fontWeight={600} color="text.primary">
                    Fecha de Registro
              </Typography>
              <Typography variant="body2" color="text.secondary">
                    {usuarioSeleccionado.createdAt ? new Date(usuarioSeleccionado.createdAt).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'No disponible'}
              </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de registros de horas extra */}
      <Dialog open={openRegistros} onClose={() => setOpenRegistros(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          background: 'linear-gradient(135deg, #388e3c, #2e7d32)',
          color: 'white'
        }}>
          <ListAltIcon />
          Registros de Horas Extra
          <IconButton onClick={() => setOpenRegistros(false)} sx={{ ml: 'auto', color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, maxHeight: '80vh', overflow: 'auto' }}>
          {/* Filtros del diálogo */}
          <Box sx={{ mb: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Tipo de Hora</Typography>
              <select
                value={tipoHoraDialog}
                onChange={(e) => setTipoHoraDialog(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e0e0e0' }}
              >
                <option value="todos">Todos</option>
                {tiposHoraDialog.map(t => (
                  <option key={t.id} value={t.id}>{t.tipo} {t.denominacion ? `- ${t.denominacion}` : ''}</option>
                ))}
              </select>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Ubicación</Typography>
              <select
                value={ubicacionDialog}
                onChange={(e) => setUbicacionDialog(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e0e0e0' }}
              >
                <option value="todos">Todas</option>
                {ubicacionesDialog.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Fecha inicio</Typography>
              <input
                type="date"
                value={fechaInicioDialog}
                onChange={(e) => setFechaInicioDialog(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e0e0e0' }}
              />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Fecha fin</Typography>
              <input
                type="date"
                value={fechaFinDialog}
                onChange={(e) => setFechaFinDialog(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e0e0e0' }}
              />
            </Box>
          </Box>
          {loadingRegistros ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Cargando registros...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Información del usuario */}
              {usuarioSeleccionado && (
                <Box sx={{ 
                  mb: 3, 
                  p: 2, 
                  background: 'rgba(56, 142, 60, 0.1)', 
                  borderRadius: 2,
                  border: '1px solid rgba(56, 142, 60, 0.2)'
                }}>
                  <Typography variant="h6" fontWeight={600} color="#388e3c">
                    {usuarioSeleccionado.persona?.nombres} {usuarioSeleccionado.persona?.apellidos}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {usuarioSeleccionado.email}
                  </Typography>
                </Box>
              )}
              
              {/* Registros */}
              {registros.length > 0 ? (
                <Box sx={{ 
                  background: '#f8f9fa', 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  border: '1px solid #dee2e6'
                }}>
                  <Box sx={{ 
                    p: 2, 
                    background: 'linear-gradient(135deg, #388e3c, #2e7d32)', 
                    color: 'white'
                  }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Registros de Horas Extra ({registrosDialogFiltrados.length})
                    </Typography>
                  </Box>
                  <Box sx={{ maxHeight: 500, overflow: 'auto', p: 2 }}>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                      gap: 2 
                    }}>
                  {registrosDialogFiltrados.map(registro => (
                        <Box key={registro.id} sx={{ 
                          p: 2, 
                          background: 'white', 
                          borderRadius: 1, 
                          border: '1px solid #dee2e6',
                          '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }
                        }}>
                          <Typography variant="subtitle2" fontWeight={600} color="#388e3c" sx={{ mb: 1 }}>
                            {registro.fecha}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
                            <Typography variant="body2">
                              <strong>Horario:</strong> {registro.horaIngreso} - {registro.horaSalida}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Ubicación:</strong> {registro.ubicacion}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Horas Extra:</strong> {registro.cantidadHorasExtra}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Estado:</strong> 
                              <Box component="span" sx={{ 
                                ml: 1, 
                                px: 1, 
                                py: 0.5, 
                                borderRadius: 1, 
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: 'white',
                                backgroundColor: registro.estado === 'aprobado' ? '#2e7d32' : 
                                               registro.estado === 'pendiente' ? '#ed6c02' : '#d32f2f'
                              }}>
                                {registro.estado}
                              </Box>
                            </Typography>
                          </Box>
                          
                          {/* Tipos de hora */}
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 0.5 }}>
                              Tipos de Hora:
                            </Typography>
                        {registro.Horas && registro.Horas.length > 0 ? (
                          registro.Horas.map(hora => (
                                <Box key={hora.id} sx={{ 
                                  p: 1, 
                                  background: 'rgba(56, 142, 60, 0.1)', 
                                  borderRadius: 1, 
                                  mb: 0.5 
                                }}>
                                  <Typography variant="body2" fontWeight={600}>
                                    {hora.tipo}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {hora.denominacion}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    Cantidad: {hora.RegistroHora.cantidad}
                                  </Typography>
                            </Box>
                          ))
                        ) : (
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                No asignado
                              </Typography>
                            )}
                          </Box>
                          
                          {/* Justificación */}
                          {registro.justificacionHoraExtra && (
                            <Box sx={{ mt: 1, p: 1, background: 'rgba(255, 193, 7, 0.1)', borderRadius: 1 }}>
                              <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 0.5 }}>
                                Justificación:
                              </Typography>
                              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                {registro.justificacionHoraExtra}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No hay registros de horas extra para este usuario
                  </Typography>
                        {usuarioSeleccionado && (
                    <Typography variant="body2" color="text.secondary">
                      Usuario: <strong>{usuarioSeleccionado.persona?.nombres} {usuarioSeleccionado.persona?.apellidos}</strong> ({usuarioSeleccionado.email})
                    </Typography>
                        )}
                </Box>
                  )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de reporte general de horas extra */}
      <Dialog open={openReporte} onClose={() => setOpenReporte(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
          color: 'white'
        }}>
          <AssessmentIcon />
          Reporte General de Horas Extra
          <IconButton onClick={() => setOpenReporte(false)} sx={{ ml: 'auto', color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, maxHeight: '80vh', overflow: 'auto' }}>
          {usuarioSeleccionado && (
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              background: 'rgba(156, 39, 176, 0.1)', 
              borderRadius: 2,
              border: '1px solid rgba(156, 39, 176, 0.2)'
            }}>
              <Typography variant="h6" fontWeight={600} color="#9c27b0">
                {usuarioSeleccionado.persona?.nombres} {usuarioSeleccionado.persona?.apellidos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {usuarioSeleccionado.email}
              </Typography>
            </Box>
          )}
          
                  {/* Tabla de resumen para descarga */}
          <TablaResumenDescarga
            registrosFiltrados={registrosDialogFiltrados}
            registrosAprobadosTodos={registros}
            valorHoraOrdinaria={valorHoraOrdinaria}
            tipoHoraSeleccionado={tipoHoraDialog}
            filtrosActivos={Boolean(
              (tipoHoraDialog && tipoHoraDialog !== 'todos') ||
              ubicacionDialog !== 'todos' ||
              fechaInicioDialog ||
              fechaFinDialog
            )}
            onComputed={useCallback((resumen) => setReporteData(resumen), [setReporteData])}
          />

          {/* Botones de descarga */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DescriptionOutlinedIcon />}
              onClick={() => handleDescargarWord(reporteData, usuarioSeleccionado)}
              sx={{ 
                background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                '&:hover': { background: 'linear-gradient(135deg, #1565c0, #0d47a1)' }
              }}
            >
              Descargar Word
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<TableChartOutlinedIcon />}
              onClick={() => handleDescargarExcel(reporteData, usuarioSeleccionado)}
              sx={{ 
                background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
                '&:hover': { background: 'linear-gradient(135deg, #1b5e20, #0d4f1a)' }
              }}
            >
              Descargar Excel
            </Button>
          </Box>
          
          {/* Resumen de totales */}
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', 
            borderRadius: 2,
            border: '1px solid #dee2e6'
          }}>
            <Typography variant="h6" fontWeight={600} color="#495057" sx={{ mb: 2 }}>
              Resumen de Totales
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} color="#1976d2">
                Total horas extra (reporte): {reporteData.totalHorasDivididas} | Valor: $ {reporteData.totalPagarDivididas.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
              </Typography>
              <Typography variant="subtitle1" fontWeight={600} color="#ff9800">
                Bono salarial (horas): {reporteData.totalHorasBono} | Valor: $ {reporteData.totalPagarBono.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
              </Typography>
              <Typography variant="h6" fontWeight={700} color="#388e3c" sx={{ mt: 1 }}>
                Total a pagar: $ {reporteData.totalPagar.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }} color="#495057">
            Detalle por Registro
          </Typography>
          
          {/* Tabla de detalles */}
          <Box sx={{ 
            background: '#f8f9fa', 
            borderRadius: 2, 
            overflow: 'hidden',
            border: '1px solid #dee2e6'
          }}>
            <Box sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)', 
              color: 'white'
            }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Detalle de Horas Extra y Bonos
              </Typography>
            </Box>
            <Box sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: 2
              }}>
                {reporteData.detalles.map((detalle, idx) => (
                  <Box key={idx} sx={{ 
                    p: 2, 
                    background: 'white', 
                    borderRadius: 1, 
                    border: '1px solid #dee2e6',
                    '&:hover': { 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease'
                    }
                  }}>
                    <Typography variant="subtitle2" fontWeight={600} color="#9c27b0" sx={{ mb: 1 }}>
                      {detalle.fecha}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {detalle.tipo} - {detalle.denominacion}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Horas Extra: {detalle.cantidadDividida} | $ {Number(detalle.valorTotalDivididas).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Bono: {detalle.cantidadBono} | $ {Number(detalle.valorTotalBono).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Recargo: {((detalle.recargo - 1) * 100).toFixed(0)}% | Valor hora: $ {Number(detalle.valorHoraExtra).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openSalario} onClose={() => setOpenSalario(false)} maxWidth="xs" fullWidth>
        <SalarioMinimoEditor onClose={() => setOpenSalario(false)} />
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
          title={successState.title}
          onClose={hideSuccess}
        />
      )}
      {successState.type === 'edit' && (
        <SubAdminEditSuccessSpinner
          open={successState.open}
          message={successState.message}
          title={successState.title}
          onClose={hideSuccess}
        />
      )}
      {successState.type === 'delete' && (
        <SubAdminDeleteSuccessSpinner
          open={successState.open}
          message={successState.message}
          title={successState.title}
          onClose={hideSuccess}
        />
      )}
      {successState.type === 'download' && (
        <SubAdminSuccessSpinnerUniversal
          open={successState.open}
          message={successState.message || 'Documento descargado exitosamente'}
          title={successState.title || 'Descarga Completada'}
          onClose={hideSuccess}
        />
      )}
    </LayoutUniversal>
  );
}

export default GestionReportesHorasExtra;
