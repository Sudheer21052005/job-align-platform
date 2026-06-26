// src/components/JobListings/JobList.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import { fetchCompanyById } from "../../api/api";
import useGetCompanyById from "../../hooks/useGetCompanyById";
import useFetchJob from "../../hooks/useFetchJobs"; // or useFetchJobs if that's your file

const JobListing = ({ job, onApply }) => {
  const theme = useTheme();
  const jobId = job._id || job.id;
  const companyId = job.companyId || 
    (job.company && typeof job.company === 'string' ? job.company : job.company?._id);
  
  // Add state for company data
  const [company, setCompany] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(false);

  // 1) Fetch job details
  const { job: jobDetails, loading: jobLoading, error: jobError } =
    jobId ? useFetchJob(jobId) : { job: null, loading: false, error: null };

  // 2) Fetch company data directly using API instead of hook
  useEffect(() => {
    const getCompanyData = async () => {
      // Check if job.company is a string (ID) rather than an object
      const companyId = job.companyId || 
        (job.company && typeof job.company === 'string' ? job.company : job.company?._id);
      
      // Skip if no companyId or if job already has complete company data
      if (!companyId && !job.company && !job.companyName) {
        return;
      }
      
      // If job already has complete company data, use it directly
      if (job.company && typeof job.company === 'object' && job.company.name && job.company.logo) {
        setCompany(job.company);
        return;
      }
      
      // If job has companyName but no logo, create company object
      if (job.companyName && (!job.company || typeof job.company === 'string')) {
        setCompany({
          name: job.companyName,
          logo: job.companyLogo || null,
          location: job.location || null
        });
        return;
      }
      
      // Otherwise fetch company data
      if (companyId) {
        setCompanyLoading(true);
        try {
          const companyData = await fetchCompanyById(companyId);
          setCompany(companyData);
        } catch (err) {
          console.error(`JobList: Error fetching company for ${companyId}:`, err);
        } finally {
          setCompanyLoading(false);
        }
      }
    };
    
    getCompanyData();
  }, [companyId, job, jobId]);

  // Handle loading & errors
  if (jobLoading || companyLoading) {
    return <Typography variant="body2">Loading...</Typography>;
  }
  if (jobError) {
    return (
      <Typography variant="body2" color="error">
        {jobError}
      </Typography>
    );
  }

  // Get data with proper fallbacks
  const postedTime = jobDetails?.postedDate || job.postedDate || job.datePosted || "N/A";
  const companyName = company?.name || job.company?.name || job.companyName || "Unknown Company";
  const recruiterName = company?.recruiterName || job.recruiterName || job.postedBy?.name || "Unknown Recruiter";
  const companyLocation = job.location || company?.location || "Unknown Location";
  const companyLogo = company?.logo || job.company?.logo || job.companyLogo || null;
  

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        backgroundColor: "background.paper",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        transition: "transform 0.3s ease-in-out",
        "&:hover": { transform: "scale(1.02)" },
        mb: 2,
      }}
    >
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        {/* Row: Company Info & Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          {/* Left: Name, Location, Recruiter */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {companyName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {companyLocation} | {recruiterName}
            </Typography>
          </Box>
          {/* Right: Logo Avatar - always render with fallback */}
          <Avatar
            src={companyLogo}
            alt={companyName}
            sx={{
              width: 40,
              height: 40,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            {companyName ? companyName.charAt(0).toUpperCase() : "C"}
          </Avatar>
        </Box>

        {/* Job Title */}
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {job.title || "Untitled Position"}
        </Typography>

        {/* Chips (Positions, JobType, Salary) */}
        <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
          {job.positions && (
            <Chip
              label={`${job.positions} Positions`}
              variant="outlined"
              sx={{ color: "#4285F4", borderColor: "#4285F4" }}
            />
          )}
          {job.jobType && (
            <Chip
              label={job.jobType}
              variant="outlined"
              sx={{ color: "#FF5733", borderColor: "#FF5733" }}
            />
          )}
          {job.salaryLPA && (
            <Chip
              label={`${job.salaryLPA} LPA`}
              variant="outlined"
              sx={{ color: "#7B1FA2", borderColor: "#7B1FA2" }}
            />
          )}
        </Box>

        {/* Posted Time in Light Grey */}
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ display: "block", mt: 2, textAlign: "right" }}
        >
          {postedTime}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobListing;
