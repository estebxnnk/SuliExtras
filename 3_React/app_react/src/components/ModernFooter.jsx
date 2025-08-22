import React from 'react';
import { Box, Typography, IconButton, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

function ModernFooter() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        background: 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)',
        color: '#fff',
        py: 3,
        px: 2,
        mt: 'auto',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        boxShadow: '0 -2px 16px rgba(25,118,210,0.13)'
      }}
    >
      <Typography variant="body1" fontWeight={700} sx={{ letterSpacing: 1 }}>
        SuliExtras &copy; {new Date().getFullYear()}
      </Typography>
      <Box>
        <IconButton component={Link} href="#" color="inherit" sx={{ mx: 0.5 }}>
          <FacebookIcon />
        </IconButton>
        <IconButton component={Link} href="#" color="inherit" sx={{ mx: 0.5 }}>
          <TwitterIcon />
        </IconButton>
        <IconButton component={Link} href="#" color="inherit" sx={{ mx: 0.5 }}>
          <InstagramIcon />
        </IconButton>
      </Box>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Desarrollado por el equipo SuliExtras
      </Typography>
    </Box>
  );
}

export default ModernFooter; 