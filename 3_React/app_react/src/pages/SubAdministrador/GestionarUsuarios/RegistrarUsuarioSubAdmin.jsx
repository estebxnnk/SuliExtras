import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavbarSubAdmin from '../NavbarSubAdmin';
import { RegistrarUsuarioUniversal, CreateSuccessSpinner, LayoutUniversal } from '../../../components';

function RegistrarUsuario() {
  const navigate = useNavigate();
  const [successSpinner, setSuccessSpinner] = React.useState({ open: false, title: 'Usuario Creado', message: 'Usuario registrado exitosamente.' });

  return (
    <LayoutUniversal NavbarComponent={NavbarSubAdmin}>
      <Box sx={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        mt: { xs: 2, sm: 2 },
        px: { xs: 0, sm: 0, md: 0 }
      }}>
        <RegistrarUsuarioUniversal
          onSuccess={() => setSuccessSpinner({ open: true, title: 'Usuario Creado', message: 'Usuario registrado exitosamente.' })}
        />
      </Box>

      {successSpinner.open && (
        <CreateSuccessSpinner
          open
          title={successSpinner.title}
          message={successSpinner.message}
          onClose={() => {
            setSuccessSpinner({ open: false, title: '', message: '' });
            navigate('/usuarios');
          }}
        />
      )}
    </LayoutUniversal>
  );
}

export default RegistrarUsuario; 