import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  IconButton,
  Tooltip,
  Collapse,
  useMediaQuery as useMuiMediaQuery
} from '@mui/material';
// Comentamos las importaciones de charts por problemas de compatibilidad
// import {
//   PieChart,
//   BarChart,
//   Pie,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell
// } from '@mui/x-charts';
// import { Bar } from '@mui/x-charts/BarChart';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import NavbarInventoryManager from './NavbarInventoryManager';

function EstadisticasDispositivos() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [dispositivos, setDispositivos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filtroSede, setFiltroSede] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  
  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados para tabla expandible
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dispositivosRes, categoriasRes, sedesRes] = await Promise.all([
        fetch('http://localhost:8080/api/dispositivos'),
        fetch('http://localhost:8080/api/categorias'),
        fetch('http://localhost:8080/api/sedes')
      ]);
      
      const dispositivosData = await dispositivosRes.json();
      const categoriasData = await categoriasRes.json();
      const sedesData = await sedesRes.json();
      
      setDispositivos(Array.isArray(dispositivosData) ? dispositivosData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      setSedes(Array.isArray(sedesData) ? sedesData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ open: true, message: 'Error al cargar los datos', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar dispositivos según los filtros aplicados
  const dispositivosFiltrados = dispositivos.filter(dispositivo => {
    const cumpleSede = !filtroSede || dispositivo.sede?.sedeId === parseInt(filtroSede);
    const cumpleCategoria = !filtroCategoria || dispositivo.categoria?.categoriaId === parseInt(filtroCategoria);
    return cumpleSede && cumpleCategoria;
  });

  // Cálculo de estadísticas generales
  const totalDispositivos = dispositivosFiltrados.length;
  const dispositivosDisponibles = dispositivosFiltrados.filter(d => d.estado === 'DISPONIBLE').length;
  const dispositivosAsignados = dispositivosFiltrados.filter(d => d.estado === 'ASIGNADO').length;
  const dispositivosMantenimiento = dispositivosFiltrados.filter(d => d.estado === 'MANTENIMIENTO').length;
  const dispositivosBaja = dispositivosFiltrados.filter(d => d.estado === 'BAJA').length;
  const dispositivosFuncionales = dispositivosFiltrados.filter(d => d.funcional).length;
  const dispositivosNoFuncionales = dispositivosFiltrados.filter(d => !d.funcional).length;
  
  const valorTotal = dispositivosFiltrados.reduce((sum, d) => sum + (d.costo || 0), 0);
  const valorPromedio = totalDispositivos > 0 ? valorTotal / totalDispositivos : 0;

  // Datos para gráficos
  const datosEstado = [
    { name: 'Disponible', value: dispositivosDisponibles, color: '#4caf50' },
    { name: 'Asignado', value: dispositivosAsignados, color: '#2196f3' },
    { name: 'Mantenimiento', value: dispositivosMantenimiento, color: '#ff9800' },
    { name: 'Baja', value: dispositivosBaja, color: '#f44336' }
  ];

  const datosFuncionalidad = [
    { name: 'Funcional', value: dispositivosFuncionales, color: '#4caf50' },
    { name: 'No Funcional', value: dispositivosNoFuncionales, color: '#f44336' }
  ];

  // Datos por categoría
  const datosPorCategoria = categorias.map(categoria => {
    const count = dispositivosFiltrados.filter(d => d.categoria?.categoriaId === categoria.categoriaId).length;
    return { name: categoria.nombre, value: count };
  }).filter(item => item.value > 0);

  // Datos por sede
  const datosPorSede = sedes.map(sede => {
    const count = dispositivosFiltrados.filter(d => d.sede?.sedeId === sede.sedeId).length;
    return { name: sede.nombre, value: count };
  }).filter(item => item.value > 0);

  // Dispositivos que requieren atención
  const dispositivosAtencion = dispositivosFiltrados.filter(d => 
    d.estado === 'MANTENIMIENTO' || !d.funcional || d.estado === 'BAJA'
  );

  // Paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejo de filas expandibles
  const handleToggleRow = (dispositivoId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(dispositivoId)) {
      newExpandedRows.delete(dispositivoId);
    } else {
      newExpandedRows.add(dispositivoId);
    }
    setExpandedRows(newExpandedRows);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'DISPONIBLE': return 'success';
      case 'ASIGNADO': return 'primary';
      case 'MANTENIMIENTO': return 'warning';
      case 'BAJA': return 'error';
      default: return 'default';
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case 'DISPONIBLE': return 'Disponible';
      case 'ASIGNADO': return 'Asignado';
      case 'MANTENIMIENTO': return 'Mantenimiento';
      case 'BAJA': return 'Baja';
      default: return estado;
    }
  };

  const MetricCard = ({ title, value, subtitle, icon, color }) => (
    <Card sx={{ 
      background: 'rgba(255,255,255,0.95)', 
      backdropFilter: 'blur(10px)',
      borderRadius: 3,
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      height: '100%'
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: 2, 
            backgroundColor: `${color}20`, 
            color: color,
            mr: 2 
          }}>
            {icon}
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight={700} color={color} sx={{ mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pt: 12, pb: 4 }}>
        <NavbarInventoryManager />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress color="primary" />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pt: 12, pb: 4 }}>
      <NavbarInventoryManager />
      
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant={isMobile ? "h4" : "h3"} fontWeight={700} color="white" sx={{ mb: 1 }}>
            Estadísticas de Dispositivos
          </Typography>
          <Typography variant={isMobile ? "body1" : "h6"} color="rgba(255,255,255,0.8)" sx={{ mb: 3 }}>
            Análisis completo del inventario tecnológico
          </Typography>
        </Box>

                 {/* Filtros */}
         <Card sx={{ 
           background: 'rgba(255,255,255,0.95)', 
           backdropFilter: 'blur(10px)',
           borderRadius: 3,
           boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
           mb: 3
         }}>
           <CardContent>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
               <Typography variant="h6" fontWeight={600}>
                 Filtros y Controles
               </Typography>
               <Box sx={{ display: 'flex', gap: 1 }}>
                 <Tooltip title="Mostrar/Ocultar Filtros">
                   <IconButton 
                     onClick={() => setShowFilters(!showFilters)}
                     color="primary"
                     size="small"
                   >
                     <FilterListIcon />
                   </IconButton>
                 </Tooltip>
                 <Tooltip title="Actualizar Datos">
                   <IconButton 
                     onClick={fetchData}
                     color="primary"
                     size="small"
                   >
                     <RefreshIcon />
                   </IconButton>
                 </Tooltip>
               </Box>
             </Box>
             
             <Collapse in={showFilters}>
               <Grid container spacing={2}>
                 <Grid item xs={12} md={6}>
                   <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                     <InputLabel>Sede</InputLabel>
                     <Select
                       value={filtroSede}
                       onChange={(e) => setFiltroSede(e.target.value)}
                     >
                       <MenuItem value="">Todas las sedes</MenuItem>
                       {sedes.map((sede) => (
                         <MenuItem key={sede.sedeId} value={sede.sedeId}>
                           {sede.nombre}
                         </MenuItem>
                       ))}
                     </Select>
                   </FormControl>
                 </Grid>
                 <Grid item xs={12} md={6}>
                   <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                     <InputLabel>Categoría</InputLabel>
                     <Select
                       value={filtroCategoria}
                       onChange={(e) => setFiltroCategoria(e.target.value)}
                     >
                       <MenuItem value="">Todas las categorías</MenuItem>
                       {categorias.map((categoria) => (
                         <MenuItem key={categoria.categoriaId} value={categoria.categoriaId}>
                           {categoria.nombre}
                         </MenuItem>
                       ))}
                     </Select>
                   </FormControl>
                 </Grid>
               </Grid>
             </Collapse>
           </CardContent>
         </Card>

        {/* Métricas principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Dispositivos"
              value={totalDispositivos}
              subtitle="En inventario"
              icon={<InventoryIcon />}
              color="#2196f3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Disponibles"
              value={dispositivosDisponibles}
              subtitle="Listos para asignar"
              icon={<CheckCircleIcon />}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="En Mantenimiento"
              value={dispositivosMantenimiento}
              subtitle="Requieren atención"
              icon={<WarningIcon />}
              color="#ff9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Valor Total"
              value={formatCurrency(valorTotal)}
              subtitle={`Promedio: ${formatCurrency(valorPromedio)}`}
              icon={<MoneyIcon />}
              color="#9c27b0"
            />
          </Grid>
        </Grid>

                 {/* Estadísticas Detalladas */}
         <Grid container spacing={3} sx={{ mb: 4 }}>
           {/* Distribución por Estado */}
           <Grid item xs={12} md={6}>
             <Card sx={{ 
               background: 'rgba(255,255,255,0.95)', 
               backdropFilter: 'blur(10px)',
               borderRadius: 3,
               boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
               height: '100%'
             }}>
               <CardContent>
                 <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                   Distribución por Estado
                 </Typography>
                 <Stack spacing={2}>
                   {datosEstado.map((item, index) => (
                     <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
                         <Box sx={{ 
                           width: 12, 
                           height: 12, 
                           borderRadius: '50%', 
                           backgroundColor: item.color, 
                           mr: 2 
                         }} />
                         <Typography variant="body2">{item.name}</Typography>
                       </Box>
                       <Chip label={item.value} size="small" color="primary" />
                     </Box>
                   ))}
                 </Stack>
               </CardContent>
             </Card>
           </Grid>

           {/* Estado Funcional */}
           <Grid item xs={12} md={6}>
             <Card sx={{ 
               background: 'rgba(255,255,255,0.95)', 
               backdropFilter: 'blur(10px)',
               borderRadius: 3,
               boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
               height: '100%'
             }}>
               <CardContent>
                 <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                   Estado Funcional
                 </Typography>
                 <Stack spacing={2}>
                   {datosFuncionalidad.map((item, index) => (
                     <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
                         <Box sx={{ 
                           width: 12, 
                           height: 12, 
                           borderRadius: '50%', 
                           backgroundColor: item.color, 
                           mr: 2 
                         }} />
                         <Typography variant="body2">{item.name}</Typography>
                       </Box>
                       <Chip label={item.value} size="small" color="primary" />
                     </Box>
                   ))}
                 </Stack>
               </CardContent>
             </Card>
           </Grid>

           {/* Dispositivos por Categoría */}
           <Grid item xs={12} md={6}>
             <Card sx={{ 
               background: 'rgba(255,255,255,0.95)', 
               backdropFilter: 'blur(10px)',
               borderRadius: 3,
               boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
               height: '100%'
             }}>
               <CardContent>
                 <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                   Dispositivos por Categoría
                 </Typography>
                 <Stack spacing={2}>
                   {datosPorCategoria.map((item, index) => (
                     <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                       <Typography variant="body2" sx={{ flex: 1 }}>{item.name}</Typography>
                       <Chip label={item.value} size="small" color="primary" />
                     </Box>
                   ))}
                 </Stack>
               </CardContent>
             </Card>
           </Grid>

           {/* Dispositivos por Sede */}
           <Grid item xs={12} md={6}>
             <Card sx={{ 
               background: 'rgba(255,255,255,0.95)', 
               backdropFilter: 'blur(10px)',
               borderRadius: 3,
               boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
               height: '100%'
             }}>
               <CardContent>
                 <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                   Dispositivos por Sede
                 </Typography>
                 <Stack spacing={2}>
                   {datosPorSede.map((item, index) => (
                     <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                       <Typography variant="body2" sx={{ flex: 1 }}>{item.name}</Typography>
                       <Chip label={item.value} size="small" color="primary" />
                     </Box>
                   ))}
                 </Stack>
               </CardContent>
             </Card>
           </Grid>
         </Grid>

                 {/* Dispositivos que requieren atención - Resumen */}
         {dispositivosAtencion.length > 0 && (
           <Card sx={{ 
             background: 'rgba(255,255,255,0.95)', 
             backdropFilter: 'blur(10px)',
             borderRadius: 3,
             boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
             mb: 3
           }}>
             <CardContent>
               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                 <ErrorIcon sx={{ color: '#f44336', mr: 1 }} />
                 <Typography variant="h6" fontWeight={600}>
                   Dispositivos que Requieren Atención ({dispositivosAtencion.length})
                 </Typography>
               </Box>
               <Grid container spacing={2}>
                 <Grid item xs={12} sm={6} md={3}>
                   <Chip 
                     label={`${dispositivosAtencion.filter(d => d.estado === 'MANTENIMIENTO').length} en Mantenimiento`}
                     color="warning"
                     variant="outlined"
                     icon={<WarningIcon />}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                   <Chip 
                     label={`${dispositivosAtencion.filter(d => !d.funcional).length} No Funcionales`}
                     color="error"
                     variant="outlined"
                     icon={<ErrorIcon />}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                   <Chip 
                     label={`${dispositivosAtencion.filter(d => d.estado === 'BAJA').length} de Baja`}
                     color="error"
                     variant="outlined"
                     icon={<ErrorIcon />}
                   />
                 </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                   <Chip 
                     label={`${formatCurrency(dispositivosAtencion.reduce((sum, d) => sum + (d.costo || 0), 0))} Valor Total`}
                     color="info"
                     variant="outlined"
                     icon={<MoneyIcon />}
                   />
                 </Grid>
               </Grid>
             </CardContent>
           </Card>
         )}

         {/* Tabla Completa de Dispositivos */}
         <Card sx={{ 
           background: 'rgba(255,255,255,0.95)', 
           backdropFilter: 'blur(10px)',
           borderRadius: 3,
           boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
           height: '100%',
           display: 'flex',
           flexDirection: 'column'
         }}>
           <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
             <Box sx={{ p: 3, pb: 2 }}>
               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                 <Typography variant="h6" fontWeight={600}>
                   Inventario Completo de Dispositivos
                 </Typography>
                 <Chip 
                   label={`${dispositivosFiltrados.length} dispositivos`} 
                   color="primary" 
                   size="small"
                 />
               </Box>
             </Box>
             
             <Box sx={{ flex: 1, overflow: 'hidden' }}>
               <TableContainer sx={{ height: '100%', maxHeight: 'calc(100vh - 400px)' }}>
                 <Table stickyHeader size={isMobile ? "small" : "medium"}>
                   <TableHead>
                     <TableRow>
                       <TableCell sx={{ minWidth: 50, width: 50 }}>
                         <Tooltip title="Expandir/Colapsar">
                           <span>Detalles</span>
                         </Tooltip>
                       </TableCell>
                       <TableCell sx={{ minWidth: 120 }}><strong>Item</strong></TableCell>
                       <TableCell sx={{ minWidth: 100 }}><strong>Código Activo</strong></TableCell>
                       <TableCell sx={{ minWidth: 120 }}><strong>Serial</strong></TableCell>
                       <TableCell sx={{ minWidth: 100 }}><strong>Modelo</strong></TableCell>
                       <TableCell sx={{ minWidth: 80 }}><strong>Marca</strong></TableCell>
                       <TableCell sx={{ minWidth: 80 }}><strong>Tipo</strong></TableCell>
                       <TableCell sx={{ minWidth: 100 }}><strong>Categoría</strong></TableCell>
                       <TableCell sx={{ minWidth: 100 }}><strong>Sede</strong></TableCell>
                       <TableCell sx={{ minWidth: 100 }}><strong>Estado</strong></TableCell>
                       <TableCell sx={{ minWidth: 100 }}><strong>Clasificación</strong></TableCell>
                       <TableCell sx={{ minWidth: 80 }}><strong>Funcional</strong></TableCell>
                       <TableCell sx={{ minWidth: 100 }}><strong>Costo</strong></TableCell>
                       <TableCell sx={{ minWidth: 120 }}><strong>Fecha Adquisición</strong></TableCell>
                       <TableCell sx={{ minWidth: 150 }}><strong>Observaciones</strong></TableCell>
                     </TableRow>
                   </TableHead>
                   <TableBody>
                     {dispositivosFiltrados
                       .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                       .map((dispositivo) => (
                       <React.Fragment key={dispositivo.dispositivoId}>
                         <TableRow hover>
                           <TableCell>
                             <IconButton
                               size="small"
                               onClick={() => handleToggleRow(dispositivo.dispositivoId)}
                             >
                               {expandedRows.has(dispositivo.dispositivoId) ? 
                                 <ExpandLessIcon /> : <ExpandMoreIcon />
                               }
                             </IconButton>
                           </TableCell>
                           <TableCell>
                             <Typography variant="body2" fontWeight={600}>
                               {dispositivo.item || '-'}
                             </Typography>
                           </TableCell>
                           <TableCell>
                             <Typography variant="body2" color="text.secondary">
                               {dispositivo.codigoActivo || '-'}
                             </Typography>
                           </TableCell>
                           <TableCell>
                             <Typography variant="body2" color="text.secondary">
                               {dispositivo.serial || '-'}
                             </Typography>
                           </TableCell>
                           <TableCell>
                             <Typography variant="body2">
                               {dispositivo.modelo || '-'}
                             </Typography>
                           </TableCell>
                           <TableCell>
                             <Typography variant="body2">
                               {dispositivo.marca || '-'}
                             </Typography>
                           </TableCell>
                           <TableCell>
                             <Typography variant="body2">
                               {dispositivo.tipo || '-'}
                             </Typography>
                           </TableCell>
                           <TableCell>
                             <Chip 
                               label={dispositivo.categoria?.nombre || 'Sin categoría'} 
                               size="small"
                               color="default"
                             />
                           </TableCell>
                           <TableCell>
                             <Chip 
                               label={dispositivo.sede?.nombre || 'Sin sede'} 
                               size="small"
                               color="default"
                             />
                           </TableCell>
                           <TableCell>
                             <Chip 
                               label={getEstadoLabel(dispositivo.estado)} 
                               color={getEstadoColor(dispositivo.estado)}
                               size="small"
                             />
                           </TableCell>
                           <TableCell>
                             <Typography variant="body2">
                               {dispositivo.clasificacion || '-'}
                             </Typography>
                           </TableCell>
                           <TableCell>
                             <Chip 
                               label={dispositivo.funcional ? 'Sí' : 'No'} 
                               color={dispositivo.funcional ? 'success' : 'error'}
                               size="small"
                             />
                           </TableCell>
                           <TableCell>
                             <Typography variant="body2" fontWeight={600}>
                               {formatCurrency(dispositivo.costo)}
                             </Typography>
                           </TableCell>
                           <TableCell>
                             <Typography variant="body2">
                               {formatDate(dispositivo.fechaAdquisicion)}
                             </Typography>
                           </TableCell>
                           <TableCell>
                             <Tooltip title={dispositivo.observaciones || 'Sin observaciones'}>
                               <Typography 
                                 variant="body2" 
                                 sx={{ 
                                   maxWidth: 150, 
                                   overflow: 'hidden', 
                                   textOverflow: 'ellipsis', 
                                   whiteSpace: 'nowrap' 
                                 }}
                               >
                                 {dispositivo.observaciones || '-'}
                               </Typography>
                             </Tooltip>
                           </TableCell>
                         </TableRow>
                         
                         {/* Fila expandible con detalles adicionales */}
                         <TableRow>
                           <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={15}>
                             <Collapse in={expandedRows.has(dispositivo.dispositivoId)} timeout="auto" unmountOnExit>
                               <Box sx={{ margin: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                                 <Grid container spacing={2}>
                                   <Grid item xs={12} md={6}>
                                     <Typography variant="subtitle2" color="primary" gutterBottom>
                                       Información Detallada
                                     </Typography>
                                     <Stack spacing={1}>
                                       <Box>
                                         <Typography variant="caption" color="text.secondary">ID del Dispositivo:</Typography>
                                         <Typography variant="body2">{dispositivo.dispositivoId}</Typography>
                                       </Box>
                                       <Box>
                                         <Typography variant="caption" color="text.secondary">Tipo de Dispositivo:</Typography>
                                         <Typography variant="body2">{dispositivo.tipo || 'No especificado'}</Typography>
                                       </Box>
                                       <Box>
                                         <Typography variant="caption" color="text.secondary">Clasificación:</Typography>
                                         <Typography variant="body2">{dispositivo.clasificacion || 'No especificada'}</Typography>
                                       </Box>
                                     </Stack>
                                   </Grid>
                                   <Grid item xs={12} md={6}>
                                     <Typography variant="subtitle2" color="primary" gutterBottom>
                                       Información Financiera
                                     </Typography>
                                     <Stack spacing={1}>
                                       <Box>
                                         <Typography variant="caption" color="text.secondary">Costo:</Typography>
                                         <Typography variant="body2" fontWeight={600}>
                                           {formatCurrency(dispositivo.costo)}
                                         </Typography>
                                       </Box>
                                       <Box>
                                         <Typography variant="caption" color="text.secondary">Fecha de Adquisición:</Typography>
                                         <Typography variant="body2">{formatDate(dispositivo.fechaAdquisicion)}</Typography>
                                       </Box>
                                     </Stack>
                                   </Grid>
                                   {dispositivo.observaciones && (
                                     <Grid item xs={12}>
                                       <Typography variant="subtitle2" color="primary" gutterBottom>
                                         Observaciones
                                       </Typography>
                                       <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                         {dispositivo.observaciones}
                                       </Typography>
                                     </Grid>
                                   )}
                                 </Grid>
                               </Box>
                             </Collapse>
                           </TableCell>
                         </TableRow>
                       </React.Fragment>
                     ))}
                   </TableBody>
                 </Table>
               </TableContainer>
             </Box>
             
             {/* Paginación */}
             <TablePagination
               component="div"
               count={dispositivosFiltrados.length}
               page={page}
               onPageChange={handleChangePage}
               rowsPerPage={rowsPerPage}
               onRowsPerPageChange={handleChangeRowsPerPage}
               rowsPerPageOptions={[5, 10, 25, 50]}
               labelRowsPerPage="Filas por página:"
               labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
               sx={{ 
                 borderTop: '1px solid rgba(0,0,0,0.12)',
                 backgroundColor: 'rgba(0,0,0,0.02)'
               }}
             />
           </CardContent>
         </Card>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default EstadisticasDispositivos; 