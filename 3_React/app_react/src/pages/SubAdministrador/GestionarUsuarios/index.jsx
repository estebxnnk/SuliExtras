import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  TablePagination
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import NavbarSubAdmin from '../NavbarSubAdmin';
import { usePanelUsuariosSubAdmin } from './hooks/usePanelUsuariosSubAdmin';
import LoadingSpinner from './components/LoadingSpinner';
import AlertMessage from './components/AlertMessage';
import ConfirmDialog from './components/ConfirmDialog';
import FiltrosUsuarios from './components/FiltrosUsuarios';
import UsuarioDialog from './components/UsuarioDialog';
import UsuariosTable from './components/UsuariosTable';

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

  // Filtrar usuarios según la búsqueda
  const usuariosFiltrados = React.useMemo(() => {
    if (!search) return usuarios;

    const searchLower = search.toLowerCase();
    return usuarios.filter(usuario => {
      const nombre = `${usuario.persona?.nombres || ''} ${usuario.persona?.apellidos || ''}`.toLowerCase();
      const email = (usuario.email || '').toLowerCase();
      const documento = (usuario.persona?.numeroDocumento || '').toLowerCase();

      return nombre.includes(searchLower) ||
        email.includes(searchLower) ||
        documento.includes(searchLower);
    });
  }, [usuarios, search]);

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
    <Box sx={{ 
      Height: '100vh', 
      width: '100vw',
      overflow: 'hidden', 
      background: "url('/img/Recepcion.jpg') no-repeat center center", 
      backgroundSize: 'cover',
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <NavbarSubAdmin />
      
      <Paper elevation={8} sx={{ 
        borderRadius: 4, 
        p: { xs: 2, sm: 3, md: 4 },
        margin: '120px auto 40px auto', 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,248,255,0.98) 100%)',
        border: '1px solid rgba(25, 118, 210, 0.2)',
        position: 'relative',
        backdropFilter: 'blur(10px)',
        width: '100%',
        maxWidth: '92vw',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <PersonIcon sx={{ fontSize: 48, color: '#1976d2' }} />
          <Box>
            <Typography variant="h3" component="h1" fontWeight={800} color="#1976d2" sx={{ 
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Gestión de Usuarios
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
              Administra y gestiona todos los usuarios del sistema
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Total de usuarios: {usuarios.length} | Roles disponibles: {roles.length}
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => navigate('/registrar-usuario')}
          disabled={actionLoading}
          sx={{ 
            position: 'absolute', 
            right: 32, 
            top: 32, 
            fontWeight: 700, 
            borderRadius: 3, 
            fontSize: 16, 
            zIndex: 10,
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
            },
            '&:disabled': {
              background: 'rgba(76, 175, 80, 0.5)',
              transform: 'none',
              boxShadow: 'none'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {actionLoading ? 'Procesando...' : 'Registrar Usuario'}
        </Button>

        {/* Filtros */}
        <Box sx={{ mb: 3 }}>
          <FiltrosUsuarios
            search={search}
            onSearchChange={setSearch}
            isMobile={isMobile}
          />
          
          {/* Botón de prueba temporal */}
          <Button
            variant="outlined"
            onClick={() => {
              console.log('🧪 Prueba: Estados actuales:', {
                usuarios: usuarios.length,
                roles: roles.length,
                confirmDialog,
                usuarioSeleccionado,
                nuevoRolId
              });
            }}
            sx={{ ml: 2, borderRadius: 2 }}
          >
            🧪 Debug Estados
          </Button>
        </Box>

        {/* Tabla de Usuarios */}
        {usuariosFiltrados.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,248,255,0.9) 100%)',
            borderRadius: 3,
            border: '2px dashed rgba(25, 118, 210, 0.3)',
            mt: 3
          }}>
            <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {search ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {search 
                ? `No se encontraron usuarios que coincidan con "${search}"`
                : 'Los usuarios aparecerán aquí una vez que se registren en el sistema'
              }
            </Typography>
            {search && (
              <Button
                variant="outlined"
                onClick={() => setSearch('')}
                sx={{ borderRadius: 2 }}
              >
                Limpiar búsqueda
              </Button>
            )}
          </Box>
        ) : (
          <UsuariosTable
            usuarios={usuariosPaginados}
            search={search}
            onVer={handleVer}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            onCambiarRol={handleCambiarRol}
            isMobile={isMobile}
          />
        )}

        {/* Paginación */}
        <Paper elevation={2} sx={{ 
          mt: 3, 
          borderRadius: 2, 
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(25, 118, 210, 0.1)'
        }}>
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid rgba(25, 118, 210, 0.1)'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Mostrando {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuarios
            </Typography>
            {search && (
              <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                🔍 Filtrado por: "{search}"
              </Typography>
            )}
          </Box>
          <TablePagination
            component="div"
            count={usuariosFiltrados.length}
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
              },
              '& .MuiTablePagination-select': {
                borderRadius: 1,
                '&:focus': {
                  background: 'rgba(25, 118, 210, 0.1)'
                }
              }
            }}
          />
        </Paper>
      </Paper>

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

      {/* Alerta flotante */}
      <AlertMessage
        mensaje={mensaje}
        tipo={tipoMensaje}
        onClose={() => setMensaje('')}
      />

      {/* Diálogo de confirmación para eliminar o cambiar rol */}
      <ConfirmDialog
        open={confirmDialog.open}
        action={confirmDialog.action}
        usuario={confirmDialog.usuario}
        onClose={() => setConfirmDialog({ open: false, action: '', usuario: null })}
        onConfirm={confirmDialog.action === 'eliminar' ? confirmarEliminar : confirmarCambiarRol}
      />
    </Box>
  );
}

export default PanelUsuariosSubAdmin; 