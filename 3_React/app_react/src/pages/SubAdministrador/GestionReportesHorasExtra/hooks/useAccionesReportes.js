import { useCallback } from 'react';
import { gestionReportesService } from '../services/gestionReportesService';

export const useAccionesReportes = (setAlertState, setLoadingState, setRegistros, setReporteData, valorHoraOrdinaria, setSuccessState) => {
  
  const handleRefresh = useCallback(async (fetchUsuarios) => {
    try {
      await fetchUsuarios();
      setAlertState({
        open: true,
        type: 'success',
        message: 'Lista de usuarios actualizada',
        title: 'Éxito'
      });
    } catch (error) {
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al actualizar usuarios: ' + error.message,
        title: 'Error'
      });
    }
  }, [setAlertState]);

  const handleVerDetalles = useCallback((usuario, setUsuarioSeleccionado, setOpenDialog) => {
    setUsuarioSeleccionado(usuario);
    setOpenDialog(true);
  }, []);

  const handleVerRegistros = useCallback(async (usuario, setUsuarioSeleccionado, setOpenRegistros) => {
    try {
      setLoadingState({ open: true, message: 'Cargando registros...', size: 'medium' });
      setUsuarioSeleccionado(usuario);
      setOpenRegistros(true);

      const registros = await gestionReportesService.fetchRegistrosUsuario(usuario.id);
      setRegistros(Array.isArray(registros) ? registros : []);
    } catch (error) {
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al cargar registros: ' + error.message,
        title: 'Error'
      });
    } finally {
      setLoadingState({ open: false, message: '', size: 'medium' });
    }
  }, [setLoadingState, setRegistros, setAlertState]);

  const handleVerReporte = useCallback(async (usuario, setUsuarioSeleccionado, setOpenReporte) => {
    try {
      const registrosAprobados = await gestionReportesService.fetchRegistrosAprobados(usuario.id);
      const registros = Array.isArray(registrosAprobados) ? registrosAprobados : [];
      
      if (registros.length === 0) {
        setAlertState({
          open: true,
          type: 'warning',
          message: 'Este usuario no tiene registros aprobados para generar reporte',
          title: 'Sin datos'
        });
        // Continuar para abrir el diálogo con datos vacíos
      }

      let totalHorasDivididas = 0;
      let totalPagarDivididas = 0;
      let totalHorasBono = 0;
      let totalPagarBono = 0;
      let detalles = [];

      registros.forEach(registro => {
        const cantidadDividida = registro.horas_extra_divididas ?? 0;
        const cantidadBono = registro.bono_salarial ?? 0;

        if (Array.isArray(registro.Horas) && registro.Horas.length > 0) {
          registro.Horas.forEach((hora, index) => {
            const recargo = hora.valor;
            const valorHoraExtra = valorHoraOrdinaria * recargo;
            const valorTotalDivididas = cantidadDividida * valorHoraExtra;

            totalHorasDivididas += cantidadDividida;
            totalPagarDivididas += valorTotalDivididas;

            // Bono solo en la primera fila del registro para no duplicar
            const bonoEnFila = index === 0 ? cantidadBono : 0;
            const valorTotalBono = bonoEnFila * valorHoraExtra;
            totalHorasBono += bonoEnFila;
            totalPagarBono += valorTotalBono;

            detalles.push({
              fecha: registro.fecha,
              tipo: hora.tipo,
              denominacion: hora.denominacion,
              cantidadDividida,
              valorTotalDivididas: Number(valorTotalDivididas.toFixed(2)),
              cantidadBono: bonoEnFila,
              valorTotalBono: Number(valorTotalBono.toFixed(2)),
              recargo,
              valorHoraExtra: Number(valorHoraExtra.toFixed(2)),
              registroOriginal: registro
            });
          });
        } else if ((cantidadBono ?? 0) > 0) {
          // Sin horas asociadas, reflejar el bono en una sola fila con recargo 1
          const valorTotalBono = cantidadBono * valorHoraOrdinaria;
          totalHorasBono += cantidadBono;
          totalPagarBono += valorTotalBono;
          detalles.push({
            fecha: registro.fecha,
            tipo: 'Bono Salarial',
            denominacion: '-',
            cantidadDividida: 0,
            valorTotalDivididas: 0,
            cantidadBono,
            valorTotalBono: Number(valorTotalBono.toFixed(2)),
            recargo: 1,
            valorHoraExtra: Number(valorHoraOrdinaria.toFixed(2)),
            registroOriginal: registro
          });
        }
      });

      setReporteData({
        totalHorasDivididas,
        totalPagarDivididas,
        totalHorasBono,
        totalPagarBono,
        totalPagar: totalPagarDivididas + totalPagarBono,
        detalles
      });
      // Alinear el estado de registros con los datos del reporte para que los filtros del diálogo funcionen
      setRegistros(registros);
      setUsuarioSeleccionado(usuario);
      setOpenReporte(true);
      
      setAlertState({
        open: true,
        type: 'success',
        message: 'Reporte generado exitosamente',
        title: 'Éxito'
      });
    } catch (error) {
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al generar reporte: ' + error.message,
        title: 'Error'
      });
    }
  }, [setAlertState, setReporteData, valorHoraOrdinaria, setRegistros]);

  const handleDescargarWord = useCallback(async (reporteData, usuarioSeleccionado) => {
    try {
      const { descargarWord } = await import('../utils');
      await descargarWord(reporteData, usuarioSeleccionado);
      setAlertState({
        open: true,
        type: 'success',
        message: 'Documento Word descargado exitosamente',
        title: 'Éxito'
      });
      if (setSuccessState) {
        setSuccessState({ open: true, type: 'download', message: 'Documento Word descargado exitosamente', title: 'Descarga completada' });
      }
    } catch (error) {
      console.error('Error al descargar Word:', error);
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al descargar Word: ' + error.message,
        title: 'Error'
      });
    }
  }, [setAlertState, setSuccessState]);

  const handleDescargarExcel = useCallback(async (reporteData, usuarioSeleccionado) => {
    try {
      const { descargarExcel } = await import('../utils');
      await descargarExcel(reporteData, usuarioSeleccionado);
      setAlertState({
        open: true,
        type: 'success',
        message: 'Documento Excel descargado exitosamente',
        title: 'Éxito'
      });
      if (setSuccessState) {
        setSuccessState({ open: true, type: 'download', message: 'Documento Excel descargado exitosamente', title: 'Descarga completada' });
      }
    } catch (error) {
      console.error('Error al descargar Excel:', error);
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al descargar Excel: ' + error.message,
        title: 'Error'
      });
    }
  }, [setAlertState, setSuccessState]);

  return {
    handleRefresh,
    handleVerDetalles,
    handleVerRegistros,
    handleVerReporte,
    handleDescargarWord,
    handleDescargarExcel
  };
};
