import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Button,
  Typography
} from '@mui/material';

function Home() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: `url('/img/Recepcion.jpg') no-repeat center center`,
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {/* Barra de Navegación */}
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
          background: 'rgba(255,255,255,0.85)',
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
          <Link to="/">
            <Box component="img" src="/img/NuevoLogo.png" alt="Logo" sx={{ height: 72 }} />
          </Link>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 500, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Nosotros</Typography>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 500, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Objetivos</Typography>
          <Typography sx={{ fontSize: 15, color: '#000', fontWeight: 500, cursor: 'pointer', '&:hover': { color: '#52AB41' } }}>Manual de Usuario</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              background: '#52AB41',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              height: 48,
              fontSize: 15,
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              '&:hover': {
                background: '#3fa32c',
                transform: 'translateY(-2px) scale(1.04)',
                boxShadow: '0 6px 16px rgba(82,171,65,0.18)',
              },
            }}
          >
            Iniciar Sesión
          </Button>
          <Link to="/contactanos" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                background: '#3B394F',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                height: 48,
                fontSize: 15,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                '&:hover': {
                  background: '#23213a',
                  transform: 'translateY(-2px) scale(1.04)',
                  boxShadow: '0 6px 16px rgba(59,57,79,0.18)',
                },
              }}
            >
              Contáctanos
            </Button>
          </Link>
        </Box>
      </Paper>

      {/* Contenido principal */}
      <Container maxWidth="lg" sx={{ mt: 18, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 3, md: 7 },
            width: '100%',
          }}
        >
          <Box
            sx={{
              flex: '1 1 60%',
              minWidth: { xs: '90vw', md: 400 },
              aspectRatio: '16/10',
              background: `url('/img/PaLasQueSea.png') no-repeat center center`,
              backgroundSize: 'cover',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0px 4px 4px 4px rgba(0, 0, 0, 0.15)',
              transition: 'box-shadow 0.3s, transform 0.3s',
              '&:hover': {
                boxShadow: '0 16px 48px rgba(0,0,0,0.35), 0 0 0 4px #52AB41AA',
                transform: 'scale(1.01)',
              },
            }}
          />
          <Paper
            elevation={6}
            sx={{
              flex: '1 1 40%',
              minWidth: { xs: '90vw', md: 350 },
              maxWidth: 500,
              background: 'rgba(255,255,255,0.90)',
              borderRadius: 2,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              transition: 'box-shadow 0.3s, transform 0.3s',
              '&:hover': {
                boxShadow: '0 8px 32px rgba(82,171,65,0.10), 0 0 0 2px #52AB4144',
                transform: 'scale(1.01)',
              },
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mb: 2, textAlign: 'center' }}>
              Sulicor SAS
            </Typography>
            <Typography variant="body1" sx={{ color: '#000', mb: 2, textAlign: 'center' }}>
              Bienvenido al portal administrativo para uso interno de Sulicor SAS.
            </Typography>
            {/* Formulario de contacto solo vista */}
            <Box
              component="form"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mb: 2,
              }}
              onSubmit={e => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Nombre"
                disabled
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                  marginBottom: '8px',
                  background: '#f5f5f5'
                }}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                disabled
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                  marginBottom: '8px',
                  background: '#f5f5f5'
                }}
              />
              <textarea
                placeholder="Mensaje"
                disabled
                rows={3}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                  marginBottom: '8px',
                  resize: 'vertical',
                  background: '#f5f5f5'
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled
                sx={{
                  background: '#52AB41',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: 2,
                  fontSize: 16,
                  '&:hover': {
                    background: '#3fa32c',
                  },
                }}
              >
                Enviar mensaje
              </Button>
            </Box>
            {/* Redes sociales */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" style={{ width: 32, height: 32 }} />
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" style={{ width: 32, height: 32 }} />
              </a>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" alt="WhatsApp" style={{ width: 32, height: 32 }} />
              </a>
              <a href="mailto:info@sulicor.com" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gmail.svg" alt="Correo" style={{ width: 32, height: 32 }} />
              </a>
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          background: 'white',
          opacity: 0.90,
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          borderRadius: 2,
          mt: 2,
          maxWidth: 1400,
          width: '98vw',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 5, alignItems: 'center', maxWidth: 600, width: '100%', justifyContent: 'center' }}>
          <Box component="img" src="/img/RonMedellin.png" alt="Logo 1" sx={{ height: 60, objectFit: 'contain', filter: 'grayscale(0.2) drop-shadow(0 2px 4px #0002)', transition: 'filter 0.2s, transform 0.2s', '&:hover': { filter: 'grayscale(0) drop-shadow(0 4px 12px #52AB41AA)', transform: 'scale(1.08)' } }} />
          <Box component="img" src="/img/antioqueño.png" alt="Logo 2" sx={{ height: 60, objectFit: 'contain', filter: 'grayscale(0.2) drop-shadow(0 2px 4px #0002)', transition: 'filter 0.2s, transform 0.2s', '&:hover': { filter: 'grayscale(0) drop-shadow(0 4px 12px #52AB41AA)', transform: 'scale(1.08)' } }} />
          <Box component="img" src="/img/NuevoLogo.png" alt="Logo 3" sx={{ height: 60, objectFit: 'contain', filter: 'grayscale(0.2) drop-shadow(0 2px 4px #0002)', transition: 'filter 0.2s, transform 0.2s', '&:hover': { filter: 'grayscale(0) drop-shadow(0 4px 12px #52AB41AA)', transform: 'scale(1.08)' } }} />
        </Box>
      </Box>
    </Box>
  );
}

export default Home;