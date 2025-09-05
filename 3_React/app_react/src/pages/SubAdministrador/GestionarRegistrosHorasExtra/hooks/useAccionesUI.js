export default function useAccionesUI(abrirDialog, abrirConfirmDialog) {
  const handleVer = (registro) => abrirDialog(registro, 'ver');
  const handleEditar = (registro) => abrirDialog(registro, 'editar');
  const handleAprobar = (registro) => abrirConfirmDialog(
    'aprobar',
    registro,
    'Confirmar Aprobación',
    `¿Estás seguro que deseas APROBAR el registro ${registro.numRegistro}?`
  );
  const handleRechazar = (registro) => abrirConfirmDialog(
    'rechazar',
    registro,
    'Confirmar Rechazo',
    `¿Estás seguro que deseas RECHAZAR el registro ${registro.numRegistro}?`
  );
  const handleEliminar = (registro) => abrirConfirmDialog(
    'eliminar',
    registro,
    'Confirmar Eliminación',
    `¿Estás seguro que deseas ELIMINAR el registro ${registro.numRegistro}?`
  );

  return { handleVer, handleEditar, handleAprobar, handleRechazar, handleEliminar };
}


