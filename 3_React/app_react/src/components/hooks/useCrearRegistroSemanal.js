import { useEffect, useMemo, useRef, useState } from 'react';
import {
  emptyRow,
  calcularHorasExtraRow,
  validateRow,
  validateNoOverlaps,
  addDays,
  formatDate,
  isWeekend,
  computeWeekFromMondayStr,
  parseLocalISODate,
  toMondayDateString
} from '../utils/horasExtrasUtils';
import { registrosHorasExtraService } from '../services/registrosHorasExtraService';

/**
 * Hook para manejar toda la lógica del diálogo de creación semanal de registros
 */
export const useCrearRegistroSemanal = ({ usuarios = [], onCrearRegistrosBulk, onClose, loadingProp = false }) => {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [rows, setRows] = useState([emptyRow()]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [genOpts, setGenOpts] = useState({
    fechaInicio: '',
    dias: 5,
    soloHabiles: true,
    horaIngreso: '',
    horaSalida: '',
    ubicacion: '',
    tipoHoraId: '',
    justificacionHoraExtra: ''
  });
  const [vistaSemanal, setVistaSemanal] = useState(true);
  const [fechaLunes, setFechaLunes] = useState('');
  const [weekRows, setWeekRows] = useState([
    emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow()
  ]);
  const [weekInclude, setWeekInclude] = useState([true, true, true, true, true, true, true]);

  // Ancho del contenedor para virtualización
  const tableContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);

  const usuarioId = useMemo(() => usuarioSeleccionado?.id || null, [usuarioSeleccionado]);

  const handleUsuarioChange = (usuarioIdValue) => {
    const usuario = usuarios.find(u => u.id === usuarioIdValue) || null;
    setUsuarioSeleccionado(usuario);
  };

  const updateRow = (index, field, value) => {
    setRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  const addRow = () => setRows(prev => [...prev, emptyRow()]);
  const removeRow = (index) => setRows(prev => prev.filter((_, i) => i !== index));
  const duplicateRow = (index) => setRows(prev => {
    const copy = { ...prev[index] };
    return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)];
  });

  // Derivar filas con horas calculadas (performance-friendly)
  const derivedRows = useMemo(() => {
    return rows.map(r => {
      if (r.horaIngreso && r.horaSalida && (r.cantidadHorasExtra === '' || r.cantidadHorasExtra === undefined || r.cantidadHorasExtra === null)) {
        const calc = calcularHorasExtraRow(r);
        return { ...r, cantidadHorasExtra: calc };
      }
      return r;
    });
  }, [rows]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setMensaje('');
    setLoading(true);

    try {
      if (!usuarioId) {
        throw new Error('Debes seleccionar un empleado');
      }
      let registros = [];
      if (vistaSemanal) {
        if (!fechaLunes) throw new Error('Selecciona la fecha de Lunes');
        const activos = derivedWeekRows
          .map((d, i) => ({ ...d, _i: i }))
          .filter((d, i) => weekInclude[i])
          .filter(d => d.fecha && d.horaIngreso && d.horaSalida && d.ubicacion && d.tipoHoraId);
        if (!activos.length) throw new Error('Completa al menos un día de la semana');
        activos.forEach((r, idx) => validateRow(r, idx));
        validateNoOverlaps(activos);
        registros = activos.map(r => ({
          fecha: r.fecha,
          horaIngreso: r.horaIngreso,
          horaSalida: r.horaSalida,
          ubicacion: r.ubicacion,
          cantidadHorasExtra: parseFloat(r.cantidadHorasExtra || 0),
          justificacionHoraExtra: r.justificacionHoraExtra || '',
          tipoHoraId: r.tipoHoraId ? parseInt(r.tipoHoraId) : undefined
        }));
      } else {
        if (!derivedRows.length) throw new Error('Agrega al menos un registro');
        derivedRows.forEach((row, idx) => validateRow(row, idx));
        validateNoOverlaps(derivedRows);
        registros = derivedRows.map(r => ({
          fecha: r.fecha,
          horaIngreso: r.horaIngreso,
          horaSalida: r.horaSalida,
          ubicacion: r.ubicacion,
          cantidadHorasExtra: parseFloat(r.cantidadHorasExtra),
          justificacionHoraExtra: r.justificacionHoraExtra || '',
          tipoHoraId: r.tipoHoraId ? parseInt(r.tipoHoraId) : undefined
        }));
      }

      const payload = { usuarioId, registros };

      const result = onCrearRegistrosBulk
        ? await onCrearRegistrosBulk(payload)
        : await registrosHorasExtraService.createRegistrosBulk(payload);
      if (result) {
        setMensaje('¡Registros creados exitosamente!');
        setRows([emptyRow()]);
        setWeekRows([emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow()]);
        setTimeout(() => {
          onClose?.();
          setMensaje('');
        }, 1500);
      }
    } catch (error) {
      setMensaje(error.message || 'Error al crear los registros');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRows([emptyRow()]);
    setUsuarioSeleccionado(null);
    setMensaje('');
    setWeekRows([emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow()]);
    setFechaLunes('');
    setWeekInclude([true, true, true, true, true, true, true]);
    onClose?.();
  };

  const handleGenOptChange = (field, value) => {
    setGenOpts(prev => ({ ...prev, [field]: value }));
  };

  const generarSemana = () => {
    setMensaje('');
    const { fechaInicio, dias, soloHabiles, horaIngreso, horaSalida, ubicacion, tipoHoraId, justificacionHoraExtra } = genOpts;
    if (!fechaInicio || !horaIngreso || !horaSalida || !ubicacion || !tipoHoraId) {
      setMensaje('Completa los campos de generación: fecha, horas, ubicación y tipo');
      return;
    }
    const start = parseLocalISODate(fechaInicio);
    const generadas = [];
    let count = 0;
    let offset = 0;
    while (count < Number(dias) && offset < 31) {
      const d = addDays(start, offset);
      offset += 1;
      if (soloHabiles && isWeekend(d)) continue;
      const base = {
        fecha: formatDate(d),
        horaIngreso,
        horaSalida,
        ubicacion,
        tipoHoraId,
        justificacionHoraExtra: justificacionHoraExtra || ''
      };
      const cantidadHorasExtra = calcularHorasExtraRow(base);
      generadas.push({ ...base, cantidadHorasExtra });
      count += 1;
    }

    if (!generadas.length) {
      setMensaje('No se generaron filas. Verifica rango y filtros.');
      return;
    }

    setRows(generadas);
  };

  // Semana: helpers
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    if (vistaSemanal && fechaLunes) {
      const fecha = parseLocalISODate(fechaLunes);
      const mondayStr = toMondayDateString(fecha);
      if (mondayStr !== fechaLunes) {
        setFechaLunes(mondayStr);
        return;
      }
      setWeekRows(prev => {
        const base = computeWeekFromMondayStr(fechaLunes);
        let changed = false;
        const merged = base.map((d, i) => {
          const combinado = {
            ...d,
            horaIngreso: prev[i]?.horaIngreso || genOpts.horaIngreso || '',
            horaSalida: prev[i]?.horaSalida || genOpts.horaSalida || '',
            ubicacion: prev[i]?.ubicacion || genOpts.ubicacion || '',
            tipoHoraId: prev[i]?.tipoHoraId || genOpts.tipoHoraId || '',
            justificacionHoraExtra: prev[i]?.justificacionHoraExtra || genOpts.justificacionHoraExtra || ''
          };
          const antes = prev[i] || emptyRow();
          if (
            antes.fecha !== combinado.fecha ||
            antes.horaIngreso !== combinado.horaIngreso ||
            antes.horaSalida !== combinado.horaSalida ||
            antes.ubicacion !== combinado.ubicacion ||
            antes.tipoHoraId !== combinado.tipoHoraId ||
            antes.justificacionHoraExtra !== combinado.justificacionHoraExtra
          ) {
            changed = true;
          }
          return combinado;
        });
        return changed ? merged : prev;
      });
    }
  }, [vistaSemanal, fechaLunes]);

  // Derivar weekRows con horas calculadas (performance-friendly)
  const derivedWeekRows = useMemo(() => {
    if (!vistaSemanal) return weekRows;
    return weekRows.map(r => {
      if (r.horaIngreso && r.horaSalida && (r.cantidadHorasExtra === '' || r.cantidadHorasExtra === undefined || r.cantidadHorasExtra === null)) {
        const calc = calcularHorasExtraRow(r);
        return { ...r, cantidadHorasExtra: calc };
      }
      return r;
    });
  }, [weekRows, vistaSemanal]);

  const updateWeekCell = (index, field, value) => {
    setWeekRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  const toggleWeekInclude = (index, checked) => {
    setWeekInclude(prev => prev.map((v, i) => i === index ? checked : v));
  };

  const toggleAllWeekInclude = (checked) => {
    setWeekInclude(new Array(7).fill(checked));
  };

  // Resumen
  const { totalHoras, validCount, invalidCount } = useMemo(() => {
    const target = vistaSemanal ? derivedWeekRows : derivedRows;
    let total = 0;
    let valid = 0;
    let invalid = 0;
    target.forEach((r, idx) => {
      const hasData = r.fecha || r.horaIngreso || r.horaSalida || r.ubicacion || r.tipoHoraId || r.cantidadHorasExtra;
      if (!hasData) return;
      try {
        validateRow(r, idx);
        valid += 1;
        const c = parseFloat(r.cantidadHorasExtra || 0);
        if (!isNaN(c)) total += c;
      } catch (_) {
        invalid += 1;
      }
    });
    return { totalHoras: total, validCount: valid, invalidCount: invalid };
  }, [vistaSemanal, derivedWeekRows, derivedRows]);

  // Medir ancho del contenedor para virtualización
  useEffect(() => {
    const el = tableContainerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth || 800);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const shouldVirtualize = useMemo(() => !vistaSemanal && derivedRows.length > 100, [vistaSemanal, derivedRows.length]);

  return {
    // estado
    usuarioSeleccionado,
    rows,
    mensaje,
    loading: loading || loadingProp,
    genOpts,
    vistaSemanal,
    fechaLunes,
    weekRows,
    weekInclude,
    tableContainerRef,
    containerWidth,
    // derivados
    usuarioId,
    derivedRows,
    derivedWeekRows,
    totalHoras,
    validCount,
    invalidCount,
    shouldVirtualize,
    dayNames,
    // acciones
    setVistaSemanal,
    setFechaLunes,
    handleUsuarioChange,
    updateRow,
    addRow,
    removeRow,
    duplicateRow,
    handleSubmit,
    handleClose,
    handleGenOptChange,
    generarSemana,
    updateWeekCell,
    toggleWeekInclude,
    toggleAllWeekInclude,
    setMensaje
  };
};

export default useCrearRegistroSemanal;


