import { Box, Paper, Typography, Button, Avatar, IconButton, Menu, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function NavbarSubAdmin() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:3000/api/usuarios/${userId}`)
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(() => setUserData(null));
    }
  }, []);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRol');
    navigate('/');
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: '98vw', md: '98vw' },
        maxWidth: 1400,
        height: 90,
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 5,
        zIndex: 1000,
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Link to="/panel-sub-admin">
          <Box component="img" src="/img/NuevoLogo.png" alt="Logo" sx={{ height: 72 }} />
        </Link>
        <Link to="/usuarios" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Usuarios</Typography>
        </Link>
        <Link to="/registrar-usuario" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Crear Usuario</Typography>
        </Link>
        <Link to="/panel-sub-admin?tab=solicitudes" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Solicitudes</Typography>
        </Link> 
        <Link to="/gestionar-registros-horas-extra" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Registros de horas extra</Typography>
        </Link>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleProfileClick} size="large" sx={{ ml: 2 }}>
          <Avatar sx={{ bgcolor: '#52AB41', width: 48, height: 48 }}>
            <AccountCircleIcon sx={{ fontSize: 36, color: '#fff' }} />
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { p: 2, minWidth: 240, borderRadius: 3 } }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 1 }}>
            <Avatar sx={{ bgcolor: '#52AB41', width: 64, height: 64, mb: 1 }}>
              <AccountCircleIcon sx={{ fontSize: 40, color: '#fff' }} />
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              {userData ? `${userData.persona?.nombres || ''} ${userData.persona?.apellidos || ''}` : 'Cargando...'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData ? userData.email : ''}
            </Typography>
            <Typography variant="body2" color="#52AB41" fontWeight={700}>
              {userData ? userData.rol?.nombre : ''}
            </Typography>
            <Divider sx={{ width: '100%', my: 1 }} />
            <Button onClick={handleLogout} variant="contained" color="error" sx={{ fontWeight: 700, borderRadius: 2, px: 3, width: '100%' }}>
              Cerrar sesión
            </Button>
          </Box>
        </Menu>
      </Box>
    </Paper>
  );
}

export default NavbarSubAdmin; 