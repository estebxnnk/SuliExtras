import { useState, useEffect } from 'react';
import { subAdminService } from '../../PanelSubAdmin/services/subAdminService';

export const usePanelUsuariosSubAdmin = () => {
  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('info');
  
  // Estados de UI
  const [openDialog, setOpenDialog] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modo, setModo] = useState('ver'); // 'ver', 'editar', 'rol'
  const [editData, setEditData] = useState({});
  const [nuevoRolId, setNuevoRolId] = useState('');
  const [search, setSearch] = useState('');
  
  // Estado para diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', usuario: null });

  // Función para mostrar mensajes
  const mostrarMensaje = (texto, tipo = 'info') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  // Cargar datos iniciales
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await subAdminService.fetchUsuarios();
      setUsuarios(data);
    } catch (error) {
      mostrarMensaje('No se pudieron cargar los usuarios.', 'error');
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const data = await subAdminService.fetchRoles();
      setRoles(data);
    } catch (error) {
      mostrarMensaje('No se pudieron cargar los roles.', 'error');
    }
  };

  // Handlers
  const handleVer = async (usuario) => {
    setModo('ver');
    setUsuarioSeleccionado(usuario);
    setOpenDialog(true);
  };

  const handleEditar = (usuario) => {
    setModo('editar');
    setUsuarioSeleccionado(usuario);
    setEditData({
      email: usuario.email,
      rolId: usuario.rol?.id || '',
     tipoDocumento: usuario.persona?.tipoDocumento || '',
      numeroDocumento: usuario.persona?.numeroDocumento || '',
       nombres: usuario.persona?.nombres || '',
      apellidos: usuario.persona?.apellidos || '',
      correo: usuario.persona?.correo || '',
      fechaNacimiento: usuario.persona?.fechaNacimiento ? usuario.persona.fechaNacimiento.substring(0, 10) : '',

    });
    setOpenDialog(true);
  };

  const handleEliminar = async (usuario) => {
    setConfirmDialog({ open: true, action: 'eliminar', usuario });
  };

  const confirmarEliminar = async () => {
    const usuario = confirmDialog.usuario;
    try {
      await subAdminService.deleteUsuario(usuario.id);
      mostrarMensaje('Usuario eliminado exitosamente.', 'success');
      setConfirmDialog({ open: false, action: '', usuario: null });
      fetchUsuarios();
    } catch (error) {
      mostrarMensaje('No se pudo eliminar el usuario: ' + error.message, 'error');
      setConfirmDialog({ open: false, action: '', usuario: null });
    }
  };

  const handleGuardarEdicion = async (data) => {
    try {
      // Construir el objeto con la estructura recomendada para la API
      const dataToSend = {
        email: data.email,
        rolId: data.rolId,
        persona: {
          tipoDocumento: data.tipoDocumento,
          numeroDocumento: data.numeroDocumento,
          nombres: data.nombres,
          apellidos: data.apellidos,
          correo: data.correo,
          fechaNacimiento: data.fechaNacimiento,
        },
      };
      
      await subAdminService.updateUsuario(usuarioSeleccionado.id, dataToSend);
      mostrarMensaje('Usuario actualizado exitosamente.', 'success');
      handleCloseDialog();
      fetchUsuarios();
    } catch (error) {
      mostrarMensaje('No se pudo actualizar el usuario: ' + error.message, 'error');
    }
  };

  const handleCambiarRol = (usuario) => {
    console.log('🔧 handleCambiarRol llamado con usuario:', usuario);
    setModo('rol');
    setUsuarioSeleccionado(usuario);
    const rolId = usuario.rol?.id || '';
    console.log('🔧 Rol actual del usuario:', rolId);
    setNuevoRolId(rolId);
    setOpenDialog(true);
  };

  const handleGuardarRol = async (rolId) => {
    if (!rolId) {
      mostrarMensaje('Por favor selecciona un rol.', 'warning');
      return;
    }
    
    // Actualizar el estado con el nuevo rol seleccionado
    setNuevoRolId(rolId);
    
    // Mostrar diálogo de confirmación
    setConfirmDialog({ 
      open: true, 
      action: 'cambiarRol', 
      usuario: usuarioSeleccionado 
    });
  };

  const confirmarCambiarRol = async () => {
    try {
      console.log('🔄 Cambiando rol del usuario:', {
        usuarioId: usuarioSeleccionado.id,
        nuevoRolId: nuevoRolId,
        usuarioEmail: usuarioSeleccionado.email
      });
      
      // Usar el mismo endpoint que funciona en PanelUsuariosAdministrativo
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioSeleccionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rolId: nuevoRolId }),
      });
      
      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error del servidor:', errorData);
        mostrarMensaje(`No se pudo actualizar el rol del usuario. ${errorData.message || ''}`, 'error');
        setConfirmDialog({ open: false, action: '', usuario: null });
        return;
      }
      
      const result = await response.json();
      console.log('✅ Rol cambiado exitosamente:', result);
      
      mostrarMensaje('Rol cambiado exitosamente.', 'success');
      setConfirmDialog({ open: false, action: '', usuario: null });
      handleCloseDialog();
      fetchUsuarios();
    } catch (error) {
      console.error('💥 Error al cambiar rol:', error);
      mostrarMensaje('No se pudo conectar con el servidor: ' + error.message, 'error');
      setConfirmDialog({ open: false, action: '', usuario: null });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUsuarioSeleccionado(null);
    setModo('ver');
    setEditData({});
    setNuevoRolId('');
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  return {
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
  };
}; 