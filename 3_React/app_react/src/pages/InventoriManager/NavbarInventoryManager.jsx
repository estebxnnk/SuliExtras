import { Box, Paper, Typography, Button, Avatar, IconButton, Menu, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InventoryIcon from '@mui/icons-material/Inventory';

function NavbarInventoryManager() {
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
    localStorage.removeItem('userId');
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
        <Link to="/panel-inventory-manager">
          <Box component="img" src="/img/NuevoLogo.png" alt="Logo" sx={{ height: 72 }} />
        </Link>
        <Link to="/dispositivos" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#0d47a1', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#1976d2' } }}>Gestionar Dispositivos</Typography>
        </Link>
        <Link to="/categorias" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#0d47a1', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#1976d2' } }}>Categorías</Typography>
        </Link>
        <Link to="/sedes" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#0d47a1', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#1976d2' } }}>Sedes</Typography>
        </Link>
        <Link to="/reportes-inventario" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#0d47a1', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#1976d2' } }}>Reportes</Typography>
        </Link>
        <Link to="/estadisticas-dispositivos" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 15, color: '#0d47a1', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#1976d2' } }}>Estadísticas</Typography>
        </Link>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleProfileClick} size="large" sx={{ ml: 2 }}>
          <Avatar sx={{ bgcolor: '#0d47a1', width: 48, height: 48 }}>
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
            <Avatar sx={{ bgcolor: '#0d47a1', width: 64, height: 64, mb: 1 }}>
              <AccountCircleIcon sx={{ fontSize: 40, color: '#fff' }} />
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              {userData ? `${userData.persona?.nombres || ''} ${userData.persona?.apellidos || ''}` : 'Cargando...'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData ? userData.email : ''}
            </Typography>
            <Typography variant="body2" color="#0d47a1" fontWeight={700}>
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

export default NavbarInventoryManager; 