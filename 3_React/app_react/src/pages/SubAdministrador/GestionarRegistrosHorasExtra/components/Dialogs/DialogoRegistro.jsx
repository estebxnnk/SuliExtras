import React from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Divider,
  Grid,
  TextField,
  MenuItem,
  Card,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Alert
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const DialogoRegistro = ({
  openDialog,
  cerrarDialog,
  registroSeleccionado,
  modo,
  editData,
  setEditData,
  handleGuardarEdicion,
  tiposHora,
  getEstadoChip,
  getUsuario,
  usuarios
}) => {
  return (
    <Dialog 
      open={openDialog} 
      onClose={cerrarDialog} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header mejorado con diseño premium */}
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #64b5f6 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        py: 4,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Efecto de brillo en el fondo */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          animation: 'shimmer 3s ease-in-out infinite'
        }} />
        
        <Avatar sx={{ 
          bgcolor: 'rgba(255,255,255,0.25)', 
          color: 'white',
          width: 56,
          height: 56,
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          zIndex: 1
        }}>
          {modo === 'editar' ? <EditIcon sx={{ fontSize: 28 }} /> : <AccessTimeIcon sx={{ fontSize: 28 }} />}
        </Avatar>
        
        <Box sx={{ zIndex: 1 }}>
          <Typography variant="h4" fontWeight={800} sx={{ 
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            mb: 1
          }}>
            {modo === 'ver' ? '📋 Detalles del Registro' : 
              (registroSeleccionado?.estado === 'aprobado' ? '🔄 Cambiar Estado del Registro' : '✏️ Editar Registro')}
          </Typography>
          <Typography variant="h6" sx={{ 
            opacity: 0.95, 
            fontWeight: 500,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}>
            {registroSeleccionado?.numRegistro ? `Registro #${registroSeleccionado.numRegistro}` : 'Nuevo Registro'}
          </Typography>
        </Box>
        
        {/* Estilos CSS para las animaciones */}
        <style>
          {`
            @keyframes shimmer {
              0% { transform: translateX(-100%) rotate(0deg); }
              100% { transform: translateX(100%) rotate(360deg); }
            }
          `}
        </style>
      </DialogTitle>

      <DialogContent sx={{ 
        background: modo === 'ver' ? '#f8fafc' : 'inherit', 
        borderRadius: 0,
        p: 0
      }}>
        {registroSeleccionado && modo === 'ver' && (
          <Box sx={{ p: 4 }}>
            {/* Avatar y título del registro */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: '#1976d2',
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)'
              }}>
                <AccessTimeIcon sx={{ fontSize: 48, color: '#fff' }} />
              </Avatar>
              <Typography variant="h4" fontWeight={800} color="#1976d2" sx={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Registro #{registroSeleccionado.numRegistro}
              </Typography>
              <Divider sx={{ width: '100%', borderWidth: 2, borderColor: '#e3f2fd' }} />
            </Box>
            
            {/* Información del usuario */}
            {(() => {
              const usuario = getUsuario(registroSeleccionado.usuario, usuarios);
              return (
                <Card sx={{ 
                  p: 3, 
                  mb: 3,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)',
                  border: '2px solid rgba(25, 118, 210, 0.15)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                  <Typography variant="h6" fontWeight={700} color="#1976d2" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    👤 Información del Empleado
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                        Nombre Completo
                      </Typography>
                      <Typography variant="body1" fontWeight={600} sx={{ 
                        p: 2, 
                        background: 'rgba(25, 118, 210, 0.1)', 
                        borderRadius: 2,
                        border: '1px solid rgba(25, 118, 210, 0.2)'
                      }}>
                        {usuario?.persona?.nombres || registroSeleccionado.nombres || 'N/A'} {usuario?.persona?.apellidos || registroSeleccionado.apellidos || ''}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                        Documento
                      </Typography>
                      <Typography variant="body1" fontWeight={600} sx={{ 
                        p: 2, 
                        background: 'rgba(25, 118, 210, 0.1)', 
                        borderRadius: 2,
                        border: '1px solid rgba(25, 118, 210, 0.2)'
                      }}>
                        {usuario?.persona?.tipoDocumento || registroSeleccionado.tipoDocumento || 'N/A'}: {usuario?.persona?.numeroDocumento || registroSeleccionado.numeroDocumento || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight={600} sx={{ 
                        p: 2, 
                        background: 'rgba(25, 118, 210, 0.1)', 
                        borderRadius: 2,
                        border: '1px solid rgba(25, 118, 210, 0.2)'
                      }}>
                        {registroSeleccionado.usuario}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                        Estado del Registro
                      </Typography>
                      {(() => {
                        const estadoChip = getEstadoChip(registroSeleccionado.estado);
                        return (
                          <Chip
                            label={estadoChip.label}
                            color={estadoChip.color}
                            size="medium"
                            sx={{ 
                              fontWeight: 700,
                              fontSize: '1rem',
                              height: 40,
                              '& .MuiChip-label': {
                                px: 2
                              }
                            }}
                          />
                        );
                      })()}
                    </Grid>
                  </Grid>
                </Card>
              );
            })()}

            {/* Información del registro */}
            <Card sx={{ 
              p: 3, 
              mb: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)',
              border: '2px solid rgba(25, 118, 210, 0.15)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h6" fontWeight={700} color="#1976d2" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                ⏰ Detalles del Registro
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    Fecha
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ 
                    p: 2, 
                    background: 'rgba(25, 118, 210, 0.1)', 
                    borderRadius: 2,
                    border: '1px solid rgba(25, 118, 210, 0.2)'
                  }}>
                    {registroSeleccionado.fecha}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    Ubicación
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ 
                    p: 2, 
                    background: 'rgba(25, 118, 210, 0.1)', 
                    borderRadius: 2,
                    border: '1px solid rgba(25, 118, 210, 0.2)'
                  }}>
                    {registroSeleccionado.ubicacion}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    Hora de Ingreso
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ 
                    p: 2, 
                    background: 'rgba(25, 118, 210, 0.1)', 
                    borderRadius: 2,
                    border: '1px solid rgba(25, 118, 210, 0.2)'
                  }}>
                    {registroSeleccionado.horaIngreso}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    Hora de Salida
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ 
                    p: 2, 
                    background: 'rgba(25, 118, 210, 0.1)', 
                    borderRadius: 2,
                    border: '1px solid rgba(25, 118, 210, 0.2)'
                  }}>
                    {registroSeleccionado.horaSalida}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    Horas Extra
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ 
                    p: 2, 
                    background: 'rgba(25, 118, 210, 0.1)', 
                    borderRadius: 2,
                    border: '1px solid rgba(25, 118, 210, 0.2)'
                  }}>
                    {registroSeleccionado.cantidadHorasExtra} horas
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    Bono Salarial
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ 
                    p: 2, 
                    background: 'rgba(25, 118, 210, 0.1)', 
                    borderRadius: 2,
                    border: '1px solid rgba(25, 118, 210, 0.2)'
                  }}>
                    {registroSeleccionado.bono_salarial} horas extra de bono
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    Horas a Mostrar
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ 
                    p: 2, 
                    background: 'rgba(25, 118, 210, 0.1)', 
                    borderRadius: 2,
                    border: '1px solid rgba(25, 118, 210, 0.2)'
                  }}>
                    {registroSeleccionado.horas_extra_divididas} horas extra a mostrar
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    Tipo(s) de Hora
                  </Typography>
                  {registroSeleccionado.Horas && registroSeleccionado.Horas.length > 0 ? (
                    registroSeleccionado.Horas.map(hora => (
                      <Box key={hora.id} sx={{ 
                        p: 2, 
                        background: 'rgba(156, 39, 176, 0.1)', 
                        borderRadius: 2,
                        border: '1px solid rgba(156, 39, 176, 0.2)',
                        mb: 1
                      }}>
                        <Typography variant="body1" fontWeight={600} color="#9c27b0">
                          {hora.tipo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {hora.denominacion} ({(hora.valor - 1) * 100}% recargo)
                        </Typography>
                        {hora.RegistroHora && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Cantidad: {hora.RegistroHora.cantidad}
                          </Typography>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body1" fontWeight={600} color="text.secondary" sx={{ 
                      p: 2, 
                      background: 'rgba(158, 158, 158, 0.1)', 
                      borderRadius: 2,
                      border: '1px solid rgba(158, 158, 158, 0.2)'
                    }}>
                      No asignado
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Card>
            
            {/* Justificación */}
            {registroSeleccionado.justificacionHoraExtra && (
              <Card sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)',
                border: '2px solid rgba(25, 118, 210, 0.15)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h6" fontWeight={700} color="#1976d2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📝 Justificación
                </Typography>
                <Typography variant="body1" sx={{ 
                  p: 3, 
                  background: 'rgba(25, 118, 210, 0.05)', 
                  borderRadius: 2,
                  border: '1px solid rgba(25, 118, 210, 0.1)',
                  lineHeight: 1.6
                }}>
                  {registroSeleccionado.justificacionHoraExtra}
                </Typography>
              </Card>
            )}
          </Box>
        )}
        
        {registroSeleccionado && modo === 'editar' && (
          <Box sx={{ p: 4 }}>
            {/* Si el registro está aprobado, solo mostrar cambio de estado */}
            {registroSeleccionado.estado === 'aprobado' ? (
              <Card sx={{ 
                p: 4, 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)', 
                border: '2px solid #dee2e6',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h5" fontWeight={700} color="#495057" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🔄 Cambiar Estado del Registro
                </Typography>
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  Este registro está aprobado. Solo puedes cambiar su estado a pendiente para permitir futuras ediciones.
                </Alert>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: 600 }}>Nuevo Estado</InputLabel>
                      <Select
                        value={editData.estado || 'pendiente'}
                        onChange={e => setEditData({ ...editData, estado: e.target.value })}
                        label="Nuevo Estado"
                        sx={{ 
                          background: '#fff', 
                          borderRadius: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          }
                        }}
                      >
                        <MenuItem value="pendiente">Pendiente</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Card>
            ) : (
              /* Para registros no aprobados, mostrar edición completa */
              <Card sx={{ 
                p: 4, 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)', 
                border: '2px solid #dee2e6',
                borderRadius: 4,
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Efecto de borde brillante */}
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6, #1976d2)',
                  backgroundSize: '400% 400%',
                  animation: 'gradientShift 3s ease infinite',
                  opacity: 0.1,
                  borderRadius: 4
                }} />
                
                <Typography variant="h4" fontWeight={800} color="#1976d2" sx={{ 
                  mb: 4, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  position: 'relative',
                  zIndex: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  ✏️ Editar Información del Registro
                </Typography>
                
                {/* Estilos CSS para las animaciones */}
                <style>
                  {`
                    @keyframes gradientShift {
                      0% { background-position: 0% 50%; }
                      50% { background-position: 100% 50%; }
                      100% { background-position: 0% 50%; }
                    }
                  `}
                </style>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Fecha"
                      type="date"
                      value={editData.fecha}
                      onChange={e => setEditData({ ...editData, fecha: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={{ 
                        background: '#fff', 
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#1976d2',
                            borderWidth: 2,
                            transition: 'all 0.3s ease'
                          },
                          '&:hover fieldset': {
                            borderColor: '#1565c0',
                            borderWidth: 3,
                            boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                            borderWidth: 3,
                            boxShadow: '0 0 0 6px rgba(25, 118, 210, 0.15)'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#1976d2',
                          fontWeight: 600
                        },
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Ubicación"
                      value={editData.ubicacion}
                      onChange={e => setEditData({ ...editData, ubicacion: e.target.value })}
                      fullWidth
                      sx={{ 
                        background: '#fff', 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#1565c0',
                            borderWidth: 2
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Hora de Ingreso"
                      type="time"
                      value={editData.horaIngreso}
                      onChange={e => setEditData({ ...editData, horaIngreso: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={{ 
                        background: '#fff', 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#1565c0',
                            borderWidth: 2
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Hora de Salida"
                      type="time"
                      value={editData.horaSalida}
                      onChange={e => setEditData({ ...editData, horaSalida: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={{ 
                        background: '#fff', 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#1565c0',
                            borderWidth: 2
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Cantidad de Horas Extra"
                      type="number"
                      value={editData.cantidadHorasExtra}
                      onChange={e => setEditData({ ...editData, cantidadHorasExtra: parseFloat(e.target.value) })}
                      fullWidth
                      sx={{ 
                        background: '#fff', 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#1565c0',
                            borderWidth: 2
                          }
                        }
                      }}
                      inputProps={{ min: 1, step: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: 600 }}>Tipo de Hora Extra</InputLabel>
                      <Select
                        value={editData.tipoHoraId || ''}
                        onChange={e => setEditData({ ...editData, tipoHoraId: e.target.value })}
                        label="Tipo de Hora Extra"
                        sx={{ 
                          background: '#fff', 
                          borderRadius: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          }
                        }}
                      >
                        {tiposHora.map(tipo => (
                          <MenuItem key={tipo.id} value={tipo.id}>
                            {tipo.tipo} - {tipo.denominacion} ({(tipo.valor - 1) * 100}% recargo)
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: 600 }}>Estado del Registro</InputLabel>
                      <Select
                        value={editData.estado || registroSeleccionado.estado || 'pendiente'}
                        onChange={e => setEditData({ ...editData, estado: e.target.value })}
                        label="Estado del Registro"
                        sx={{ 
                          background: '#fff', 
                          borderRadius: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          }
                        }}
                      >
                        <MenuItem value="pendiente">Pendiente</MenuItem>
                        <MenuItem value="aprobado">Aprobado</MenuItem>
                        <MenuItem value="rechazado">Rechazado</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Justificación"
                      value={editData.justificacionHoraExtra}
                      onChange={e => setEditData({ ...editData, justificacionHoraExtra: e.target.value })}
                      multiline
                      rows={4}
                      fullWidth
                      sx={{ 
                        background: '#fff', 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#1565c0',
                            borderWidth: 2
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Card>
            )}
          </Box>
        )}
      </DialogContent>
      
      {/* Footer mejorado con diseño premium */}
      <DialogActions sx={{ 
        p: 4, 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)',
        borderTop: '2px solid #e3f2fd',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Efecto de fondo */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(25, 118, 210, 0.05) 50%, transparent 70%)',
          animation: 'footerShimmer 4s ease-in-out infinite'
        }} />
        
        <Button 
          onClick={cerrarDialog} 
          variant="outlined"
          startIcon={<CancelIcon />}
          sx={{ 
            px: 5, 
            py: 2, 
            fontWeight: 700,
            borderColor: '#1976d2',
            color: '#1976d2',
            borderRadius: 3,
            borderWidth: 3,
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: 1,
            '&:hover': {
              borderColor: '#1565c0',
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              borderWidth: 3,
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)'
            }
          }}
        >
          ❌ Cerrar
        </Button>
        
        {modo === 'editar' && (
          <Button 
            onClick={handleGuardarEdicion} 
            variant="contained" 
            color="success"
            startIcon={<SaveIcon />}
            sx={{ 
              px: 5, 
              py: 2, 
              fontWeight: 800,
              borderRadius: 3,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 50%, #3d8b40 100%)',
              boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 1,
              '&:hover': {
                background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 50%, #2e7d32 100%)',
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 30px rgba(76, 175, 80, 0.5)'
              }
            }}
          >
            💾 {registroSeleccionado?.estado === 'aprobado' ? 'Cambiar Estado' : 'Guardar Cambios'}
          </Button>
        )}
        
        {/* Estilos CSS para las animaciones */}
        <style>
          {`
            @keyframes footerShimmer {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.7; }
            }
          `}
        </style>
      </DialogActions>
    </Dialog>
  );
};

export default DialogoRegistro;
