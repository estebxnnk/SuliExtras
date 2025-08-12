import { useState, useEffect } from 'react';
import { subAdminService } from '../../PanelSubAdmin/services/subAdminService';

export const usePanelUsuariosSubAdmin = () => {
  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  
  // Estados de UI
  const [openDialog, setOpenDialog] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modo, setModo] = useState('ver'); // 'ver', 'editar', 'rol'
  const [editData, setEditData] = useState({});
  const [nuevoRolId, setNuevoRolId] = useState('');
  const [search, setSearch] = useState('');

  // Cargar datos iniciales
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await subAdminService.fetchUsuarios();
      setUsuarios(data);
    } catch (error) {
      setMensaje('No se pudieron cargar los usuarios.');
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const data = await subAdminService.fetchRoles();
      setRoles(data);
    } catch (error) {
      setMensaje('No se pudieron cargar los roles.');
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
      tipoDocumento: usuario.persona?.tipoDocumento || '',
      numeroDocumento: usuario.persona?.numeroDocumento || '',
      nombres: usuario.persona?.nombres || '',
      apellidos: usuario.persona?.apellidos || '',
      correo: usuario.persona?.correo || '',
      fechaNacimiento: usuario.persona?.fechaNacimiento ? usuario.persona.fechaNacimiento.substring(0, 10) : '',
      rolId: usuario.rol?.id || '',
    });
    setOpenDialog(true);
  };

  const handleEliminar = async (usuario) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    
    try {
      await subAdminService.deleteUsuario(usuario.id);
      setMensaje('Usuario eliminado exitosamente.');
      fetchUsuarios();
    } catch (error) {
      setMensaje('No se pudo eliminar el usuario.');
    }
  };

  const handleGuardarEdicion = async () => {
    try {
      await subAdminService.updateUsuario(usuarioSeleccionado.id, editData);
      setMensaje('Usuario actualizado exitosamente.');
      handleCloseDialog();
      fetchUsuarios();
    } catch (error) {
      setMensaje('No se pudo actualizar el usuario.');
    }
  };

  const handleCambiarRol = (usuario) => {
    setModo('rol');
    setUsuarioSeleccionado(usuario);
    setNuevoRolId(usuario.rol?.id || '');
    setOpenDialog(true);
  };

  const handleGuardarRol = async () => {
    if (!nuevoRolId) {
      setMensaje('Por favor selecciona un rol.');
      return;
    }
    
    try {
      await subAdminService.cambiarRolUsuario(usuarioSeleccionado.id, nuevoRolId);
      setMensaje('Rol cambiado exitosamente.');
      handleCloseDialog();
      fetchUsuarios();
    } catch (error) {
      setMensaje('No se pudo cambiar el rol del usuario.');
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
    openDialog,
    usuarioSeleccionado,
    modo,
    editData,
    nuevoRolId,
    search,
    
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
    handleCloseDialog
  };
}; 