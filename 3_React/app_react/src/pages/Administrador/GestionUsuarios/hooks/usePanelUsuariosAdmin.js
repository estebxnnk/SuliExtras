import { useState, useEffect } from 'react';
import { usuariosService } from '../services';

export const usePanelUsuariosAdmin = () => {
  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('info');
  
  // Estados de UI
  const [openDialog, setOpenDialog] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modo, setModo] = useState('ver'); // 'ver', 'editar', 'rol', 'sede'
  const [editData, setEditData] = useState({});
  const [nuevoRolId, setNuevoRolId] = useState('');
  const [nuevaSedeId, setNuevaSedeId] = useState('');
  const [search, setSearch] = useState('');
  
  // Estado para diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', usuario: null });

  // Funciones para formatear y validar salario
  const formatSalaryInput = (value) => {
    // Remover caracteres no numéricos excepto punto
    let cleanValue = value.replace(/[^\d.]/g, '');
    
    // Asegurar que solo haya un punto decimal
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limitar a 2 decimales
    if (parts[1] && parts[1].length > 2) {
      cleanValue = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    // Limitar a 9 dígitos antes del punto decimal
    if (parts[0].length > 9) {
      cleanValue = parts[0].substring(0, 9) + (parts[1] ? '.' + parts[1] : '');
    }
    
    return cleanValue;
  };

  const formatSalaryDisplay = (value) => {
    if (!value || value === '') return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    return numValue.toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Función para mostrar mensajes
  const mostrarMensaje = (texto, tipo = 'info') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  // Cargar datos iniciales
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/usuarios');
      const data = await response.json();
      console.log('🔍 Datos de usuarios recibidos:', data);
      if (data.length > 0) {
        console.log('🔍 Estructura del primer usuario:', data[0]);
        console.log('🔍 Salario del primer usuario:', data[0].salario);
      }
      setUsuarios(data);
    } catch (error) {
      mostrarMensaje('No se pudieron cargar los usuarios.', 'error');
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      mostrarMensaje('No se pudieron cargar los roles.', 'error');
    }
  };

  const fetchSedes = async () => {
    try {
      const data = await usuariosService.fetchSedes();
      setSedes(data);
    } catch (error) {
      mostrarMensaje('No se pudieron cargar las sedes.', 'error');
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
      salario: usuario.persona?.salario || '',
      sedeId: usuario.sede?.id || '',
    });
    setOpenDialog(true);
  };

  const handleEliminar = async (usuario) => {
    setConfirmDialog({ open: true, action: 'eliminar', usuario });
  };

  const confirmarEliminar = async () => {
    const usuario = confirmDialog.usuario;
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuario.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        mostrarMensaje('No se pudo eliminar el usuario.', 'error');
        setConfirmDialog({ open: false, action: '', usuario: null });
        return;
      }
      mostrarMensaje('Usuario eliminado exitosamente.', 'success');
      setConfirmDialog({ open: false, action: '', usuario: null });
      fetchUsuarios();
    } catch (error) {
      mostrarMensaje('No se pudo conectar con el servidor.', 'error');
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
          salario: data.salario ? parseFloat(data.salario) : null,
        },
      };
      
      console.log('🚀 Enviando datos de actualización:', dataToSend);
      
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioSeleccionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      
      if (!response.ok) {
        mostrarMensaje('No se pudo actualizar el usuario.', 'error');
        return;
      }
      
      mostrarMensaje('Usuario actualizado exitosamente.', 'success');
      handleCloseDialog();
      fetchUsuarios();
    } catch (error) {
      mostrarMensaje('No se pudo conectar con el servidor.', 'error');
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

  const handleCambiarSede = (usuario) => {
    console.log('🏢 handleCambiarSede llamado con usuario:', usuario);
    setModo('sede');
    setUsuarioSeleccionado(usuario);
    const sedeId = usuario.sede?.id || '';
    console.log('🏢 Sede actual del usuario:', sedeId);
    setNuevaSedeId(sedeId);
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

  const handleGuardarSede = async (sedeId) => {
    if (!sedeId) {
      mostrarMensaje('Por favor selecciona una sede.', 'warning');
      return;
    }
    
    // Actualizar el estado con la nueva sede seleccionada
    setNuevaSedeId(sedeId);
    
    // Mostrar diálogo de confirmación
    setConfirmDialog({ 
      open: true, 
      action: 'cambiarSede', 
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

  const confirmarCambiarSede = async () => {
    try {
      console.log('🏢 Cambiando sede del usuario:', {
        usuarioId: usuarioSeleccionado.id,
        nuevaSedeId: nuevaSedeId,
        usuarioEmail: usuarioSeleccionado.email
      });
      
      const result = await usuariosService.actualizarSedeUsuario(usuarioSeleccionado.id, nuevaSedeId);
      console.log('✅ Sede cambiada exitosamente:', result);
      
      mostrarMensaje('Sede cambiada exitosamente.', 'success');
      setConfirmDialog({ open: false, action: '', usuario: null });
      handleCloseDialog();
      fetchUsuarios();
    } catch (error) {
      console.error('💥 Error al cambiar sede:', error);
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
    setNuevaSedeId('');
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
    fetchSedes();
  }, []);

  return {
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
    setConfirmDialog,
    
    // Setters
    setMensaje,
    setSearch,
    
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
  };
};
