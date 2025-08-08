import { useState, useEffect } from 'react';
import { dispositivosService } from '../services/dispositivosService';

export const useDispositivos = () => {
  // Estados principales
  const [dispositivos, setDispositivos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Estados de UI
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editingDispositivo, setEditingDispositivo] = useState(null);
  const [viewingDispositivo, setViewingDispositivo] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Estados para asignaciones
  const [openAsignacionesDialog, setOpenAsignacionesDialog] = useState(false);
  const [selectedDispositivoAsignaciones, setSelectedDispositivoAsignaciones] = useState(null);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(false);

  // Estados de paginación y filtros
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    estado: '',
    sede: '',
    funcional: '',
    tipoDispositivo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    nombreDispositivo: '',
    codigoActivo: '',
    serial: '',
    modelo: '',
    marca: '',
    tipo: '',
    estado: 'DISPONIBLE',
    clasificacion: '',
    funcional: true,
    sedeId: '',
    ubicacionDetallada: '',
    empleadoAsignadoId: '',
    costo: '',
    fechaAdquisicion: null,
    proveedor: '',
    numeroFactura: '',
    fechaFinGarantia: null,
    sistemaOperativo: '',
    procesador: '',
    memoria: '',
    almacenamiento: '',
    direccionIP: '',
    direccionMAC: '',
    observaciones: ''
  });

  // Cargar datos iniciales
  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        dispositivosService.fetchDispositivos().then(setDispositivos),
        dispositivosService.fetchSedes().then(setSedes),
        dispositivosService.fetchEmpleados().then(setEmpleados)
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ open: true, message: 'Error al cargar los datos', severity: 'error' });
    }
    setLoading(false);
  };

  // Cargar asignaciones
  const fetchAsignaciones = async (dispositivoId) => {
    setLoadingAsignaciones(true);
    try {
      const data = await dispositivosService.fetchAsignaciones(dispositivoId);
      setAsignaciones(data);
    } catch (error) {
      console.error('Error fetching asignaciones:', error);
      setSnackbar({ open: true, message: 'Error al cargar las asignaciones', severity: 'error' });
      setAsignaciones([]);
    }
    setLoadingAsignaciones(false);
  };

  // Crear/Editar dispositivo
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const dispositivoData = {
        item: formData.nombreDispositivo,
        codigoActivo: formData.codigoActivo,
        serial: formData.serial,
        modelo: formData.modelo,
        marca: formData.marca,
        tipo: formData.tipo,
        estado: formData.estado,
        clasificacion: formData.clasificacion,
        funcional: formData.funcional,
        sede: formData.sedeId ? { sedeId: parseInt(formData.sedeId) } : null,
        ubicacionDetallada: formData.ubicacionDetallada,
        empleadoAsignado: formData.empleadoAsignadoId ? { empleadoId: parseInt(formData.empleadoAsignadoId) } : null,
        costo: formData.costo ? parseFloat(formData.costo) : null,
        fechaAdquisicion: formData.fechaAdquisicion ? formData.fechaAdquisicion.toISOString().split('T')[0] : null,
        proveedor: formData.proveedor,
        numeroFactura: formData.numeroFactura,
        fechaFinGarantia: formData.fechaFinGarantia ? formData.fechaFinGarantia.toISOString().split('T')[0] : null,
        sistemaOperativo: formData.sistemaOperativo,
        procesador: formData.procesador,
        memoria: formData.memoria,
        almacenamiento: formData.almacenamiento,
        direccionIP: formData.direccionIP,
        direccionMAC: formData.direccionMAC,
        observaciones: formData.observaciones
      };

      if (editingDispositivo) {
        await dispositivosService.updateDispositivo(editingDispositivo.dispositivoId, dispositivoData);
        setSnackbar({ open: true, message: 'Dispositivo actualizado exitosamente', severity: 'success' });
      } else {
        await dispositivosService.createDispositivo(dispositivoData);
        setSnackbar({ open: true, message: 'Dispositivo creado exitosamente', severity: 'success' });
      }
      
      handleCloseDialog();
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: 'Error al guardar el dispositivo', severity: 'error' });
    }
    setSubmitting(false);
  };

  // Eliminar dispositivo
  const handleDelete = async (dispositivoId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este dispositivo?')) {
      try {
        await dispositivosService.deleteDispositivo(dispositivoId);
        setSnackbar({ open: true, message: 'Dispositivo eliminado exitosamente', severity: 'success' });
        fetchData();
      } catch (error) {
        console.error('Error:', error);
        setSnackbar({ open: true, message: 'Error al eliminar el dispositivo', severity: 'error' });
      }
    }
  };

  // Manejo de diálogos
  const handleOpenDialog = (dispositivo = null) => {
    if (dispositivo) {
      setEditingDispositivo(dispositivo);
      setFormData({
        nombreDispositivo: dispositivo.item || '',
        codigoActivo: dispositivo.codigoActivo || '',
        serial: dispositivo.serial || '',
        modelo: dispositivo.modelo || '',
        marca: dispositivo.marca || '',
        tipo: dispositivo.tipo || '',
        estado: dispositivo.estado || 'DISPONIBLE',
        clasificacion: dispositivo.clasificacion || '',
        funcional: dispositivo.funcional !== undefined ? dispositivo.funcional : true,
        sedeId: dispositivo.sede?.sedeId || '',
        ubicacionDetallada: dispositivo.ubicacionDetallada || '',
        empleadoAsignadoId: dispositivo.empleadoAsignado?.empleadoId || '',
        costo: dispositivo.costo || '',
        fechaAdquisicion: dispositivo.fechaAdquisicion ? new Date(dispositivo.fechaAdquisicion) : null,
        proveedor: dispositivo.proveedor || '',
        numeroFactura: dispositivo.numeroFactura || '',
        fechaFinGarantia: dispositivo.fechaFinGarantia ? new Date(dispositivo.fechaFinGarantia) : null,
        sistemaOperativo: dispositivo.sistemaOperativo || '',
        procesador: dispositivo.procesador || '',
        memoria: dispositivo.memoria || '',
        almacenamiento: dispositivo.almacenamiento || '',
        direccionIP: dispositivo.direccionIP || '',
        direccionMAC: dispositivo.direccionMAC || '',
        observaciones: dispositivo.observaciones || ''
      });
    } else {
      setEditingDispositivo(null);
      setFormData({
        nombreDispositivo: '', codigoActivo: '', serial: '', modelo: '', marca: '', tipo: '',
        sedeId: '', empleadoAsignadoId: '', ubicacionDetallada: '',
        estado: 'DISPONIBLE', clasificacion: '', funcional: true,
        costo: '', fechaAdquisicion: null, proveedor: '', numeroFactura: '', fechaFinGarantia: null,
        sistemaOperativo: '', procesador: '', memoria: '', almacenamiento: '', direccionIP: '', direccionMAC: '',
        observaciones: ''
      });
    }
    setOpenDialog(true);
  };

  const handleOpenViewDialog = (dispositivo) => {
    setViewingDispositivo(dispositivo);
    setOpenViewDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenViewDialog(false);
    setEditingDispositivo(null);
    setViewingDispositivo(null);
  };

  const handleOpenAsignacionesDialog = async (dispositivo) => {
    setSelectedDispositivoAsignaciones(dispositivo);
    setOpenAsignacionesDialog(true);
    await fetchAsignaciones(dispositivo.dispositivoId);
  };

  const handleCloseAsignacionesDialog = () => {
    setOpenAsignacionesDialog(false);
    setSelectedDispositivoAsignaciones(null);
    setAsignaciones([]);
  };

  // Paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtros
  const clearFilters = () => {
    setFilters({
      estado: '',
      sede: '',
      funcional: '',
      tipoDispositivo: ''
    });
    setSearchTerm('');
    setPage(0);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  return {
    // Estados
    dispositivos,
    sedes,
    empleados,
    loading,
    submitting,
    openDialog,
    openViewDialog,
    editingDispositivo,
    viewingDispositivo,
    snackbar,
    openAsignacionesDialog,
    selectedDispositivoAsignaciones,
    asignaciones,
    loadingAsignaciones,
    page,
    rowsPerPage,
    filters,
    showFilters,
    searchTerm,
    formData,
    
    // Setters
    setSnackbar,
    setShowFilters,
    setFilters,
    setSearchTerm,
    setFormData,
    setPage,
    
    // Funciones
    fetchData,
    handleSubmit,
    handleDelete,
    handleOpenDialog,
    handleOpenViewDialog,
    handleCloseDialog,
    handleOpenAsignacionesDialog,
    handleCloseAsignacionesDialog,
    handleChangePage,
    handleChangeRowsPerPage,
    clearFilters
  };
}; 