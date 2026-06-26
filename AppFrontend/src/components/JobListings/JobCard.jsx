// src/components/JobListings/JobCard.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Chip,
  Avatar,
  Box,
  Skeleton,
  useTheme,
  CardContent,
  alpha,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useAuth } from "../../auth/AuthContext";
import { fetchCompanyById, saveJob, unsaveJob } from "../../api/api";
import { useSnackbar } from "../../contexts/SnackbarContext";

// IMPORTANT: Make sure the hook name & file path match your actual file.
// If your file is named useFetchJob.js, import from "../hooks/useFetchJob" (singular).
import useGetCompanyById from "../../hooks/useGetCompanyById";
import useFetchJob from "../../hooks/useFetchJobs"; // or useFetchJobs if that file is for a single job

const JobCard = ({ job }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userRole } = useAuth();
  const { showSnackbar } = useSnackbar();
  const jobId = job._id || job.id;
  
  const [company, setCompany] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(job?.isSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  // Get user from localStorage if context hasn't initialized yet
  let userFromStorage = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      userFromStorage = JSON.parse(userStr);
    }
  } catch (err) {
    console.error('Error parsing user from localStorage:', err);
  }
  
  // Define effectiveUserRole at component level
  const effectiveUserRole = userRole || (userFromStorage ? userFromStorage.role : null);

  // Fetch company data if job has a companyId
  useEffect(() => {
    const fetchCompanyData = async () => {
      // Check if job.company is a string (ID) rather than an object
      const companyId = job?.companyId || 
        (job?.company && typeof job.company === 'string' ? job.company : job?.company?._id);
      
      if (companyId) {
        setCompanyLoading(true);
        try {
          const companyData = await fetchCompanyById(companyId);
          setCompany(companyData);
        } catch (err) {
          console.error("Error fetching company data:", err);
        } finally {
          setCompanyLoading(false);
        }
      } else if (job.company && typeof job.company === 'object' && (job.company.name || job.company.logo)) {
        // If job already has embedded company data, use it directly
        setCompany(job.company);
        setCompanyLoading(false);
      } else if (job.companyName) {
        // Create minimal company object from job fields
        setCompany({
          name: job.companyName,
          logo: job.companyLogo || null
        });
        setCompanyLoading(false);
      }
    };
    
    fetchCompanyData();
  }, [job]);

  // Update isSaved when job changes
  useEffect(() => {
    if (job && job.isSaved !== undefined) {
      setIsSaved(job.isSaved);
    }
  }, [job]);

  // If still loading, show a skeleton loader
  if (!job || companyLoading) {
    return (
      <Card sx={{ 
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        height: "100%" 
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Skeleton variant="text" width={150} height={30} />
              <Skeleton variant="text" width={200} height={24} />
            </Box>
            <Skeleton variant="circular" width={50} height={50} />
          </Box>
          <Skeleton variant="text" width="70%" height={28} sx={{ mt: 2 }} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: theme.shape.borderRadius / 2 }} />
            <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: theme.shape.borderRadius / 2 }} />
            <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: theme.shape.borderRadius / 2 }} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: theme.shape.borderRadius / 2 }} />
            <Skeleton variant="text" width={80} height={24} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Improved data extraction with better debugging
  const postedTime = job.postedDate || job.createdAt || job.datePosted || null;
  
  // Better fallbacks for company information
  const companyName = company?.name || job.company?.name || job.companyName || "Unknown Company";
  const recruiterName = company?.recruiterName || job.recruiterName || job.postedBy?.name || "Unknown Recruiter";
  const companyLocation = job.location || company?.location || "Unknown Location";
  const jobTitle = job.title || "Untitled Position";
  const jobDescription = job.description || "No description provided.";
  const positions = job.positions || 0;
  const jobType = job.jobType || "Not specified";
  const salary = job.salaryLPA || 0;
  const companyLogo = company?.logo || job.company?.logo || job.companyLogo || null;

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Unknown date";
      
      const now = new Date();
      const diffTime = now - date;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Unknown date";
    }
  };

  // Show fallback if no logo
  const showFallback = !companyLogo;

  // Helper function to truncate description
  const truncateDescription = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Handle saving or unsaving a job
  const handleSaveToggle = async (e) => {
    e.stopPropagation(); // Prevent card click
    
    
    // Redirect to login if not authenticated (check both context and localStorage)
    if ((!currentUser || !currentUser.id || !currentUser._id) && !userFromStorage) {
      showSnackbar('Please log in to save jobs', 'info');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    // Get the user ID from either context or localStorage
    const userId = currentUser?._id || currentUser?.id || userFromStorage?._id || userFromStorage?.id;
    
    if (!userId) {
      showSnackbar('Authentication error. Please log in again.', 'error');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    // No action for recruiters
    if (effectiveUserRole === 'recruiter') {
      showSnackbar('Recruiters cannot save jobs', 'info');
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (isSaved) {
        const result = await unsaveJob(job._id);
        setIsSaved(false);
        showSnackbar('Job removed from saved jobs', 'success');
      } else {
        const result = await saveJob(job._id);
        setIsSaved(true);
        showSnackbar('Job saved successfully', 'success');
      }
    } catch (err) {
      console.error('Error saving/unsaving job:', err);
      showSnackbar(err.response?.data?.message || err.message || 'Error saving job', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = formatDate(postedTime);

  return (
    <Card
      sx={{
        height: "100%",
        p: 0,
        overflow: "hidden",
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        transition: theme.transitions.create(['transform', 'box-shadow']),
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        }
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Company Banner */}
        <Box 
          sx={{ 
            height: 12, 
            bgcolor: 'primary.main', 
            width: "100%" 
          }} 
        />

        <Box sx={{ p: 3 }}>
          {/* Top Row: Company Info */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Always render Avatar, with fallback if no logo */}
              <Avatar
                src={companyLogo}
                alt={companyName}
                sx={{
                  width: 50,
                  height: 50,
                  mr: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                }}
              >
                {companyName ? companyName.charAt(0).toUpperCase() : "C"}
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 0.5 }}
                >
                  {companyName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationOnIcon
                    fontSize="small"
                    sx={{ color: "text.secondary", mr: 0.5, fontSize: "0.875rem" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {companyLocation}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Save Button */}
            <Tooltip title={isSaved ? "Remove from saved" : "Save job"}>
              <Button
                onClick={handleSaveToggle}
                size="small"
                disabled={isSaving || effectiveUserRole === 'recruiter'}
                sx={{
                  minWidth: 'auto',
                  p: 1,
                  borderRadius: '50%',
                  color: isSaved ? 'primary.main' : 'action.active',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                {isSaving ? (
                  <CircularProgress size={20} color="inherit" />
                ) : isSaved ? (
                  <BookmarkIcon />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </Button>
            </Tooltip>
          </Box>

          {/* Job Title */}
          <Typography 
            variant="h6" 
            fontWeight={theme.typography.fontWeightBold} 
            sx={{ 
              color: 'text.primary',
              mb: 1.5 
            }}
          >
            {jobTitle}
          </Typography>

          {/* Job Description */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              mb: 2.5,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              lineHeight: 1.5
            }}
          >
            {truncateDescription(jobDescription, 150)}
          </Typography>

          {/* Job Specs */}
          <Box 
            sx={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: 1.5,
              mb: 2.5
            }}
          >
            {jobType && jobType !== "Not specified" && (
              <Chip
                icon={<BusinessCenterIcon fontSize="small" />}
                label={jobType}
                variant="outlined"
                size="small"
                sx={{ 
                  borderColor: theme.palette.divider,
                  backgroundColor: 'background.paper',
                  '& .MuiChip-icon': {
                    color: 'primary.main'
                  }
                }}
              />
            )}
            
            {positions > 0 && (
              <Chip
                icon={<BusinessCenterIcon fontSize="small" />}
                label={`${positions} position${positions > 1 ? 's' : ''}`}
                variant="outlined"
                size="small"
                sx={{ 
                  borderColor: theme.palette.divider,
                  backgroundColor: 'background.paper',
                  '& .MuiChip-icon': {
                    color: 'secondary.main'
                  }
                }}
              />
            )}
            
            {salary > 0 && (
              <Chip
                icon={<MonetizationOnIcon fontSize="small" />}
                label={`${salary} LPA`}
                variant="outlined"
                size="small"
                sx={{ 
                  borderColor: theme.palette.divider,
                  backgroundColor: 'background.paper',
                  '& .MuiChip-icon': {
                    color: 'success.main'
                  }
                }}
              />
            )}
          </Box>

          {/* Bottom Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: `1px solid ${theme.palette.divider}`,
              pt: 2,
            }}
          >
            <Button
              variant="contained"
              component={Link}
              to={`/jobs/${jobId}`}
              sx={{
                px: 3,
                borderRadius: theme.shape.borderRadius,
                fontWeight: theme.typography.fontWeightMedium,
                boxShadow: theme.shadows[1],
                '&:hover': {
                  boxShadow: theme.shadows[3],
                  transform: 'translateY(-2px)',
                }
              }}
            >
              View Details
            </Button>
            
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center",
                color: 'text.secondary',
                fontSize: "0.75rem"
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: "0.875rem", mr: 0.5 }} />
              {formattedDate}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;
