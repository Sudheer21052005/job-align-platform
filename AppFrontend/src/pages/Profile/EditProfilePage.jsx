// pages/EditProfilePage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Avatar,
  Paper,
  Grid,
  Divider,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  FormHelperText,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Lock as LockIcon,
  Description as DescriptionIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, uploadResume, fetchUserProfile } from "../../api/api";
import { useAuth } from "../../auth/AuthContext";

// Initial form field values for editable fields
const initialValues = {
  fullName: "",
  phoneNumber: "",
  location: "",
  bio: "",
  skills: "",
  socialMediaLinks: "",
};

const EditProfilePage = () => {
  const theme = useTheme();
  const { authToken, userRole } = useAuth();
  const navigate = useNavigate();

  // Local state to manage form values
  const [formValues, setFormValues] = useState(initialValues);
  const { fullName, phoneNumber, bio, skills, socialMediaLinks, location } = formValues;

  // Handle changes for text fields
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // Non-editable email stored separately
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Avatar state for profile picture
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState("");

  // Resume upload state
  const [resume, setResume] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Fetch user profile on mount and pre-fill form values
  useEffect(() => {
    if (!authToken) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setFormValues({
          fullName: data.fullName || "",
          phoneNumber: data.phoneNumber || "",
          location: data.profile?.location || "",
          bio: data.profile?.bio || "",
          skills: data.profile?.skills ? data.profile.skills.join(", ") : "",
          socialMediaLinks: data.profile?.socialMediaLinks || "",
        });
        setEmail(data.email || "");
        if (data.profilePicture) {
          setProfilePicPreview(data.profilePicture);
        }
      } catch (err) {
        console.error("Error fetching profile in EditProfilePage:", err);
        setError(err.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [authToken]);

  // Handle profile picture changes
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  // Handle resume file changes
  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
    setUploadMessage("");
    setUploadError("");
  };

  // Submit updated profile data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      let payload;

      if (profilePicFile) {
        // Use FormData if a new profile picture is provided
        payload = new FormData();
        payload.append("fullName", fullName);
        payload.append("phoneNumber", phoneNumber);
        payload.append("location", location);
        payload.append("bio", bio);
        payload.append("skills", skills);
        payload.append("socialMediaLinks", socialMediaLinks);
        payload.append("profilePicture", profilePicFile);
      } else {
        payload = {
          fullName,
          phoneNumber,
          location,
          bio,
          skills,
          socialMediaLinks,
        };
      }

      await updateUserProfile(payload);
      setSuccess("Profile updated successfully!");
      // Reset profile pic file after successful upload
      setProfilePicFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  // Submit resume upload separately
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resume) {
      setUploadError("Please select a file to upload.");
      return;
    }
    
    setUploadMessage("");
    setUploadError("");
    
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      await uploadResume(formData);
      setUploadMessage("Resume uploaded successfully!");
      setResume(null);
      // Reset the file input
      document.getElementById("resume-upload").value = "";
    } catch (err) {
      setUploadError("Error uploading resume.");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => navigate("/profile")}
          sx={{ mr: 2 }}
        >
          Back to Profile
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Edit Profile
      </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[1]
          }}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3, 
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[1]
          }}
        >
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column - Profile Picture and Account Info */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              mb: 3,
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[3],
              }
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Profile Picture
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ position: "relative", mb: 2 }}>
            <Avatar
              src={profilePicPreview}
              alt={fullName}
                  sx={{ 
                    width: 120, 
                    height: 120,
                    border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    boxShadow: theme.shadows[2]
                  }}
                />
                <Tooltip title="Change Profile Picture">
            <IconButton
              sx={{
                position: "absolute",
                      bottom: 0,
                right: 0,
                      backgroundColor: theme.palette.primary.main,
                color: "white",
                      "&:hover": { backgroundColor: theme.palette.primary.dark },
                      boxShadow: theme.shadows[2],
                      width: 36,
                      height: 36,
              }}
              onClick={() => document.getElementById("profilePicInput").click()}
                    size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
                </Tooltip>
            <input
              id="profilePicInput"
              type="file"
              onChange={handleProfilePicChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </Box>

              {profilePicFile && (
                <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                  New image selected. Save profile to update.
                </Typography>
              )}
              
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                Upload a high quality image for your profile picture
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Account Info */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Account Information
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Email Address
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {email}
              </Typography>
              <FormHelperText>
                Email cannot be changed
              </FormHelperText>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Account Type
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 500,
                  display: 'inline-block',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.dark,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '16px',
                  mt: 0.5
                }}
              >
                {userRole === 'jobSeeker' ? 'Job Seeker' : userRole === 'recruiter' ? 'Recruiter' : 'User'}
              </Typography>
            </Box>
            
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => navigate("/change-password")}
              sx={{ mt: 1 }}
              fullWidth
            >
              Change Password
            </Button>
          </Paper>
          
          {/* Resume Upload Section */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[3],
              }
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Resume
            </Typography>
            
            {uploadMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {uploadMessage}
              </Alert>
            )}
            
            {uploadError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {uploadError}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleResumeUpload}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<DescriptionIcon />}
                sx={{ mb: 2, width: '100%' }}
              >
                Select Resume File
                <input
                  id="resume-upload"
                  type="file"
                  onChange={handleResumeChange}
                  hidden
                  accept=".pdf,.doc,.docx"
                />
              </Button>
              
              {resume && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Selected: {resume.name}
                </Typography>
              )}
              
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={<UploadIcon />}
                disabled={!resume}
                fullWidth
              >
                Upload Resume
              </Button>
              
              <FormHelperText>
                Accepted formats: PDF, DOC, DOCX
              </FormHelperText>
            </Box>
          </Paper>
        </Grid>
        
        {/* Right Column - Profile Details Form */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[3],
              }
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Profile Details
          </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              name="fullName"
              value={fullName}
              onChange={handleChange}
              required
              fullWidth
                    InputProps={{ sx: { borderRadius: 2 } }}
            />
                </Grid>
                <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleChange}
              fullWidth
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Location"
                    name="location"
                    value={location}
                    onChange={handleChange}
                    fullWidth
                    placeholder="City, Country"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
            <TextField
                    label="About Me"
              name="bio"
              value={bio}
              onChange={handleChange}
              fullWidth
              multiline
                    rows={4}
                    placeholder="Write a short bio that describes your professional experience and interests"
                    InputProps={{ sx: { borderRadius: 2 } }}
            />
                </Grid>
                <Grid item xs={12}>
            <TextField
                    label="Skills"
              name="skills"
              value={skills}
              onChange={handleChange}
              fullWidth
                    placeholder="HTML, CSS, JavaScript, React..."
                    helperText="Separate skills with commas"
                    InputProps={{ sx: { borderRadius: 2 } }}
            />
                </Grid>
                <Grid item xs={12}>
            <TextField
                    label="Social Media Links"
              name="socialMediaLinks"
              value={socialMediaLinks}
              onChange={handleChange}
              fullWidth
                    placeholder="https://linkedin.com/in/yourprofile, https://github.com/yourusername"
                    helperText="Separate links with commas"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  type="button" 
                  variant="outlined" 
                  onClick={() => navigate('/profile')}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  startIcon={<SaveIcon />}
                  disabled={saving}
                >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
      </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditProfilePage;
