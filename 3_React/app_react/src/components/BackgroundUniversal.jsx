import React from 'react';
import { Box } from '@mui/material';

function BackgroundUniversal({ children, backgroundImage, overlayGradient = 'linear-gradient(180deg, rgba(247,251,255,0.85) 0%, rgba(242,246,255,0.85) 40%, rgba(238,242,255,0.85) 100%)' }) {
  const hasImage = Boolean(backgroundImage);
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        position: 'relative',
        backgroundColor: '#f7fbff',
        backgroundImage: hasImage ? `${overlayGradient}, url('${backgroundImage}')` : overlayGradient,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' }
      }}
    >
      {/* Decorative backdrop circles */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <Box sx={{ position: 'absolute', top: -80, left: -80, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(25,118,210,0.18), transparent 60%)' }} />
        <Box sx={{ position: 'absolute', bottom: -100, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle at 70% 70%, rgba(82,171,65,0.14), transparent 60%)' }} />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
    </Box>
  );
}

export default BackgroundUniversal;


