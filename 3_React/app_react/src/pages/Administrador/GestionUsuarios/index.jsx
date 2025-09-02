import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useNavigate } from 'react-router-dom';
import { usePanelUsuariosAdmin } from './hooks/usePanelUsuariosAdmin';
import LoadingSpinner from './components/LoadingSpinner';
import ConfirmDialog from './components/ConfirmDialog';
import { ConfirmDialogUniversal, InitialPageLoader, RegistrarUsuarioDialog } from '../../../components';
import FiltrosUsuarios from './components/FiltrosUsuarios';
import UsuarioDialog from './components/UsuarioDialog';
import {
  UniversalAlert,
  SuccessSpinner,
  EditSuccessSpinner,
  DeleteSuccessSpinner,
  StateChangeSuccessSpinner,
  CreateSuccessSpinner
} from '../../../components';
import {
  LayoutUniversal,
  HeaderUniversal,
  StatsUniversal,
  FiltersUniversal
} from '../../../components';
import NavbarAdminstrativo from '../NavbarAdminstrativo';
import UsuariosTable from './components/UsuariosTable';
import useUserFiltersUniversal from '../../../components/hooks/useUserFiltersUniversal';

function PanelUsuariosAdmin() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const {
    // Estados
    usuarios,
    roles,
    sedes,
    loading,
    mensaje,
    tipoMensaje,
    openDialog,
    usuarioSeleccionado,
    modo,
    editData,
    nuevoRolId,
    nuevaSedeId,
    search,
    confirmDialog,
    
    // Setters
    setMensaje,
    setSearch,
    setConfirmDialog,
    
    // Funciones
    fetchUsuarios,
    fetchRoles,
    fetchSedes,
    handleVer,
    handleEditar,
    handleEliminar,
    handleGuardarEdicion,
    handleCambiarRol,
    handleGuardarRol,
    handleCambiarSede,
    handleGuardarSede,
    handleCloseDialog,
    confirmarEliminar,
    confirmarCambiarRol,
    confirmarCambiarSede,
    
    // Funciones de formateo
    formatSalaryInput,
    formatSalaryDisplay
  } = usePanelUsuariosAdmin();

  // Estado de paginación
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  // Estado para acciones en progreso
  const [actionLoading, setActionLoading] = React.useState(false);
  
  // Estado para el diálogo de registro
  const [openRegistrarDialog, setOpenRegistrarDialog] = React.useState(false);

  // Filtros universales de usuarios (search, rol, sede)
  const {
    search: searchUsers,
    setSearch: setSearchUsers,
    roleId,
    setRoleId,
    sedeId,
    setSedeId,
    roleOptions,
    sedeOptions,
    filteredUsers: usuariosFiltrados
  } = useUserFiltersUniversal(usuarios, roles);

  // Paginación
  const usuariosPaginados = usuariosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Funciones de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Resetear paginación cuando cambie la búsqueda
  React.useEffect(() => {
    setPage(0);
  }, [search]);

  // Funciones para el diálogo de registro
  const handleOpenRegistrarDialog = () => {
    setOpenRegistrarDialog(true);
  };

  const handleCloseRegistrarDialog = () => {
    setOpenRegistrarDialog(false);
  };

  const handleRegistroExitoso = () => {
    // Recargar la lista de usuarios después del registro exitoso
    fetchUsuarios();
  };

  if (loading) {
    return <InitialPageLoader open title="Cargando Usuarios" subtitle="Preparando datos y componentes" iconColor="#1976d2" />;
  }

  return (
    <LayoutUniversal
      NavbarComponent={NavbarAdminstrativo}
      navbarProps={{}}
    >
      <HeaderUniversal
        title="Gestión de Usuarios"
        subtitle={`Administra usuarios | Total: ${usuarios.length} | Roles: ${roles.length}`}
        icon={PersonIcon}
        iconColor="#1976d2"
        refreshing={false}
        onRefresh={async () => {
          setActionLoading(true);
          try {
            await Promise.all([fetchUsuarios(), fetchRoles(), fetchSedes()]);
          } finally {
            setActionLoading(false);
          }
        }}
      />

      <StatsUniversal
        stats={[
          { type: 'total', label: 'Total Usuarios', value: usuarios.length },
          { type: 'usuarios', label: 'Roles Disponibles', value: roles.length }
        ]}
        title="Resumen de Usuarios"
        subtitle="Métricas clave del módulo"
        iconColor="#1976d2"
      />

      <FiltersUniversal
        search={searchUsers}
        onSearchChange={setSearchUsers}
        roles={roleOptions}
        roleValue={roleId}
        onRoleChange={setRoleId}
        sedes={sedeOptions}
        sedeValue={sedeId}
        onSedeChange={setSedeId}
        onCreate={handleOpenRegistrarDialog}
        createText={actionLoading ? 'Procesando...' : 'Registrar Usuario'}
      />

      <UsuariosTable
        data={usuariosPaginados}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={usuariosFiltrados.length}
        onPageChange={(_, newPage) => handleChangePage(null, newPage)}
        onRowsPerPageChange={(e) => handleChangeRowsPerPage(e)}
        onVer={handleVer}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        onCambiarRol={handleCambiarRol}
        onCambiarSede={handleCambiarSede}
        isMobile={isMobile}
      />

      {/* Diálogo de Usuario */}
      <UsuarioDialog
        open={openDialog}
        modo={modo}
        usuario={usuarioSeleccionado}
        editData={editData}
        nuevoRolId={nuevoRolId}
        nuevaSedeId={nuevaSedeId}
        roles={roles}
        sedes={sedes}
        onClose={handleCloseDialog}
        onGuardarEdicion={handleGuardarEdicion}
        onGuardarRol={handleGuardarRol}
        onGuardarSede={handleGuardarSede}
        isMobile={isMobile}
        formatSalaryInput={formatSalaryInput}
        formatSalaryDisplay={formatSalaryDisplay}
      />

      {/* Alerta universal */}
      <UniversalAlert
        open={!!mensaje}
        type={tipoMensaje}
        message={mensaje}
        title={tipoMensaje === 'success' ? 'Operación exitosa' : tipoMensaje === 'error' ? 'Error' : tipoMensaje === 'warning' ? 'Advertencia' : 'Información'}
        onClose={() => setMensaje('')}
        showLogo={true}
        autoHideDuration={4000}
      />

      {/* Spinners de éxito según mensaje */}
      <EditSuccessSpinner
        open={tipoMensaje === 'success' && /actualizado|editado/i.test(mensaje)}
        message={mensaje || 'Usuario actualizado exitosamente.'}
        onComplete={() => setMensaje('')}
      />
      <DeleteSuccessSpinner
        open={tipoMensaje === 'success' && /eliminado/i.test(mensaje)}
        message={mensaje || 'Usuario eliminado exitosamente.'}
        onComplete={() => setMensaje('')}
      />
      <StateChangeSuccessSpinner
        open={tipoMensaje === 'success' && /rol cambiado|rol actualizado|rol cambiado exitosamente/i.test(mensaje)}
        message={mensaje || 'Estado del usuario cambiado exitosamente.'}
        onComplete={() => setMensaje('')}
      />

      {/* Diálogo de confirmación para eliminar o cambiar rol */}
      <ConfirmDialogUniversal
        open={confirmDialog.open}
        action={confirmDialog.action}
        data={confirmDialog.usuario}
        onClose={() => setConfirmDialog({ open: false, action: '', usuario: null })}
        onConfirm={confirmDialog.action === 'eliminar' ? confirmarEliminar : confirmDialog.action === 'cambiarRol' ? confirmarCambiarRol : confirmarCambiarSede}
        color={confirmDialog.action === 'eliminar' ? '#f44336' : confirmDialog.action === 'cambiarRol' ? '#ff9800' : '#4caf50'}
      />

      {/* Diálogo de registro de usuario */}
      <RegistrarUsuarioDialog
        open={openRegistrarDialog}
        onClose={handleCloseRegistrarDialog}
        onSuccess={handleRegistroExitoso}
        formatSalaryInput={formatSalaryInput}
        sedes={sedes}
      />

      {/* Spinner de creación exitosa */}
      <CreateSuccessSpinner
        open={tipoMensaje === 'success' && /registrado|creado/i.test(mensaje)}
        message={mensaje || 'Usuario registrado exitosamente.'}
        onComplete={() => setMensaje('')}
      />
    </LayoutUniversal>
  );
}

export default PanelUsuariosAdmin;
