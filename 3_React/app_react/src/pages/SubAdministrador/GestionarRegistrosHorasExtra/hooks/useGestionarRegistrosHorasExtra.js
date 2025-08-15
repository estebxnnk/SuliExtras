import { useState, useEffect } from 'react';
import { gestionarRegistrosHorasExtraService } from '../services/gestionarRegistrosHorasExtraService';

export const useGestionarRegistrosHorasExtra = () => {
  const [registros, setRegistros] = useState([]);
  const [tiposHora, setTiposHora] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [modo, setModo] = useState('ver'); // 'ver', 'editar', 'estado'
  const [editData, setEditData] = useState({});
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', registro: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchRegistros();
    fetchTiposHora();
    fetchUsuarios();
  }, []);

  const fetchRegistros = async () => {
    setLoading(true);
    try {
      const data = await gestionarRegistrosHorasExtraService.getRegistros();
      setRegistros(data);
    } catch (error) {
      setMensaje('No se pudieron cargar los registros de horas extra.');
    }
    setLoading(false);
  };

  const fetchTiposHora = async () => {
    try {
      const data = await gestionarRegistrosHorasExtraService.getTiposHora();
      setTiposHora(data);
    } catch (error) {
      setMensaje('No se pudieron cargar los tipos de hora.');
    }
  };

  const fetchUsuarios = async () => {
    try {
      const data = await gestionarRegistrosHorasExtraService.getUsuarios();
      setUsuarios(data);
    } catch (error) {
      setMensaje('No se pudieron cargar los usuarios.');
    }
  };

  const handleVer = async (registro) => {
    setModo('ver');
    setRegistroSeleccionado(registro);
    setOpenDialog(true);
  };

  const handleEditar = (registro) => {
    // Si el estado ya fue modificado (no es pendiente), mostrar solo edición de estado
    if (registro.estado !== 'pendiente') {
      setModo('estado');
      setRegistroSeleccionado(registro);
      setNuevoEstado(registro.estado);
      setOpenDialog(true);
    } else {
      // Si es pendiente, mostrar edición completa
      setModo('editar');
      setRegistroSeleccionado(registro);
      setEditData({
        fecha: registro.fecha,
        horaIngreso: registro.horaIngreso,
        horaSalida: registro.horaSalida,
        ubicacion: registro.ubicacion,
        cantidadHorasExtra: registro.cantidadHorasExtra,
        justificacionHoraExtra: registro.justificacionHoraExtra || '',
        horas_extra_divididas: registro.horas_extra_divididas ?? 0,
        bono_salarial: registro.bono_salarial ?? 0,
        tipoHora: (registro.Horas && registro.Horas.length > 0) ? registro.Horas[0].id : '',
      });
      setOpenDialog(true);
    }
  };

  const handleAprobar = (registro) => {
    showConfirmDialog('aprobar', registro);
  };

  const handleRechazar = (registro) => {
    showConfirmDialog('rechazar', registro);
  };

  const handleEliminar = (registro) => {
    showConfirmDialog('eliminar', registro);
  };

  const handleGuardarEdicion = async () => {
    try {
      const dataToSend = {
        ...editData,
        horas: [
          {
            id: editData.tipoHora,
            cantidad: editData.cantidadHorasExtra
          }
        ]
      };
      delete dataToSend.tipoHora;
      delete dataToSend.bono_salarial;

      await gestionarRegistrosHorasExtraService.updateRegistro(registroSeleccionado.id, dataToSend);
      setMensaje('Registro actualizado exitosamente.');
      setOpenDialog(false);
      fetchRegistros();
    } catch (error) {
      setMensaje('No se pudo actualizar el registro.');
    }
  };

  const handleGuardarEstado = async () => {
    try {
      await gestionarRegistrosHorasExtraService.updateRegistro(registroSeleccionado.id, { estado: nuevoEstado });
      setMensaje('Estado del registro actualizado exitosamente.');
      setOpenDialog(false);
      fetchRegistros();
    } catch (error) {
      setMensaje('No se pudo actualizar el estado del registro.');
    }
  };

  // Paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showConfirmDialog = (action, registro) => {
    setConfirmDialog({ open: true, action, registro });
  };

  const handleConfirmAction = async () => {
    const { action, registro } = confirmDialog;
    
    try {
      let message = '';
      
      switch (action) {
        case 'aprobar':
          await gestionarRegistrosHorasExtraService.updateRegistro(registro.id, { estado: 'aprobado' });
          message = 'Registro aprobado exitosamente.';
          break;
          
        case 'rechazar':
          await gestionarRegistrosHorasExtraService.updateRegistro(registro.id, { estado: 'rechazado' });
          message = 'Registro rechazado exitosamente.';
          break;
          
        case 'eliminar':
          await gestionarRegistrosHorasExtraService.deleteRegistro(registro.id);
          message = 'Registro eliminado exitosamente.';
          break;
      }
      
      setMensaje(message);
      fetchRegistros();
    } catch (error) {
      setMensaje(`No se pudo ${action} el registro.`);
    } finally {
      setConfirmDialog({ open: false, action: '', registro: null });
    }
  };

  const onCrearRegistro = async (registroData) => {
    try {
      await gestionarRegistrosHorasExtraService.createRegistro(registroData);
      setMensaje('Registro creado exitosamente.');
      fetchRegistros();
    } catch (error) {
      setMensaje('No se pudo crear el registro.');
    }
  };

  return {
    registros,
    tiposHora,
    usuarios,
    loading,
    mensaje,
    openDialog,
    registroSeleccionado,
    modo,
    editData,
    nuevoEstado,
    search,
    filtroEstado,
    confirmDialog,
    page,
    rowsPerPage,
    handleVer,
    handleEditar,
    handleAprobar,
    handleRechazar,
    handleEliminar,
    handleGuardarEdicion,
    handleGuardarEstado,
    handleChangePage,
    handleChangeRowsPerPage,
    showConfirmDialog,
    handleConfirmAction,
    onCrearRegistro,
    setSearch,
    setFiltroEstado,
    setMensaje,
    setOpenDialog,
    fetchRegistros
  };
}; 