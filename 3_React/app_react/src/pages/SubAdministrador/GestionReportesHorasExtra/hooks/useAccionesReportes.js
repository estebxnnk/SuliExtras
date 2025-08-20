import { useCallback } from 'react';

export const useAccionesReportes = (setAlertState, setLoadingState, setRegistros, setReporteData, valorHoraOrdinaria) => {
  
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
      
      // Buscar registros por id de usuario
      const response = await fetch(`http://localhost:3000/api/registros/usuario-completo/${usuario.id}`);
      if (!response.ok) {
        throw new Error('Error al cargar registros');
      }
      const data = await response.json();
      setRegistros(Array.isArray(data.registros) ? data.registros : []);
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
      const response = await fetch(`http://localhost:3000/api/registros/usuario-completo/${usuario.id}`);
      if (!response.ok) {
        throw new Error('Error al cargar datos para el reporte');
      }
      
      const data = await response.json();
      const registros = Array.isArray(data.registros) ? data.registros.filter(r => r.estado === 'aprobado') : [];
      
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
  }, [setAlertState, setReporteData, valorHoraOrdinaria]);

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
    } catch (error) {
      console.error('Error al descargar Word:', error);
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al descargar Word: ' + error.message,
        title: 'Error'
      });
    }
  }, [setAlertState]);

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
    } catch (error) {
      console.error('Error al descargar Excel:', error);
      setAlertState({
        open: true,
        type: 'error',
        message: 'Error al descargar Excel: ' + error.message,
        title: 'Error'
      });
    }
  }, [setAlertState]);

  return {
    handleRefresh,
    handleVerDetalles,
    handleVerRegistros,
    handleVerReporte,
    handleDescargarWord,
    handleDescargarExcel
  };
};
