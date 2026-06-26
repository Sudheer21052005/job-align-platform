// src/pages/RecruiterDashboardPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Divider,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Skeleton,
  useTheme,
  alpha,
} from "@mui/material";
import { 
  Add as AddIcon, 
  Business as BusinessIcon,
  PeopleAlt as PeopleAltIcon,
  WorkOutline as WorkOutlineIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";
import { useAuth } from "../auth/AuthContext";
import { fetchJobs, deleteJob, getRecruiterJobs, fetchCompanyById } from "../api/api";
import { useNavigate } from "react-router-dom";

// Dashboard summary card component
const DashboardCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  
  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '4px', // Less curved edges
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[2], // Lighter shadow
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.08),
              color: color,
              mr: 2,
              borderRadius: '2px', // Square with slight rounding
              width: 40,
              height: 40
            }}
            variant="square"
          >
            {icon}
          </Avatar>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" fontWeight="bold" align="center" sx={{ my: 2 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Job card component with loading skeleton
const JobCard = ({ job, onDelete, onViewApplicants, onEdit }) => {
  const theme = useTheme();
  const [company, setCompany] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(false);
  const id = job?.id || job?._id;
  
  // Fetch company data if job.company is a string (ID)
  useEffect(() => {
    const fetchCompanyData = async () => {
      // Check if company is a string ID rather than an object
      const companyId = job?.companyId || 
        (job?.company && typeof job.company === 'string' ? job.company : job?.company?._id);
      
      
      if (companyId) {
        setCompanyLoading(true);
        try {
          const companyData = await fetchCompanyById(companyId);
          setCompany(companyData);
        } catch (err) {
          console.error(`RecruiterDashboard JobCard: Error fetching company:`, err);
        } finally {
          setCompanyLoading(false);
        }
      } else if (job.company && typeof job.company === 'object' && (job.company.name || job.company.logo)) {
        // Use embedded company data
        setCompany(job.company);
      } else if (job.companyName) {
        // Create minimal company object
        setCompany({
          name: job.companyName,
          logo: job.companyLogo || null
        });
      }
    };
    
    fetchCompanyData();
  }, [job, id]);
  
  // Get company name and logo with proper fallbacks
  const companyName = company?.name || 
    (job.company && typeof job.company === 'object' ? job.company.name : null) || 
    job.companyName || 
    "Unknown Company";
    
  const companyLogo = company?.logo || 
    (job.company && typeof job.company === 'object' ? job.company.logo : null) || 
    job.companyLogo || 
    null;
  
  // Calculate applicant count properly - check if applicants exists and is an array
  const hasApplicantsArray = job.applicants && Array.isArray(job.applicants);
  const applicantCount = hasApplicantsArray ? job.applicants.length : 0;
  
  // Ensure skills is always an array
  const skills = job.skills && Array.isArray(job.skills) ? job.skills : [];
  
  // For displaying job date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Unknown date";
      }
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return "Unknown date";
    }
  };
  
  // For loading state
  if (companyLoading) {
    return <JobCardSkeleton />;
  }
  
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: "12px",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        backgroundColor: "background.paper",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": { 
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4]
        },
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
              mb: 1,
              width: 'calc(100% - 50px)' // Make room for logo
          }}
        >
            {job.title || "Untitled Job"}
        </Typography>
          
          {/* Always display company logo/avatar with fallback */}
          <Avatar 
            src={companyLogo} 
            alt={companyName}
            variant="rounded"
            sx={{ 
              width: 40, 
              height: 40,
              bgcolor: alpha(theme.palette.primary.main, 0.1)
            }}
          >
            <BusinessIcon />
          </Avatar>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <BusinessIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {companyName} • {job.location || 'Location N/A'}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
          {job.jobType && (
            <Chip 
              label={job.jobType} 
              size="small"
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 500,
                borderRadius: "8px",
              }} 
            />
          )}
          
          {job.positions > 0 && (
            <Chip 
              label={`${job.positions} ${job.positions > 1 ? 'positions' : 'position'}`} 
              size="small"
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 500,
                borderRadius: "8px",
              }}
            />
          )}
          
          <Chip 
            label={`${applicantCount} applicant${applicantCount !== 1 ? 's' : ''}`}
            size="small" 
            sx={{ 
              backgroundColor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.main,
              fontWeight: 500,
              borderRadius: "8px",
            }} 
          />
          
          {job.isClosed && (
            <Chip 
              label="Closed" 
              size="small"
              sx={{ 
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                fontWeight: 500,
                borderRadius: "8px",
              }}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {job.experience ? `Experience: ${job.experience}` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.salaryLPA ? `Salary: ₹${job.salaryLPA} LPA` : ''}
            </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {skills.slice(0, 3).map((skill, index) => (
                <Chip 
                  key={index}
                  label={skill}
                  size="small"
              variant="outlined"
                  sx={{ 
                fontSize: '0.7rem',
                height: 20,
                borderColor: alpha(theme.palette.info.main, 0.5),
                color: theme.palette.info.main,
                borderRadius: "8px",
                  }}
                />
              ))}
          {skills.length > 3 && (
                <Chip 
              label={`+${skills.length - 3} more`}
                  size="small"
              variant="outlined"
                  sx={{ 
                fontSize: '0.7rem',
                height: 20,
                borderColor: alpha(theme.palette.info.main, 0.5),
                color: theme.palette.info.main,
                borderRadius: "8px",
                  }}
                />
              )}
            </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Posted: {formatDate(job.datePosted || job.createdAt)}
          </Typography>
          <Box>
        <IconButton 
          size="small" 
              color="primary" 
          onClick={() => onViewApplicants(id)}
              title="View applicants"
        >
              <PeopleAltIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
              color="primary" 
          onClick={() => onEdit(id)}
              title="Edit job"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
              color="error" 
          onClick={() => onDelete(id)}
              title="Delete job"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Loading skeleton for job cards
const JobCardSkeleton = () => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: "12px",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Skeleton variant="text" width="70%" height={32} />
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
        
        <Skeleton variant="text" width="90%" height={24} sx={{ mb: 1.5 }} />
        
        <Skeleton variant="rectangular" height={1} sx={{ my: 1.5 }} />
        
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={60} height={24} />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="text" width="30%" height={24} />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Skeleton variant="rounded" width={60} height={20} />
          <Skeleton variant="rounded" width={60} height={20} />
          <Skeleton variant="rounded" width={60} height={20} />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Skeleton variant="text" width="30%" height={16} />
          <Skeleton variant="rounded" width={70} height={20} />
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'flex-end' }}>
        <Skeleton variant="circular" width={30} height={30} />
        <Skeleton variant="circular" width={30} height={30} />
        <Skeleton variant="circular" width={30} height={30} />
      </CardActions>
    </Card>
  );
};

const RecruiterDashboardPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    activeJobs: 0
  });
  const navigate = useNavigate();

  // Optional: Redirect if not recruiter
  useEffect(() => {
    if (user && user.role !== "recruiter") {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

  // Fetch jobs with the more specific getRecruiterJobs function
  const fetchRecruiterJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRecruiterJobs();
      
        if (response && Array.isArray(response.jobs)) {
        // Process jobs to ensure company data is properly loaded
        const processedJobs = await Promise.all(response.jobs.map(async (job) => {
          // Ensure applicants is always an array
          const applicants = job.applicants ? 
            (Array.isArray(job.applicants) ? job.applicants : []) : [];
          
          // Check if company is a string ID rather than an object
          const companyId = job.companyId || 
            (job.company && typeof job.company === 'string' ? job.company : job.company?._id);
          
          
          // If we need to fetch company data
          if (companyId && (!job.company || typeof job.company === 'string' || !job.company.name || !job.company.logo)) {
            try {
              const companyData = await fetchCompanyById(companyId);
              
              return {
                ...job,
                company: companyData,
                // Also set these fields for backward compatibility
                companyName: companyData?.name || job.companyName || "Unknown Company",
                companyLogo: companyData?.logo || job.companyLogo || null,
                applicants: applicants
              };
            } catch (err) {
              console.error(`RecruiterDashboard: Error fetching company for job ${job._id}:`, err);
              // Return job with applicants array but without company data
              return {
                ...job,
                applicants: applicants
              };
            }
          }
          
          // If job already has proper company object
          if (job.company && typeof job.company === 'object') {
            return {
              ...job,
              // Ensure these fields are available for backward compatibility
              companyName: job.company.name || job.companyName || "Unknown Company",
              companyLogo: job.company.logo || job.companyLogo || null,
              applicants: applicants
            };
          }
          
          // Otherwise, just ensure applicants is an array
          return {
            ...job,
            applicants: applicants
          };
        }));
        
        setJobs(processedJobs);
        
        // Calculate dashboard statistics
        const totalJobs = processedJobs.length;
        const activeJobs = processedJobs.filter(job => !job.isClosed).length;
        const totalApplicants = processedJobs.reduce((sum, job) => 
          sum + (Array.isArray(job.applicants) ? job.applicants.length : 0), 0);
        
        setDashboardStats({
          totalJobs,
          activeJobs,
          totalApplicants
        });
        } else {
        setJobs([]);
        setDashboardStats({
          totalJobs: 0,
          activeJobs: 0,
          totalApplicants: 0
        });
        }
      } catch (err) {
      console.error("RecruiterDashboard: Error fetching recruiter jobs:", err);
      setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchRecruiterJobs();
  }, [fetchRecruiterJobs]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(id);
      fetchRecruiterJobs(); // Refresh the job list after deletion
    } catch (err) {
      console.error("Error deleting job:", err);
      setError("Failed to delete job. Please try again.");
    }
  };
  
  const handleEdit = (id) => {
    navigate(`/recruiter-dashboard/edit-job/${id}`);
  };
  
  const handleViewApplicants = (id) => {
    navigate(`/manage-applicants/${id}`);
  };
  
  const handlePostNewJob = () => {
    navigate("/recruiter-dashboard/new-job");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        mb: 4
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: { xs: 2, sm: 0 }
          }}
        >
        Recruiter Dashboard
      </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handlePostNewJob}
          sx={{
            borderRadius: '4px', // Less curved edges
            textTransform: 'none',
            px: 3,
            py: 1,
            boxShadow: theme.shadows[1],
            '&:hover': {
              boxShadow: theme.shadows[2],
            }
          }}
        >
          Post New Job
        </Button>
      </Box>
      
      {/* Dashboard Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <DashboardCard 
            title="Total Jobs" 
            value={loading ? '—' : dashboardStats.totalJobs} 
            icon={<WorkOutlineIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DashboardCard 
            title="Active Jobs" 
            value={loading ? '—' : dashboardStats.activeJobs} 
            icon={<BusinessIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DashboardCard 
            title="Total Applicants" 
            value={loading ? '—' : dashboardStats.totalApplicants} 
            icon={<PeopleAltIcon />}
            color={theme.palette.secondary.main}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
                  sx={{
            fontWeight: 600, 
            mb: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <WorkOutlineIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          Your Job Listings
                    </Typography>
        <Divider sx={{ borderColor: theme.palette.divider }} />
      </Box>
      
      {/* Error state */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: '4px' // Less curved edges
          }}
        >
          {error}
        </Alert>
      )}
      
      {/* Job Grid - ensure consistent 2-column layout */}
      <Grid container spacing={3}>
        {loading ? (
          // Loading skeleton - 2 columns per row
          Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={`skeleton-${index}`}>
              <JobCardSkeleton />
            </Grid>
          ))
        ) : jobs.length > 0 ? (
          // Job cards - 2 columns per row
          jobs.map((job) => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={job._id || job.id}>
              <JobCard 
                job={job}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onViewApplicants={handleViewApplicants}
              />
              </Grid>
          ))
        ) : (
          // Empty state - full width
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: '4px', // Less curved edges
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.info.light, 0.05)
              }}
            >
              <Typography variant="h6" gutterBottom>
                No jobs posted yet
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Create your first job listing to start receiving applications
            </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handlePostNewJob}
                sx={{ 
                  mt: 1,
                  borderRadius: '4px', // Less curved edges
                  textTransform: 'none'
                }}
              >
                Post Your First Job
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default RecruiterDashboardPage;
