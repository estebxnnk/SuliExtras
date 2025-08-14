import { useState, useEffect, useContext } from 'react';
import { gestionReportesService } from '../services/gestionReportesService';
import { SalarioMinimoContext } from '../../../../providers/SalarioMinimoProvider';
import { saveAs } from 'file-saver';

export const useGestionReportes = () => {
  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estados de UI
  const [openDialog, setOpenDialog] = useState(false);
  const [openRegistros, setOpenRegistros] = useState(false);
  const [openReporte, setOpenReporte] = useState(false);
  const [openSalario, setOpenSalario] = useState(false);
  
  // Estados de datos
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [loadingRegistros, setLoadingRegistros] = useState(false);
  const [reporteData, setReporteData] = useState({ 
    totalHorasDivididas: 0, 
    totalPagarDivididas: 0, 
    totalHorasBono: 0, 
    totalPagarBono: 0, 
    totalPagar: 0, 
    detalles: [] 
  });

  // Contexto
  const { salarioMinimo } = useContext(SalarioMinimoContext);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Resetear página cuando cambie la búsqueda
  useEffect(() => { 
    setPage(0); 
  }, [search]);

  // Función para cargar usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await gestionReportesService.fetchUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
    setLoading(false);
  };

  // Función para ver detalles de usuario
  const handleVerDetalles = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setOpenDialog(true);
  };

  // Función para ver registros de horas extra
  const handleVerRegistros = async (usuario) => {
    setLoadingRegistros(true);
    setUsuarioSeleccionado(usuario);
    setOpenRegistros(true);
    
    try {
      const data = await gestionReportesService.fetchRegistrosUsuario(usuario.id);
      setRegistros(data);
    } catch (error) {
      console.error('Error al cargar registros:', error);
      setRegistros([]);
    }
    setLoadingRegistros(false);
  };

  // Función para generar reporte
  const handleVerReporte = async (usuario) => {
    try {
      const registrosAprobados = await gestionReportesService.fetchRegistrosAprobados(usuario.id);
      const reporte = gestionReportesService.calcularReporte(registrosAprobados, salarioMinimo);
      
      setReporteData(reporte);
      setUsuarioSeleccionado(usuario);
      setOpenReporte(true);
    } catch (error) {
      console.error('Error al generar reporte:', error);
    }
  };

  // Función para descargar documento Word
  const handleDescargarWord = async () => {
    try {
      const blobWord = await gestionReportesService.generarDocumentoWord(
        reporteData, 
        usuarioSeleccionado
      );
      
      const nombreArchivo = `Reportes de hora extra de ${usuarioSeleccionado.persona?.nombres || ''} ${usuarioSeleccionado.persona?.apellidos || ''}.docx`;
      saveAs(blobWord, nombreArchivo);
    } catch (error) {
      console.error('Error al descargar Word:', error);
    }
  };

  // Función para descargar documento Excel
  const handleDescargarExcel = async () => {
    try {
      const buffer = await gestionReportesService.generarDocumentoExcel(reporteData);
      const nombreArchivo = `Reporte_horas_extra_${usuarioSeleccionado.persona?.nombres || ''}_${usuarioSeleccionado.persona?.apellidos || ''}.xlsx`;
      
      saveAs(
        new Blob([buffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        }), 
        nombreArchivo
      );
    } catch (error) {
      console.error('Error al descargar Excel:', error);
    }
  };

  // Funciones de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Funciones de cierre de diálogos
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUsuarioSeleccionado(null);
  };

  const handleCloseRegistros = () => {
    setOpenRegistros(false);
    setUsuarioSeleccionado(null);
    setRegistros([]);
  };

  const handleCloseReporte = () => {
    setOpenReporte(false);
    setUsuarioSeleccionado(null);
    setReporteData({ 
      totalHorasDivididas: 0, 
      totalPagarDivididas: 0, 
      totalHorasBono: 0, 
      totalPagarBono: 0, 
      totalPagar: 0, 
      detalles: [] 
    });
  };

  const handleCloseSalario = () => {
    setOpenSalario(false);
  };

  // Filtrado de usuarios
  const usuariosFiltrados = usuarios.filter(u => {
    const texto = search.toLowerCase();
    return (
      (u.persona?.nombres || '').toLowerCase().includes(texto) ||
      (u.persona?.apellidos || '').toLowerCase().includes(texto) ||
      (u.persona?.numeroDocumento || '').toString().includes(texto) ||
      (u.email || '').toLowerCase().includes(texto)
    );
  });

  // Paginación
  const usuariosPagina = usuariosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return {
    // Estados
    usuarios,
    loading,
    search,
    page,
    rowsPerPage,
    openDialog,
    openRegistros,
    openReporte,
    openSalario,
    usuarioSeleccionado,
    registros,
    loadingRegistros,
    reporteData,
    salarioMinimo,
    
    // Setters
    setSearch,
    
    // Funciones
    fetchUsuarios,
    handleVerDetalles,
    handleVerRegistros,
    handleVerReporte,
    handleDescargarWord,
    handleDescargarExcel,
    handleChangePage,
    handleChangeRowsPerPage,
    handleCloseDialog,
    handleCloseRegistros,
    handleCloseReporte,
    handleCloseSalario,
    
    // Datos procesados
    usuariosFiltrados,
    usuariosPagina
  };
};
