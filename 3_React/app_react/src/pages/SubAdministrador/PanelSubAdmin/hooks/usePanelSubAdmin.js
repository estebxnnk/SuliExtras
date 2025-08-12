import { useState, useEffect, useMemo } from 'react';
import { subAdminService } from '../services/subAdminService';

export const usePanelSubAdmin = () => {
  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  // Estados de filtros
  const [rolFiltro, setRolFiltro] = useState('');
  const [datePreset, setDatePreset] = useState('7d');
  
  // Estados de UI
  const [modalUsuario, setModalUsuario] = useState({ 
    open: false, 
    usuario: null, 
    registros: [] 
  });

  // Cargar datos iniciales
  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        subAdminService.fetchUsuarios().then(setUsuarios),
        subAdminService.fetchRoles().then(setRoles),
        subAdminService.fetchRegistros().then(setRegistros)
      ]);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  // Calcular rango de fechas según preset
  const getDateRangeFromPreset = (preset) => {
    const today = new Date();
    let from = null, to = null;
    
    if (preset === 'today') {
      from = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      to = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    } else if (preset === '7d') {
      from = new Date(today);
      from.setDate(today.getDate() - 6);
      from.setHours(0,0,0,0);
      to = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    } else if (preset === '1m') {
      from = new Date(today);
      from.setMonth(today.getMonth() - 1);
      from.setHours(0,0,0,0);
      to = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    } else {
      from = null;
      to = null;
    }
    
    return { from, to };
  };

  const dateRange = useMemo(() => getDateRangeFromPreset(datePreset), [datePreset]);

  // Filtros y KPIs
  const usuariosFiltrados = useMemo(() => {
    let filtrados = usuarios;
    
    if (rolFiltro) {
      filtrados = filtrados.filter(u => u.rol?.id === rolFiltro);
    }
    
    if (dateRange.from && dateRange.to) {
      filtrados = filtrados.filter(u => {
        const fecha = new Date(u.createdAt || u.fechaCreacion || u.persona?.fechaCreacion || u.fechaRegistro);
        return fecha >= dateRange.from && fecha <= dateRange.to;
      });
    }
    
    return filtrados;
  }, [usuarios, rolFiltro, dateRange]);

  // Usuarios por rol para gráfico
  const usuariosPorRol = useMemo(() => {
    const conteo = {};
    usuarios.forEach(u => {
      const nombreRol = u.rol?.nombre || 'Sin Rol';
      conteo[nombreRol] = (conteo[nombreRol] || 0) + 1;
    });
    
    return Object.entries(conteo).map(([rol, cantidad], i) => ({
      id: i,
      value: cantidad,
      label: rol,
      color: i === 0 ? '#1976d2' : i === 1 ? '#ffb300' : '#43a047',
    }));
  }, [usuarios]);

  // Métricas de usuarios por estado
  const usuariosActivos = useMemo(() => 
    usuarios.filter(u => u.estado === 'activo' || u.estado === 'ACTIVO').length, 
    [usuarios]
  );
  
  const usuariosInactivos = useMemo(() => 
    usuarios.filter(u => u.estado === 'inactivo' || u.estado === 'INACTIVO').length, 
    [usuarios]
  );
  
  const usuariosPendientes = useMemo(() => 
    usuarios.filter(u => u.estado === 'pendiente' || u.estado === 'PENDIENTE').length, 
    [usuarios]
  );

  // Métricas de registros por estado
  const registrosAprobados = useMemo(() => 
    registros.filter(r => r.estado === 'aprobado' || r.estado === 'APROBADO').length, 
    [registros]
  );
  
  const registrosPendientes = useMemo(() => 
    registros.filter(r => r.estado === 'pendiente' || r.estado === 'PENDIENTE').length, 
    [registros]
  );
  
  const registrosRechazados = useMemo(() => 
    registros.filter(r => r.estado === 'rechazado' || r.estado === 'RECHAZADO').length, 
    [registros]
  );

  // Handlers
  const handleFiltroRol = (e) => setRolFiltro(e.target.value);
  
  const handleOpenUsuario = async (usuarioId) => {
    try {
      const registrosUsuario = await subAdminService.fetchRegistrosUsuario(usuarioId);
      const usuario = usuarios.find(u => u.id === usuarioId);
      setModalUsuario({
        open: true,
        usuario,
        registros: registrosUsuario
      });
    } catch (error) {
      console.error('Error fetching user records:', error);
    }
  };

  const handleCloseUsuario = () => {
    setModalUsuario({ open: false, usuario: null, registros: [] });
  };

  const handleRefresh = () => {
    fetchData();
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    // Estados
    usuarios,
    roles,
    registros,
    loading,
    rolFiltro,
    datePreset,
    lastUpdate,
    modalUsuario,
    
    // Estados calculados
    usuariosFiltrados,
    usuariosPorRol,
    usuariosActivos,
    usuariosInactivos,
    usuariosPendientes,
    registrosAprobados,
    registrosPendientes,
    registrosRechazados,
    dateRange,
    
    // Setters
    setRolFiltro,
    setDatePreset,
    
    // Funciones
    fetchData,
    handleFiltroRol,
    handleOpenUsuario,
    handleCloseUsuario,
    handleRefresh
  };
}; 