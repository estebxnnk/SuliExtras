import { useContext, useMemo, useState } from 'react';
import { SalarioMinimoContext } from '../../../../providers/SalarioMinimoProvider';

export const useGestionRegistrosEmpleado = () => {
  const [registros, setRegistros] = useState([]);
  const [tiposHora, setTiposHora] = useState([]);

  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const [openDetails, setOpenDetails] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, registro: null });

  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [editData, setEditData] = useState({});

  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const { salarioMinimo } = useContext(SalarioMinimoContext);
  const valorHoraOrdinaria = useMemo(() => (salarioMinimo ? salarioMinimo / 240 : 0), [salarioMinimo]);

  const registrosFiltrados = useMemo(() => {
    return registros.filter(r => {
      if (String(r.usuarioId) !== String(userId)) return false;
      const cumpleBusqueda = (
        (r.ubicacion && r.ubicacion.toLowerCase().includes(search.toLowerCase())) ||
        (r.numRegistro && String(r.numRegistro).toLowerCase().includes(search.toLowerCase())) ||
        (r.justificacionHoraExtra && r.justificacionHoraExtra.toLowerCase().includes(search.toLowerCase()))
      );
      const cumpleEstado = filtroEstado === 'todos' || r.estado === filtroEstado;
      const cumpleDesde = !fechaDesde || (r.fecha && new Date(r.fecha) >= new Date(fechaDesde));
      const cumpleHasta = !fechaHasta || (r.fecha && new Date(r.fecha) <= new Date(fechaHasta));
      return cumpleBusqueda && cumpleEstado && cumpleDesde && cumpleHasta;
    });
  }, [registros, userId, search, filtroEstado, fechaDesde, fechaHasta]);

  return {
    registros,
    setRegistros,
    tiposHora,
    setTiposHora,
    search,
    setSearch,
    filtroEstado,
    setFiltroEstado,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    registrosFiltrados,
    openDetails,
    setOpenDetails,
    openEdit,
    setOpenEdit,
    confirmDialog,
    setConfirmDialog,
    registroSeleccionado,
    setRegistroSeleccionado,
    editData,
    setEditData,
    lastUpdate,
    setLastUpdate,
    valorHoraOrdinaria
  };
};


