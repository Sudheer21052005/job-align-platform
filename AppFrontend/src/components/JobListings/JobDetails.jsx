// src/components/JobListings/JobDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  IconButton,
  Avatar,
  Paper,
  Skeleton,
  useTheme,
  alpha,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PeopleIcon from "@mui/icons-material/People";
import { fetchJobDetails, fetchUserProfile, fetchUserApplications, fetchCompanyById } from "../../api/api";

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to track if the user has applied to this job
  const [hasApplied, setHasApplied] = useState(false);
  const [company, setCompany] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(false);

  // Check if user applied from location state (coming from apply form)
  useEffect(() => {
    if (location.state?.applied) {
      setHasApplied(true);
    }
  }, [location.state]);

  useEffect(() => {
    if (!id) {
      setError("No job ID provided");
      setLoading(false);
      return;
    }
    const getJobDetails = async () => {
      try {
        const jobData = await fetchJobDetails(id);
        if (!jobData) {
          throw new Error("Job not found");
        }
        setJob(jobData);
      } catch (err) {
        setError(err.message || "Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };
    getJobDetails();
  }, [id]);

  // Check if the user has applied (even after reload) by fetching the user's applications.
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (job && token) {
      const checkApplicationStatus = async () => {
        try {
          const userProfile = await fetchUserProfile();
          if (userProfile && userProfile._id) {
            const applicationsResponse = await fetchUserApplications(userProfile._id);
            const applications = applicationsResponse.applications || [];

            // Check if user has applied to this job
            const applied = applications.some((app) => {
              // Check if app.job is an object with _id or a direct value.
              if (typeof app.job === "object" && app.job._id) {
                return app.job._id.toString() === job._id.toString();
              }
              return app.job.toString() === job._id.toString();
            });

            setHasApplied(applied);
          }
        } catch (err) {
          // Silently fail — this is a public page. If the token is expired,
          // the user simply won't see their application status (which is fine).
          // Do NOT redirect to login from a public page.
        }
      };
      checkApplicationStatus();
    }
  }, [job]);

  // Add new effect to fetch company data
  useEffect(() => {
    if (job) {
      const fetchCompanyData = async () => {
        setCompanyLoading(true);
        try {
          // Check if job.company is a string (ID) rather than an object
          const companyId = job.companyId ||
            (job.company && typeof job.company === 'string' ? job.company : job.company?._id);

          if (companyId) {
            const companyData = await fetchCompanyById(companyId);
            setCompany(companyData);
          }
          // If job has company object with proper data, use it directly
          else if (job.company && typeof job.company === 'object' && (job.company.name || job.company.logo)) {
            setCompany(job.company);
          }
        } catch (err) {
          console.error("Error fetching company data:", err);
        } finally {
          setCompanyLoading(false);
        }
      };

      fetchCompanyData();
    }
  }, [job]);

  // Loading state UI
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
          <Box sx={{ width: "70%" }}>
            <Skeleton variant="text" height={60} width="90%" />
            <Skeleton variant="text" height={20} width="60%" />
          </Box>
          <Skeleton variant="rounded" height={40} width="20%" />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rounded" height={32} width={100} sx={{ mr: 1, display: "inline-block" }} />
          <Skeleton variant="rounded" height={32} width={100} sx={{ mr: 1, display: "inline-block" }} />
          <Skeleton variant="rounded" height={32} width={100} sx={{ display: "inline-block" }} />
        </Box>

        <Skeleton variant="text" height={40} width="40%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} sx={{ mb: 3 }} />

        <Box sx={{ mb: 3 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="text" height={24} sx={{ mb: 1 }} />
          ))}
        </Box>

        <Skeleton variant="text" height={40} width="60%" sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={200} />
      </Container>
    );
  }

  // Error state UI
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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
          <Typography variant="body1" color="text.secondary" paragraph>
            {error}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  // Destructure job details with fallbacks
  const {
    title = "Untitled Position",
    positions,
    jobType,
    salaryLPA,
    skills = [],
    location: jobLocation = "N/A",
    experience = "N/A",
    postedDate,
    description = "No description available.",
    applicants = [],
    recruiterName = "Unknown Recruiter",
  } = job;

  // Use company state that we fetched, with fallbacks
  const companyName = company?.name || job.company?.name || job.companyName || "Unknown Company";
  const companyLogo = company?.logo || job.company?.logo || job.companyLogo || null;

  const formattedDate = postedDate
    ? new Date(postedDate).toLocaleDateString()
    : "N/A";

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Navigation: Back Arrow */}
      <Box sx={{ mb: 2 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ color: "text.primary" }}
          aria-label="Back to previous page"
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Top Row: Company Info & Apply/Applied Button */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Always render Avatar with fallback if no logo */}
            <Avatar
              src={companyLogo}
              alt={companyName}
              sx={{
                width: 60,
                height: 60,
                boxShadow: theme.shadows[1],
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              {companyName ? companyName.charAt(0).toUpperCase() : "C"}
            </Avatar>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: theme.typography.fontWeightBold }}>
                {title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                <BusinessCenterIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {companyName}
                </Typography>
                <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  {jobLocation}
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* If user has applied, disable the button; otherwise navigate to the apply page */}
          <Button
            variant="contained"
            disabled={hasApplied}
            sx={{
              height: 40,
              bgcolor: hasApplied ? 'success.main' : 'primary.main',
              '&:hover': {
                bgcolor: hasApplied ? 'success.dark' : 'primary.dark'
              },
              transition: theme.transitions.create('background-color'),
            }}
            onClick={!hasApplied ? () => navigate(`/apply-job/${id}`, { state: { job } }) : undefined}
          >
            {hasApplied ? "Applied" : "Apply Now"}
          </Button>
        </Box>
      </Paper>

      {/* Chips for Positions, Job Type, Salary */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
        {positions && (
          <Chip
            icon={<PeopleIcon />}
            label={`${positions} Position${positions > 1 ? 's' : ''}`}
            sx={{
              color: 'info.main',
              borderColor: 'info.main',
              borderWidth: 1,
              borderStyle: "solid",
              bgcolor: alpha(theme.palette.info.main, 0.1),
            }}
          />
        )}
        {jobType && (
          <Chip
            icon={<BusinessCenterIcon />}
            label={jobType}
            sx={{
              color: 'warning.main',
              borderColor: 'warning.main',
              borderWidth: 1,
              borderStyle: "solid",
              bgcolor: alpha(theme.palette.warning.main, 0.1),
            }}
          />
        )}
        {salaryLPA && (
          <Chip
            icon={<MonetizationOnIcon />}
            label={`${salaryLPA} LPA`}
            sx={{
              color: 'success.main',
              borderColor: 'success.main',
              borderWidth: 1,
              borderStyle: "solid",
              bgcolor: alpha(theme.palette.success.main, 0.1),
            }}
          />
        )}
        <Chip
          icon={<AccessTimeIcon />}
          label={`Posted: ${formattedDate}`}
          sx={{
            color: 'text.secondary',
            borderColor: theme.palette.divider,
            borderWidth: 1,
            borderStyle: "solid",
          }}
        />
      </Box>

      {/* Job Details Paper */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.divider}`,
          mb: 3,
        }}
      >
        {/* Divider for Job Description */}
        <Typography variant="h6" sx={{ fontWeight: theme.typography.fontWeightBold, mb: 1 }}>
          Job Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Job Metadata */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
          <Typography variant="subtitle1">
            <strong>Role:</strong> {title}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Company:</strong> {companyName}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Location:</strong> {jobLocation}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Experience:</strong> {experience}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Salary:</strong> {salaryLPA ? `${salaryLPA} LPA` : "N/A"}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Job Type:</strong> {jobType || "Not specified"}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Total Applicants:</strong> {applicants.length}
          </Typography>

          {/* Skills section */}
          {skills.length > 0 && (
            <>
              <Typography variant="subtitle1">
                <strong>Skills:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>

        {/* Main Description */}
        <Typography variant="h6" sx={{ fontWeight: theme.typography.fontWeightBold, mb: 1 }}>
          Job Description
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {description}
        </Typography>
      </Paper>

      {/* Apply Button at Bottom */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          disabled={hasApplied}
          size="large"
          sx={{
            py: 1.5,
            px: 4,
            bgcolor: hasApplied ? 'success.main' : 'primary.main',
            '&:hover': {
              bgcolor: hasApplied ? 'success.dark' : 'primary.dark'
            },
            transition: theme.transitions.create('background-color'),
          }}
          onClick={!hasApplied ? () => navigate(`/apply-job/${id}`, { state: { job } }) : undefined}
        >
          {hasApplied ? "You have already applied" : "Apply for this position"}
        </Button>
      </Box>
    </Container>
  );
};

export default JobDetailsPage;
