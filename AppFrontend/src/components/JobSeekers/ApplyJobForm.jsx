// src/components/JobSeekers/ApplyJobForm.jsx

import React, { useState, useEffect } from 'react';
import { applyForJob, uploadResume } from '../../api/api'; // Both API calls
import useForm from '../../hooks/useForm';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  LinearProgress,
  Paper,
  Divider,
  useTheme,
  alpha,
  Grid,
  Card,
  Avatar,
  Chip,
  CircularProgress,
  FormHelperText,
  InputLabel,
  styled
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleIcon from '@mui/icons-material/Article';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const initialFormValues = {
  coverLetter: '',
  resume: null,
};

// Custom file upload input component
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ApplyJobForm = (props) => {
  const theme = useTheme();
  
  // Destructure props (if provided)
  const { jobId: propJobId, jobTitle: propJobTitle } = props;
  // Retrieve id from URL parameters
  const { id } = useParams();
  const location = useLocation();

  // Determine jobId and jobTitle:
  // Prefer the prop values; if missing, fall back to URL params and location state.
  const jobId = propJobId || id;
  const job = location.state?.job || {};
  const jobTitle = propJobTitle || job.title || "this job";
  const companyName = job.companyName || job.company?.name || "the company";

  const { values, errors, handleChange, handleFileChange, handleSubmit, resetForm } =
    useForm(initialFormValues);
  const [apiError, setApiError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState('');
  const navigate = useNavigate();

  // Simulate progress when uploading
  useEffect(() => {
    let progressInterval;
    
    if (uploading) {
      progressInterval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          // Cap at 90% - the remaining 10% will happen when the API calls complete
          const nextProgress = prevProgress + 5;
          return nextProgress >= 90 ? 90 : nextProgress;
        });
      }, 500);
    } else if (uploadProgress === 100) {
      // Reset progress when finished
      setTimeout(() => setUploadProgress(0), 1000);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [uploading, uploadProgress]);

  // Handle file selection
  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFileName(event.target.files[0].name);
    }
    handleFileChange(event);
  };

  // Called when form validation passes.
  const onSubmit = async () => {
    // Guard: Ensure jobId exists
    if (!jobId) {
      setApiError("Job ID is missing. Please try again or contact support if the issue persists.");
      return;
    }

    setUploading(true);
    setApiError(null);
    setUploadProgress(10); // Start progress

    try {
      // 1. Upload the resume file first
      const resumeData = new FormData();
      resumeData.append('resume', values.resume);

      const uploadResponse = await uploadResume(resumeData);
      
      // The backend returns { msg, resume: newResume } so extract the _id from newResume
      const resumeId = uploadResponse.resume && uploadResponse.resume._id;
      if (!resumeId) {
        throw new Error("Resume upload failed. Please try again with a different file.");
      }
      
      setUploadProgress(95); // Almost done after resume upload
      
      // 2. Prepare the job application data with the obtained resumeId
      const formDataToSend = new FormData();
      formDataToSend.append('coverLetter', values.coverLetter);
      formDataToSend.append('resumeId', resumeId);
      
      // 3. Submit the job application
      const result = await applyForJob(jobId, formDataToSend);
      
      setUploadProgress(100); // Complete
        setSnackbarOpen(true);
        resetForm();
      
      // Short delay to show completed progress
      setTimeout(() => {
        // Redirect to the Job Details page with a flag indicating the job has been applied to.
        navigate(`/jobs/${jobId}`, { state: { applied: true } });
      }, 1000);
    } catch (err) {
      setApiError(err.message || 'Error applying for the job. Please try again later.');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, px: { xs: 2, md: 0 } }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          Back to Job
        </Button>
        
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ fontWeight: theme.typography.fontWeightBold }}
        >
        Apply for {jobTitle}
      </Typography>
        
        <Typography
          variant="subtitle1"
          color="text.secondary"
          gutterBottom
        >
          at {companyName}
        </Typography>
      </Box>
      
      {apiError && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: theme.shape.borderRadius,
          }}
        >
          {apiError}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%',
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontWeight: theme.typography.fontWeightBold }}
            >
              Application Tips
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
                Cover Letter
              </Typography>
              <Typography variant="body2" paragraph>
                Write a personalized cover letter explaining why you're a good fit for this role. 
                Highlight relevant experience and skills.
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
                Resume
              </Typography>
              <Typography variant="body2" paragraph>
                Upload an up-to-date resume in PDF format. Make sure it's tailored to the position 
                you're applying for.
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
                Follow Up
              </Typography>
              <Typography variant="body2">
                After submitting your application, you can track its status in your "Applications" section.
              </Typography>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8} order={{ xs: 1, md: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
      <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 3 }}>
                <InputLabel 
                  htmlFor="coverLetter" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: theme.typography.fontWeightMedium 
                  }}
                >
                  Cover Letter
                </InputLabel>
        <TextField
                  id="coverLetter"
          fullWidth
          name="coverLetter"
          multiline
                  rows={6}
          value={values.coverLetter}
          onChange={handleChange}
          required
                  placeholder="Introduce yourself and explain why you're interested in this role..."
          error={!!errors.coverLetter}
          helperText={errors.coverLetter}
                  sx={{ mb: 1 }}
        />
        {/* Live character count */}
                <FormHelperText sx={{ textAlign: 'right' }}>
          {values.coverLetter.length} characters
                </FormHelperText>
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <InputLabel 
                  htmlFor="resume" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: theme.typography.fontWeightMedium 
                  }}
                >
                  Resume
                </InputLabel>
                
                <Box sx={{ mb: 1 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      py: 1.5,
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      borderColor: selectedFileName ? 'primary.main' : theme.palette.divider,
                      backgroundColor: selectedFileName 
                        ? alpha(theme.palette.primary.main, 0.05) 
                        : 'transparent',
                    }}
                  >
                    {selectedFileName ? 'Change Resume' : 'Upload Resume'}
                    <VisuallyHiddenInput 
          type="file"
          name="resume"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx"
          required
                    />
                  </Button>
                </Box>
                
                {selectedFileName && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: theme.shape.borderRadius,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: alpha(theme.palette.success.main, 0.2),
                        color: 'success.main',
                        mr: 1.5,
                      }}
                    >
                      <ArticleIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" noWrap>
                        {selectedFileName}
                      </Typography>
                    </Box>
                    <Chip 
                      label="Selected" 
                      size="small" 
                      sx={{ 
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: 'success.main',
                        fontWeight: theme.typography.fontWeightMedium,
                      }} 
                    />
                  </Box>
                )}
                
        {/* Display file validation errors */}
        {errors.resume && (
                  <FormHelperText error>
            {errors.resume}
                  </FormHelperText>
                )}
              </Box>
              
              {/* Progress indicator during file upload */}
              {uploading && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {uploadProgress < 100 ? 'Submitting application...' : 'Application submitted!'}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight={theme.typography.fontWeightMedium}>
                      {uploadProgress}%
          </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={uploadProgress}
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }} 
                  />
                </Box>
              )}
              
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={uploading}
                fullWidth
                size="large"
                endIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{ 
                  py: 1.5,
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >
                {uploading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: theme.shadows[3],
          }}
        >
          Application submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApplyJobForm;
