// src/components/common/AlertMessage.jsx
import React from 'react';
import { Alert, AlertTitle, Box, Collapse, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AlertMessage = ({ 
  severity = 'info', 
  title, 
  message, 
  onClose, 
  open = true,
  sx = {}
}) => {
  const theme = useTheme();

  // Get alert styles directly from theme to ensure consistency
  const getAlertStyles = () => {
    const baseStyles = {
      borderRadius: theme.shape.borderRadius,
      border: '1px solid',
      borderLeftWidth: 4,
      fontSize: '0.875rem',
    };

    switch (severity) {
      case 'success':
        return { 
          ...baseStyles,
          backgroundColor: theme.palette.success.light, 
          color: theme.palette.success.dark, 
          borderColor: theme.palette.success.main 
        };
      case 'error':
        return { 
          ...baseStyles,
          backgroundColor: theme.palette.error.light, 
          color: theme.palette.error.dark, 
          borderColor: theme.palette.error.main 
        };
      case 'warning':
        return { 
          ...baseStyles,
          backgroundColor: theme.palette.warning.light, 
          color: theme.palette.warning.dark, 
          borderColor: theme.palette.warning.main 
        };
      case 'info':
      default:
        return { 
          ...baseStyles,
          backgroundColor: theme.palette.info.light, 
          color: theme.palette.info.dark, 
          borderColor: theme.palette.info.main 
        };
    }
  };

  return (
    <Collapse in={open}>
      <Box my={2}>
        <Alert 
          severity={severity}
          sx={{
            ...getAlertStyles(),
            ...sx
          }}
          action={
            onClose && (
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={onClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )
          }
        >
          {title && <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>}
          {message}
        </Alert>
      </Box>
    </Collapse>
  );
};

export default AlertMessage;
