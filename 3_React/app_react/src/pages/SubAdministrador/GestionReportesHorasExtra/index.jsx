import React, { useEffect, useState, useContext } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, IconButton, TablePagination, TextField, InputAdornment, Divider, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import NavbarSubAdmin from '../NavbarSubAdmin';
import { SalarioMinimoContext } from '../../../providers/SalarioMinimoProvider';

import SalarioMinimoEditor from '../../../SalarioMinimoEditor';

function GestionReportesHorasExtra() {
  const [usuarios, setUsuarios] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [openRegistros, setOpenRegistros] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [loadingRegistros, setLoadingRegistros] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [openReporte, setOpenReporte] = useState(false);
  const [reporteData, setReporteData] = useState({ totalHorasDivididas: 0, totalPagarDivididas: 0, totalHorasBono: 0, totalPagarBono: 0, totalPagar: 0, detalles: [] });
  const { salarioMinimo } = useContext(SalarioMinimoContext);
  const valorHoraOrdinaria = salarioMinimo / 240;
  const [openSalario, setOpenSalario] = useState(false);

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
    // Buscar registros por id de usuario
    const response = await fetch(`http://localhost:3000/api/registros/usuario-completo/${usuario.id}`);
    const data = await response.json();
    setRegistros(Array.isArray(data.registros) ? data.registros : []);
    setLoadingRegistros(false);
  };

  const handleVerReporte = async (usuario) => {
    const response = await fetch(`http://localhost:3000/api/registros/usuario-completo/${usuario.id}`);
    const data = await response.json();
    const registros = Array.isArray(data.registros) ? data.registros.filter(r => r.estado === 'aprobado') : [];
    let totalHorasDivididas = 0;
    let totalPagarDivididas = 0;
    let totalHorasBono = 0;
    let totalPagarBono = 0;
    let detalles = [];
    registros.forEach(registro => {
      if (registro.Horas && registro.Horas.length > 0) {
        registro.Horas.forEach(hora => {
          const cantidadDividida = registro.horas_extra_divididas ?? 0;
          const cantidadBono = registro.bono_salarial ?? 0;
          const recargo = hora.valor;
          const valorHoraExtra = valorHoraOrdinaria * recargo;
          const valorTotalDivididas = cantidadDividida * valorHoraExtra;
          const valorTotalBono = cantidadBono * valorHoraOrdinaria;

          totalHorasDivididas += cantidadDividida;
          totalPagarDivididas += valorTotalDivididas;
          totalHorasBono += cantidadBono;
          totalPagarBono += valorTotalBono;

          detalles.push({
            fecha: registro.fecha,
            tipo: hora.tipo,
            denominacion: hora.denominacion,
            cantidadDividida,
            valorTotalDivididas: valorTotalDivididas.toFixed(2),
            cantidadBono,
            valorTotalBono: valorTotalBono.toFixed(2),
            recargo,
            valorHoraExtra: valorHoraExtra.toFixed(2),
            registroOriginal: registro
          });
        });
      }
    });

    // LOG para depuración
    console.log("Detalles del reporte:", detalles);
    console.log("Totales:", {
      totalHorasDivididas,
      totalPagarDivididas,
      totalHorasBono,
      totalPagarBono,
      totalPagar: totalPagarDivididas + totalPagarBono
    });

    setReporteData({
      totalHorasDivididas,
      totalPagarDivididas,
      totalHorasBono,
      totalPagarBono,
      totalPagar: totalPagarDivididas + totalPagarBono,
      detalles
    });
    setUsuarioSeleccionado(usuario);
    setOpenReporte(true);
  };

  // Filtro de búsqueda
  const usuariosFiltrados = usuarios.filter(u => {
    const texto = search.toLowerCase();
    return (
      (u.persona?.nombres || '').toLowerCase().includes(texto) ||
      (u.persona?.apellidos || '').toLowerCase().includes(texto) ||
      (u.persona?.numeroDocumento || '').toString().includes(texto) ||
      (u.email || '').toLowerCase().includes(texto)
    );
  });

  // Paginación
  useEffect(() => { setPage(0); }, [search]);
  const usuariosPagina = usuariosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDescargarWord = async () => {
    try {
      const { descargarWord } = await import('./utils');
      await descargarWord(reporteData, usuarioSeleccionado);
    } catch (error) {
      console.error('Error al descargar Word:', error);
    }
  };

  const handleDescargarExcel = async () => {
    try {
      const { descargarExcel } = await import('./utils');
      await descargarExcel(reporteData, usuarioSeleccionado);
    } catch (error) {
      console.error('Error al descargar Excel:', error);
    }
  };

  return (
    <Box
      minHeight="100vh"
      width="100vw"
      sx={{
        background: "url('/img/Recepcion.jpg') no-repeat center center",
        backgroundSize: 'cover',
        p: { xs: 1, sm: 2, md: 4 }
      }}
    >
      <NavbarSubAdmin />
      <Paper elevation={6} sx={{ borderRadius: 3, p: { xs: 1, sm: 2, md: 4 }, maxWidth: { xs: '100%', sm: 700, md: 1200 }, margin: { xs: '90px auto 20px auto', md: '120px auto 40px auto' }, background: 'rgba(255,255,255,0.98)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight={700} color="#222">
            Gestión de Reportes de Horas Extra
          </Typography>
          <Button variant="outlined" color="secondary" onClick={() => setOpenSalario(true)}>
            Editar salario mínimo
          </Button>
        </Box>
        <TextField
          placeholder="Buscar por nombre, apellido, documento o email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
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
              {usuariosPagina.map(usuario => (
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
                    <IconButton onClick={() => handleVerReporte(usuario)} title="Ver reporte general" sx={{ color: '#ff9800' }}>
                      <ReceiptLongIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {usuariosPagina.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No se encontraron usuarios.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={usuariosFiltrados.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
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
                    <TableCell>Tipo(s) de Hora</TableCell>
                    <TableCell>Justificación</TableCell>
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
                      <TableCell>
                        {registro.Horas && registro.Horas.length > 0 ? (
                          registro.Horas.map(hora => (
                            <Box key={hora.id}>
                              <Typography variant="body2" fontWeight={600}>{hora.tipo}</Typography>
                              <Typography variant="caption" color="text.secondary">{hora.denominacion}</Typography>
                              <Typography variant="caption" color="text.secondary">Cantidad: {hora.RegistroHora.cantidad}</Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">No asignado</Typography>
                        )}
                      </TableCell>
                      <TableCell>{registro.justificacionHoraExtra}</TableCell>
                      <TableCell>{registro.estado}</TableCell>
                    </TableRow>
                  ))}
                  {registros.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No hay registros de horas extra para este usuario.<br/>
                        {usuarioSeleccionado && (
                          <span>Usuario: <b>{usuarioSeleccionado.persona?.nombres} {usuarioSeleccionado.persona?.apellidos}</b> ({usuarioSeleccionado.email})</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de reporte general de horas extra */}
      <Dialog open={openReporte} onClose={() => setOpenReporte(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          Reporte General de Horas Extra
          <IconButton onClick={() => setOpenReporte(false)} sx={{ ml: 'auto' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {usuarioSeleccionado && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {usuarioSeleccionado.persona?.nombres} {usuarioSeleccionado.persona?.apellidos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {usuarioSeleccionado.email}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DescriptionOutlinedIcon />}
              onClick={handleDescargarWord}
            >
              Descargar Word
            </Button>
            <Button
              variant="outlined"
              color="success"
              startIcon={<TableChartOutlinedIcon />}
              onClick={handleDescargarExcel}
            >
              Descargar Excel
            </Button>
          </Box>
          <Typography variant="subtitle1" fontWeight={700} color="#1976d2" sx={{ mb: 1 }}>
            Total horas extra (reporte): {reporteData.totalHorasDivididas} &nbsp;|&nbsp; Valor: $ {reporteData.totalPagarDivididas.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} color="#ff9800" sx={{ mb: 1 }}>
            Total bono salarial (horas): {reporteData.totalHorasBono} &nbsp;|&nbsp; Valor: $ {reporteData.totalPagarBono.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} color="#388e3c" sx={{ mb: 2 }}>
            <u>Total a pagar:</u> $ {reporteData.totalPagar.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Detalle por registro:</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Denominación</TableCell>
                  <TableCell>Horas Extra (reporte)</TableCell>
                  <TableCell>Valor Horas Extra</TableCell>
                  <TableCell>Bono Salarial (horas)</TableCell>
                  <TableCell>Valor Bono Salarial</TableCell>
                  <TableCell>Recargo</TableCell>
                  <TableCell>Valor Hora Extra</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reporteData.detalles.map((detalle, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{detalle.fecha}</TableCell>
                    <TableCell>{detalle.tipo}</TableCell>
                    <TableCell>{detalle.denominacion}</TableCell>
                    <TableCell>{detalle.cantidadDividida}</TableCell>
                    <TableCell>$ {Number(detalle.valorTotalDivididas).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>{detalle.cantidadBono}</TableCell>
                    <TableCell>$ {Number(detalle.valorTotalBono).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>{((detalle.recargo - 1) * 100).toFixed(0)}%</TableCell>
                    <TableCell>$ {Number(detalle.valorHoraExtra).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      <Dialog open={openSalario} onClose={() => setOpenSalario(false)} maxWidth="xs" fullWidth>
        <SalarioMinimoEditor onClose={() => setOpenSalario(false)} />
      </Dialog>
    </Box>
  );
}

export default GestionReportesHorasExtra;
