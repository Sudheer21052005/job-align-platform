// src/components/Recruiters/EditJobForm.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Divider,
  useTheme,
  alpha,
  Paper,
  Chip,
  FormHelperText,
  Stack,
  Skeleton
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import { fetchRecruiterJobDetails, updateJob } from "../../api/api";
import EditIcon from '@mui/icons-material/Edit';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Job type options
const JOB_TYPES = [
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
  { value: "Internship", label: "Internship" },
  { value: "Contract", label: "Contract" },
  { value: "Remote", label: "Remote" },
];

const initialValues = {
  title: "",
  location: "",
  skills: "",
  salaryLPA: "",
  jobType: "",
  positions: "",
  description: "",
  experience: "",
  softSkills: "",
  responsibilities: "",
  company: "",
};

const EditJobForm = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [jobData, setJobData] = useState(null); // Store original job data

  // Validation function for the job form
  const validateJobForm = (values) => {
    const errors = {};
    const requiredFields = [
      "title", "location", "skills", "salaryLPA",
      "jobType", "positions", "description", "company"
    ];

    requiredFields.forEach(field => {
      if (!values[field] || values[field].trim() === "") {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Additional validations
    if (values.salaryLPA) {
      if (isNaN(parseFloat(values.salaryLPA))) {
        errors.salaryLPA = "Salary must be a valid number";
      } else if (parseFloat(values.salaryLPA) <= 0) {
        errors.salaryLPA = "Salary must be greater than zero";
      }
    }
    
    if (values.positions) {
      if (isNaN(parseInt(values.positions)) || parseInt(values.positions) <= 0) {
        errors.positions = "Positions must be a positive number";
      }
    }

    // Validate skills format
    if (values.skills && !errors.skills) {
      const skillsArray = values.skills.split(',');
      if (skillsArray.some(skill => !skill.trim())) {
        errors.skills = "Please remove any empty skills (extra commas)";
      }
    }
    
    return errors;
  };

  // Use form hook for state management and validation
  const { 
    values, 
    errors, 
    handleChange, 
    handleSubmit, 
    setValues,
    resetForm 
  } = useForm(initialValues, validateJobForm);

  // Fetch companies for the company dropdown
  const { 
    companies, 
    loading: companiesLoading, 
    error: companiesError 
  } = useGetAllCompanies();

  // Memoize company options with proper value and label
  const companyOptions = useMemo(() => {
    if (companiesLoading || companiesError) return [];
    return companies.map(company => ({
      value: company.value || company._id, 
      label: company.label || company.name
    }));
  }, [companies, companiesLoading, companiesError]);

  // Fetch job details on mount using the recruiter endpoint
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const jobDetails = await fetchRecruiterJobDetails(id);
        setJobData(jobDetails); // Save original job data
        
        // Determine company value (either as an object or a direct value)
        const companyId = jobDetails.company?._id || jobDetails.company;
        
        // Prepare form values from the job details
        const formattedValues = {
          title: jobDetails.title || "",
          location: jobDetails.location || "",
          skills: Array.isArray(jobDetails.skills) 
            ? jobDetails.skills.join(", ") 
            : (jobDetails.skills || ""),
          salaryLPA: jobDetails.salaryLPA 
            ? jobDetails.salaryLPA.toString() 
            : "",
          jobType: jobDetails.jobType || "",
          positions: jobDetails.positions 
            ? jobDetails.positions.toString() 
            : "",
          description: jobDetails.description || "",
          experience: jobDetails.experience || "",
          softSkills: Array.isArray(jobDetails.softSkills) 
            ? jobDetails.softSkills.join(", ") 
            : (jobDetails.softSkills || ""),
          responsibilities: Array.isArray(jobDetails.responsibilities)
            ? jobDetails.responsibilities.join("\n")
            : (jobDetails.responsibilities || ""),
          company: companyId || "", // Ensure a valid value
        };

        setValues(formattedValues);
      } catch (err) {
        console.error("Detailed Job Fetch Error:", err);
        setFormError(`Failed to load job details: ${err.message}`);
        setTimeout(() => {
        navigate("/recruiter-job", {
          state: {
            message: `Unable to fetch job details: ${err.message}`,
            type: "error"
          }
        });
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  // Sample skills preview
  const skillsPreview = useMemo(() => {
    if (!values.skills) return [];
    return values.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean)
      .slice(0, 5);
  }, [values.skills]);

  // Handler for form submission to update the job
  const onSubmit = async () => {
    setIsSubmitting(true);
    setFormError("");
    setFormSuccess(false);

    const dataToSubmit = {
      ...values,
      skills: values.skills.split(",").map(s => s.trim()).filter(Boolean),
      softSkills: values.softSkills.split(",").map(s => s.trim()).filter(Boolean),
      responsibilities: values.responsibilities.split("\n").map(line => line.trim()).filter(Boolean),
      salaryLPA: parseFloat(values.salaryLPA),
      positions: parseInt(values.positions)
    };

    try {
      await updateJob(id, dataToSubmit);
      setFormSuccess(true);
      setTimeout(() => {
      navigate("/recruiter-job", {
        state: {
          message: "Job updated successfully!",
          type: "success"
        }
      });
      }, 1500);
    } catch (err) {
      setFormError(err.message || "Failed to update job");
      console.error("Job update error:", err);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel form handler
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      navigate("/recruiter-job");
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="rectangular" height={40} sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          mb: 4,
          backgroundColor: '#fff',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Box
          sx={{
            p: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <BusinessCenterIcon color="primary" />
          <Typography variant="h5" component="h1" fontWeight="500">
            Edit Job: {jobData?.title || 'Loading...'}
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/recruiter-job')}
            sx={{ mb: 3 }}
          >
            Back to Jobs
          </Button>
          
          {formError && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 1 }}
              onClose={() => setFormError("")}
            >
              {formError}
            </Alert>
          )}

          {formSuccess && (
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 1 }}
            >
              Job updated successfully! Redirecting...
            </Alert>
          )}
          
          {companiesError && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 1 }}>
              There was an issue loading companies. You may continue, but company selection may be limited.
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="primary" fontWeight="500" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              {/* Job Title */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Job Title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title || "Enter a clear and specific job title"}
                  fullWidth
                  required
                  placeholder="e.g., Senior React Developer"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Location */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Location"
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                  error={!!errors.location}
                  helperText={errors.location || "Enter city name or 'Remote'"}
                  fullWidth
                  required
                  placeholder="e.g., New York City, Remote"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Company Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth required error={!!errors.company}>
                  <InputLabel id="company-label">Company</InputLabel>
                  <Select
                    labelId="company-label"
                    name="company"
                    value={values.company}
                    label="Company"
                  onChange={handleChange}
                    endAdornment={
                      companiesLoading && (
                        <CircularProgress size={20} sx={{ position: 'absolute', right: 30 }} />
                      )
                    }
                  >
                    {companiesLoading ? (
                      <MenuItem disabled>Loading companies...</MenuItem>
                    ) : companiesError ? (
                      <MenuItem disabled>Error loading companies</MenuItem>
                    ) : (
                      companyOptions.map((company) => (
                        <MenuItem key={company.value} value={company.value}>
                          {company.label}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  <FormHelperText error={!!errors.company}>
                    {errors.company || "Select the company posting this job"}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" color="primary" fontWeight="500" gutterBottom sx={{ mt: 1 }}>
                  Job Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {/* Job Type */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required error={!!errors.jobType}>
                  <InputLabel id="jobType-label">Job Type</InputLabel>
                  <Select
                    labelId="jobType-label"
                    name="jobType"
                    value={values.jobType}
                    label="Job Type"
                    onChange={handleChange}
                  >
                    {JOB_TYPES.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error={!!errors.jobType}>
                    {errors.jobType || "Select the employment type"}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Salary */}
              <Grid item xs={12} md={4}>
                <TextField
                  label="Salary (in LPA)"
                  name="salaryLPA"
                  type="number"
                  value={values.salaryLPA}
                  onChange={handleChange}
                  error={!!errors.salaryLPA}
                  helperText={errors.salaryLPA || "Annual salary in Lakhs Per Annum"}
                  fullWidth
                  required
                  InputProps={{
                    inputProps: { min: 0, step: 0.1 }
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Positions */}
              <Grid item xs={12} md={4}>
                <TextField
                  label="Positions"
                  name="positions"
                  type="number"
                  value={values.positions}
                  onChange={handleChange}
                  error={!!errors.positions}
                  helperText={errors.positions || "Number of open positions"}
                  fullWidth
                  required
                  InputProps={{
                    inputProps: { min: 1, step: 1 }
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Experience */}
              <Grid item xs={12}>
                <TextField
                  label="Experience"
                  name="experience"
                  value={values.experience}
                  onChange={handleChange}
                  error={!!errors.experience}
                  helperText={errors.experience || "e.g., 3-5 years of experience in web development"}
                  fullWidth
                  required
                  placeholder="e.g., 3-5 years, Entry Level, Senior Level"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" color="primary" fontWeight="500" gutterBottom sx={{ mt: 1 }}>
                  Skills & Requirements
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {/* Skills */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Technical Skills (comma separated)"
                  name="skills"
                  value={values.skills}
                  onChange={handleChange}
                  error={!!errors.skills}
                  helperText={errors.skills || "Enter technical skills separated by commas"}
                  fullWidth
                  required
                  placeholder="e.g., React, Node.js, MongoDB"
                  InputLabelProps={{ shrink: true }}
                />
                {skillsPreview.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {skillsPreview.map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                    {values.skills.split(',').filter(Boolean).length > 5 && (
                      <Chip 
                        label={`+${values.skills.split(',').filter(Boolean).length - 5} more`} 
                        size="small"
                        color="default"
                      />
                    )}
                  </Box>
                )}
              </Grid>

              {/* Soft Skills */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Soft Skills (comma separated)"
                  name="softSkills"
                  value={values.softSkills}
                  onChange={handleChange}
                  error={!!errors.softSkills}
                  helperText={errors.softSkills || "Enter soft skills separated by commas"}
                  fullWidth
                  required
                  placeholder="e.g., Communication, Teamwork, Problem Solving"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" color="primary" fontWeight="500" gutterBottom sx={{ mt: 1 }}>
                  Description & Responsibilities
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  label="Job Description"
                  name="description"
                  multiline
                  rows={4}
                  value={values.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description || "Provide a detailed description of the job"}
                  fullWidth
                  required
                  placeholder="Enter a comprehensive description of the job role, requirements, and what candidates can expect..."
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Responsibilities */}
              <Grid item xs={12}>
                <TextField
                  label="Responsibilities (each on new line)"
                  name="responsibilities"
                  multiline
                  rows={4}
                  value={values.responsibilities}
                  onChange={handleChange}
                  error={!!errors.responsibilities}
                  helperText={errors.responsibilities || "Enter each responsibility on a new line"}
                  fullWidth
                  required
                  placeholder="Design and implement new features\nCollaborate with cross-functional teams\nParticipate in code reviews"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
            <Button
              type="submit"
              variant="contained"
              color="primary"
                disabled={isSubmitting || Object.keys(errors).length > 0}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
            >
                {isSubmitting ? "Updating..." : "Update Job"}
            </Button>
            </Box>
          </form>
        </CardContent>
      </Paper>
    </Container>
  );
};

export default EditJobForm;
