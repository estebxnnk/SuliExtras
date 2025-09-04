import React, { useEffect } from 'react';
import {
  LayoutUniversal,
  SubAdminUniversalAlertUniversal,
  SubAdminLoadingSpinner,
  SubAdminSuccessSpinnerUniversal,
  InitialPageLoader,
  StatsUniversal
} from '../../../components';
import NavbarEmpleado from '../NavbarEmpleado';
import HeaderGestionRegistrosEmpleado from './components/HeaderGestionRegistrosEmpleado';
import CrearRegistrosSemanalEmpleadoDialog from './components/CrearRegistrosSemanalEmpleadoDialog';
import FiltrosAvanzadosEmpleado from './components/FiltrosAvanzadosEmpleado';
import TablaRegistrosEmpleado from './components/TablaRegistrosEmpleado';
import DetallesRegistroDialog from './components/Dialogs/DetallesRegistroDialog';
import EditarRegistroDialog from './components/Dialogs/EditarRegistroDialog';
import ConfirmEliminarDialog from './components/Dialogs/ConfirmEliminarDialog';
import { useGestionRegistrosEmpleado } from './hooks/useGestionRegistrosEmpleado';
import { useAccionesRegistrosEmpleado } from './hooks/useAccionesRegistrosEmpleado';
import { useAlertasRegistrosEmpleado } from './hooks/useAlertasRegistrosEmpleado';

function GestionarRegistrosEmpleado() {
  const {
    // estados base
    registros,
    setRegistros,
    tiposHora,
    setTiposHora,
    search,
    setSearch,
    filtroEstado,
    setFiltroEstado,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    registrosFiltrados,
    // dialogs
    openDetails,
    setOpenDetails,
    openEdit,
    setOpenEdit,
    confirmDialog,
    setConfirmDialog,
    registroSeleccionado,
    setRegistroSeleccionado,
    editData,
    setEditData,
    lastUpdate,
    setLastUpdate,
    valorHoraOrdinaria
  } = useGestionRegistrosEmpleado();

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
  } = useAlertasRegistrosEmpleado();

  const {
    initialize,
    handleVer,
    handleEditar,
    handleEliminar,
    handleConfirmEliminar,
    handleGuardarEdicion,
    handleRefresh
  } = useAccionesRegistrosEmpleado({
    setAlertState,
    setLoadingState,
    setSuccessState,
    setRegistros,
    setTiposHora,
    setOpenDetails,
    setOpenEdit,
    setConfirmDialog,
    setRegistroSeleccionado,
    setEditData,
    setLastUpdate
  });

  const [openCrearMultiple, setOpenCrearMultiple] = React.useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <LayoutUniversal NavbarComponent={NavbarEmpleado}>

      <InitialPageLoader open={Boolean(loadingState.initialOpen && loadingState.open)} title="Cargando" subtitle="Preparando datos" iconColor="#1976d2" />

      <HeaderGestionRegistrosEmpleado
        title="Gestión de Registros de Horas Extra"
        subtitle="Administra tus registros personales"
        search={search}
        onSearchChange={setSearch}
        refreshing={loadingState.open}
        onRefresh={handleRefresh}
        onOpenCrearMultiple={() => setOpenCrearMultiple(true)}
      />

      <FiltrosAvanzadosEmpleado
        search={search}
        onSearchChange={setSearch}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        fechaDesde={fechaDesde}
        onFechaDesdeChange={setFechaDesde}
        fechaHasta={fechaHasta}
        onFechaHastaChange={setFechaHasta}
        onRefresh={handleRefresh}
        disabled={loadingState.open}
      />

      <StatsUniversal
        stats={[
          { type: 'total', label: 'Total Registros', value: registros.length, description: 'Todos tus registros' },
          { type: 'pendiente', label: 'Pendientes', value: registros.filter(r => r.estado === 'pendiente').length, description: 'En revisión' },
          { type: 'aprobado', label: 'Aprobados', value: registros.filter(r => r.estado === 'aprobado').length, description: 'Autorizados' },
          { type: 'rechazado', label: 'Rechazados', value: registros.filter(r => r.estado === 'rechazado').length, description: 'No autorizados' }
        ]}
        title="Resumen de Registros"
        subtitle={`Última actualización: ${new Date(lastUpdate).toLocaleTimeString()}`}
        iconColor="#1976d2"
      />

      <TablaRegistrosEmpleado
        data={registrosFiltrados}
        tiposHora={tiposHora}
        onVer={handleVer}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />

      <DetallesRegistroDialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        registro={registroSeleccionado}
        getValorHora={(recargo) => Number((valorHoraOrdinaria * (recargo || 1)).toFixed(2))}
      />

      <EditarRegistroDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        editData={editData}
        setEditData={setEditData}
        onSave={handleGuardarEdicion}
      />

      <ConfirmEliminarDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, registro: null })}
        onConfirm={() => handleConfirmEliminar(() => confirmDialog.registro)}
      />

      <SubAdminUniversalAlertUniversal
        open={alertState.open}
        type={alertState.type}
        message={alertState.message}
        title={alertState.title}
        onClose={hideAlert}
        showLogo={true}
        autoHideDuration={4000}
      />

      <SubAdminLoadingSpinner
        open={Boolean(loadingState.open && !loadingState.initialOpen)}
        message={loadingState.message}
        size={loadingState.size}
        showLogo={true}
      />

      {successState.type === 'download' && (
        <SubAdminSuccessSpinnerUniversal
          open={successState.open}
          message={successState.message}
          title={successState.title}
          onClose={hideSuccess}
        />
      )}

      {/* Diálogo para crear múltiples registros del empleado autenticado */}
      <CrearRegistrosSemanalEmpleadoDialog
        open={openCrearMultiple}
        onClose={() => setOpenCrearMultiple(false)}
        tiposHora={tiposHora}
        usuarios={[]}
        onCreado={() => handleRefresh()}
      />
    </LayoutUniversal>
  );
}

export default GestionarRegistrosEmpleado;


