import React, { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const TablaResumenDescarga = ({
  registrosFiltrados = [],
  registrosAprobadosTodos = [],
  valorHoraOrdinaria = 0,
  tipoHoraSeleccionado = null,
  filtrosActivos = false,
  onComputed
}) => {
  // Conmutador entre dataset filtrado del diálogo o todos aprobados
  const [modoVista, setModoVista] = useState(filtrosActivos ? 'filtrados' : 'aprobados');
  const dataset = useMemo(() => {
    const base = (filtrosActivos && modoVista === 'filtrados') ? registrosFiltrados : registrosAprobadosTodos;
    return Array.isArray(base) ? base : [];
  }, [filtrosActivos, modoVista, registrosFiltrados, registrosAprobadosTodos]);
  // Normalizar estructura de registros (acepta 'Horas' del backend o 'horas' locales)
  const registrosAprobados = useMemo(() => {
    const aprobados = (dataset || []).filter(r => r.estado === 'aprobado');
    return aprobados;
  }, [dataset]);

  // Construir filas de detalle (una por combinación registro/hora)
  const detalles = useMemo(() => {
    const rows = [];
    registrosAprobados.forEach(registro => {
      const horasArray = Array.isArray(registro.Horas) ? registro.Horas : (registro.horas || []);
      horasArray.forEach(hora => {
        // Compatibilidad de propiedades
        const cantidadDividida = registro.horas_extra_divididas ?? hora?.RegistroHora?.cantidad ?? hora?.cantidad ?? 0;
        const cantidadBono = registro.bono_salarial ?? 0;
        const recargo = (hora?.valor ?? hora?.tipoHora?.valor ?? 1);
        const valorHoraExtra = valorHoraOrdinaria * recargo;
        const valorTotalDivididas = cantidadDividida * valorHoraExtra;
        const valorTotalBono = cantidadBono * valorHoraOrdinaria;

        // Filtro por tipo de hora si aplica
        if (tipoHoraSeleccionado && tipoHoraSeleccionado !== 'todos') {
          const horaId = String(hora?.id ?? hora?.tipoHoraId);
          if (String(tipoHoraSeleccionado) !== horaId) return;
        }

        rows.push({
          fecha: registro.fecha,
          tipo: hora?.tipo || hora?.tipoHora?.tipo || '',
          denominacion: hora?.denominacion || hora?.tipoHora?.denominacion || '',
          cantidadDividida: Number(cantidadDividida) || 0,
          valorTotalDivididas,
          cantidadBono: Number(cantidadBono) || 0,
          valorTotalBono,
          recargo,
          valorHoraExtra
        });
      });
    });
    return rows;
  }, [registrosAprobados, valorHoraOrdinaria, tipoHoraSeleccionado]);

  // Filtros internos de la tabla de detalles
  const [query, setQuery] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [fechaIni, setFechaIni] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const tiposDisponibles = useMemo(() => {
    const setTipos = new Set();
    detalles.forEach(d => setTipos.add(`${d.tipo}${d.denominacion ? ' - ' + d.denominacion : ''}`));
    return Array.from(setTipos);
  }, [detalles]);

  const detallesFiltrados = useMemo(() => {
    return detalles.filter(d => {
      const texto = `${d.tipo} ${d.denominacion}`.toLowerCase();
      const qOk = !query || texto.includes(query.toLowerCase());
      const tLabel = `${d.tipo}${d.denominacion ? ' - ' + d.denominacion : ''}`;
      const tipoOk = tipoFiltro === 'todos' || tLabel === tipoFiltro;
      const fechaOk = (() => {
        if (!fechaIni && !fechaFin) return true;
        const dte = d.fecha ? new Date(d.fecha) : null;
        if (!dte) return false;
        const sOk = !fechaIni || dte >= new Date(fechaIni);
        const eOk = !fechaFin || dte <= new Date(fechaFin);
        return sOk && eOk;
      })();
      return qOk && tipoOk && fechaOk;
    });
  }, [detalles, query, tipoFiltro, fechaIni, fechaFin]);

  // Totales
  const totales = useMemo(() => {
    return detallesFiltrados.reduce((acc, d) => {
      acc.totalHorasDivididas += d.cantidadDividida;
      acc.totalPagarDivididas += d.valorTotalDivididas;
      acc.totalHorasBono += d.cantidadBono;
      acc.totalPagarBono += d.valorTotalBono;
      acc.totalPagar = acc.totalPagarDivididas + acc.totalPagarBono;
      return acc;
    }, { totalHorasDivididas: 0, totalPagarDivididas: 0, totalHorasBono: 0, totalPagarBono: 0, totalPagar: 0 });
  }, [detallesFiltrados]);

  // Emitir al padre el dataset computado para descarga
  React.useEffect(() => {
    if (typeof onComputed === 'function') {
      onComputed({
        totalHorasDivididas: totales.totalHorasDivididas,
        totalPagarDivididas: totales.totalPagarDivididas,
        totalHorasBono: totales.totalHorasBono,
        totalPagarBono: totales.totalPagarBono,
        totalPagar: totales.totalPagar,
        detalles: detallesFiltrados.map(d => ({
          fecha: d.fecha,
          tipo: d.tipo,
          denominacion: d.denominacion,
          cantidadDividida: d.cantidadDividida,
          valorTotalDivididas: d.valorTotalDivididas,
          cantidadBono: d.cantidadBono,
          valorTotalBono: d.valorTotalBono,
          recargo: d.recargo,
          valorHoraExtra: d.valorHoraExtra
        }))
      });
    }
  }, [onComputed, totales, detallesFiltrados]);

  const totalRegistros = registrosAprobados.length;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)',
        border: '2px solid rgba(25, 118, 210, 0.2)',
        borderRadius: 3
      }}
    >
      {/* Header del resumen */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AssessmentIcon sx={{ color: '#1976d2', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={700} color="#1976d2">
          Resumen para Descarga
        </Typography>
        <Chip
          icon={<CheckIcon />}
          label={`${totalRegistros} registros aprobados`}
          color="success"
          size="small"
          sx={{ fontWeight: 600 }}
        />
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Chip
            label="Filtrados"
            color={modoVista === 'filtrados' ? 'primary' : 'default'}
            variant={modoVista === 'filtrados' ? 'filled' : 'outlined'}
            size="small"
            onClick={() => setModoVista('filtrados')}
            disabled={!filtrosActivos}
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label="Todos aprobados"
            color={modoVista === 'aprobados' ? 'primary' : 'default'}
            variant={modoVista === 'aprobados' ? 'filled' : 'outlined'}
            size="small"
            onClick={() => setModoVista('aprobados')}
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Box>

      {/* KPIs principales */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.2) 100%)',
            border: '2px solid rgba(76, 175, 80, 0.3)',
            minWidth: 150
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TimeIcon sx={{ color: '#4caf50' }} />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Total Horas
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight={700} color="#4caf50">
            {totales.totalHorasDivididas.toFixed(2)}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.2) 100%)',
            border: '2px solid rgba(33, 150, 243, 0.3)',
            minWidth: 150
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <MoneyIcon sx={{ color: '#2196f3' }} />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Valor Total
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight={700} color="#2196f3">
            ${totales.totalPagarDivididas.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Controles de filtro de la tabla de detalles */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2, mb: 2 }}>
        <TextField label="Buscar tipo/denominación" value={query} onChange={(e) => setQuery(e.target.value)} size="small" />
        <FormControl size="small">
          <InputLabel>Tipo de Hora</InputLabel>
          <Select label="Tipo de Hora" value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
            <MenuItem value="todos"><em>Todos</em></MenuItem>
            {tiposDisponibles.map(t => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Fecha inicio" type="date" value={fechaIni} onChange={(e) => setFechaIni(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
        <TextField label="Fecha fin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
      </Box>

      {/* Tabla de resumen por tipo de hora */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Desglose por Tipo de Hora Extra
      </Typography>
      
      <TableContainer sx={{ maxHeight: 320 }}>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '& th': {
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  borderBottom: '2px solid rgba(255,255,255,0.2)'
                }
              }}
            >
              <TableCell>Tipo de Hora</TableCell>
              <TableCell align="center">Cantidad (hrs)</TableCell>
              <TableCell align="center">Valor por Hora</TableCell>
              <TableCell align="right">Valor Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(
              detallesFiltrados.reduce((acc, d) => {
                const key = `${d.tipo}-${d.denominacion}` || 'sin-tipo';
                if (!acc[key]) {
                  acc[key] = { nombre: `${d.tipo}${d.denominacion ? ' - ' + d.denominacion : ''}`, cantidad: 0, valor: 0 };
                }
                acc[key].cantidad += d.cantidadDividida;
                acc[key].valor += d.valorTotalDivididas;
                return acc;
              }, {})
            ).map((tipo, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    background: 'rgba(25, 118, 210, 0.05)'
                  },
                  '&:nth-of-type(even)': {
                    background: 'rgba(25, 118, 210, 0.02)'
                  }
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {tipo.nombre}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" color="text.primary">
                    {tipo.cantidad.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" color="text.secondary">
                    ${tipo.cantidad > 0 ? (tipo.valor / tipo.cantidad).toLocaleString('es-CO', { minimumFractionDigits: 2 }) : '0'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600} color="#1976d2">
                    ${tipo.valor.toLocaleString('es-CO')}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      {/* Tabla de detalle por registro (con scroll) */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Detalle por registro
      </Typography>
      <TableContainer sx={{ maxHeight: 300 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(135deg, #43a047, #2e7d32)', '& th': { color: 'white', fontWeight: 700 } }}>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Denominación</TableCell>
              <TableCell align="center">Horas Extra (reporte)</TableCell>
              <TableCell align="right">Valor Horas Extra</TableCell>
              <TableCell align="center">Bono Salarial (horas)</TableCell>
              <TableCell align="right">Valor Bono Salarial</TableCell>
              <TableCell align="center">Recargo</TableCell>
              <TableCell align="right">Valor Hora Extra</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detallesFiltrados.map((d, idx) => (
              <TableRow key={idx} sx={{ '&:nth-of-type(even)': { background: 'rgba(67, 160, 71, 0.04)' } }}>
                <TableCell>{d.fecha}</TableCell>
                <TableCell>{d.tipo}</TableCell>
                <TableCell>{d.denominacion}</TableCell>
                <TableCell align="center">{d.cantidadDividida}</TableCell>
                <TableCell align="right">${Number(d.valorTotalDivididas).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell align="center">{d.cantidadBono}</TableCell>
                <TableCell align="right">${Number(d.valorTotalBono).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell align="center">{((d.recargo - 1) * 100).toFixed(0)}%</TableCell>
                <TableCell align="right">${Number(d.valorHoraExtra).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</TableCell>
              </TableRow>) )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Información adicional */}
      <Box sx={{ mt: 3, p: 2, background: 'rgba(25, 118, 210, 0.05)', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          <strong>Nota:</strong> Solo se incluyen registros con estado "Aprobado" en la descarga. 
          Los registros pendientes o rechazados no se incluirán en el reporte final.
        </Typography>
      </Box>
    </Paper>
  );
};

export default TablaResumenDescarga;
