import React from 'react';
import { Box, Button, TextField, InputAdornment } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { LayoutUniversal, HeaderUniversal, UniversalAlert, ConfirmDialogUniversal, InitialPageLoader, CreateSuccessSpinner, EditSuccessSpinner, DeleteSuccessSpinner } from '../../../components';
import NavbarSubAdmin from '../NavbarSubAdmin';
import { useTiposHora } from './hooks/useTiposHora';
import TiposHoraCards from './components/TiposHoraCards';
import TipoHoraDialog from './components/TipoHoraDialog';

function GestionarTiposHoraSubAdmin() {
  const { filtered, loading, error, search, setSearch, fetchAll, create, update, remove } = useTiposHora();
  const [alert, setAlert] = React.useState({ open: false, type: 'info', message: '', title: '' });
  const [confirm, setConfirm] = React.useState({ open: false, action: '', data: null });
  const [success, setSuccess] = React.useState({ open: false, type: '', message: '', title: '' });
  const [dialog, setDialog] = React.useState({ open: false, mode: 'crear', data: null });

  React.useEffect(() => {
    if (error) setAlert({ open: true, type: 'error', title: 'Error', message: error });
  }, [error]);

  const handleCrear = () => setDialog({ open: true, mode: 'crear', data: null });
  const handleVer = (row) => setDialog({ open: true, mode: 'ver', data: row });
  const handleEditar = (row) => setDialog({ open: true, mode: 'editar', data: row });
  const handleEliminar = (row) => setConfirm({ open: true, action: 'eliminar', data: row });

  const onSaveDialog = async (payload) => {
    try {
      if (dialog.mode === 'crear') {
        await create(payload);
        setSuccess({ open: true, type: 'create', title: 'Creado', message: 'Tipo de hora creado correctamente.' });
      } else {
        await update(dialog.data?.tipo || dialog.data?.id, payload);
        setSuccess({ open: true, type: 'edit', title: 'Actualizado', message: 'Tipo de hora actualizado correctamente.' });
      }
      setDialog({ open: false, mode: 'crear', data: null });
    } catch (e) {
      setAlert({ open: true, type: 'error', title: 'Error', message: e.message });
    }
  };

  const handleConfirm = async () => {
    try {
      if (confirm.action === 'eliminar') {
        await remove(confirm.data?.tipo || confirm.data?.id);
        setSuccess({ open: true, type: 'delete', title: 'Eliminado', message: 'Tipo de hora eliminado' });
      }
    } catch (e) {
      setAlert({ open: true, type: 'error', title: 'Error', message: e.message });
    } finally {
      setConfirm({ open: false, action: '', data: null });
    }
  };

  return (
    <LayoutUniversal NavbarComponent={NavbarSubAdmin}>
      <HeaderUniversal
        title="Gestionar Tipos de Hora"
        subtitle={`Administración de tipos con recargos`}
        icon={AccessTimeIcon}
        iconColor="#1976d2"
        onRefresh={fetchAll}
      />

      <InitialPageLoader open={loading} title="Cargando Tipos de Hora" subtitle="Preparando datos y componentes" iconColor="#1976d2" />

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Buscar por tipo o denominación"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          InputProps={{ startAdornment: (
            <InputAdornment position="start"><SearchIcon /></InputAdornment>
          )}}
          sx={{ minWidth: 320 }}
        />
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={handleCrear}
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)' }
          }}
        >
          Crear Nuevo Tipo
        </Button>
      </Box>

      <TiposHoraCards data={filtered} onView={handleVer} onEdit={handleEditar} onDelete={handleEliminar} />

      <TipoHoraDialog open={dialog.open} mode={dialog.mode} data={dialog.data} onClose={() => setDialog({ open: false, mode: 'crear', data: null })} onSave={onSaveDialog} />

      <UniversalAlert open={alert.open} type={alert.type} message={alert.message} title={alert.title} onClose={() => setAlert(a => ({ ...a, open: false }))} showLogo autoHideDuration={4000} />

      <ConfirmDialogUniversal open={confirm.open} action={confirm.action} data={confirm.data} onClose={() => setConfirm({ open: false, action: '', data: null })} onConfirm={handleConfirm} />

      {success.type === 'create' && (
        <CreateSuccessSpinner open message={success.message} title={success.title} onClose={() => setSuccess({ open: false, type: '', message: '', title: '' })} />
      )}
      {success.type === 'edit' && (
        <EditSuccessSpinner open message={success.message} title={success.title} onClose={() => setSuccess({ open: false, type: '', message: '', title: '' })} />
      )}
      {success.type === 'delete' && (
        <DeleteSuccessSpinner open message={success.message} title={success.title} onClose={() => setSuccess({ open: false, type: '', message: '', title: '' })} />
      )}
    </LayoutUniversal>
  );
}

export default GestionarTiposHoraSubAdmin;


