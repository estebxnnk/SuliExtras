// Utilidades para manejo de horas extra y fechas (local timezone-safe)
import { format, addDays as dfAddDays, isWeekend as dfIsWeekend, startOfWeek, parseISO, isAfter } from 'date-fns';

export const emptyRow = () => ({
  fecha: '',
  horaIngreso: '',
  horaSalida: '',
  ubicacion: '',
  cantidadHorasExtra: '',
  justificacionHoraExtra: '',
  tipoHoraId: ''
});

// Parse 'YYYY-MM-DD' evitando el bug de timezone creando Date en hora local
export const parseLocalISODate = (yyyyMmDd) => (yyyyMmDd ? parseISO(yyyyMmDd) : null);

export const formatDate = (date) => format(date, 'yyyy-MM-dd');

export const addDays = (date, days) => dfAddDays(date, days);

export const isWeekend = (date) => dfIsWeekend(date);

export const timeToMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
};

export const calcularHorasExtraRow = (row) => {
  if (!row.horaIngreso || !row.horaSalida) return row.cantidadHorasExtra;
  const [hIn, mIn] = row.horaIngreso.split(':').map(Number);
  const [hOut, mOut] = row.horaSalida.split(':').map(Number);
  let horas = (hOut - hIn) + (mOut - mIn) / 60;
  if (horas < 0) horas += 24; // cruza medianoche
  horas = Math.max(0, horas - 8); // descontar jornada
  return horas > 0 ? horas.toFixed(2) : '0.00';
};

// Devuelve string 'YYYY-MM-DD' del lunes de la semana de la fecha dada (local)
export const toMondayDateString = (date) => formatDate(startOfWeek(date, { weekStartsOn: 1 }));

export const computeWeekFromMondayStr = (mondayStr) => {
  if (!mondayStr) return [emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow()];
  const start = parseLocalISODate(mondayStr);
  return new Array(7)
    .fill(0)
    .map((_, i) => ({ ...emptyRow(), fecha: formatDate(addDays(start, i)) }));
};

export const validateRow = (row, index) => {
  if (!row.fecha || !row.horaIngreso || !row.horaSalida || !row.ubicacion || !row.tipoHoraId) {
    throw new Error(`Fila ${index + 1}: campos requeridos incompletos`);
  }

  // Validación fecha no futura (local)
  const f = parseLocalISODate(row.fecha);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isAfter(f, today)) throw new Error(`Fila ${index + 1}: la fecha no puede ser futura`);

  if (row.horaIngreso >= row.horaSalida) {
    throw new Error(`Fila ${index + 1}: la hora de salida debe ser mayor a la de ingreso`);
  }
  // cantidadHorasExtra ahora es opcional; el backend la calcula.
};

export const validateNoOverlaps = (rowsToValidate) => {
  const byDate = rowsToValidate.reduce((acc, row, idx) => {
    if (!row.fecha || !row.horaIngreso || !row.horaSalida) return acc;
    const start = timeToMinutes(row.horaIngreso);
    let end = timeToMinutes(row.horaSalida);
    if (end <= start) end += 24 * 60; // cruza medianoche
    (acc[row.fecha] = acc[row.fecha] || []).push({ start, end, idx });
    return acc;
  }, {});

  for (const fecha of Object.keys(byDate)) {
    const list = byDate[fecha].sort((a, b) => a.start - b.start);
    for (let i = 1; i < list.length; i++) {
      if (list[i].start < list[i - 1].end) {
        const a = list[i - 1].idx + 1;
        const b = list[i].idx + 1;
        throw new Error(`Solapamiento de horas en ${fecha} entre filas ${a} y ${b}`);
      }
    }
  }
};


