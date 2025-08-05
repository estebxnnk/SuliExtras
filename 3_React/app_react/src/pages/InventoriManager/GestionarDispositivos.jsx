import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Alert,
  Snackbar,
  Fab,
  Tooltip,
  InputAdornment,
  Stack,
  Divider,
  Collapse,
  Switch,
  FormControlLabel,
  CircularProgress,
  TablePagination,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';

// Icons
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  LocalShipping as ProviderIcon,
  Article as InvoiceIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Computer as ComputerIcon,
  Phone as PhoneIcon,
  Print as PrintIcon,
  Router as RouterIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Build as BuildIcon
} from '@mui/icons-material';

// Simulación de componente Navbar
const NavbarInventoryManager = () => (
  <Box sx={{ height: 64, bgcolor: 'primary.main', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }} />
);

// Simulación de DatePicker
const DatePicker = ({ value, onChange, label, renderInput }) => {
  const handleChange = (e) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onChange(date);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return renderInput({
    type: 'date',
    value: formatDate(value),
    onChange: handleChange,
    label
  });
};

const LocalizationProvider = ({ children }) => children;

// Configuración de la API
const API_BASE_URL = 'http://localhost:8080/api';

function GestionarDispositivos() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
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
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [expandedDispositivo, setExpandedDispositivo] = useState(null);
  
  // Estados de paginación y filtros
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    estado: '',
    sede: '',
    funcional: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Form state mejorado
  const [formData, setFormData] = useState({
    // Información General
    nombreDispositivo: '',
    codigoActivo: '', 
    serial: '',
    modelo: '',
    marca: '',
    tipo: '',
    
    // Clasificación y Estado
    estado: 'DISPONIBLE',
    clasificacion: '',
    funcional: true,
    
    // Asignación y Ubicación
    sedeId: '',
    ubicacionDetallada: '',
    empleadoAsignadoId: '',
    
    // Información Financiera
    costo: '',
    fechaAdquisicion: null,
    proveedor: '',
    numeroFactura: '',
    fechaFinGarantia: null,
    
    // Información Técnica Adicional
    sistemaOperativo: '',
    procesador: '',
    memoria: '',
    almacenamiento: '',
    direccionIP: '',
    direccionMAC: '',
    
    // Adicional
    observaciones: ''
  });

  const estados = [
    { value: 'DISPONIBLE', label: 'Disponible', color: 'success', icon: <CheckCircleIcon /> },
    { value: 'ASIGNADO', label: 'Asignado', color: 'primary', icon: <AssignmentIcon /> },
    { value: 'MANTENIMIENTO', label: 'Mantenimiento', color: 'warning', icon: <BuildIcon /> },
    { value: 'BAJA', label: 'Baja', color: 'error', icon: <CancelIcon /> }
  ];

  // Funciones de API
  const fetchDispositivos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dispositivos`);
      if (!response.ok) {
        throw new Error('Error al cargar dispositivos');
      }
      const data = await response.json();
      setDispositivos(data);
    } catch (error) {
      console.error('Error fetching dispositivos:', error);
      setSnackbar({ open: true, message: 'Error al cargar los dispositivos', severity: 'error' });
    }
  };



  const fetchSedes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sedes`);
      if (!response.ok) {
        throw new Error('Error al cargar sedes');
      }
      const data = await response.json();
      setSedes(data);
    } catch (error) {
      console.error('Error fetching sedes:', error);
      setSnackbar({ open: true, message: 'Error al cargar las sedes', severity: 'error' });
    }
  };

  const fetchEmpleados = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/empleados`);
      if (!response.ok) {
        throw new Error('Error al cargar empleados');
      }
      const data = await response.json();
      setEmpleados(data);
    } catch (error) {
      console.error('Error fetching empleados:', error);
      setSnackbar({ open: true, message: 'Error al cargar los empleados', severity: 'error' });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDispositivos(),
        fetchSedes(),
        fetchEmpleados()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ open: true, message: 'Error al cargar los datos', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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

      const url = editingDispositivo 
        ? `${API_BASE_URL}/dispositivos/${editingDispositivo.dispositivoId}`
        : `${API_BASE_URL}/dispositivos`;
      
      const method = editingDispositivo ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dispositivoData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar el dispositivo');
      }

      setSnackbar({ 
        open: true, 
        message: editingDispositivo ? 'Dispositivo actualizado exitosamente' : 'Dispositivo creado exitosamente', 
        severity: 'success' 
      });
      handleCloseDialog();
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: 'Error al guardar el dispositivo', severity: 'error' });
    }
    setSubmitting(false);
  };

  const handleDelete = async (dispositivoId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este dispositivo?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/dispositivos/${dispositivoId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el dispositivo');
        }

        setSnackbar({ open: true, message: 'Dispositivo eliminado exitosamente', severity: 'success' });
        fetchData();
      } catch (error) {
        console.error('Error:', error);
        setSnackbar({ open: true, message: 'Error al eliminar el dispositivo', severity: 'error' });
      }
    }
  };

  // Filtrado y paginación mejorados
  const filteredDispositivos = dispositivos.filter(dispositivo => {
    const matchesSearch = (
      (dispositivo.item && dispositivo.item.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dispositivo.serial && dispositivo.serial.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dispositivo.modelo && dispositivo.modelo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dispositivo.marca && dispositivo.marca.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dispositivo.codigoActivo && dispositivo.codigoActivo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const matchesFilters = (
      (!filters.estado || dispositivo.estado === filters.estado) &&
      (!filters.sede || dispositivo.sede?.sedeId?.toString() === filters.sede) &&
      (!filters.funcional || dispositivo.funcional?.toString() === filters.funcional)
    );

    return matchesSearch && matchesFilters;
  });

  const paginatedDispositivos = filteredDispositivos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getEstadoInfo = (estado) => {
    return estados.find(e => e.value === estado) || estados[0];
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const getDispositivoIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'laptop':
      case 'computador':
        return <ComputerIcon />;
      case 'impresora':
        return <PrintIcon />;
      case 'teléfono':
      case 'telefono':
        return <PhoneIcon />;
      case 'router':
        return <RouterIcon />;
      case 'servidor':
        return <StorageIcon />;
      default:
        return <MemoryIcon />;
    }
  };

  const clearFilters = () => {
    setFilters({
      estado: '',
      sede: '',
      funcional: ''
    });
    setSearchTerm('');
    setPage(0);
  };

  const handleToggleExpand = (dispositivoId) => {
    setExpandedDispositivo(expandedDispositivo === dispositivoId ? null : dispositivoId);
  };

  // Componente de tarjeta móvil mejorado
  const MobileDispositivoCard = ({ dispositivo }) => {
    const isExpanded = expandedDispositivo === dispositivo.dispositivoId;
    const estadoInfo = getEstadoInfo(dispositivo.estado);
    
    return (
      <Card sx={{ 
        mb: 2, 
        background: 'rgba(255,255,255,0.98)', 
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid rgba(255,255,255,0.2)',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}>
        <CardContent sx={{ p: 0 }}>
          {/* Header de la tarjeta */}
          <Box sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            color: 'white',
            p: 2,
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                width: 48,
                height: 48
              }}>
                {getDispositivoIcon(dispositivo.tipo)}
              </Avatar>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" fontWeight={700} sx={{ 
                  color: 'white',
                  mb: 0.5,
                  wordBreak: 'break-word'
                }}>
                  {dispositivo.item}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {dispositivo.marca} {dispositivo.modelo}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Serial: {dispositivo.serial || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                <Badge 
                  color={dispositivo.funcional ? 'success' : 'error'}
                  variant="dot"
                  sx={{ '& .MuiBadge-badge': { right: 6, top: 6 } }}
                >
                  <Chip 
                    label={estadoInfo.label}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.9)',
                      color: theme.palette[estadoInfo.color].main,
                      fontWeight: 600
                    }}
                  />
                </Badge>
                
                <IconButton 
                  size="small" 
                  onClick={() => handleToggleExpand(dispositivo.dispositivoId)}
                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Información básica siempre visible */}
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Ubicación</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {dispositivo.sede?.nombre || 'No asignada'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Asignado a</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {dispositivo.empleadoAsignado?.nombreCompleto || 'No asignado'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Información expandible */}
          <Collapse in={isExpanded}>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Información Técnica
                  </Typography>
                </Grid>
                
                {dispositivo.codigoActivo && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Código Activo</Typography>
                    <Typography variant="body2">{dispositivo.codigoActivo}</Typography>
                  </Grid>
                )}
                
                {dispositivo.tipo && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Tipo</Typography>
                    <Typography variant="body2">{dispositivo.tipo}</Typography>
                  </Grid>
                )}
                

                
                {dispositivo.clasificacion && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Clasificación</Typography>
                    <Typography variant="body2">{dispositivo.clasificacion}</Typography>
                  </Grid>
                )}

                {(dispositivo.sistemaOperativo || dispositivo.procesador || dispositivo.memoria) && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 1 }}>
                        Especificaciones
                      </Typography>
                    </Grid>
                    
                    {dispositivo.sistemaOperativo && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Sistema Operativo</Typography>
                        <Typography variant="body2">{dispositivo.sistemaOperativo}</Typography>
                      </Grid>
                    )}
                    
                    {dispositivo.procesador && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Procesador</Typography>
                        <Typography variant="body2">{dispositivo.procesador}</Typography>
                      </Grid>
                    )}
                    
                    {dispositivo.memoria && (
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Memoria</Typography>
                        <Typography variant="body2">{dispositivo.memoria}</Typography>
                      </Grid>
                    )}
                    
                    {dispositivo.almacenamiento && (
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Almacenamiento</Typography>
                        <Typography variant="body2">{dispositivo.almacenamiento}</Typography>
                      </Grid>
                    )}
                  </>
                )}

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 1 }}>
                    Información de Compra
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Costo</Typography>
                  <Typography variant="body2" fontWeight={600} color="success.main">
                    {formatCurrency(dispositivo.costo)}
                  </Typography>
                </Grid>
                
                {dispositivo.proveedor && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Proveedor</Typography>
                    <Typography variant="body2">{dispositivo.proveedor}</Typography>
                  </Grid>
                )}
                
                {dispositivo.fechaAdquisicion && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Fecha Adquisición</Typography>
                    <Typography variant="body2">
                      {new Date(dispositivo.fechaAdquisicion).toLocaleDateString('es-CO')}
                    </Typography>
                  </Grid>
                )}
                
                {dispositivo.fechaFinGarantia && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Fin Garantía</Typography>
                    <Typography variant="body2">
                      {new Date(dispositivo.fechaFinGarantia).toLocaleDateString('es-CO')}
                    </Typography>
                  </Grid>
                )}

                {dispositivo.observaciones && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Observaciones</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                      {dispositivo.observaciones}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
            
            <Divider />
            <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => handleOpenViewDialog(dispositivo)}
              >
                Ver Detalle
              </Button>
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => handleOpenDialog(dispositivo)}
                color="primary"
              >
                Editar
              </Button>
              <Button
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(dispositivo.dispositivoId)}
                color="error"
              >
                Eliminar
              </Button>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  // Componente de vista detallada
  const ViewDialog = () => {
    if (!viewingDispositivo) return null;
    
    const estadoInfo = getEstadoInfo(viewingDispositivo.estado);
    
    return (
      <Dialog 
        open={openViewDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
            {getDispositivoIcon(viewingDispositivo.tipo)}
          </Avatar>
          <Box>
            <Typography variant="h6">{viewingDispositivo.item}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {viewingDispositivo.marca} {viewingDispositivo.modelo}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Estado y estado funcional */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Chip 
                  icon={estadoInfo.icon}
                  label={estadoInfo.label}
                  color={estadoInfo.color}
                  variant="filled"
                  size="medium"
                />
                <Chip 
                  icon={viewingDispositivo.funcional ? <CheckCircleIcon /> : <WarningIcon />}
                  label={viewingDispositivo.funcional ? 'Funcional' : 'No Funcional'}
                  color={viewingDispositivo.funcional ? 'success' : 'error'}
                  variant="filled"
                  size="medium"
                />
              </Stack>
            </Grid>

            {/* Información General */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Información General
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">Código de Activo</Typography>
                <Typography variant="body1">{viewingDispositivo.codigoActivo || 'N/A'}</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">Serial</Typography>
                <Typography variant="body1">{viewingDispositivo.serial || 'N/A'}</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">Tipo</Typography>
                <Typography variant="body1">{viewingDispositivo.tipo || 'N/A'}</Typography>
              </Box>
            </Grid>
            

            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">Clasificación</Typography>
                <Typography variant="body1">{viewingDispositivo.clasificacion || 'N/A'}</Typography>
              </Box>
            </Grid>

            {/* Especificaciones Técnicas */}
            {(viewingDispositivo.sistemaOperativo || viewingDispositivo.procesador || viewingDispositivo.memoria || viewingDispositivo.almacenamiento) && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                    Especificaciones Técnicas
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                {viewingDispositivo.sistemaOperativo && (
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Sistema Operativo</Typography>
                      <Typography variant="body1">{viewingDispositivo.sistemaOperativo}</Typography>
                    </Box>
                  </Grid>
                )}
                
                {viewingDispositivo.procesador && (
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Procesador</Typography>
                      <Typography variant="body1">{viewingDispositivo.procesador}</Typography>
                    </Box>
                  </Grid>
                )}
                
                {viewingDispositivo.memoria && (
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Memoria RAM</Typography>
                      <Typography variant="body1">{viewingDispositivo.memoria}</Typography>
                    </Box>
                  </Grid>
                )}
                
                {viewingDispositivo.almacenamiento && (
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Almacenamiento</Typography>
                      <Typography variant="body1">{viewingDispositivo.almacenamiento}</Typography>
                    </Box>
                  </Grid>
                )}
                
                {viewingDispositivo.direccionIP && (
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Dirección IP</Typography>
                      <Typography variant="body1">{viewingDispositivo.direccionIP}</Typography>
                    </Box>
                  </Grid>
                )}
                
                {viewingDispositivo.direccionMAC && (
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Dirección MAC</Typography>
                      <Typography variant="body1">{viewingDispositivo.direccionMAC}</Typography>
                    </Box>
                  </Grid>
                )}
              </>
            )}

            {/* Ubicación y Asignación */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Ubicación y Asignación
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">Sede</Typography>
                <Typography variant="body1">{viewingDispositivo.sede?.nombre || 'No asignada'}</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">Ubicación Detallada</Typography>
                <Typography variant="body1">{viewingDispositivo.ubicacionDetallada || 'No especificada'}</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box>
                <Typography variant="caption" color="text.secondary">Empleado Asignado</Typography>
                <Typography variant="body1">
                  {viewingDispositivo.empleadoAsignado ? 
                    `${viewingDispositivo.empleadoAsignado.nombreCompleto} (${viewingDispositivo.empleadoAsignado.cedula})` : 
                    'No asignado'
                  }
                </Typography>
              </Box>
            </Grid>

            {/* Información Financiera */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Información Financiera
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">Costo</Typography>
                <Typography variant="h6" color="success.main" fontWeight={600}>
                  {formatCurrency(viewingDispositivo.costo)}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">Proveedor</Typography>
                <Typography variant="body1">{viewingDispositivo.proveedor || 'N/A'}</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">Número de Factura</Typography>
                <Typography variant="body1">{viewingDispositivo.numeroFactura || 'N/A'}</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">Fecha de Adquisición</Typography>
                <Typography variant="body1">
                  {viewingDispositivo.fechaAdquisicion ? 
                    new Date(viewingDispositivo.fechaAdquisicion).toLocaleDateString('es-CO') : 
                    'N/A'
                  }
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">Fin de Garantía</Typography>
                <Typography variant="body1">
                  {viewingDispositivo.fechaFinGarantia ? 
                    new Date(viewingDispositivo.fechaFinGarantia).toLocaleDateString('es-CO') : 
                    'N/A'
                  }
                </Typography>
              </Box>
            </Grid>

            {/* Observaciones */}
            {viewingDispositivo.observaciones && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                    Observaciones
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      {viewingDispositivo.observaciones}
                    </Typography>
                  </Paper>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>
            Cerrar
          </Button>
          <Button onClick={() => {
            handleCloseDialog();
            handleOpenDialog(viewingDispositivo);
          }} variant="contained" startIcon={<EditIcon />}>
            Editar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pt: 12, pb: 4 }}>
      <NavbarInventoryManager />
      
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 } }}>
        {/* Header mejorado */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant={isMobile ? "h4" : "h3"} fontWeight={700} color="white" sx={{ mb: 1 }}>
            Gestión de Dispositivos
          </Typography>
          <Typography variant={isMobile ? "body1" : "h6"} color="rgba(255,255,255,0.8)" sx={{ mb: 1 }}>
            Administra el inventario de dispositivos tecnológicos
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.6)">
            {filteredDispositivos.length} dispositivos encontrados
          </Typography>
        </Box>

        {/* Barra de búsqueda y filtros mejorada */}
        <Card sx={{ 
          background: 'rgba(255,255,255,0.98)', 
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          mb: 3,
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Buscar por nombre, serial, modelo, marca o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size={isMobile ? "small" : "medium"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                    size={isMobile ? "small" : "medium"}
                    color={showFilters ? 'primary' : 'inherit'}
                    sx={{ borderRadius: 3 }}
                  >
                    Filtros
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchData}
                    size={isMobile ? "small" : "medium"}
                    disabled={loading}
                    sx={{ borderRadius: 3 }}
                  >
                    {loading ? 'Cargando...' : 'Actualizar'}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    size={isMobile ? "small" : "medium"}
                    sx={{ 
                      background: 'linear-gradient(135deg, #0d47a1, #1976d2)',
                      borderRadius: 3,
                      boxShadow: '0 4px 16px rgba(13, 71, 161, 0.3)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                        boxShadow: '0 6px 20px rgba(13, 71, 161, 0.4)'
                      }
                    }}
                  >
                    Nuevo Dispositivo
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            {/* Panel de filtros colapsible */}
            <Collapse in={showFilters}>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={filters.estado}
                      onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                      label="Estado"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {estados.map((estado) => (
                        <MenuItem key={estado.value} value={estado.value}>
                          {estado.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sede</InputLabel>
                    <Select
                      value={filters.sede}
                      onChange={(e) => setFilters({ ...filters, sede: e.target.value })}
                      label="Sede"
                    >
                      <MenuItem value="">Todas</MenuItem>
                      {sedes.map((sede) => (
                        <MenuItem key={sede.sedeId || 'default'} value={sede.sedeId?.toString() || ''}>
                          {sede.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Funcional</InputLabel>
                    <Select
                      value={filters.funcional}
                      onChange={(e) => setFilters({ ...filters, funcional: e.target.value })}
                      label="Funcional"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="true">Funcional</MenuItem>
                      <MenuItem value="false">No Funcional</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      size="small"
                      startIcon={<ClearIcon />}
                      onClick={clearFilters}
                      color="secondary"
                    >
                      Limpiar Filtros
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Collapse>
          </CardContent>
        </Card>

        {/* Contenido principal */}
        {loading ? (
          <Box>
            {[...Array(3)].map((_, index) => (
              <Card key={index} sx={{ 
                mb: 2, 
                background: 'rgba(255,255,255,0.95)', 
                borderRadius: 4
              }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Skeleton variant="rectangular" height={60} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="60%" />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : isMobile ? (
          <Box>
            {paginatedDispositivos.map((dispositivo) => (
              <MobileDispositivoCard key={dispositivo.dispositivoId} dispositivo={dispositivo} />
            ))}
            
            {filteredDispositivos.length === 0 && (
              <Card sx={{ 
                background: 'rgba(255,255,255,0.98)', 
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
              }}>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <MemoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No se encontraron dispositivos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Intenta ajustar los filtros de búsqueda
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Paginación móvil */}
            {filteredDispositivos.length > 0 && (
              <Card sx={{ 
                mt: 2,
                background: 'rgba(255,255,255,0.98)', 
                borderRadius: 4
              }}>
                <TablePagination
                  component="div"
                  count={filteredDispositivos.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage="Filas por página:"
                  labelDisplayedRows={({ from, to, count }) => 
                    `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
                  }
                />
              </Card>
            )}
          </Box>
        ) : (
          <Card sx={{ 
            background: 'rgba(255,255,255,0.98)', 
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                        Dispositivo
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                        Identificación
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                        Especificaciones
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                        Estado
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                        Asignación
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                        Costo
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
                        Acciones
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedDispositivos.map((dispositivo, index) => {
                      const estadoInfo = getEstadoInfo(dispositivo.estado);
                      return (
                        <TableRow 
                          key={dispositivo.dispositivoId}
                          sx={{ 
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                            bgcolor: index % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent'
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ 
                                bgcolor: theme.palette.primary.light,
                                color: 'white',
                                width: 40,
                                height: 40
                              }}>
                                {getDispositivoIcon(dispositivo.tipo)}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {dispositivo.item}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {dispositivo.marca} {dispositivo.modelo}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {dispositivo.codigoActivo || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Serial: {dispositivo.serial || 'N/A'}
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {dispositivo.tipo || 'N/A'}
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Stack spacing={1}>
                              <Chip 
                                icon={estadoInfo.icon}
                                label={estadoInfo.label}
                                color={estadoInfo.color}
                                size="small"
                                variant="filled"
                              />
                              <Chip 
                                label={dispositivo.funcional ? 'Funcional' : 'No Funcional'}
                                color={dispositivo.funcional ? 'success' : 'error'}
                                size="small"
                                variant="outlined"
                              />
                            </Stack>
                          </TableCell>
                          
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {dispositivo.empleadoAsignado?.nombreCompleto || 'No asignado'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {dispositivo.sede?.nombre || 'Sin sede'}
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2" fontWeight={600} color="success.main">
                              {formatCurrency(dispositivo.costo)}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Stack direction="row" spacing={0.5} justifyContent="center">
                              <Tooltip title="Ver detalles" arrow>
                                <IconButton 
                                  size="small" 
                                  color="info" 
                                  onClick={() => handleOpenViewDialog(dispositivo)}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar" arrow>
                                <IconButton 
                                  size="small" 
                                  color="primary" 
                                  onClick={() => handleOpenDialog(dispositivo)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar" arrow>
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={() => handleDelete(dispositivo.dispositivoId)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {filteredDispositivos.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <MemoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No se encontraron dispositivos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Intenta ajustar los filtros de búsqueda
                  </Typography>
                </Box>
              )}
              
              {filteredDispositivos.length > 0 && (
                <TablePagination
                  component="div"
                  count={filteredDispositivos.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="Filas por página:"
                  labelDisplayedRows={({ from, to, count }) => 
                    `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
                  }
                  sx={{
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                    bgcolor: 'rgba(0,0,0,0.02)'
                  }}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Dialog para agregar/editar */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="lg" 
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 4,
              backgroundImage: 'none'
            }
          }}
        >
          <DialogTitle sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              {editingDispositivo ? <EditIcon /> : <AddIcon />}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {editingDispositivo ? 'Editar Dispositivo' : 'Nuevo Dispositivo'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {editingDispositivo ? 'Modifica la información del dispositivo' : 'Completa la información del nuevo dispositivo'}
              </Typography>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
            <LocalizationProvider>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* Sección: Información General */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ComputerIcon />
                    Información General
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre del Dispositivo *"
                    value={formData.nombreDispositivo}
                    onChange={(e) => setFormData({ ...formData, nombreDispositivo: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    required
                    error={!formData.nombreDispositivo}
                    helperText={!formData.nombreDispositivo ? "Campo requerido" : ""}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Código de Activo"
                    value={formData.codigoActivo}
                    onChange={(e) => setFormData({ ...formData, codigoActivo: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Serial"
                    value={formData.serial}
                    onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Marca"
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Modelo"
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    helperText="Ej: Laptop, Desktop, Monitor, Impresora"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Sección: Clasificación y Estado */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon />
                    Clasificación y Estado
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                    <InputLabel>Estado *</InputLabel>
                    <Select
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      required
                      label="Estado"
                      sx={{ borderRadius: 2 }}
                    >
                      {estados.map((estado) => (
                        <MenuItem key={estado.value} value={estado.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {estado.icon}
                            {estado.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Clasificación"
                    value={formData.clasificacion}
                    onChange={(e) => setFormData({ ...formData, clasificacion: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    helperText="Ej: A, B, C según criticidad"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.funcional}
                        onChange={(e) => setFormData({ ...formData, funcional: e.target.checked })}
                        color="success"
                        size="medium"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {formData.funcional ? <CheckCircleIcon color="success" /> : <WarningIcon color="error" />}
                        {formData.funcional ? "Funcional" : "No Funcional"}
                      </Box>
                    }
                    sx={{ ml: 1, mt: 2 }}
                  />
                </Grid>

                {/* Sección: Especificaciones Técnicas */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MemoryIcon />
                    Especificaciones Técnicas
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Sistema Operativo"
                    value={formData.sistemaOperativo}
                    onChange={(e) => setFormData({ ...formData, sistemaOperativo: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    helperText="Ej: Windows 11, macOS, Ubuntu"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Procesador"
                    value={formData.procesador}
                    onChange={(e) => setFormData({ ...formData, procesador: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    helperText="Ej: Intel Core i7, AMD Ryzen 5"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Memoria RAM"
                    value={formData.memoria}
                    onChange={(e) => setFormData({ ...formData, memoria: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    helperText="Ej: 8GB DDR4, 16GB DDR5"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Almacenamiento"
                    value={formData.almacenamiento}
                    onChange={(e) => setFormData({ ...formData, almacenamiento: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    helperText="Ej: 512GB SSD, 1TB HDD"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Dirección IP"
                    value={formData.direccionIP}
                    onChange={(e) => setFormData({ ...formData, direccionIP: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    helperText="Ej: 192.168.1.100"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Dirección MAC"
                    value={formData.direccionMAC}
                    onChange={(e) => setFormData({ ...formData, direccionMAC: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    helperText="Ej: 00:1B:44:11:3A:B7"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Sección: Asignación y Ubicación */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon />
                    Asignación y Ubicación
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                    <InputLabel>Sede</InputLabel>
                    <Select
                      value={formData.sedeId}
                      onChange={(e) => setFormData({ ...formData, sedeId: e.target.value })}
                      label="Sede"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value=""><em>Seleccionar sede</em></MenuItem>
                      {sedes.map((sede) => (
                        <MenuItem key={sede.sedeId} value={sede.sedeId}>
                          {sede.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ubicación Detallada"
                    value={formData.ubicacionDetallada}
                    onChange={(e) => setFormData({ ...formData, ubicacionDetallada: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    helperText="Ej: Oficina 201 - Escritorio 3"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><LocationIcon color="action" /></InputAdornment>
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                    <InputLabel>Empleado Asignado</InputLabel>
                    <Select
                      value={formData.empleadoAsignadoId}
                      onChange={(e) => setFormData({ ...formData, empleadoAsignadoId: e.target.value })}
                      disabled={formData.estado !== 'ASIGNADO'}
                      label="Empleado Asignado"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value=""><em>No asignado</em></MenuItem>
                      {empleados.map((empleado) => (
                        <MenuItem key={empleado.empleadoId} value={empleado.empleadoId}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon color="action" />
                            {empleado.nombreCompleto} ({empleado.cedula})
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {formData.estado !== 'ASIGNADO' && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        Solo disponible cuando el estado es "Asignado"
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Sección: Información Financiera */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon />
                    Información de Compra y Financiera
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Proveedor"
                    value={formData.proveedor}
                    onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><ProviderIcon color="action" /></InputAdornment>
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Número de Factura"
                    value={formData.numeroFactura}
                    onChange={(e) => setFormData({ ...formData, numeroFactura: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><InvoiceIcon color="action" /></InputAdornment>
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Fecha de Adquisición"
                    value={formData.fechaAdquisicion}
                    onChange={(date) => setFormData({ ...formData, fechaAdquisicion: date })}
                    renderInput={(params) => 
                      <TextField 
                        {...params} 
                        fullWidth 
                        size={isMobile ? "small" : "medium"}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <InputAdornment position="start"><CalendarIcon color="action" /></InputAdornment>
                        }}
                      />
                    }
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Fin de Garantía"
                    value={formData.fechaFinGarantia}
                    onChange={(date) => setFormData({ ...formData, fechaFinGarantia: date })}
                    renderInput={(params) => 
                      <TextField 
                        {...params} 
                        fullWidth 
                        size={isMobile ? "small" : "medium"}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <InputAdornment position="start"><CalendarIcon color="action" /></InputAdornment>
                        }}
                      />
                    }
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Costo"
                    type="number"
                    value={formData.costo}
                    onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    helperText="Valor en pesos colombianos (COP)"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><MoneyIcon color="action" /></InputAdornment>,
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                {/* Sección: Observaciones */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
                    Observaciones Adicionales
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Observaciones"
                    multiline
                    rows={4}
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                    helperText="Notas adicionales sobre el estado, mantenimiento, configuración especial, etc."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </DialogContent>
          
          <DialogActions sx={{ 
            p: { xs: 2, sm: 3 }, 
            background: 'rgba(0,0,0,0.02)',
            borderTop: '1px solid rgba(224, 224, 224, 1)',
            gap: 1
          }}>
            <Button 
              onClick={handleCloseDialog} 
              size={isMobile ? "small" : "medium"}
              color="inherit"
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              size={isMobile ? "small" : "medium"}
              disabled={submitting || !formData.nombreDispositivo}
              startIcon={submitting ? <CircularProgress size={16} /> : (editingDispositivo ? <EditIcon /> : <AddIcon />)}
              sx={{
                background: submitting ? 'grey.400' : 'linear-gradient(135deg, #0d47a1, #1976d2)',
                minWidth: 120,
                '&:hover': { 
                  background: submitting ? 'grey.400' : 'linear-gradient(135deg, #1976d2, #42a5f5)'
                }
              }}
            >
              {submitting ? 'Guardando...' : (editingDispositivo ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de vista detallada */}
        <ViewDialog />

        {/* FAB para móvil */}
        {isMobile && (
          <Tooltip title="Nuevo Dispositivo" arrow>
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => handleOpenDialog()}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                background: 'linear-gradient(135deg, #0d47a1, #1976d2)',
                boxShadow: '0 8px 24px rgba(13, 71, 161, 0.4)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                  boxShadow: '0 12px 32px rgba(13, 71, 161, 0.5)'
                }
              }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        )}

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            severity={snackbar.severity} 
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default GestionarDispositivos;