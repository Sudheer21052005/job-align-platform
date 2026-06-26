// components/common/ErrorBoundary.jsx
import React, { Component } from 'react';
import { Box, Typography, Button, Container, Paper, ThemeProvider } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import theme from '../../styles/theme';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // You could add error reporting service here
    // Example: reportError(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ThemeProvider theme={theme}>
          <Container maxWidth="md">
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                mt: 4, 
                borderRadius: theme.shape.borderRadius * 1.5,
                border: '1px solid',
                borderColor: 'secondary.main',
                backgroundColor: 'secondary.light'
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <ErrorOutlineIcon 
                  sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} 
                />
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: theme.typography.fontWeightBold }}>
                  Something went wrong
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
                  We're sorry, but an error has occurred in this part of the application. 
                  Try refreshing the page or returning to the home page.
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => window.location.reload()}
                    startIcon={<RefreshIcon />}
                    size="large"
                  >
                    Refresh Page
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={this.handleReset}
                    size="large"
                  >
                    Try Again
                  </Button>
                </Box>
              </Box>
              
              {process.env.NODE_ENV === 'development' && (
                <Box 
                  sx={{ 
                    mt: 4, 
                    p: 2, 
                    backgroundColor: 'text.primary',
                    color: 'background.paper',
                    borderRadius: theme.shape.borderRadius,
                    overflow: 'auto',
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    maxHeight: '300px'
                  }}
                >
                  <Typography variant="body2" color="inherit" sx={{ whiteSpace: 'pre-wrap' }}>
                    {this.state.error?.toString()}
                  </Typography>
                  <Typography variant="body2" color="inherit" sx={{ whiteSpace: 'pre-wrap', mt: 2, opacity: 0.8 }}>
                    {this.state.errorInfo?.componentStack}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Container>
        </ThemeProvider>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
