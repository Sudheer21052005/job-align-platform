// src/pages/ManageApplicantsPage.jsx

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Link,
  Box,
  Paper,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  Button,
  TableContainer,
  TablePagination,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Card,
  Grid,
  FormControl,
  InputLabel,
  Alert,
  Skeleton,
  Menu,
  Fade,
  Avatar
} from "@mui/material";
import {
  fetchUserApplications,
  updateApplicantStatus,
  fetchRecruiterJobDetails,
  fetchUserResume,
} from "../api/api";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const ManageApplicantsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState({});
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('applicationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);

  // Status options with color mapping
  const statusOptions = [
    { value: 'applied', label: 'Pending', color: theme.palette.warning.main },
    { value: 'accepted', label: 'Accepted', color: theme.palette.success.main },
    { value: 'rejected', label: 'Rejected', color: theme.palette.error.main },
    { value: 'interviewing', label: 'Interviewing', color: theme.palette.info.main },
  ];

  // Load job and applicants data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
      try {
        // 1) Fetch job details for the header
        const jobData = await fetchRecruiterJobDetails(jobId);
      if (!jobData) {
        throw new Error('Job not found');
      }
        setJobDetails(jobData);

        // 2) Fetch raw applications for this job
        const applicationsData = await fetchUserApplications(jobId);
      if (!applicationsData || !Array.isArray(applicationsData)) {
        throw new Error('Failed to fetch applicants');
      }

        // 3) For each application, fetch the candidate's resume using fetchUserResume.
        const enrichedApplicants = await Promise.all(
          applicationsData.map(async (application) => {
            let resumeData = null;
            try {
              // Get all resumes for this candidate
            const resumesResponse = await fetchUserResume(application.user?._id);
              if (
                resumesResponse &&
                resumesResponse.resumes &&
                resumesResponse.resumes.length > 0
              ) {
                // Try to find the resume that matches the application's resume ID;
                // if not found, default to the first resume.
                resumeData =
                  resumesResponse.resumes.find(
                    (r) => r._id === application.resume
                  ) || resumesResponse.resumes[0];
              }
            } catch (err) {
              console.error("Error fetching resume for user:", err);
            }
          return { 
            ...application, 
            resumeData,
            // Ensure we have these fields for display
            displayName: resumeData?.name || application.user?.name || "N/A",
            displayEmail: resumeData?.email || application.user?.email || "N/A",
            displayPhone: resumeData?.phoneNumber || "N/A",
          };
          })
        );

        setApplicants(enrichedApplicants);
      setFilteredApplicants(enrichedApplicants);
      } catch (error) {
        console.error("Error fetching data:", error);
      setError(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
  }, [jobId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Apply filters, sorting, and search
  useEffect(() => {
    let result = [...applicants];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(app => app.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(app => 
        app.displayName.toLowerCase().includes(query) ||
        app.displayEmail.toLowerCase().includes(query) ||
        app.displayPhone.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch(sortField) {
        case 'name':
          aValue = a.displayName || '';
          bValue = b.displayName || '';
          break;
        case 'applicationDate':
          aValue = new Date(a.applicationDate || 0);
          bValue = new Date(b.applicationDate || 0);
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        default:
          aValue = a[sortField] || '';
          bValue = b[sortField] || '';
      }
      
      // Compare based on sort direction
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredApplicants(result);
    setPage(0); // Reset to first page when filters change
  }, [applicants, searchQuery, statusFilter, sortField, sortDirection]);

  // Update applicant status
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setStatusUpdating((prev) => ({ ...prev, [applicationId]: true }));
      await updateApplicantStatus(applicationId, newStatus);
      
      // Update local state
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      // Show feedback (could add a success toast here)
    } catch (error) {
      console.error("Error updating applicant status:", error);
      // Show error feedback
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle sort menu
  const handleSortMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
    handleSortMenuClose();
  };

  // Get status chip color and label
  const getStatusChip = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status) || 
      { value: status, label: status, color: theme.palette.grey[500] };
    
    return (
      <Chip 
        label={statusOption.label}
        size="small"
        sx={{ 
          bgcolor: alpha(statusOption.color, 0.1),
          color: statusOption.color,
          fontWeight: 'medium',
          borderRadius: '4px'
        }}
      />
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" width="60%" height={40} sx={{ mb: 3 }} />
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={40} />
            </Grid>
            <Grid item xs={12} md={2}>
              <Skeleton variant="rectangular" height={40} />
            </Grid>
            <Grid item xs={12} md={2}>
              <Skeleton variant="rectangular" height={40} />
            </Grid>
            <Grid item xs={12} md={2}>
              <Skeleton variant="rectangular" height={40} />
            </Grid>
          </Grid>
        </Paper>
        <Paper>
          <Skeleton variant="rectangular" height={400} />
        </Paper>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/recruiter-job')}
          sx={{ mb: 3 }}
        >
          Back to Jobs
        </Button>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header section */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
        <Box>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/recruiter-job')}
            sx={{ mb: 1 }}
          >
            Back to Jobs
          </Button>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Manage Applicants
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 2, md: 0 } }}>
            <WorkIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" color="text.secondary">
              {jobDetails?.title || `Job ID: ${jobId}`}
            </Typography>
          </Box>
        </Box>
        
        <Card 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}
        >
          <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" color="primary.main">
            {filteredApplicants.length} {filteredApplicants.length === 1 ? 'Applicant' : 'Applicants'}
      </Typography>
        </Card>
      </Box>
      
      {/* Filters and search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search by name, email, or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Button 
              fullWidth
              variant="outlined"
              startIcon={<SortIcon />}
              onClick={handleSortMenuOpen}
            >
              Sort By
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleSortMenuClose}
              TransitionComponent={Fade}
            >
              <MenuItem onClick={() => handleSortChange('applicationDate')}>
                Date Applied {sortField === 'applicationDate' && (sortDirection === 'desc' ? '↓' : '↑')}
              </MenuItem>
              <MenuItem onClick={() => handleSortChange('name')}>
                Name {sortField === 'name' && (sortDirection === 'desc' ? '↓' : '↑')}
              </MenuItem>
              <MenuItem onClick={() => handleSortChange('status')}>
                Status {sortField === 'status' && (sortDirection === 'desc' ? '↓' : '↑')}
              </MenuItem>
            </Menu>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Button 
              fullWidth
              variant="contained"
              color="primary"
              onClick={loadData}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Applicants table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {filteredApplicants.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <HourglassEmptyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No applicants found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {applicants.length > 0 
                ? 'Try changing your search or filter criteria'
                : 'No one has applied for this job yet.'}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
          <TableHead>
            <TableRow>
                    <TableCell><Typography fontWeight="bold">Candidate</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Contact</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Applied Date</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Resume</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                  {filteredApplicants
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((app) => {
                      const { _id, displayName, displayEmail, displayPhone, resumeData, applicationDate, status } = app;
              const resumeLink = resumeData?.filePath;

              return (
                        <TableRow key={_id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.2) }}>
                                {displayName.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography noWrap>{displayName}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" noWrap>{displayEmail}</Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>{displayPhone}</Typography>
                          </TableCell>
                          <TableCell>
                            {applicationDate 
                              ? new Date(applicationDate).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'N/A'
                            }
                          </TableCell>
                  <TableCell>
                    {resumeLink ? (
                              <Button
                        href={resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                                startIcon={<GetAppIcon />}
                                variant="outlined"
                                size="small"
                              >
                                Download
                              </Button>
                            ) : (
                              <Typography variant="body2" color="text.secondary">Not available</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                            {getStatusChip(status)}
                  </TableCell>
                  <TableCell>
                            <FormControl fullWidth size="small">
                    <Select
                      value={status}
                                onChange={(e) => handleStatusChange(_id, e.target.value)}
                      disabled={statusUpdating[_id]}
                                displayEmpty
                                renderValue={(value) => (
                                  <Typography variant="body2">
                                    {statusUpdating[_id] ? 'Updating...' : 'Update Status'}
                                  </Typography>
                                )}
                                sx={{ minWidth: 130 }}
                              >
                                {statusOptions.map(option => (
                                  <MenuItem 
                                    key={option.value} 
                                    value={option.value}
                                    disabled={status === option.value}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Box 
                      sx={{
                                          width: 8, 
                                          height: 8, 
                                          borderRadius: '50%', 
                                          bgcolor: option.color,
                                          mr: 1 
                                        }} 
                                      />
                                      {option.label}
                                    </Box>
                                  </MenuItem>
                                ))}
                    </Select>
                            </FormControl>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredApplicants.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ManageApplicantsPage;
