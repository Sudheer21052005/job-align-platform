// components/common/Loader.jsx

import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

const Loader = ({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = false,
  fullHeight = false
}) => {
  const theme = useTheme();
  
  // Size mappings
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  };
  
  const spinnerSize = sizeMap[size] || sizeMap.medium;
  
  // Base styles
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(3),
  };
  
  // Conditional styles
  if (fullScreen) {
    Object.assign(containerStyles, {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.palette.background.default,
      opacity: 0.95,
      zIndex: theme.zIndex.modal + 1,
    });
  } else if (fullHeight) {
    Object.assign(containerStyles, {
      minHeight: '60vh',
    });
  }

  return (
    <Box sx={containerStyles}>
      <CircularProgress 
        size={spinnerSize} 
        thickness={4}
        sx={{ 
          color: 'primary.main',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }} 
      />
      {message && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mt: 1, 
            fontWeight: theme.typography.fontWeightMedium,
            textAlign: 'center',
            animation: 'pulse 1.5s infinite ease-in-out',
            '@keyframes pulse': {
              '0%': { opacity: 0.7 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0.7 },
            }
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;
