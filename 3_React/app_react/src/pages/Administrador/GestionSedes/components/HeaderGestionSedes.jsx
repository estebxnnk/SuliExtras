import React from 'react';
import { Button } from '@mui/material';
import { HeaderUniversal } from '../../../../components';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';

const HeaderGestionSedes = ({
  title,
  subtitle,
  refreshing,
  onRefresh,
  search,
  onSearchChange,
  onNuevaSede
}) => {
  return (
    <HeaderUniversal
      title={title}
      subtitle={subtitle}
      icon={BusinessIcon}
      iconColor="#1976d2"
      refreshing={refreshing}
      onRefresh={onRefresh}
      showSearch={true}
      searchValue={search}
      searchPlaceholder="Buscar por nombre, ciudad o dirección"
      onSearchChange={onSearchChange}
      additionalButtons={[
        <Button 
          key="nueva-sede-button"
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={onNuevaSede}
          sx={{ 
            background: 'linear-gradient(135deg, #1976d2, #1565c0)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0, #0d47a1)'
            }
          }}
        >
          Nueva Sede
        </Button>
      ]}
    />
  );
};

export default HeaderGestionSedes;
