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
  useCrearRegistro,
  useCrearRegistrosBulk
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
  CrearRegistrosBulkDialog,
  InformacionFiltros,
  RegistrosSemanaTable
} from './components';
import { RegistrosPorFechaTable, GestionRegistrosDialog, GestionSemanaDialog } from './components';
import { InitialPageLoader } from '../../../components';
import { gestionarRegistrosHorasExtraService } from './services/gestionarRegistrosHorasExtraService';
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
  } = useFiltrosAvanzados(registros, usuarios);

  const {
    crearRegistro,
    loading: loadingCreacion
  } = useCrearRegistro(cargarDatos, showSuccess, showError);

  const {
    crearRegistrosBulk,
    loading: loadingCreacionBulk
  } = useCrearRegistrosBulk(cargarDatos, showSuccess, showError);

  // Calcular estadísticas
  const estadisticasAdicionales = calcularEstadisticas(registros, registrosFiltrados, estadisticasFiltros);

  // Paginación
  const registrosPaginados = registrosFiltrados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Vista dinámica (unitaria / semanal)
  const [vistaSemanal, setVistaSemanal] = React.useState(false);
  const onToggleVista = () => setVistaSemanal(v => !v);
  const [semanaData, setSemanaData] = React.useState(null);
  const [usuarioSemanaId, setUsuarioSemanaId] = React.useState('');
  const [fechaInicioSemana, setFechaInicioSemana] = React.useState('');
  const [fechaSolo, setFechaSolo] = React.useState('');
  const [fechaData, setFechaData] = React.useState(null);
  const [openGestion, setOpenGestion] = React.useState(false);
  const [grupoGestion, setGrupoGestion] = React.useState(null);

  React.useEffect(() => {
    const cargarSemana = async () => {
      if (!vistaSemanal || !usuarioSemanaId) return;
      try {
        const data = await gestionarRegistrosHorasExtraService.getRegistrosPorSemana(usuarioSemanaId, fechaInicioSemana || undefined);
        setSemanaData(data);
      } catch (e) {
        showError(e.message || 'Error al cargar semana');
      }
    };
    cargarSemana();
  }, [vistaSemanal, usuarioSemanaId, fechaInicioSemana]);

  React.useEffect(() => {
    const cargarFecha = async () => {
      if (!vistaSemanal || !fechaSolo) return;
      try {
        const data = await gestionarRegistrosHorasExtraService.getRegistrosPorFecha(fechaSolo);
        setFechaData(data);
      } catch (e) {
        showError(e.message || 'Error al cargar registros por fecha');
      }
    };
    cargarFecha();
  }, [vistaSemanal, fechaSolo]);

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

  const [openBulk, setOpenBulk] = React.useState(false);
  const irACrearRegistrosBulk = () => setOpenBulk(true);
  const cerrarBulk = () => setOpenBulk(false);

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
          irACrearRegistrosBulk={irACrearRegistrosBulk}
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
          extraControls={vistaSemanal ? (
            <>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: { xs: 2, md: 0 } }}>
                <span style={{ fontSize: 12, color: '#666' }}>Vista semanal:</span>
                <select value={usuarioSemanaId} onChange={(e) => setUsuarioSemanaId(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
                  <option value="">Seleccione usuario</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.persona?.nombres} {u.persona?.apellidos} - {u.email}</option>
                  ))}
                </select>
                <input type="date" value={fechaInicioSemana} onChange={(e) => setFechaInicioSemana(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }} />
                <span style={{ fontSize: 12, color: '#666' }}>o Fecha única:</span>
                <input type="date" value={fechaSolo} onChange={(e) => setFechaSolo(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }} />
              </Box>
            </>
          ) : null}
        />

        {/* Toggle dentro del contenedor (no modifica header) */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <button onClick={() => setVistaSemanal(false)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #1976d2', background: vistaSemanal ? '#fff' : '#1976d2', color: vistaSemanal ? '#1976d2' : '#fff', cursor: 'pointer', fontWeight: 700 }}>Vista unitaria</button>
          <button onClick={() => setVistaSemanal(true)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #1976d2', background: vistaSemanal ? '#1976d2' : '#fff', color: vistaSemanal ? '#fff' : '#1976d2', cursor: 'pointer', fontWeight: 700 }}>Vista semanal</button>
          {vistaSemanal && (
            <select value={usuarioSemanaId} onChange={(e) => setUsuarioSemanaId(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
              <option value="">Seleccione usuario</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>{u.persona?.nombres} {u.persona?.apellidos} - {u.email}</option>
              ))}
            </select>
          )}
          {vistaSemanal && (
            <input type="date" value={fechaInicioSemana} onChange={(e) => setFechaInicioSemana(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc' }} />
          )}
          {vistaSemanal && (
            <>
              <span style={{ alignSelf: 'center', color: '#666' }}>o Fecha única:</span>
              <input type="date" value={fechaSolo} onChange={(e) => setFechaSolo(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc' }} />
            </>
          )}
        </Box>

        {!vistaSemanal ? (
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
        ) : (
          fechaSolo ? (
            <RegistrosPorFechaTable
              data={fechaData}
              onOpenGestion={(grupo) => { setGrupoGestion(grupo); setOpenGestion(true); }}
              onDeleteUsuariosSeleccionados={async (usuarioIds, registroIds) => {
                try {
                  const res = await gestionarRegistrosHorasExtraService.deleteMany(registroIds);
                  showSuccess(`Eliminados: ${res.ok}/${res.total}`);
                  const data = await gestionarRegistrosHorasExtraService.getRegistrosPorFecha(fechaSolo);
                  setFechaData(data);
                } catch (e) {
                  showError(e.message || 'Error eliminando');
                }
              }}
            />
          ) : (
            <RegistrosSemanaTable data={semanaData} usuarios={usuarios} />
          )
        )}

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

      {/* Diálogo de Crear Registros (Bulk) */}
      <CrearRegistrosBulkDialog
        open={openBulk}
        onClose={cerrarBulk}
        tiposHora={tiposHora}
        usuarios={usuarios}
        onCrearRegistrosBulk={async ({ usuarioId, registros }) => {
          try {
            const res = await crearRegistrosBulk(usuarioId, registros);
            if (res) showSuccess('Registros creados exitosamente');
            return true;
          } catch (e) {
            showError(e.message || 'Error al crear registros');
            return false;
          }
        }}
        loading={loadingCreacionBulk}
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

      {grupoGestion && !grupoGestion?.registrosPorDia && (
        <GestionRegistrosDialog
          open={openGestion}
          onClose={() => setOpenGestion(false)}
          usuarioGrupo={grupoGestion}
          onAprobarSeleccion={async (ids) => {
            try {
              const res = await gestionarRegistrosHorasExtraService.updateManyEstado(ids, 'aprobado');
              showSuccess(`Aprobados: ${res.ok}/${res.total}`);
              setOpenGestion(false);
              if (fechaSolo) {
                const data = await gestionarRegistrosHorasExtraService.getRegistrosPorFecha(fechaSolo);
                setFechaData(data);
              } else if (usuarioSemanaId) {
                const data = await gestionarRegistrosHorasExtraService.getRegistrosPorSemana(usuarioSemanaId, fechaInicioSemana || undefined);
                setSemanaData(data);
              } else {
                await refrescarDatos();
              }
            } catch (e) {
              showError(e.message || 'Error aprobando');
            }
          }}
          onRechazarSeleccion={async (ids) => {
            try {
              const res = await gestionarRegistrosHorasExtraService.updateManyEstado(ids, 'rechazado');
              showSuccess(`Rechazados: ${res.ok}/${res.total}`);
              setOpenGestion(false);
              if (fechaSolo) {
                const data = await gestionarRegistrosHorasExtraService.getRegistrosPorFecha(fechaSolo);
                setFechaData(data);
              } else if (usuarioSemanaId) {
                const data = await gestionarRegistrosHorasExtraService.getRegistrosPorSemana(usuarioSemanaId, fechaInicioSemana || undefined);
                setSemanaData(data);
              } else {
                await refrescarDatos();
              }
            } catch (e) {
              showError(e.message || 'Error rechazando');
            }
          }}
          onEditar={(r) => { setOpenGestion(false); abrirDialog(r, 'editar'); }}
          onEliminar={(r) => { setOpenGestion(false); abrirConfirmDialog('eliminar', r, 'Confirmar Eliminación', '¿Eliminar este registro?'); }}
        />
      )}

      {grupoGestion && grupoGestion?.registrosPorDia && (
        <GestionSemanaDialog
          open={openGestion}
          onClose={() => setOpenGestion(false)}
          data={{ registrosPorDia: grupoGestion.registrosPorDia, semana: fechaData?.semana }}
          usuarios={usuarios}
          onAprobarSeleccion={async (ids) => {
            try {
              const res = await gestionarRegistrosHorasExtraService.updateManyEstado(ids, 'aprobado');
              showSuccess(`Aprobados: ${res.ok}/${res.total}`);
              setOpenGestion(false);
              if (fechaSolo) {
                const data = await gestionarRegistrosHorasExtraService.getRegistrosPorFecha(fechaSolo);
                setFechaData(data);
              } else if (usuarioSemanaId) {
                const data = await gestionarRegistrosHorasExtraService.getRegistrosPorSemana(usuarioSemanaId, fechaInicioSemana || undefined);
                setSemanaData(data);
              } else {
                await refrescarDatos();
              }
            } catch (e) {
              showError(e.message || 'Error aprobando');
            }
          }}
          onRechazarSeleccion={async (ids) => {
            try {
              const res = await gestionarRegistrosHorasExtraService.updateManyEstado(ids, 'rechazado');
              showSuccess(`Rechazados: ${res.ok}/${res.total}`);
              setOpenGestion(false);
              if (fechaSolo) {
                const data = await gestionarRegistrosHorasExtraService.getRegistrosPorFecha(fechaSolo);
                setFechaData(data);
              } else if (usuarioSemanaId) {
                const data = await gestionarRegistrosHorasExtraService.getRegistrosPorSemana(usuarioSemanaId, fechaInicioSemana || undefined);
                setSemanaData(data);
              } else {
                await refrescarDatos();
              }
            } catch (e) {
              showError(e.message || 'Error rechazando');
            }
          }}
          onEditar={(r) => { setOpenGestion(false); abrirDialog(r, 'editar'); }}
          onEliminar={(r) => { setOpenGestion(false); abrirConfirmDialog('eliminar', r, 'Confirmar Eliminación', '¿Eliminar este registro?'); }}
        />
      )}
    </Box>
  );
}

export default GestionarRegistrosHorasExtra; 