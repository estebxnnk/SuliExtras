import React from 'react';
import { Box, TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { HeaderUniversal } from '../../../../components';
import AssessmentIcon from '@mui/icons-material/Assessment';

const HeaderGestionReportes = ({
  title,
  subtitle,
  refreshing,
  onRefresh,
  search,
  onSearchChange,
  onOpenSalario
}) => {
  return (
    <HeaderUniversal
      title={title}
      subtitle={subtitle}
      icon={AssessmentIcon}
      iconColor="#9c27b0"
      refreshing={refreshing}
      onRefresh={onRefresh}
      showSearch={true}
      searchValue={search}
      searchPlaceholder="Buscar por nombre, apellido, documento o email"
      onSearchChange={onSearchChange}
      additionalButtons={[
        <Button 
          key="salario-button"
          variant="outlined" 
          color="secondary" 
          onClick={onOpenSalario}
          sx={{ 
            borderColor: '#9c27b0', 
            color: '#9c27b0',
            '&:hover': {
              borderColor: '#7b1fa2',
              backgroundColor: 'rgba(156, 39, 176, 0.04)'
            }
          }}
        >
          Editar salario mínimo
        </Button>
      ]}
    />
  );
};

export default HeaderGestionReportes;
