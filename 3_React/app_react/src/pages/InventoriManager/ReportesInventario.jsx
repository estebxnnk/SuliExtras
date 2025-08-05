import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import {
  PieChart, pieArcLabelClasses
} from '@mui/x-charts/PieChart';
import {
  BarChart
} from '@mui/x-charts/BarChart';
import {
  LineChart
} from '@mui/x-charts/LineChart';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import NavbarInventoryManager from './NavbarInventoryManager';

function ReportesInventario() {
  const [dispositivos, setDispositivos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroSede, setFiltroSede] = useState('todas');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dispositivosRes, categoriasRes, sedesRes] = await Promise.all([
        fetch('http://localhost:8000/api/dispositivos'),
        fetch('http://localhost:8000/api/categorias'),
        fetch('http://localhost:8000/api/sedes')
      ]);
      
      const dispositivosData = await dispositivosRes.json();
      const categoriasData = await categoriasRes.json();
      const sedesData = await sedesRes.json();
      
      setDispositivos(Array.isArray(dispositivosData) ? dispositivosData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      setSedes(Array.isArray(sedesData) ? sedesData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar dispositivos según los filtros aplicados
  const dispositivosFiltrados = useMemo(() => {
    let filtrados = dispositivos;
    
    if (filtroSede !== 'todas') {
      filtrados = filtrados.filter(d => d.sede?.sedeId === parseInt(filtroSede));
    }
    
    if (filtroCategoria !== 'todas') {
      filtrados = filtrados.filter(d => d.categoria?.categoriaId === parseInt(filtroCategoria));
    }
    
    return filtrados;
  }, [dispositivos, filtroSede, filtroCategoria]);

  // Estadísticas generales
  const estadisticas = useMemo(() => {
    const total = dispositivosFiltrados.length;
    const disponibles = dispositivosFiltrados.filter(d => d.estado === 'DISPONIBLE').length;
    const asignados = dispositivosFiltrados.filter(d => d.estado === 'ASIGNADO').length;
    const mantenimiento = dispositivosFiltrados.filter(d => d.estado === 'MANTENIMIENTO').length;
    const baja = dispositivosFiltrados.filter(d => d.estado === 'BAJA').length;
    const funcionales = dispositivosFiltrados.filter(d => d.funcional).length;
    const noFuncionales = dispositivosFiltrados.filter(d => !d.funcional).length;
    const valorTotal = dispositivosFiltrados.reduce((acc, d) => acc + (d.costo || 0), 0);

    return {
      total,
      disponibles,
      asignados,
      mantenimiento,
      baja,
      funcionales,
      noFuncionales,
      valorTotal
    };
  }, [dispositivosFiltrados]);

  // Datos para gráficos
  const datosPorEstado = useMemo(() => [
    { id: 0, value: estadisticas.disponibles, label: 'Disponible', color: '#43a047' },
    { id: 1, value: estadisticas.asignados, label: 'Asignado', color: '#1976d2' },
    { id: 2, value: estadisticas.mantenimiento, label: 'Mantenimiento', color: '#fbc02d' },
    { id: 3, value: estadisticas.baja, label: 'Baja', color: '#e53935' },
  ], [estadisticas]);

  const datosPorCategoria = useMemo(() => {
    const conteo = {};
    dispositivosFiltrados.forEach(d => {
      const categoria = d.categoria?.nombre || 'Sin categoría';
      conteo[categoria] = (conteo[categoria] || 0) + 1;
    });
    return Object.entries(conteo).map(([categoria, cantidad], index) => ({
      id: index,
      categoria,
      cantidad
    }));
  }, [dispositivosFiltrados]);

  const datosPorSede = useMemo(() => {
    const conteo = {};
    dispositivosFiltrados.forEach(d => {
      const sede = d.sede?.nombre || 'Sin sede';
      conteo[sede] = (conteo[sede] || 0) + 1;
    });
    return Object.entries(conteo).map(([sede, cantidad], index) => ({
      id: index,
      sede,
      cantidad
    }));
  }, [dispositivosFiltrados]);

  // Dispositivos que requieren atención
  const dispositivosAtencion = useMemo(() => 
    dispositivosFiltrados.filter(d => 
      d.estado === 'MANTENIMIENTO' || 
      d.estado === 'BAJA' || 
      !d.funcional
    ), 
    [dispositivosFiltrados]
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
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

  const handleExportReport = () => {
    // Aquí se implementaría la lógica para exportar el reporte
    console.log('Exportando reporte...');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pt: 12, pb: 4 }}>
      <NavbarInventoryManager />
      
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} color="white" sx={{ mb: 1 }}>
            Reportes de Inventario
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.8)" sx={{ mb: 3 }}>
            Análisis y estadísticas del inventario de dispositivos
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
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filtrar por Sede</InputLabel>
                  <Select
                    value={filtroSede}
                    onChange={(e) => setFiltroSede(e.target.value)}
                  >
                    <MenuItem value="todas">Todas las sedes</MenuItem>
                    {sedes.map((sede) => (
                      <MenuItem key={sede.sedeId} value={sede.sedeId}>
                        {sede.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filtrar por Categoría</InputLabel>
                  <Select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                  >
                    <MenuItem value="todas">Todas las categorías</MenuItem>
                    {categorias.map((categoria) => (
                      <MenuItem key={categoria.categoriaId} value={categoria.categoriaId}>
                        {categoria.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchData}
                  sx={{ mr: 2 }}
                >
                  Actualizar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportReport}
                  sx={{ 
                    background: '#0d47a1',
                    '&:hover': { background: '#1976d2' }
                  }}
                >
                  Exportar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Métricas principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <AssessmentIcon sx={{ fontSize: 48, color: '#0d47a1', mb: 2 }} />
                <Typography variant="h4" fontWeight={700} color="#0d47a1">
                  {estadisticas.total}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Total Dispositivos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 48, color: '#43a047', mb: 2 }} />
                <Typography variant="h4" fontWeight={700} color="#43a047">
                  {estadisticas.disponibles}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Disponibles
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <WarningIcon sx={{ fontSize: 48, color: '#fbc02d', mb: 2 }} />
                <Typography variant="h4" fontWeight={700} color="#fbc02d">
                  {estadisticas.mantenimiento + estadisticas.baja}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Requieren Atención
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <InventoryIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" fontWeight={700} color="#1976d2">
                  {formatCurrency(estadisticas.valorTotal)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Valor Total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Gráfico de estados */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Dispositivos por Estado
                </Typography>
                {datosPorEstado.some(item => item.value > 0) ? (
                  <PieChart
                    series={[{
                      data: datosPorEstado,
                      arcLabel: (item) => `${item.label} (${item.value})`,
                      arcLabelMinAngle: 45,
                    }]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: 'white',
                        fontWeight: 'bold',
                      },
                    }}
                    height={300}
                  />
                ) : (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">No hay datos disponibles</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de categorías */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Dispositivos por Categoría
                </Typography>
                {datosPorCategoria.length > 0 ? (
                  <BarChart
                    dataset={datosPorCategoria}
                    xAxis={[{ scaleType: 'band', dataKey: 'categoria' }]}
                    series={[{ dataKey: 'cantidad', color: '#0d47a1' }]}
                    height={300}
                  />
                ) : (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">No hay datos disponibles</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de sedes */}
          <Grid item xs={12}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Dispositivos por Sede
                </Typography>
                {datosPorSede.length > 0 ? (
                  <BarChart
                    dataset={datosPorSede}
                    xAxis={[{ scaleType: 'band', dataKey: 'sede' }]}
                    series={[{ dataKey: 'cantidad', color: '#43a047' }]}
                    height={300}
                  />
                ) : (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">No hay datos disponibles</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabla de dispositivos que requieren atención */}
        <Card sx={{ 
          background: 'rgba(255,255,255,0.95)', 
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <WarningIcon color="warning" />
              <Typography variant="h6" fontWeight={700}>
                Dispositivos que Requieren Atención ({dispositivosAtencion.length})
              </Typography>
            </Box>
            
            {dispositivosAtencion.length > 0 ? (
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Item</strong></TableCell>
                      <TableCell><strong>Serial</strong></TableCell>
                      <TableCell><strong>Categoría</strong></TableCell>
                      <TableCell><strong>Sede</strong></TableCell>
                      <TableCell><strong>Estado</strong></TableCell>
                      <TableCell><strong>Funcional</strong></TableCell>
                      <TableCell><strong>Costo</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dispositivosAtencion.slice(0, 10).map((dispositivo) => (
                      <TableRow key={dispositivo.dispositivoId}>
                        <TableCell>{dispositivo.item}</TableCell>
                        <TableCell>{dispositivo.serial}</TableCell>
                        <TableCell>{dispositivo.categoria?.nombre}</TableCell>
                        <TableCell>{dispositivo.sede?.nombre}</TableCell>
                        <TableCell>
                          <Chip 
                            label={getEstadoLabel(dispositivo.estado)} 
                            color={getEstadoColor(dispositivo.estado)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={dispositivo.funcional ? 'Sí' : 'No'} 
                            color={dispositivo.funcional ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatCurrency(dispositivo.costo)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No hay dispositivos que requieran atención
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default ReportesInventario; 