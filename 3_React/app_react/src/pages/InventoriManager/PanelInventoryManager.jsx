import React, { useEffect, useState, useMemo } from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, Divider, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button, MenuItem, Select, FormControl, InputLabel, Badge, IconButton } from '@mui/material';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import InventoryIcon from '@mui/icons-material/Inventory';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ComputerIcon from '@mui/icons-material/Computer';
import PhoneIcon from '@mui/icons-material/Phone';
import TabletIcon from '@mui/icons-material/Tablet';
import BuildIcon from '@mui/icons-material/Build';
import NavbarInventoryManager from './NavbarInventoryManager';

function PanelInventoryManager() {
  const [dispositivos, setDispositivos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Fetch dispositivos, categorias y sedes
  const fetchData = async () => {
    setLoading(true);
    try {
      const [dispositivosRes, categoriasRes, sedesRes] = await Promise.all([
        fetch('http://localhost:8000/api/dispositivos'),
        fetch('http://localhost:8000/api/categorias'),
        fetch('http://localhost:8000/api/sedes'),
      ]);
      const dispositivosData = await dispositivosRes.json();
      const categoriasData = await categoriasRes.json();
      const sedesData = await sedesRes.json();
      setDispositivos(Array.isArray(dispositivosData) ? dispositivosData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      setSedes(Array.isArray(sedesData) ? sedesData : []);
      setLastUpdate(Date.now());
    } catch (e) {
      console.error('Error fetching data:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Métricas de dispositivos por estado
  const dispositivosDisponibles = useMemo(() => dispositivos.filter(d => d.estado === 'DISPONIBLE').length, [dispositivos]);
  const dispositivosAsignados = useMemo(() => dispositivos.filter(d => d.estado === 'ASIGNADO').length, [dispositivos]);
  const dispositivosMantenimiento = useMemo(() => dispositivos.filter(d => d.estado === 'MANTENIMIENTO').length, [dispositivos]);
  const dispositivosBaja = useMemo(() => dispositivos.filter(d => d.estado === 'BAJA').length, [dispositivos]);
  const totalDispositivos = useMemo(() => dispositivos.length, [dispositivos]);

  // Dispositivos por estado para gráfico
  const dispositivosPorEstado = useMemo(() => {
    const conteo = { DISPONIBLE: 0, ASIGNADO: 0, MANTENIMIENTO: 0, BAJA: 0 };
    dispositivos.forEach(d => {
      conteo[d.estado] = (conteo[d.estado] || 0) + 1;
    });
    return [
      { id: 0, value: conteo.DISPONIBLE, label: 'Disponible', color: '#43a047' },
      { id: 1, value: conteo.ASIGNADO, label: 'Asignado', color: '#1976d2' },
      { id: 2, value: conteo.MANTENIMIENTO, label: 'Mantenimiento', color: '#fbc02d' },
      { id: 3, value: conteo.BAJA, label: 'Baja', color: '#e53935' },
    ];
  }, [dispositivos]);

  // Dispositivos por categoría
  const dispositivosPorCategoria = useMemo(() => {
    const conteo = {};
    dispositivos.forEach(d => {
      const categoria = d.categoria?.nombre || 'Sin categoría';
      conteo[categoria] = (conteo[categoria] || 0) + 1;
    });
    return Object.entries(conteo).map(([categoria, cantidad], index) => ({
      id: index,
      categoria,
      cantidad
    }));
  }, [dispositivos]);

  // Dispositivos que requieren atención
  const dispositivosAtencion = useMemo(() => 
    dispositivos.filter(d => d.estado === 'MANTENIMIENTO' || d.estado === 'BAJA' || !d.funcional), 
    [dispositivos]
  );

  // Valor total del inventario
  const valorTotalInventario = useMemo(() => 
    dispositivos.reduce((acc, d) => acc + (d.costo || 0), 0), 
    [dispositivos]
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

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pt: 12, pb: 4 }}>
      <NavbarInventoryManager />
      
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} color="white" sx={{ mb: 1 }}>
            Panel de Gestión de Inventario
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.8)" sx={{ mb: 3 }}>
            Última actualización: {new Date(lastUpdate).toLocaleString('es-CO')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            sx={{ 
              background: 'rgba(255,255,255,0.2)', 
              backdropFilter: 'blur(10px)',
              '&:hover': { background: 'rgba(255,255,255,0.3)' }
            }}
          >
            Actualizar Datos
          </Button>
        </Box>

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
                <Avatar sx={{ bgcolor: '#43a047', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                  <InventoryIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h4" fontWeight={700} color="#43a047">
                  {totalDispositivos}
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
                <Avatar sx={{ bgcolor: '#1976d2', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                  <ComputerIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h4" fontWeight={700} color="#1976d2">
                  {dispositivosDisponibles}
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
                <Avatar sx={{ bgcolor: '#fbc02d', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                  <BuildIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h4" fontWeight={700} color="#fbc02d">
                  {dispositivosMantenimiento}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  En Mantenimiento
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
                <Typography variant="h4" fontWeight={700} color="#0d47a1">
                  {formatCurrency(valorTotalInventario)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Valor Total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Gráficos y tablas */}
        <Grid container spacing={3}>
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
                {dispositivosPorEstado.some(item => item.value > 0) ? (
                  <PieChart
                    series={[{
                      data: dispositivosPorEstado,
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
                {dispositivosPorCategoria.length > 0 ? (
                  <BarChart
                    dataset={dispositivosPorCategoria}
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

          {/* Dispositivos que requieren atención */}
          <Grid item xs={12}>
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
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Item</strong></TableCell>
                        <TableCell><strong>Serial</strong></TableCell>
                        <TableCell><strong>Categoría</strong></TableCell>
                        <TableCell><strong>Estado</strong></TableCell>
                        <TableCell><strong>Funcional</strong></TableCell>
                        <TableCell><strong>Acciones</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dispositivosAtencion.slice(0, 10).map((dispositivo) => (
                        <TableRow key={dispositivo.dispositivoId}>
                          <TableCell>{dispositivo.item}</TableCell>
                          <TableCell>{dispositivo.serial}</TableCell>
                          <TableCell>{dispositivo.categoria?.nombre}</TableCell>
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
                          <TableCell>
                            <IconButton size="small" color="primary">
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No hay dispositivos que requieran atención
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default PanelInventoryManager; 