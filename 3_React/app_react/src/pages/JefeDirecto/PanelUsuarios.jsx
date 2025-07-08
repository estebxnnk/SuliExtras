import React, { useEffect, useState, useContext } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, IconButton, TablePagination, TextField, InputAdornment, Divider, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NavbarJefeDirecto from './NavbarJefeDirecto';
import { SalarioMinimoContext } from '../../providers/SalarioMinimoProvider';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, TextRun, ImageRun, AlignmentType, WidthType } from 'docx';
import SalarioMinimoEditor from '../../SalarioMinimoEditor';

function PanelUsuarios() {
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
  const [reporteData, setReporteData] = useState({ totalHoras: 0, totalPagar: 0, detalles: [] });
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
    // Buscar registros completos del usuario
    const response = await fetch(`http://localhost:3000/api/registros/usuario-completo/${usuario.id}`);
    const data = await response.json();
    const registros = Array.isArray(data.registros) ? data.registros : [];
    let totalHoras = 0;
    let totalPagar = 0;
    let detalles = [];
    registros.forEach(registro => {
      if (registro.Horas && registro.Horas.length > 0) {
        registro.Horas.forEach(hora => {
          const cantidad = hora.RegistroHora.cantidad;
          const recargo = hora.valor; // Ej: 1.25 para 25% recargo
          const valorHoraExtra = valorHoraOrdinaria * recargo;
          const valorTotal = cantidad * valorHoraExtra;
          totalHoras += cantidad;
          totalPagar += valorTotal;
          detalles.push({
            fecha: registro.fecha,
            tipo: hora.tipo,
            denominacion: hora.denominacion,
            cantidad,
            recargo,
            valorHoraExtra: valorHoraExtra.toFixed(2),
            valorTotal: valorTotal.toFixed(2)
          });
        });
      }
    });
    setReporteData({ totalHoras, totalPagar, detalles });
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
    // Cargar el logo como base64
    const logoUrl = '/img/NuevoLogo.png';
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    // Encabezados de la tabla
    const headers = [
      'Fecha', 'Tipo', 'Denominación', 'Cantidad', 'Recargo', 'Valor Hora Extra', 'Valor total'
    ];

    // Filas de datos
    const dataRows = reporteData.detalles.map(detalle => [
      detalle.fecha,
      detalle.tipo,
      detalle.denominacion,
      String(detalle.cantidad),
      ((detalle.recargo - 1) * 100).toFixed(0) + ' %',
      `$ ${Number(detalle.valorHoraExtra).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
      `$ ${Number(detalle.valorTotal).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`
    ]);

    // Fila de suma total
    const totalRow = [
      { text: 'Totales', bold: true }, '', '',
      reporteData.totalHoras.toString(), '', '',
      `$ ${reporteData.totalPagar.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`
    ];

    // Construir la tabla de docx
    const table = new DocxTable({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new DocxTableRow({
          children: headers.map(h => new DocxTableCell({
            children: [new Paragraph({ text: h, bold: true })],
            verticalAlign: 'center',
          }))
        }),
        ...dataRows.map(row => new DocxTableRow({
          children: row.map(cell => new DocxTableCell({
            children: [new Paragraph(cell)],
          }))
        })),
        new DocxTableRow({
          children: totalRow.map(cell =>
            new DocxTableCell({
              children: [
                typeof cell === 'object'
                  ? new Paragraph({ text: cell.text, bold: cell.bold })
                  : new Paragraph(cell)
              ],
            })
          )
        })
      ]
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: arrayBuffer,
                  transformation: { width: 120, height: 60 },
                })
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Reportes de hora extra de ${usuarioSeleccionado.persona?.nombres || ''} ${usuarioSeleccionado.persona?.apellidos || ''}`,
                  bold: true,
                  size: 32,
                })
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun(`Email: ${usuarioSeleccionado.email}`)
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Total de horas extra: ${reporteData.totalHoras}`,
                  bold: true,
                })
              ],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Valor total a pagar: $ ${reporteData.totalPagar.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
                  bold: true,
                })
              ],
              spacing: { after: 200 },
            }),
            table
          ]
        }
      ]
    });
    const blobWord = await Packer.toBlob(doc);
    const nombreArchivo = `Reportes de hora extra de ${usuarioSeleccionado.persona?.nombres || ''} ${usuarioSeleccionado.persona?.apellidos || ''}.docx`;
    saveAs(blobWord, nombreArchivo);
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
      <NavbarJefeDirecto />
      <Paper elevation={6} sx={{ borderRadius: 3, p: { xs: 1, sm: 2, md: 4 }, maxWidth: { xs: '100%', sm: 700, md: 1200 }, margin: { xs: '90px auto 20px auto', md: '120px auto 40px auto' }, background: 'rgba(255,255,255,0.98)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight={700} color="#222">
            Usuarios
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
          <Button variant="outlined" color="primary" sx={{ mb: 2 }} onClick={handleDescargarWord}>
            Descargar Word
          </Button>
          <Typography variant="subtitle1" fontWeight={700} color="#1976d2" sx={{ mb: 1 }}>
            Total de horas extra: {reporteData.totalHoras}
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} color="#388e3c" sx={{ mb: 2 }}>
            Valor total a pagar: $ {reporteData.totalPagar.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
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
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Recargo</TableCell>
                  <TableCell>Valor Hora Extra</TableCell>
                  <TableCell>Valor Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reporteData.detalles.map((detalle, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{detalle.fecha}</TableCell>
                    <TableCell>{detalle.tipo}</TableCell>
                    <TableCell>{detalle.denominacion}</TableCell>
                    <TableCell>{detalle.cantidad}</TableCell>
                    <TableCell>{((detalle.recargo - 1) * 100).toFixed(0)}%</TableCell>
                    <TableCell>$ {Number(detalle.valorHoraExtra).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>$ {Number(detalle.valorTotal).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</TableCell>
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

export default PanelUsuarios; 