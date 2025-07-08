import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, InputAdornment, Avatar, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NavbarJefeDirecto from './NavbarJefeDirecto';

function GestionarTiposHora() {
  const [tiposHora, setTiposHora] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [modo, setModo] = useState('ver'); // 'ver', 'editar', 'crear'
  const [editData, setEditData] = useState({
    tipo: '',
    denominacion: '',
    valor: ''
  });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTiposHora();
  }, []);

  const fetchTiposHora = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/horas');
      const data = await response.json();
      setTiposHora(data);
    } catch (error) {
      setMensaje('No se pudieron cargar los tipos de hora.');
    }
    setLoading(false);
  };

  const handleVer = async (tipo) => {
    setModo('ver');
    setTipoSeleccionado(tipo);
    setOpenDialog(true);
  };

  const handleEditar = (tipo) => {
    setModo('editar');
    setTipoSeleccionado(tipo);
    setEditData({
      tipo: tipo.tipo,
      denominacion: tipo.denominacion,
      valor: tipo.valor.toString()
    });
    setOpenDialog(true);
  };

  const handleCrear = () => {
    setModo('crear');
    setTipoSeleccionado(null);
    setEditData({
      tipo: '',
      denominacion: '',
      valor: ''
    });
    setOpenDialog(true);
  };

  const handleEliminar = async (tipo) => {
    if (!window.confirm('¿Seguro que deseas eliminar este tipo de hora?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/horas/${tipo.tipo}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        setMensaje('No se pudo eliminar el tipo de hora.');
        return;
      }
      setMensaje('Tipo de hora eliminado exitosamente.');
      fetchTiposHora();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  const handleGuardar = async () => {
    try {
      const dataToSend = {
        ...editData,
        valor: parseFloat(editData.valor)
      };

      let response;
      if (modo === 'crear') {
        response = await fetch('http://localhost:3000/api/horas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
      } else {
        response = await fetch(`http://localhost:3000/api/horas/${tipoSeleccionado.tipo}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
      }

      if (!response.ok) {
        setMensaje(`No se pudo ${modo === 'crear' ? 'crear' : 'actualizar'} el tipo de hora.`);
        return;
      }
      setMensaje(`Tipo de hora ${modo === 'crear' ? 'creado' : 'actualizado'} exitosamente.`);
      setOpenDialog(false);
      fetchTiposHora();
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
    }
  };

  const getValorFormateado = (valor) => {
    const porcentaje = ((valor - 1) * 100).toFixed(0);
    return `${porcentaje}% de recargo`;
  };

  // Filtro de búsqueda
  const tiposFiltrados = tiposHora.filter(t =>
    (t.tipo && t.tipo.toLowerCase().includes(search.toLowerCase())) ||
    (t.denominacion && t.denominacion.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box minHeight="100vh" width="100vw" sx={{ background: "url('/img/Recepcion.jpg') no-repeat center center", backgroundSize: 'cover', p: 4 }}>
      <NavbarJefeDirecto />
      <Paper elevation={6} sx={{ borderRadius: 3, p: 4, maxWidth: 1200, margin: '120px auto 40px auto', background: 'rgba(255,255,255,0.95)', position: 'relative' }}>
        <Typography variant="h4" fontWeight={700} mb={2} color="#222">
          Tipos de Hora Extra
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          sx={{ position: 'absolute', right: 32, top: 32, fontWeight: 700, borderRadius: 2, fontSize: 16, zIndex: 10 }}
          onClick={handleCrear}
        >
          Crear Nuevo Tipo
        </Button>
        
        <TextField
          placeholder="Buscar por tipo o denominación"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          sx={{ mb: 2, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {mensaje && <Alert severity="info" sx={{ mb: 2 }}>{mensaje}</Alert>}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#e3f2fd' }}>
                <TableCell>Tipo</TableCell>
                <TableCell>Denominación</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Recargo</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tiposFiltrados.map(tipo => (
                <TableRow key={tipo.id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: '#e3f2fd' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                      <Typography fontWeight={600}>{tipo.tipo}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{tipo.denominacion}</TableCell>
                  <TableCell>{tipo.valor}</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'inline-block', 
                      px: 2, 
                      py: 0.5, 
                      borderRadius: 2, 
                      background: tipo.valor > 1.5 ? '#ff9800' : tipo.valor > 1.25 ? '#2196f3' : '#4caf50',
                      color: 'white',
                      fontWeight: 600
                    }}>
                      {getValorFormateado(tipo.valor)}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleVer(tipo)} title="Ver detalles" sx={{ color: 'green' }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditar(tipo)} title="Editar" sx={{ color: '#1976d2' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEliminar(tipo)} title="Eliminar" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {tiposFiltrados.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No hay tipos de hora registrados.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialogo para ver/editar/crear tipo de hora */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccessTimeIcon sx={{ fontSize: 36, color: '#1976d2' }} />
          {modo === 'ver' ? 'Detalles del Tipo de Hora' : modo === 'editar' ? 'Editar Tipo de Hora' : 'Crear Nuevo Tipo de Hora'}
        </DialogTitle>
        <DialogContent sx={{ background: modo === 'ver' ? '#f3f7fa' : 'inherit', borderRadius: 2 }}>
          {tipoSeleccionado && modo === 'ver' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 72, height: 72, bgcolor: '#1976d2', mb: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 48, color: '#fff' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={700} color="#222" mb={1}>
                {tipoSeleccionado.tipo}
              </Typography>
              <Divider sx={{ width: '100%', mb: 2 }} />
              
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary">Denominación</Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
                  {tipoSeleccionado.denominacion}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">Valor</Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
                  {tipoSeleccionado.valor}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">Recargo</Typography>
                <Box sx={{ 
                  display: 'inline-block', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 2, 
                  background: tipoSeleccionado.valor > 1.5 ? '#ff9800' : tipoSeleccionado.valor > 1.25 ? '#2196f3' : '#4caf50',
                  color: 'white',
                  fontWeight: 600
                }}>
                  {getValorFormateado(tipoSeleccionado.valor)}
                </Box>
              </Box>
            </Box>
          )}
          
          {(modo === 'editar' || modo === 'crear') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Tipo (ej: HED, HEN, HEDF)"
                value={editData.tipo}
                onChange={e => setEditData({ ...editData, tipo: e.target.value })}
                fullWidth
                required
                helperText="Código técnico del tipo de hora"
              />
              <TextField
                label="Denominación"
                value={editData.denominacion}
                onChange={e => setEditData({ ...editData, denominacion: e.target.value })}
                fullWidth
                required
                helperText="Nombre amigable del tipo de hora"
              />
              <TextField
                label="Valor"
                type="number"
                value={editData.valor}
                onChange={e => setEditData({ ...editData, valor: e.target.value })}
                fullWidth
                required
                inputProps={{ min: 0, step: 0.01 }}
                helperText="Porcentaje de recargo (ej: 1.25 = 125%)"
              />
              {editData.valor && (
                <Alert severity="info">
                  Este valor representa un {getValorFormateado(parseFloat(editData.valor))}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
          {(modo === 'editar' || modo === 'crear') && (
            <Button onClick={handleGuardar} variant="contained" color="success">
              {modo === 'crear' ? 'Crear' : 'Guardar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GestionarTiposHora; 