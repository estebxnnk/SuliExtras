import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react'; 
import { SalarioMinimoContext } from '../../../../providers/SalarioMinimoProvider';

export const useGestionReportes = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [openRegistros, setOpenRegistros] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [loadingRegistros, setLoadingRegistros] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [openReporte, setOpenReporte] = useState(false);
  const [reporteData, setReporteData] = useState({ 
    totalHorasDivididas: 0, 
    totalPagarDivididas: 0, 
    totalHorasBono: 0, 
    totalPagarBono: 0, 
    totalPagar: 0, 
    detalles: [] 
  });
  const [openSalario, setOpenSalario] = useState(false);
  
  const { salarioMinimo } = useContext(SalarioMinimoContext);
  const valorHoraOrdinaria = salarioMinimo / 240;

  // Filtro de búsqueda simple
  const usuariosFiltrados = useMemo(() => {
    if (!search.trim()) return usuarios;
    
    const texto = search.toLowerCase();
    return usuarios.filter(u => (
      (u.persona?.nombres || '').toLowerCase().includes(texto) ||
      (u.persona?.apellidos || '').toLowerCase().includes(texto) ||
      (u.persona?.numeroDocumento || '').toString().includes(texto) ||
      (u.email || '').toLowerCase().includes(texto)
    ));
  }, [usuarios, search]);

  // Paginación
  useEffect(() => { setPage(0); }, [search]);
  const usuariosPagina = usuariosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  return {
    // Estados
    usuarios,
    setUsuarios,
    openDialog,
    setOpenDialog,
    usuarioSeleccionado,
    setUsuarioSeleccionado,
    openRegistros,
    setOpenRegistros,
    registros,
    setRegistros,
    loadingRegistros,
    setLoadingRegistros,
    page,
    rowsPerPage,
    search,
    setSearch,
    openReporte,
    setOpenReporte,
    reporteData,
    setReporteData,
    openSalario,
    setOpenSalario,
    valorHoraOrdinaria,
    

    
    // Datos procesados
    usuariosFiltrados,
    usuariosPagina,
    
    // Funciones de paginación
    handleChangePage,
    handleChangeRowsPerPage
  };
};
