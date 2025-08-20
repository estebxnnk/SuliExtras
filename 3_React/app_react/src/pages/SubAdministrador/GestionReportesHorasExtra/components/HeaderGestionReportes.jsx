import React from 'react';
import { Box, TextField, InputAdornment, Button } from '@mui/material';
import { SearchIcon } from '@mui/icons-material';
import { SubAdminHeader } from '../../components';
import { AssessmentIcon } from '@mui/icons-material';

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
    <SubAdminHeader
      title={title}
      subtitle={subtitle}
      refreshing={refreshing}
      onRefresh={onRefresh}
      showAddButton={false}
      icon={AssessmentIcon}
      iconColor="#9c27b0"
      gradientColors={["#9c27b0", "#7b1fa2"]}
    >
      {/* Campo de búsqueda */}
      <TextField
        placeholder="Buscar por nombre, apellido, documento o email"
        value={search}
        onChange={onSearchChange}
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      {/* Botón de editar salario mínimo */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
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
      </Box>
    </SubAdminHeader>
  );
};

export default HeaderGestionReportes;
