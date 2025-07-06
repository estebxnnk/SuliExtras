import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CloseIcon from '@mui/icons-material/Close';

function PanelUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [openRegistros, setOpenRegistros] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [loadingRegistros, setLoadingRegistros] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    const response = await fetch('http://localhost:3000/api/usuarios');
    const data = await response.json();
    // Ordenar por fecha de creación descendente
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setUsuarios(data);
  };

  const handleVerDetalles = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setOpenDialog(true);
  };

  const handleVerRegistros = async (usuario) => {
    setLoadingRegistros(true);
    setUsuarioSeleccionado(usuario);
    setOpenRegistros(true);
    // Buscar registros por email
    const response = await fetch(`http://localhost:3000/api/registros?usuario=${usuario.email}`);
    const data = await response.json();
    setRegistros(data);
    setLoadingRegistros(false);
  };

  return (
    <Box minHeight="100vh" sx={{ background: '#f3f7fa', p: 4 }}>
      <Paper elevation={6} sx={{ borderRadius: 3, p: 4, maxWidth: 1200, margin: '120px auto 40px auto', background: 'rgba(255,255,255,0.98)' }}>
        <Typography variant="h4" fontWeight={700} mb={2} color="#222">
          Usuarios
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#e3f2fd' }}>
                <TableCell>Nombres</TableCell>
                <TableCell>Apellidos</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map(usuario => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.persona?.nombres}</TableCell>
                  <TableCell>{usuario.persona?.apellidos}</TableCell>
                  <TableCell>{usuario.persona?.tipoDocumento}: {usuario.persona?.numeroDocumento}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.createdAt ? new Date(usuario.createdAt).toLocaleDateString() : ''}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleVerDetalles(usuario)} title="Ver detalles" sx={{ color: '#1976d2' }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleVerRegistros(usuario)} title="Ver registros de horas extra" sx={{ color: '#388e3c' }}>
                      <ListAltIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Diálogo de detalles de usuario */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          Detalles del Usuario
          <IconButton onClick={() => setOpenDialog(false)} sx={{ ml: 'auto' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {usuarioSeleccionado && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                {usuarioSeleccionado.persona?.nombres} {usuarioSeleccionado.persona?.apellidos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Documento:</strong> {usuarioSeleccionado.persona?.tipoDocumento}: {usuarioSeleccionado.persona?.numeroDocumento}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {usuarioSeleccionado.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Fecha de creación:</strong> {usuarioSeleccionado.createdAt ? new Date(usuarioSeleccionado.createdAt).toLocaleString() : ''}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de registros de horas extra */}
      <Dialog open={openRegistros} onClose={() => setOpenRegistros(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          Registros de Horas Extra
          <IconButton onClick={() => setOpenRegistros(false)} sx={{ ml: 'auto' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loadingRegistros ? (
            <Typography>Cargando registros...</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Hora Ingreso</TableCell>
                    <TableCell>Hora Salida</TableCell>
                    <TableCell>Ubicación</TableCell>
                    <TableCell>Horas Extra</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registros.map(registro => (
                    <TableRow key={registro.id}>
                      <TableCell>{registro.fecha}</TableCell>
                      <TableCell>{registro.horaIngreso}</TableCell>
                      <TableCell>{registro.horaSalida}</TableCell>
                      <TableCell>{registro.ubicacion}</TableCell>
                      <TableCell>{registro.cantidadHorasExtra}</TableCell>
                      <TableCell>{registro.estado}</TableCell>
                    </TableRow>
                  ))}
                  {registros.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No hay registros de horas extra para este usuario.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default PanelUsuarios; 