import { useState, useMemo } from 'react';

export const useGestionSedes = () => {
  // Estados principales
  const [sedes, setSedes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [sedeSeleccionada, setSedeSeleccionada] = useState(null);
  const [openHorarios, setOpenHorarios] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [openFormulario, setOpenFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filtros
  const [search, setSearch] = useState('');

  // Sedes paginadas
  const sedesConFiltros = useMemo(() => {
    return sedes.filter(sede => {
      const searchMatch = !search || 
        (sede.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
        (sede.ciudad || '').toLowerCase().includes(search.toLowerCase()) ||
        (sede.direccion || '').toLowerCase().includes(search.toLowerCase());
      return searchMatch;
    });
  }, [sedes, search]);

  const sedesPagina = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sedesConFiltros.slice(startIndex, startIndex + rowsPerPage);
  }, [sedesConFiltros, page, rowsPerPage]);

  // Handlers de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    // Estados
    sedes,
    setSedes,
    openDialog,
    setOpenDialog,
    sedeSeleccionada,
    setSedeSeleccionada,
    openHorarios,
    setOpenHorarios,
    horarios,
    setHorarios,
    loadingHorarios,
    setLoadingHorarios,
    openFormulario,
    setOpenFormulario,
    modoEdicion,
    setModoEdicion,

    // Paginación
    page,
    rowsPerPage,
    sedesPagina,
    handleChangePage,
    handleChangeRowsPerPage,

    // Filtros
    search,
    setSearch,

    // Datos computados
    sedesConFiltros
  };
};
