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
import { usePanelUsuariosSubAdmin } from './hooks/usePanelUsuariosSubAdmin';
import LoadingSpinner from './components/LoadingSpinner';
import ConfirmDialog from './components/ConfirmDialog';
import FiltrosUsuarios from './components/FiltrosUsuarios';
import UsuarioDialog from './components/UsuarioDialog';
import {
  UniversalAlert,
  SuccessSpinner,
  EditSuccessSpinner,
  DeleteSuccessSpinner,
  StateChangeSuccessSpinner
} from '../../../components';
import {
  LayoutUniversal,
  HeaderUniversal,
  StatsUniversal,
  FiltersUniversal
} from '../../../components';
import UsuariosTable from './components/UsuariosTable';
import useUserFiltersUniversal from '../../../components/hooks/useUserFiltersUniversal';

function PanelUsuariosSubAdmin() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const {
    // Estados
    usuarios,
    roles,
    loading,
    mensaje,
    tipoMensaje,
    openDialog,
    usuarioSeleccionado,
    modo,
    editData,
    nuevoRolId,
    search,
    confirmDialog,
    
    // Setters
    setMensaje,
    setSearch,
    
    // Funciones
    fetchUsuarios,
    fetchRoles,
    handleVer,
    handleEditar,
    handleEliminar,
    handleGuardarEdicion,
    handleCambiarRol,
    handleGuardarRol,
    handleCloseDialog,
    confirmarEliminar,
    confirmarCambiarRol
  } = usePanelUsuariosSubAdmin();

  // Estado de paginación
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  // Estado para acciones en progreso
  const [actionLoading, setActionLoading] = React.useState(false);

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
        <LoadingSpinner message="Cargando usuarios..." size="large" />
      </Box>
    );
  }

  return (
    <LayoutUniversal>
      <HeaderUniversal
        title="Gestión de Usuarios"
        subtitle={`Administra usuarios | Total: ${usuarios.length} | Roles: ${roles.length}`}
        icon={PersonIcon}
        iconColor="#1976d2"
        refreshing={false}
        onRefresh={async () => {
          setActionLoading(true);
          try {
            await Promise.all([fetchUsuarios(), fetchRoles()]);
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
        onCreate={() => navigate('/registrar-usuario')}
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
            isMobile={isMobile}
          />
      {/* Diálogo de Usuario */}
      <UsuarioDialog
        open={openDialog}
        modo={modo}
        usuario={usuarioSeleccionado}
        editData={editData}
        nuevoRolId={nuevoRolId}
        roles={roles}
        onClose={handleCloseDialog}
        onGuardarEdicion={handleGuardarEdicion}
        onGuardarRol={handleGuardarRol}
        isMobile={isMobile}
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
      <ConfirmDialog
        open={confirmDialog.open}
        action={confirmDialog.action}
        usuario={confirmDialog.usuario}
        onClose={() => setConfirmDialog({ open: false, action: '', usuario: null })}
        onConfirm={confirmDialog.action === 'eliminar' ? confirmarEliminar : confirmarCambiarRol}
      />
    </LayoutUniversal>
  );
}

export default PanelUsuariosSubAdmin; 