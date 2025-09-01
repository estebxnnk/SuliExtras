import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavbarSubAdmin from '../NavbarSubAdmin';
import { RegistrarUsuarioUniversal, CreateSuccessSpinner } from '../../../components';

function RegistrarUsuario() {
  const navigate = useNavigate();
  const [successSpinner, setSuccessSpinner] = React.useState({ open: false, title: 'Usuario Creado', message: 'Usuario registrado exitosamente.' });

  return (
    <Box
      minHeight="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      sx={{
        background: "url('/img/Recepcion.jpg') no-repeat center center",
        backgroundSize: 'cover',
      }}
    >
      <NavbarSubAdmin />
      <Box sx={{ 
        flex: 1, 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        mt: { xs: 14, sm: 16 },
        px: { xs: 2, sm: 3, md: 4 }
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
    </Box>
  );
}

export default RegistrarUsuario; 