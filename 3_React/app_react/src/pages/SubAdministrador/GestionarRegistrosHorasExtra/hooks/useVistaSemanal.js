import React from 'react';
import { gestionarRegistrosHorasExtraService } from '../services/gestionarRegistrosHorasExtraService';

export default function useVistaSemanal(showError) {
  const [vistaSemanal, setVistaSemanal] = React.useState(false);
  const [semanaData, setSemanaData] = React.useState(null);
  const [usuarioSemanaId, setUsuarioSemanaId] = React.useState('');
  const [fechaInicioSemana, setFechaInicioSemana] = React.useState('');
  const [fechaSolo, setFechaSolo] = React.useState('');
  const [fechaData, setFechaData] = React.useState(null);

  React.useEffect(() => {
    const cargarSemana = async () => {
      if (!vistaSemanal || !usuarioSemanaId) return;
      try {
        const data = await gestionarRegistrosHorasExtraService.getRegistrosPorSemana(
          usuarioSemanaId,
          fechaInicioSemana || undefined
        );
        setSemanaData(data);
      } catch (e) {
        showError?.(e.message || 'Error al cargar semana');
      }
    };
    cargarSemana();
  }, [vistaSemanal, usuarioSemanaId, fechaInicioSemana, showError]);

  React.useEffect(() => {
    const cargarFecha = async () => {
      if (!vistaSemanal || !fechaSolo) return;
      try {
        const data = await gestionarRegistrosHorasExtraService.getRegistrosPorFecha(fechaSolo);
        setFechaData(data);
      } catch (e) {
        showError?.(e.message || 'Error al cargar registros por fecha');
      }
    };
    cargarFecha();
  }, [vistaSemanal, fechaSolo, showError]);

  return {
    vistaSemanal,
    setVistaSemanal,
    semanaData,
    setSemanaData,
    usuarioSemanaId,
    setUsuarioSemanaId,
    fechaInicioSemana,
    setFechaInicioSemana,
    fechaSolo,
    setFechaSolo,
    fechaData,
    setFechaData,
  };
}


