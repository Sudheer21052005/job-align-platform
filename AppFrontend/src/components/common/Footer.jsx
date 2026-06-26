// components/common/Footer.jsx
import React from 'react';
import { Box, Typography, Link, Container, Stack, Divider, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{
        py: 3,
        mt: 4,
        backgroundColor: theme.palette.secondary.light,
        borderTop: `1px solid ${theme.palette.secondary.main}`,
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', md: 'flex-start' }}
          spacing={2}
        >
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography 
              variant="h6" 
              component={RouterLink} 
              to="/" 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.primary.main,
                textDecoration: 'none',
                display: 'block',
                mb: 1
              }}
            >
              JobAlign
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260 }}>
              Connecting talented individuals with great opportunities
            </Typography>
          </Box>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 3, sm: 4 }}
            alignItems={{ xs: 'center', sm: 'flex-start' }}
          >
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
                Resources
              </Typography>
              <Stack spacing={1}>
                <Link component={RouterLink} to="/jobs" color="text.secondary" underline="hover">
                  Jobs
                </Link>
                <Link component={RouterLink} to="/companies" color="text.secondary" underline="hover">
                  Companies
                </Link>
              </Stack>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
                Company
              </Typography>
              <Stack spacing={1}>
                <Link component={RouterLink} to="/about" color="text.secondary" underline="hover">
                  About
                </Link>
                <Link component={RouterLink} to="/contact" color="text.secondary" underline="hover">
                  Contact
                </Link>
              </Stack>
            </Box>
          </Stack>
        </Stack>
        
        <Divider sx={{ my: 2, borderColor: theme.palette.secondary.main }} />
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} JobAlign. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
