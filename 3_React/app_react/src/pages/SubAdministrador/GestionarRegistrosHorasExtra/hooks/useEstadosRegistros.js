import { useState, useCallback } from 'react';

export const useEstadosRegistros = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [modo, setModo] = useState('ver');
  const [editData, setEditData] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: '',
    registro: null,
    title: '',
    message: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const abrirDialog = useCallback((registro, modoDialog = 'ver') => {
    setRegistroSeleccionado(registro);
    setModo(modoDialog);
    setOpenDialog(true);
    
    if (modoDialog === 'editar') {
      if (registro.estado === 'aprobado') {
        setEditData({ estado: 'pendiente' });
      } else {
        const tipoHoraId = (registro.Horas && registro.Horas.length > 0) ? registro.Horas[0].id : '';
        setEditData({
          fecha: registro.fecha,
          horaIngreso: registro.horaIngreso,
          horaSalida: registro.horaSalida,
          ubicacion: registro.ubicacion,
          cantidadHorasExtra: registro.cantidadHorasExtra,
          justificacionHoraExtra: registro.justificacionHoraExtra || '',
          tipoHoraId: tipoHoraId
        });
      }
    }
  }, []);

  const cerrarDialog = useCallback(() => {
    setOpenDialog(false);
    setRegistroSeleccionado(null);
    setModo('ver');
    setEditData({});
  }, []);

  const abrirConfirmDialog = useCallback((action, registro, title, message) => {
    setConfirmDialog({
      open: true,
      action,
      registro,
      title,
      message
    });
  }, []);

  const cerrarConfirmDialog = useCallback(() => {
    setConfirmDialog({
      open: false,
      action: '',
      registro: null,
      title: '',
      message: ''
    });
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return {
    openDialog,
    registroSeleccionado,
    modo,
    editData,
    confirmDialog,
    page,
    rowsPerPage,
    setEditData,
    setModo,
    abrirDialog,
    cerrarDialog,
    abrirConfirmDialog,
    cerrarConfirmDialog,
    handleChangePage,
    handleChangeRowsPerPage
  };
};
