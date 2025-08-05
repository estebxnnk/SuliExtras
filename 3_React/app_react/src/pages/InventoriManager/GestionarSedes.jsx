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
  Grid,
  Alert,
  Snackbar,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import NavbarInventoryManager from './NavbarInventoryManager';

function GestionarSedes() {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSede, setEditingSede] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    email: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/sedes');
      const data = await response.json();
      setSedes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching sedes:', error);
      setSnackbar({ open: true, message: 'Error al cargar las sedes', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (sede = null) => {
    if (sede) {
      setEditingSede(sede);
      setFormData({
        nombre: sede.nombre || '',
        direccion: sede.direccion || '',
        ciudad: sede.ciudad || '',
        telefono: sede.telefono || '',
        email: sede.email || ''
      });
    } else {
      setEditingSede(null);
      setFormData({
        nombre: '',
        direccion: '',
        ciudad: '',
        telefono: '',
        email: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSede(null);
  };

  const handleSubmit = async () => {
    try {
      const url = editingSede 
        ? `http://localhost:8000/api/sedes/${editingSede.sedeId}`
        : 'http://localhost:8000/api/sedes';
      
      const method = editingSede ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSnackbar({ 
          open: true, 
          message: editingSede ? 'Sede actualizada exitosamente' : 'Sede creada exitosamente', 
          severity: 'success' 
        });
        handleCloseDialog();
        fetchData();
      } else {
        throw new Error('Error en la operación');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: 'Error al guardar la sede', severity: 'error' });
    }
  };

  const handleDelete = async (sedeId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta sede?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/sedes/${sedeId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setSnackbar({ open: true, message: 'Sede eliminada exitosamente', severity: 'success' });
          fetchData();
        } else {
          throw new Error('Error al eliminar');
        }
      } catch (error) {
        console.error('Error:', error);
        setSnackbar({ open: true, message: 'Error al eliminar la sede', severity: 'error' });
      }
    }
  };

  const filteredSedes = sedes.filter(sede =>
    sede.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sede.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sede.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pt: 12, pb: 4 }}>
      <NavbarInventoryManager />
      
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} color="white" sx={{ mb: 1 }}>
            Gestión de Sedes
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.8)" sx={{ mb: 3 }}>
            Administra las sedes de la empresa
          </Typography>
        </Box>

        {/* Search and Actions */}
        <Card sx={{ 
          background: 'rgba(255,255,255,0.95)', 
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          mb: 3
        }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Buscar sedes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
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
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                  sx={{ 
                    background: '#0d47a1',
                    '&:hover': { background: '#1976d2' }
                  }}
                >
                  Nueva Sede
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Table */}
        <Card sx={{ 
          background: 'rgba(255,255,255,0.95)', 
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Nombre</strong></TableCell>
                    <TableCell><strong>Ciudad</strong></TableCell>
                    <TableCell><strong>Dirección</strong></TableCell>
                    <TableCell><strong>Teléfono</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSedes.map((sede) => (
                    <TableRow key={sede.sedeId}>
                      <TableCell>{sede.sedeId}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon color="primary" />
                          {sede.nombre}
                        </Box>
                      </TableCell>
                      <TableCell>{sede.ciudad}</TableCell>
                      <TableCell>{sede.direccion}</TableCell>
                      <TableCell>{sede.telefono}</TableCell>
                      <TableCell>{sede.email}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary" onClick={() => handleOpenDialog(sede)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(sede.sedeId)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Dialog for Add/Edit */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingSede ? 'Editar Sede' : 'Nueva Sede'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ciudad"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingSede ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>

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

export default GestionarSedes; 