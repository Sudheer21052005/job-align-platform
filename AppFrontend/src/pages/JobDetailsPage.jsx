// src/pages/JobDetailsPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress, 
  Container, 
  Box, 
  Chip,
  Avatar,
  Divider,
  Paper,
  Grid,
  useTheme,
  alpha,
} from "@mui/material";
import { 
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { fetchJobDetails, fetchCompanyById } from "../api/api";

const JobDetailsPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getJobDetails = async () => {  
      if (!id) {
        setError("No job ID provided");
        setLoading(false);
        return;
      }
      
      try {
        const data = await fetchJobDetails(id);
        if (!data) {
          throw new Error("Job not found");
        }
        setJob(data);
        
        // Fetch company data if companyId exists
        if (data.companyId) {
          try {
            const companyData = await fetchCompanyById(data.companyId);
            setCompany(companyData);
          } catch (companyErr) {
            console.error("Error fetching company details:", companyErr);
            // Don't set error here, continue with job data
          }
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError(err.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    getJobDetails();
  }, [id]);

  // Get company logo and name, using fallbacks if needed
  const companyName = company?.name || job?.companyName || job?.company?.name || "Unknown Company";
  const companyLogo = company?.logo || job?.company?.logo || null;
  const recruiterName = company?.recruiterName || job?.recruiterName || job?.postedBy?.name || "Unknown Recruiter";
  const jobLocation = job?.location || company?.location || "Location not specified";

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: theme.shape.borderRadius,
            bgcolor: alpha(theme.palette.error.light, 0.1),
            borderLeft: `4px solid ${theme.palette.error.main}`,
          }}
        >
          <Typography variant="h6" color="error.main" gutterBottom>
            Error Loading Job Details
          </Typography>
          <Typography variant="body1" paragraph>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/jobs')}
          >
            Browse Other Jobs
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: theme.shape.borderRadius,
            bgcolor: alpha(theme.palette.primary.light, 0.1),
          }}
        >
          <Typography variant="h6" gutterBottom>
            Job Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The job you're looking for may have been removed or doesn't exist.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/jobs')}
          >
            Browse Jobs
          </Button>
        </Paper>
      </Container>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Unknown date";
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Unknown date";
    }
  };

  const postedDate = formatDate(job.postedDate || job.createdAt || job.datePosted);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid container spacing={3}>
          {/* Company Logo and Info */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {companyLogo ? (
                <Avatar 
                  src={companyLogo} 
                  alt={companyName}
                  sx={{ 
                    width: 80, 
                    height: 80,
                    mr: 2,
                    boxShadow: theme.shadows[1],
                  }}
                />
              ) : (
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80,
                    mr: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    boxShadow: theme.shadows[1],
                  }}
                >
                  {companyName.charAt(0).toUpperCase()}
                </Avatar>
              )}
              
              <Box>
                <Typography variant="h4" sx={{ fontWeight: theme.typography.fontWeightBold }}>
                  {job.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <BusinessIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">
                    {companyName}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          {/* Apply Button */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(`/apply/${id}`)}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: '50px',
              }}
            >
              Apply Now
            </Button>
          </Grid>
        </Grid>
        
        {/* Key Details Chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3 }}>
          {job.jobType && (
            <Chip 
              icon={<WorkIcon />} 
              label={job.jobType}
              sx={{ 
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.dark,
                fontWeight: 500,
              }} 
            />
          )}
          
          {jobLocation && (
            <Chip 
              icon={<LocationIcon />} 
              label={jobLocation}
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.dark,
                fontWeight: 500,
              }} 
            />
          )}
          
          {job.salaryLPA && (
            <Chip 
              icon={<SalaryIcon />} 
              label={`₹${job.salaryLPA} LPA`}
              sx={{ 
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.dark,
                fontWeight: 500,
              }} 
            />
          )}
          
          {postedDate && postedDate !== "Unknown date" && (
            <Chip 
              icon={<CalendarIcon />} 
              label={`Posted on ${postedDate}`}
              sx={{ 
                bgcolor: alpha(theme.palette.grey[500], 0.1),
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }} 
            />
          )}
          
          {recruiterName && recruiterName !== "Unknown Recruiter" && (
            <Chip 
              icon={<PersonIcon />} 
              label={`Posted by ${recruiterName}`}
              sx={{ 
                bgcolor: alpha(theme.palette.grey[500], 0.1),
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }} 
            />
          )}
        </Box>
      </Paper>
      
      {/* Job Description */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: theme.typography.fontWeightBold }}>
          Job Description
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {job.description || "No job description provided."}
        </Typography>
      </Paper>
      
      {/* Requirements Section */}
      {job.skills && job.skills.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: theme.typography.fontWeightBold }}>
            Required Skills
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {job.skills.map((skill, index) => (
              <Chip 
                key={index} 
                label={skill}
                sx={{ 
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.dark,
                  fontWeight: 500,
                }} 
              />
            ))}
          </Box>
        </Paper>
      )}
      
      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/jobs')}
        >
          Back to Jobs
        </Button>
        
        <Button
          variant="contained"
          onClick={() => navigate(`/apply/${id}`)}
          sx={{ borderRadius: '50px', px: 4 }}
        >
          Apply Now
        </Button>
      </Box>
    </Container>
  );
};

export default JobDetailsPage;
