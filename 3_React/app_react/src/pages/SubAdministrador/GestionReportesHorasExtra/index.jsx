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
import NavbarSubAdmin from '../NavbarSubAdmin';

import {
  FiltrosAvanzados,
  TablaResumenDescarga
} from './components';
import { 
  HeaderGestionReportes,
  TablaUsuarios
} from './components';
import { DetallesUsuarioDialog, RegistrosUsuarioDialog } from './components';
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
    <LayoutUniversal NavbarComponent={NavbarSubAdmin}>
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

      <DetallesUsuarioDialog open={openDialog} onClose={() => setOpenDialog(false)} usuario={usuarioSeleccionado} />

      <RegistrosUsuarioDialog
        open={openRegistros}
        onClose={() => setOpenRegistros(false)}
        usuario={usuarioSeleccionado}
        registros={registros}
        loading={loadingRegistros}
        filtros={{
          tipoHora: tipoHoraDialog,
          tiposHora: tiposHoraDialog,
          ubicacion: ubicacionDialog,
          fechaInicio: fechaInicioDialog,
          fechaFin: fechaFinDialog
        }}
        onChangeFiltro={(key, value) => {
          if (key === 'tipoHora') setTipoHoraDialog(value);
          if (key === 'ubicacion') setUbicacionDialog(value);
          if (key === 'fechaInicio') setFechaInicioDialog(value);
          if (key === 'fechaFin') setFechaFinDialog(value);
        }}
      />

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
