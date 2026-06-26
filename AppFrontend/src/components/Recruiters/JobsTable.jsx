// src/components/Recruiters/JobsTable.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Chip,
  Skeleton,
  Alert,
  CircularProgress,
  Avatar,
  alpha,
  useTheme,
  Divider,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '../../hooks/useGetAllCompanies';
import { fetchCompanyById } from '../../api/api';

const JobsTable = ({ jobs, onEdit, onDelete, onViewApplicants, loading, error }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { companies, loading: companiesLoading } = useGetAllCompanies();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [companyData, setCompanyData] = useState({});
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Fetch company data for all jobs
  useEffect(() => {
    const fetchCompanies = async () => {
      if (!jobs || jobs.length === 0) return;
      
      setLoadingCompanies(true);
      
      const companyMap = {};
      for (const job of jobs) {
        // Handle both object and string types for company field
        const companyId = 
          job.companyId || 
          (job.company && typeof job.company === 'string' ? job.company : job.company?._id);
        
        // Skip if already fetched or no company ID
        if (!companyId || companyMap[companyId]) continue;
        
        try {
          const company = await fetchCompanyById(companyId);
          if (company) {
            companyMap[companyId] = company;
          }
        } catch (err) {
          console.error(`Error fetching company ${companyId}:`, err);
        }
      }
      
      setCompanyData(companyMap);
      setLoadingCompanies(false);
    };
    
    fetchCompanies();
  }, [jobs]);

  const openMenu = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleViewDetails = () => {
    closeMenu();
    navigate(`/jobs/${selectedJob._id}`);
  };

  const handleEdit = () => {
    closeMenu();
    navigate(`/recruiter-dashboard/edit-job/${selectedJob._id}`);
  };

  const handleDelete = () => {
    closeMenu();
    onDelete(selectedJob);
  };

  const handleViewApplicants = () => {
    closeMenu();
    navigate(`/manage-applicants/${selectedJob._id}`);
  };
  
  // Helper: get company data by company id from our local cache
  const getCompanyData = (job) => {
    // Handle both object and string types for company field
    const companyId = 
      job.companyId || 
      (job.company && typeof job.company === 'string' ? job.company : job.company?._id);
    
    // Return company data if found
    if (companyId && companyData[companyId]) {
      return companyData[companyId];
    }
    
    // Fallback to company data embedded in job
    if (job.company && typeof job.company === 'object') {
      return job.company;
    }
    
    // Otherwise fallback to basic data
    return {
      name: job.companyName || "Unknown Company",
      logo: job.companyLogo || null
    };
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return "N/A";
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          mt: 2, 
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '4px' // Less curved edges
        }}
      >
        <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Date Posted</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3].map((index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width={150} />
                    <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Skeleton variant="circular" width={30} height={30} sx={{ mr: 1 }} />
                      <Skeleton variant="text" width={100} />
                    </Box>
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                    <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: '2px' }} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton variant="circular" width={32} height={32} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mt: 2,
          borderRadius: '4px' // Less curved edges
        }}
      >
        {error}
      </Alert>
    );
  }

  // Empty state
  if (!jobs || jobs.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          textAlign: 'center',
          py: 4,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '4px', // Less curved edges
          mt: 2
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No jobs posted yet
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mt: 2, 
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '4px' // Less curved edges
      }}
    >
      <TableContainer>
        <Table aria-label="jobs table">
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  py: 2,
                  borderBottom: `2px solid ${theme.palette.divider}`
                }}
              >
                Title
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  py: 2,
                  borderBottom: `2px solid ${theme.palette.divider}`
                }}
              >
                Company
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  py: 2,
                  borderBottom: `2px solid ${theme.palette.divider}`
                }}
              >
                Location
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  py: 2,
                  borderBottom: `2px solid ${theme.palette.divider}`
                }}
              >
                Date Posted
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  py: 2,
                  borderBottom: `2px solid ${theme.palette.divider}`
                }}
              >
                Status
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  fontWeight: 'bold', 
                  py: 2,
                  borderBottom: `2px solid ${theme.palette.divider}`
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => {
              const company = getCompanyData(job);
              return (
                <TableRow 
                  key={job._id} 
                  hover
                  sx={{ 
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.primary.main, 0.04) 
                    },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ py: 2 }}>
                    <Typography variant="body1" fontWeight="500">
                    {job.title}
                  </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    {job.jobType}
                      {job.positions && (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          • {job.positions} positions
                        </Typography>
                      )}
                  </Typography>
                </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {/* Company logo */}
                      <Avatar
                        src={company?.logo}
                        alt={company?.name || "Company"}
                        variant="square" // Square avatar for less curves
                        sx={{
                          width: 28,
                          height: 28,
                          mr: 1.5,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          borderRadius: '2px' // Very slight rounding
                        }}
                      >
                        {company?.name ? company.name.charAt(0).toUpperCase() : <BusinessIcon fontSize="small" />}
                      </Avatar>
                      <Typography variant="body2" fontWeight="500">
                        {company?.name || "Unknown Company"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.9rem' }} />
                      {job.location || "Not specified"}
                    </Typography>
                </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.9rem' }} />
                      {formatDate(job.datePosted || job.createdAt)}
                    </Typography>
                </TableCell>
                  <TableCell sx={{ py: 2 }}>
                  <Chip
                    label={job.isClosed ? 'Closed' : 'Open'}
                    color={job.isClosed ? 'error' : 'success'}
                    size="small"
                      sx={{ 
                        borderRadius: '2px', // Less curved edges
                        fontWeight: 500,
                        height: '24px'
                      }}
                  />
                </TableCell>
                  <TableCell align="right" sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="View Applicants">
                        <IconButton
                          onClick={() => handleViewApplicants(job._id)}
                          size="small"
                          sx={{ 
                            color: theme.palette.primary.main,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            mr: 1,
                            borderRadius: '2px' // Less curved edges
                          }}
                        >
                          <PeopleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Job">
                        <IconButton
                          onClick={() => handleEdit(job._id)}
                          size="small"
                          sx={{ 
                            color: theme.palette.primary.main,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            mr: 1,
                            borderRadius: '2px' // Less curved edges
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Job">
                    <IconButton
                          onClick={() => handleDelete(job._id)}
                          size="small"
                          sx={{ 
                            color: theme.palette.error.main,
                            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                            borderRadius: '2px' // Less curved edges
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                    </Box>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default JobsTable;
