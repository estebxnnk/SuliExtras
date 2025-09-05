import React from 'react';
import { Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { HeaderUniversal } from '../../../../components';
import { useNavigate } from 'react-router-dom';

const HeaderGestionRegistrosEmpleado = ({
  title,
  subtitle,
  search,
  onSearchChange,
  refreshing,
  onRefresh,
  onOpenCrearMultiple
}) => {
  const navigate = useNavigate();
  return (
    <HeaderUniversal
      title={title}
      subtitle={subtitle}
      icon={AccessTimeIcon}
      iconColor="#1976d2"
      refreshing={refreshing}
      onRefresh={onRefresh}
      showSearch={true}
      searchValue={search}
      searchPlaceholder="Buscar por ubicación, número o justificación"
      onSearchChange={onSearchChange}
      additionalButtons={[
        <Button
          key="crear-registro"
          variant="contained"
          color="primary"
          onClick={() => navigate('/crear-registro-horas')}
          sx={{ fontWeight: 700 }}
        >
          Crear nuevo registro
        </Button>,
        <Button
          key="crear-multiples"
          variant="outlined"
          color="primary"
          onClick={onOpenCrearMultiple}
          sx={{ fontWeight: 700 }}
        >
          Crear múltiples
        </Button>
      ]}
    />
  );
};

export default HeaderGestionRegistrosEmpleado;


