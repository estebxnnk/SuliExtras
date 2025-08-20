import { useState, useEffect, useContext } from 'react';
import { gestionReportesService } from '../services/gestionReportesService';
import { SalarioMinimoContext } from '../../../../providers/SalarioMinimoProvider';

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
      const reporte = calcularReporte(registrosAprobados, salarioMinimo);
      
      setReporteData(reporte);
      setUsuarioSeleccionado(usuario);
      setOpenReporte(true);
    } catch (error) {
      console.error('Error al generar reporte:', error);
    }
  };

  // Función para calcular reporte
  const calcularReporte = (registros, salarioMinimo) => {
    const valorHoraOrdinaria = salarioMinimo / 240;
    let totalHorasDivididas = 0;
    let totalPagarDivididas = 0;
    let totalHorasBono = 0;
    let totalPagarBono = 0;
    let detalles = [];

    registros.forEach(registro => {
      if (registro.Horas && registro.Horas.length > 0) {
        registro.Horas.forEach(hora => {
          const cantidadDividida = registro.horas_extra_divididas ?? 0;
          const cantidadBono = registro.bono_salarial ?? 0;
          const recargo = hora.valor;
          const valorHoraExtra = valorHoraOrdinaria * recargo;
          const valorTotalDivididas = cantidadDividida * valorHoraExtra;
          const valorTotalBono = cantidadBono * valorHoraOrdinaria;

          totalHorasDivididas += cantidadDividida;
          totalPagarDivididas += valorTotalDivididas;
          totalHorasBono += cantidadBono;
          totalPagarBono += valorTotalBono;

          detalles.push({
            fecha: registro.fecha,
            tipo: hora.tipo,
            denominacion: hora.denominacion,
            cantidadDividida,
            valorTotalDivididas: valorTotalDivididas.toFixed(2),
            cantidadBono,
            valorTotalBono: valorTotalBono.toFixed(2),
            recargo,
            valorHoraExtra: valorHoraExtra.toFixed(2),
            registroOriginal: registro
          });
        });
      }
    });

    return {
      totalHorasDivididas,
      totalPagarDivididas,
      totalHorasBono,
      totalPagarBono,
      totalPagar: totalPagarDivididas + totalPagarBono,
      detalles
    };
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
