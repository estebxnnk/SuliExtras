import { Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, MenuItem, Avatar, Divider, Chip, Card, CardContent, Grid, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import NavbarSubAdmin from '../NavbarSubAdmin';
import { useGestionarRegistrosHorasExtra } from './hooks/useGestionarRegistrosHorasExtra';
import Filtros from './components/Filtros';
import RegistrosTable from './components/RegistrosTable';
import LoadingSpinner from './components/LoadingSpinner';

function GestionarRegistrosHorasExtra() {
  const {
    registros,
    tiposHora,
    usuarios,
    loading,
    mensaje,
    openDialog,
    registroSeleccionado,
    modo,
    editData,
    nuevoEstado,
    search,
    filtroEstado,
    confirmDialog,
    page,
    rowsPerPage,
    handleVer,
    handleEditar,
    handleAprobar,
    handleRechazar,
    handleEliminar,
    handleGuardarEdicion,
    handleGuardarEstado,
    handleChangePage,
    handleChangeRowsPerPage,
    showConfirmDialog,
    handleConfirmAction,
    setSearch,
    setFiltroEstado,
    setMensaje
  } = useGestionarRegistrosHorasExtra();

  const navigate = useNavigate();

  // Filtro de búsqueda y estado
  const registrosFiltrados = registros.filter(r => {
    const cumpleBusqueda = 
      (r.usuario && r.usuario.toLowerCase().includes(search.toLowerCase())) ||
      (r.numRegistro && r.numRegistro.toLowerCase().includes(search.toLowerCase())) ||
      (r.ubicacion && r.ubicacion.toLowerCase().includes(search.toLowerCase()));
    
    const cumpleEstado = filtroEstado === 'todos' || r.estado === filtroEstado;
    
    return cumpleBusqueda && cumpleEstado;
  });

  // Paginación
  const registrosPaginados = registrosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box minHeight="100vh" width="100vw" sx={{ background: "url('/img/Recepcion.jpg') no-repeat center center", backgroundSize: 'cover', p: 4 }}>
      <NavbarSubAdmin />
      <Paper elevation={8} sx={{ 
        borderRadius: 4, 
        p: 4, 
        maxWidth: 1400, 
        margin: '120px auto 40px auto', 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,248,255,0.98) 100%)',
        border: '1px solid rgba(25, 118, 210, 0.2)',
        position: 'relative',
        backdropFilter: 'blur(10px)', 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <AccessTimeIcon sx={{ fontSize: 48, color: '#1976d2' }} />
          <Box>
            <Typography variant="h3" fontWeight={800} color="#1976d2" sx={{ 
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Gestión de Registros de Horas Extra
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
              Administra y gestiona todos los registros de horas extra del sistema
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          sx={{ 
            position: 'absolute', 
            right: 32, 
            top: 32, 
            fontWeight: 700, 
            borderRadius: 3, 
            fontSize: 16, 
            zIndex: 10,
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
            },
            transition: 'all 0.3s ease'
          }}
          onClick={() => navigate('/subadmin/crear-registros-horas-extra')}
        >
          Crear Nuevo Registro
        </Button>
        
        <Filtros 
          search={search} 
          setSearch={setSearch} 
          filtroEstado={filtroEstado} 
          setFiltroEstado={setFiltroEstado} 
        />

        {mensaje && <Alert severity="info" sx={{ mb: 2 }}>{mensaje}</Alert>}
        
        <RegistrosTable
          registros={registrosPaginados}
          tiposHora={tiposHora}
          usuarios={usuarios}
          loading={loading}
          handleVer={handleVer}
          handleEditar={handleEditar}
          handleAprobar={handleAprobar}
          handleRechazar={handleRechazar}
          handleEliminar={handleEliminar}
        />
        <Paper elevation={2} sx={{ 
          mt: 3, 
          borderRadius: 2, 
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(25, 118, 210, 0.1)'
        }}>
          <TablePagination
            component="div"
            count={registrosFiltrados.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontWeight: 600,
                color: '#1976d2'
              },
              '& .MuiTablePagination-select': {
                borderRadius: 1,
                '&:focus': {
                  background: 'rgba(25, 118, 210, 0.1)'
                }
              }
            }}
          />
        </Paper>
      </Paper>

      {/* Dialogo para ver/editar registro */}
      <Dialog open={openDialog} onClose={() => setMensaje('')} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {modo === 'ver' && <AccessTimeIcon sx={{ fontSize: 36, color: '#1976d2' }} />}
          {modo === 'ver' ? 'Detalles del Registro' : modo === 'editar' ? 'Editar Registro' : 'Cambiar Estado del Registro'}
        </DialogTitle>
        <DialogContent sx={{ background: modo === 'ver' ? '#f3f7fa' : 'inherit', borderRadius: 2 }}>
          {registroSeleccionado && modo === 'ver' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 72, height: 72, bgcolor: '#1976d2', mb: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 48, color: '#fff' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={700} color="#222" mb={1}>
                Registro #{registroSeleccionado.numRegistro}
              </Typography>
              <Divider sx={{ width: '100%', mb: 2 }} />
              
              {/* Buscar el usuario correspondiente */}
              {(() => {
                const usuario = usuarios.find(u => u.email === registroSeleccionado.usuario);
                return (
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%' }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Empleado</Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {usuario?.persona?.nombres || registroSeleccionado.nombres || 'N/A'} {usuario?.persona?.apellidos || registroSeleccionado.apellidos || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {usuario?.persona?.tipoDocumento || registroSeleccionado.tipoDocumento || 'N/A'}: {usuario?.persona?.numeroDocumento || registroSeleccionado.numeroDocumento || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {registroSeleccionado.usuario}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Fecha</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.fecha}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Hora de Ingreso</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.horaIngreso}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Hora de Salida</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.horaSalida}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Ubicación</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.ubicacion}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Horas Extra</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.cantidadHorasExtra} horas</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Tipo(s) de Hora</Typography>
                      {registroSeleccionado.Horas && registroSeleccionado.Horas.length > 0 ? (
                        registroSeleccionado.Horas.map(hora => (
                          <Box key={hora.id}>
                            <Typography variant="body1" fontWeight={600}>{hora.tipo}</Typography>
                            <Typography variant="caption" color="text.secondary">{hora.denominacion} ({(hora.valor - 1) * 100}% recargo)</Typography>
                            <Typography variant="caption" color="text.secondary">Cantidad: {hora.RegistroHora.cantidad}</Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body1" fontWeight={600} color="text.secondary">No asignado</Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
                      {getEstadoChip(registroSeleccionado.estado)}
                    </Box>
                    {/* CAMPOS NUEVOS CON EL MISMO DISEÑO */}
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Horas Extra (reporte)</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.horas_extra_divididas ?? 0} horas</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Bono Salarial</Typography>
                      <Typography variant="body1" fontWeight={600}>{registroSeleccionado.bono_salarial ?? 0} horas</Typography>
                    </Box>
                  </Box>
                );
              })()}
              
              {registroSeleccionado.justificacionHoraExtra && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Justificación</Typography>
                  <Typography variant="body1" sx={{ mt: 1, p: 2, background: '#f5f5f5', borderRadius: 1 }}>
                    {registroSeleccionado.justificacionHoraExtra}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          {registroSeleccionado && modo === 'estado' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Typography variant="h6" fontWeight={600} color="#1976d2" mb={2}>
                Registro #{registroSeleccionado.numRegistro}
              </Typography>
              {(() => {
                const usuario = usuarios.find(u => u.email === registroSeleccionado.usuario);
                return (
                  <>
                    <Typography variant="body1" mb={2}>
                      <strong>Empleado:</strong> {usuario?.persona?.nombres || registroSeleccionado.nombres || 'N/A'} {usuario?.persona?.apellidos || registroSeleccionado.apellidos || 'N/A'}
                    </Typography>
                    <Typography variant="body2" mb={1} color="text.secondary">
                      <strong>Documento:</strong> {usuario?.persona?.tipoDocumento || registroSeleccionado.tipoDocumento || 'N/A'}: {usuario?.persona?.numeroDocumento || registroSeleccionado.numeroDocumento || 'N/A'}
                    </Typography>
                    <Typography variant="body2" mb={2} color="text.secondary">
                      <strong>Email:</strong> {registroSeleccionado.usuario}
                    </Typography>
                  </>
                );
              })()}
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Este registro ya ha sido procesado. Solo puedes cambiar su estado.
                </Typography>
              </Alert>
              <TextField
                select
                label="Nuevo Estado"
                value={nuevoEstado}
                onChange={e => setMensaje(e.target.value)}
                fullWidth
                required
              >
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="aprobado">Aprobado</MenuItem>
                <MenuItem value="rechazado">Rechazado</MenuItem>
              </TextField>
            </Box>
          )}
          
          {registroSeleccionado && modo === 'editar' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <Card sx={{ p: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)', border: '1px solid #dee2e6' }}>
                <Typography variant="h6" fontWeight={700} color="#495057" sx={{ mb: 3 }}>
                  Información del Registro
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Fecha"
                      type="date"
                      value={editData.fecha}
                      onChange={e => setMensaje({ ...editData, fecha: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Ubicación"
                      value={editData.ubicacion}
                      onChange={e => setMensaje({ ...editData, ubicacion: e.target.value })}
                      fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Hora de Ingreso"
                      type="time"
                      value={editData.horaIngreso}
                      onChange={e => setMensaje({ ...editData, horaIngreso: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Hora de Salida"
                      type="time"
                      value={editData.horaSalida}
                      onChange={e => setMensaje({ ...editData, horaSalida: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Cantidad de Horas Extra"
                      type="number"
                      value={editData.cantidadHorasExtra}
                      onChange={e => setMensaje({ ...editData, cantidadHorasExtra: parseFloat(e.target.value) })}
                      fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                      inputProps={{ min: 1, step: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Tipo de Hora Extra"
                      value={editData.tipoHora || ''}
                      onChange={e => setMensaje({ ...editData, tipoHora: e.target.value })}
                      fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                    >
                      {tiposHora.map(tipo => (
                        <MenuItem key={tipo.id} value={tipo.id}>
                          {tipo.tipo} - {tipo.denominacion} ({(tipo.valor - 1) * 100}% recargo)
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Horas Extra (reporte)"
                      type="number"
                      value={editData.horas_extra_divididas ?? 0}
                      onChange={e => setMensaje({ ...editData, horas_extra_divididas: parseFloat(e.target.value) })}
                      fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                      inputProps={{ min: 0, step: 0.01 }}
                      helperText="Máximo 2 horas por registro para reporte"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Justificación"
                      value={editData.justificacionHoraExtra}
                      onChange={e => setMensaje({ ...editData, justificacionHoraExtra: e.target.value })}
                      multiline
                      rows={3}
                      fullWidth
                      sx={{ background: '#fff', borderRadius: 2 }}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMensaje('')}>Cerrar</Button>
          {modo === 'editar' && (
            <Button onClick={handleGuardarEdicion} variant="contained" color="success">
              Guardar
            </Button>
          )}
          {modo === 'estado' && (
            <Button onClick={handleGuardarEstado} variant="contained" color="primary">
              Cambiar Estado
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmación Personalizado */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => setMensaje('')}
        maxWidth="sm" 
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <Card sx={{ 
            background: confirmDialog.action === 'eliminar' 
              ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)' 
              : confirmDialog.action === 'aprobar'
              ? 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)'
              : 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
            border: confirmDialog.action === 'eliminar' 
              ? '2px solid #f44336' 
              : confirmDialog.action === 'aprobar'
              ? '2px solid #4caf50'
              : '2px solid #ff9800'
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                {confirmDialog.action === 'eliminar' ? (
                  <WarningIcon sx={{ fontSize: 64, color: '#f44336' }} />
                ) : confirmDialog.action === 'aprobar' ? (
                  <CheckCircleIcon sx={{ fontSize: 64, color: '#4caf50' }} />
                ) : (
                  <CancelIcon sx={{ fontSize: 64, color: '#ff9800' }} />
                )}
              </Box>
              
              <Typography variant="h5" fontWeight={700} mb={2} color="#333">
                {confirmDialog.action === 'eliminar' ? 'Confirmar Eliminación' :
                 confirmDialog.action === 'aprobar' ? 'Confirmar Aprobación' : 'Confirmar Rechazo'}
              </Typography>
              
              <Typography variant="body1" mb={3} color="#666">
                ¿Estás seguro que deseas{' '}
                <strong>
                  {confirmDialog.action === 'eliminar' ? 'ELIMINAR' :
                   confirmDialog.action === 'aprobar' ? 'APROBAR' : 'RECHAZAR'}
                </strong>{' '}
                el registro del empleado{' '}
                <strong>
                  {confirmDialog.registro?.persona?.nombres} {confirmDialog.registro?.persona?.apellidos}
                </strong>?
              </Typography>
              
              {confirmDialog.action === 'eliminar' && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight={600}>
                    ⚠️ Esta acción no se puede deshacer
                  </Typography>
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setMensaje('')}
                  sx={{ px: 4, py: 1.5, fontWeight: 600 }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirmAction}
                  sx={{ 
                    px: 4, 
                    py: 1.5, 
                    fontWeight: 600,
                    background: confirmDialog.action === 'eliminar' 
                      ? '#f44336' 
                      : confirmDialog.action === 'aprobar'
                      ? '#4caf50'
                      : '#ff9800',
                    '&:hover': {
                      background: confirmDialog.action === 'eliminar' 
                        ? '#d32f2f' 
                        : confirmDialog.action === 'aprobar'
                        ? '#388e3c'
                        : '#f57c00'
                    }
                  }}
                >
                  {confirmDialog.action === 'eliminar' ? 'Eliminar' :
                   confirmDialog.action === 'aprobar' ? 'Aprobar' : 'Rechazar'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default GestionarRegistrosHorasExtra; 