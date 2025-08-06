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
  Category as CategoryIcon
} from '@mui/icons-material';
import NavbarInventoryManager from './NavbarInventoryManager';

function GestionarCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/categorias');
      const data = await response.json();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categorias:', error);
      setSnackbar({ open: true, message: 'Error al cargar las categorías', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (categoria = null) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({
        nombre: categoria.nombre || '',
        descripcion: categoria.descripcion || ''
      });
    } else {
      setEditingCategoria(null);
      setFormData({
        nombre: '',
        descripcion: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategoria(null);
  };

  const handleSubmit = async () => {
    try {
      const url = editingCategoria 
        ? `http://localhost:8080/api/categorias/${editingCategoria.categoriaId}`
        : 'http://localhost:8080/api/categorias';
      
      const method = editingCategoria ? 'PUT' : 'POST';
      
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
          message: editingCategoria ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente', 
          severity: 'success' 
        });
        handleCloseDialog();
        fetchData();
      } else {
        throw new Error('Error en la operación');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: 'Error al guardar la categoría', severity: 'error' });
    }
  };

  const handleDelete = async (categoriaId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta categoría?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/categorias/${categoriaId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setSnackbar({ open: true, message: 'Categoría eliminada exitosamente', severity: 'success' });
          fetchData();
        } else {
          throw new Error('Error al eliminar');
        }
      } catch (error) {
        console.error('Error:', error);
        setSnackbar({ open: true, message: 'Error al eliminar la categoría', severity: 'error' });
      }
    }
  };

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pt: 12, pb: 4 }}>
      <NavbarInventoryManager />
      
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} color="white" sx={{ mb: 1 }}>
            Gestión de Categorías
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.8)" sx={{ mb: 3 }}>
            Administra las categorías de dispositivos
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
                  placeholder="Buscar categorías..."
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
                  Nueva Categoría
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
                    <TableCell><strong>Descripción</strong></TableCell>
                    <TableCell><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategorias.map((categoria) => (
                    <TableRow key={categoria.categoriaId}>
                      <TableCell>{categoria.categoriaId}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CategoryIcon color="primary" />
                          {categoria.nombre}
                        </Box>
                      </TableCell>
                      <TableCell>{categoria.descripcion}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary" onClick={() => handleOpenDialog(categoria)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(categoria.categoriaId)}>
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
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  multiline
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingCategoria ? 'Actualizar' : 'Crear'}
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

export default GestionarCategorias; 