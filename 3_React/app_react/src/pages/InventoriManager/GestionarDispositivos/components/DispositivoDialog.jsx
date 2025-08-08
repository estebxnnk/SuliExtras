import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  Avatar,
  Box,
  Typography,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Computer as ComputerIcon,
  Assignment as AssignmentIcon,
  Memory as MemoryIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  LocalShipping as ProviderIcon,
  Article as InvoiceIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { estados } from '../utils/dispositivosUtils';

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

const DispositivoDialog = ({
  open,
  onClose,
  formData,
  setFormData,
  editingDispositivo,
  sedes,
  empleados,
  submitting,
  handleSubmit,
  isMobile
}) => {
  const theme = useTheme();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
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
                        {React.createElement(estado.icon.type)}
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
                label="Funcional"
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
          onClick={onClose} 
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
  );
};

export default DispositivoDialog; 