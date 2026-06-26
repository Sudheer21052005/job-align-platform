// src/contexts/SnackbarContext.jsx
import { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

// Create context
const SnackbarContext = createContext();

// Provider component
export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info'); // 'success', 'error', 'warning', 'info'
  
  // Function to show the snackbar
  const showSnackbar = (message, severity = 'info') => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };
  
  // Function to hide the snackbar
  const hideSnackbar = () => {
    setOpen(false);
  };
  
  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar 
        open={open} 
        autoHideDuration={6000} 
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        disableWindowBlurListener
      >
        <Alert 
          onClose={hideSnackbar} 
          severity={severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// Hook for using the snackbar context
export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export default SnackbarProvider; 