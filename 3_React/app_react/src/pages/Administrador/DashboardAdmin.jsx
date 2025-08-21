import React, { useEffect, useState, useMemo } from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, Divider, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button, MenuItem, Select, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Badge, IconButton } from '@mui/material';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavbarAdminstrativo from './NavbarAdminstrativo';
import ModernFooter from '../../components/ModernFooter';

function DashboardAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolFiltro, setRolFiltro] = useState('');
  const [datePreset, setDatePreset] = useState('7d'); // 'today', '7d', '1m', 'all'
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [modalUsuario, setModalUsuario] = useState({ open: false, usuario: null, registros: [] });

  // Fetch usuarios, roles y registros
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usuariosRes, rolesRes, registrosRes] = await Promise.all([
        fetch('http://localhost:3000/api/usuarios'),
        fetch('http://localhost:3000/api/roles'),
        fetch('http://localhost:3000/api/registros'),
      ]);
      const usuariosData = await usuariosRes.json();
      const rolesData = await rolesRes.json();
      const registrosData = await registrosRes.json();
      setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setRegistros(Array.isArray(registrosData) ? registrosData : []);
      setLastUpdate(Date.now());
    } catch (e) {
      // Manejo simple de error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // refresco cada 30s
    return () => clearInterval(interval);
  }, []);

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
    if (rolFiltro) filtrados = filtrados.filter(u => u.rol?.id === rolFiltro);
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
      color: i === 0 ? '#1976d2' : i === 1 ? '#ffb300' : '#43a047', // azul, naranja, verde, etc.
    }));
  }, [usuarios]);
  const totalUsuarios = useMemo(() => usuarios.length, [usuarios]);

  // Total horas extra (de registros)
  const totalHorasExtra = useMemo(() => {
    let total = 0;
    registros.forEach(r => {
      total += r.cantidadHorasExtra || 0;
    });
    return total;
  }, [registros]);

  // Registros pendientes
  const registrosPendientes = useMemo(() => registros.filter(r => r.estado === 'pendiente'), [registros]);

  // Nuevos usuarios (filtrados por rango)
  const nuevosUsuarios = useMemo(() => {
    return usuariosFiltrados.slice(0, 5);
  }, [usuariosFiltrados]);

  // Registros recientes (filtrados por rango de fechas)
  const registrosRecientes = useMemo(() => {
    let filtrados = registros;
    if (dateRange.from && dateRange.to) {
      filtrados = filtrados.filter(r => {
        const fecha = new Date(r.fecha);
        return fecha >= dateRange.from && fecha <= dateRange.to;
      });
    }
    // Ordenar por fecha descendente
    return filtrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 10);
  }, [registros, dateRange]);

  // Métricas de horas por estado
  const horasAprobadas = useMemo(() => registros.filter(r => r.estado === 'aprobado').reduce((acc, r) => acc + (r.cantidadHorasExtra || 0), 0), [registros]);
  const horasPendientes = useMemo(() => registros.filter(r => r.estado === 'pendiente').reduce((acc, r) => acc + (r.cantidadHorasExtra || 0), 0), [registros]);
  const horasRechazadas = useMemo(() => registros.filter(r => r.estado === 'rechazado').reduce((acc, r) => acc + (r.cantidadHorasExtra || 0), 0), [registros]);

  // Para registros por estado (con numeración)
  const registrosPorEstado = useMemo(() => {
    const conteo = { aprobado: 0, pendiente: 0, rechazado: 0 };
    registros.forEach(r => {
      conteo[r.estado] = (conteo[r.estado] || 0) + 1;
    });
    return [
      { id: 0, value: conteo.aprobado, label: 'Aprobado', color: '#43a047' },
      { id: 1, value: conteo.pendiente, label: 'Pendiente', color: '#fbc02d' },
      { id: 2, value: conteo.rechazado, label: 'Rechazado', color: '#e53935' },
    ];
  }, [registros]);
  const totalRegistros = useMemo(() => registros.length, [registros]);

  // Handlers
  const handleFiltroRol = (e) => setRolFiltro(e.target.value);

  // Modal detalles usuario
  const handleOpenUsuario = (usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    const registrosUsuario = registros.filter(r => r.usuarioId === usuarioId);
    setModalUsuario({ open: true, usuario, registros: registrosUsuario });
  };
  const handleCloseUsuario = () => setModalUsuario({ open: false, usuario: null, registros: [] });

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', overflow: 'hidden', background: `url('/img/Recepcion.jpg') no-repeat center center fixed`, backgroundSize: 'cover', display: 'flex', flexDirection: 'column' }}>
      <NavbarAdminstrativo />
      <Box sx={{ flex: 1, width: '100%', maxWidth: 1400, mx: 'auto', mt: 10, mb: 4, px: { xs: 1, sm: 2 }, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h3" fontWeight={900} color="#1976d2" sx={{ textShadow: '0 2px 8px #b6d0f7' }}>
            Dashboard Administrativo
          </Typography>
          <Button onClick={fetchData} startIcon={<RefreshIcon />} variant="outlined" color="primary" sx={{ fontWeight: 700 }} disabled={loading}>
            Refrescar
          </Button>
        </Box>
        <Grid container spacing={3} alignItems="stretch" sx={{ mb: 2, flexWrap: 'wrap' }}>
          {/* Tarjeta especial de pendientes */}
          <Grid item xs={12} md={4} lg={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 2px 16px #fbc02d', p: 2, background: 'linear-gradient(90deg,#fffde7 60%,#fff9c4 100%)', display: 'flex', alignItems: 'center', gap: 2, minHeight: 140 }}>
              <Badge badgeContent={registrosPendientes.length} color="warning" max={99} sx={{ mr: 2 }}>
                <WarningIcon sx={{ fontSize: 40, color: '#fbc02d' }} />
              </Badge>
              <Box>
                <Typography variant="h6" fontWeight={700} color="#b28704">Registros Pendientes</Typography>
                <Typography variant="h4" fontWeight={900} color="#b28704">{registrosPendientes.length}</Typography>
                <Typography variant="body2" color="text.secondary">Registros de horas extra sin aprobar</Typography>
              </Box>
            </Card>
          </Grid>
          {/* Filtros como tarjeta */}
          <Grid item xs={12} md={8} lg={5}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 2px 16px #b6d0f7', p: 2, minHeight: 140, display: 'flex', alignItems: 'center' }}>
              <CardContent sx={{ width: '100%' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="rol-filtro-label">Filtrar por Rol</InputLabel>
                      <Select
                        labelId="rol-filtro-label"
                        value={rolFiltro}
                        label="Filtrar por Rol"
                        onChange={handleFiltroRol}
                      >
                        <MenuItem value="">Todos</MenuItem>
                        {roles.map(rol => (
                          <MenuItem key={rol.id} value={rol.id}>{rol.nombre}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="date-preset-label">Rango de Fechas</InputLabel>
                      <Select
                        labelId="date-preset-label"
                        value={datePreset}
                        label="Rango de Fechas"
                        onChange={e => setDatePreset(e.target.value)}
                      >
                        <MenuItem value="today">Hoy</MenuItem>
                        <MenuItem value="7d">Últimos 7 días</MenuItem>
                        <MenuItem value="1m">Último mes</MenuItem>
                        <MenuItem value="all">Todo</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Mostrando usuarios nuevos y registros en el rango seleccionado.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Usuarios por rol con numeración */}
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 2px 16px #b6d0f7', p: 2, minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" fontWeight={700} color="#1976d2">Usuarios por Rol</Typography>
                  <Typography variant="body2" color="#1976d2" fontWeight={700}>Total: {totalUsuarios}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <PieChart
                    series={[{
                      data: usuariosPorRol,
                      arcLabel: d => d.value,
                      arcLabelMinAngle: 10,
                      color: d => d.color,
                    }]}
                    width={220}
                    height={180}
                    legend={{ hidden: false }}
                    sx={{ [`& .${pieArcLabelClasses.root}`]: { fill: '#fff', fontWeight: 700 } }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                    {usuariosPorRol.map((r, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', background: r.color, mr: 1 }} />
                        <Typography variant="body2" fontWeight={700}>{r.label}: {r.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Registros por estado con numeración */}
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 2px 16px #b6d0f7', p: 2, minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" fontWeight={700} color="#1976d2">Registros por Estado</Typography>
                  <Typography variant="body2" color="#1976d2" fontWeight={700}>Total: {totalRegistros}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <PieChart
                    series={[{
                      data: registrosPorEstado,
                      arcLabel: d => d.value,
                      arcLabelMinAngle: 10,
                      color: d => d.color,
                    }]}
                    width={220}
                    height={180}
                    legend={{ hidden: false }}
                    sx={{ [`& .${pieArcLabelClasses.root}`]: { fill: '#fff', fontWeight: 700 } }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                    {registrosPorEstado.map((r, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', background: r.color, mr: 1 }} />
                        <Typography variant="body2" fontWeight={700}>{r.label}: {r.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Total horas extra */}
          <Grid item xs={12} md={4} lg={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 2px 16px #b6d0f7', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 140 }}>
              <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56, mb: 2 }}>
                <AccessTimeIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6" fontWeight={700} color="#1976d2">Total Horas Extra</Typography>
              <Typography variant="h3" fontWeight={900} color="#222">{totalHorasExtra}</Typography>
              <Typography variant="body2" color="text.secondary">(en registros recientes)</Typography>
            </Card>
          </Grid>
          {/* Nuevos usuarios */}
          <Grid item xs={12} md={8} lg={8}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 2px 16px #b6d0f7', p: 2, mb: 3, minHeight: 140 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: '#43a047', width: 40, height: 40, mr: 1 }}>
                    <PersonAddIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} color="#1976d2">Nuevos Usuarios</Typography>
                </Box>
                <Divider sx={{ mb: 1 }} />
                {nuevosUsuarios.length === 0 && <Typography variant="body2" color="text.secondary">No hay usuarios en el rango.</Typography>}
                {nuevosUsuarios.map((u, i) => (
                  <Box key={i} sx={{ mb: 1 }}>
                    <Typography fontWeight={600}>{u.persona?.nombres} {u.persona?.apellidos}</Typography>
                    <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                    <Typography variant="caption" color="#1976d2">{u.createdAt?.slice(0,10) || u.fechaCreacion?.slice(0,10) || u.persona?.fechaCreacion?.slice(0,10) || u.fechaRegistro?.slice(0,10)}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          {/* Registros recientes */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 2px 16px #b6d0f7', p: 2, mt: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} color="#1976d2" mb={2}>Registros de Horas Extra Recientes</Typography>
                <Table size="small" sx={{ mb: 2 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Horas</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {registrosRecientes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">No hay registros en el rango.</TableCell>
                      </TableRow>
                    )}
                    {registrosRecientes.map((r, i) => {
                      const usuario = usuarios.find(u => u.id === r.usuarioId);
                      return (
                        <TableRow key={i}>
                          <TableCell>{usuario ? `${usuario.persona?.nombres} ${usuario.persona?.apellidos}` : 'Desconocido'}</TableCell>
                          <TableCell>{r.fecha}</TableCell>
                          <TableCell>{r.cantidadHorasExtra}</TableCell>
                          <TableCell>
                            <Chip label={r.estado} color={r.estado === 'aprobado' ? 'success' : r.estado === 'pendiente' ? 'warning' : 'error'} size="small" />
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleOpenUsuario(r.usuarioId)} color="primary" size="small">
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Última actualización: {new Date(lastUpdate).toLocaleTimeString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      {/* Modal detalles usuario */}
      <Dialog open={modalUsuario.open} onClose={handleCloseUsuario} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#1976d2', fontWeight: 700 }}>Detalles del Usuario</DialogTitle>
        <DialogContent>
          {modalUsuario.usuario && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>{modalUsuario.usuario.persona?.nombres} {modalUsuario.usuario.persona?.apellidos}</Typography>
              <Typography variant="body2" color="text.secondary">Email: {modalUsuario.usuario.email}</Typography>
              <Typography variant="body2" color="text.secondary">Documento: {modalUsuario.usuario.persona?.tipoDocumento} {modalUsuario.usuario.persona?.numeroDocumento}</Typography>
              <Typography variant="body2" color="text.secondary">Rol: {modalUsuario.usuario.rol?.nombre}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={700} color="#1976d2">Registros de Horas Extra</Typography>
              <Table size="small" sx={{ mt: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Horas</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modalUsuario.registros.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">Sin registros</TableCell>
                    </TableRow>
                  )}
                  {modalUsuario.registros.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.fecha}</TableCell>
                      <TableCell>{r.cantidadHorasExtra}</TableCell>
                      <TableCell>
                        <Chip label={r.estado} color={r.estado === 'aprobado' ? 'success' : r.estado === 'pendiente' ? 'warning' : 'error'} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUsuario} color="primary" variant="contained">Cerrar</Button>
        </DialogActions>
      </Dialog>
      <ModernFooter />
    </Box>
  );
}

export default DashboardAdmin; 