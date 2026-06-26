// components/common/Layout.jsx
import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';

const Layout = ({ children, maxWidth = '1280px' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <ErrorBoundary>
      <Sidebar>
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            px: { xs: 2, sm: 3, md: 4 }, 
            py: { xs: 2, sm: 2.5, md: 3 },
            bgcolor: 'background.default',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            transition: theme.transitions.create(['padding'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
          }}
        >
          <Box 
            sx={{ 
              width: '100%', 
              flex: 1,
              pb: { xs: 4, sm: 5 },
              position: 'relative',
              '&::after': isMobile ? {} : {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '30%',
                height: '200px',
                backgroundImage: 'radial-gradient(circle, rgba(138, 79, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%)',
                pointerEvents: 'none',
                zIndex: 0,
              }
            }}
          >
            {children}
          </Box>
          <Footer />
        </Box>
      </Sidebar>
    </ErrorBoundary>
  );
};

export default Layout;
