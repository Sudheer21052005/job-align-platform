// src/components/Company/CompaniesTable.jsx
import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Typography,
  Link,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
  Skeleton,
} from '@mui/material';
import { Avatar } from '@mui/material';
import { Edit as EditIcon, Business as BusinessIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CompaniesTable = ({ companies, loading, error }) => {
  const navigate = useNavigate();

  // Loading skeleton
  if (loading) {
    return (
      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3].map((index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="circular" width={40} height={40} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={150} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton variant="circular" width={32} height={32} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Empty state
  if (!companies || companies.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <BusinessIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No companies found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Logo</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Registration Date</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company) => {
            const companyId = company.value || company._id;
            const companyName = company.name || company.label;

            return (
              <TableRow key={companyId} hover>
                <TableCell>
                  <Avatar
                    alt={companyName}
                    src={company.logo || ''}
                    sx={{ 
                      bgcolor: !company.logo && 'grey.300',
                      width: 40,
                      height: 40
                    }}
                  >
                    {!company.logo && companyName.charAt(0).toUpperCase()}
                  </Avatar>
                </TableCell>

                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {companyName}
                  </Typography>
                  {company.website && (
                    <Link 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ fontSize: '0.875rem' }}
                    >
                      Visit Website
                    </Link>
                  )}
                </TableCell>

                <TableCell>
                  {company.location || 'N/A'}
                </TableCell>

                <TableCell>
                  {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Edit Company">
                    <IconButton 
                      onClick={() => navigate(`/companies/edit/${companyId}`)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CompaniesTable;
