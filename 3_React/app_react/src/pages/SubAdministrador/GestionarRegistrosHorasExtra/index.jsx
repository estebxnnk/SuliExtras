import React, { useEffect } from 'react';
import {
  Box,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavbarSubAdmin from '../NavbarSubAdmin';

// Hooks personalizados optimizados
import { 
  useGestionarRegistros, 
  useAccionesRegistros, 
  useEstadosRegistros,
  useUniversalAlerts,
  useFiltrosAvanzados,
  useCrearRegistro
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
  ConfirmDialogWithLogo,
  HeaderGestionRegistros,
  EstadisticasRegistros,
  TablaRegistros,
  DialogoRegistro,
  CrearRegistroDialog,
  InformacionFiltros
} from './components';
import { InitialPageLoader } from '../../../components';

// Utilidades
import { getEstadoChip, getTipoHoraNombre, getUsuario, calcularEstadisticas } from './utils/registrosUtils';

function GestionarRegistrosHorasExtra() {
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

  const {
    crearRegistro,
    loading: loadingCreacion
  } = useCrearRegistro(cargarDatos, showSuccess, showError);

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
    setEditData({});
    abrirDialog(null, 'crear');
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos().catch(error => {
      showError('Error al cargar los datos: ' + error.message);
    });
  }, [cargarDatos, showError]);

  if (loading) {
    return <InitialPageLoader open title="Cargando Registros" subtitle="Preparando datos y componentes" iconColor="#1976d2" />;
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
        <HeaderGestionRegistros
          refreshing={refreshing}
          refrescarDatos={refrescarDatos}
          irACrearRegistro={irACrearRegistro}
        />

        {/* Estadísticas optimizadas con estilo moderno */}
        <EstadisticasRegistros
          estadisticas={estadisticasAdicionales}
          tiposHoraCount={tiposHora.length}
        />

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
          isMobile={false}
        />

        {/* Tabla de Registros optimizada */}
        <TablaRegistros
          registrosPaginados={registrosPaginados}
          registrosFiltrados={registrosFiltrados}
              page={page}
              rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleVer={handleVer}
          handleEditar={handleEditar}
          handleAprobar={handleAprobar}
          handleRechazar={handleRechazar}
          handleEliminar={handleEliminar}
          getTipoHoraNombre={getTipoHoraNombre}
          getEstadoChip={getEstadoChip}
          getUsuario={getUsuario}
          usuarios={usuarios}
          hayFiltrosActivos={hayFiltrosActivos}
        />

        {/* Información de filtros */}
        <InformacionFiltros
          hayFiltrosActivos={hayFiltrosActivos}
          estadisticasFiltros={estadisticasFiltros}
        />
      </Paper>

      {/* Diálogo para ver/editar registro */}
      <DialogoRegistro
        openDialog={openDialog && modo !== 'crear'}
        cerrarDialog={cerrarDialog}
        registroSeleccionado={registroSeleccionado}
        modo={modo}
        editData={editData}
        setEditData={setEditData}
        handleGuardarEdicion={handleGuardarEdicion}
        tiposHora={tiposHora}
        getEstadoChip={getEstadoChip}
        getUsuario={getUsuario}
        usuarios={usuarios}
      />

      {/* Diálogo de Crear Registro */}
      <CrearRegistroDialog
        open={openDialog && modo === 'crear'}
        onClose={cerrarDialog}
        tiposHora={tiposHora}
        usuarios={usuarios}
        onCrearRegistro={crearRegistro}
        loading={loadingCreacion}
        isMobile={false}
      />

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