// pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Avatar,
  Paper,
  Grid,
  Divider,
  Chip,
  Link as MuiLink,
  Card,
  CardContent,
  useTheme,
  alpha,
  Skeleton,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../api/api";
import { useAuth } from "../../auth/AuthContext";

const ProfilePage = () => {
  const theme = useTheme();
  const { authToken, userRole } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authToken) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile in ProfilePage:", err);
        setError(err.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [authToken]);

  // Helper function to display skills as chips
  const renderSkills = (skillsArray = []) => {
    if (!skillsArray.length) return <Typography color="text.secondary">No skills listed</Typography>;
    
    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {skillsArray.map((skill, index) => (
          <Chip
            key={index}
            label={skill}
            size="small"
            sx={{
              borderRadius: '16px',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.dark,
              fontWeight: 500,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          />
        ))}
      </Box>
    );
  };

  // Helper function to render education items
  const renderEducation = (education = []) => {
    if (!education || education.length === 0) {
      return <Typography color="text.secondary">No education history listed</Typography>;
    }

    return education.map((edu, index) => (
      <Box key={index} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {edu.degree}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SchoolIcon fontSize="small" color="action" />
          {edu.institution}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : 
           edu.endDate ? `Graduated: ${edu.endDate}` : 
           edu.startDate ? `Started: ${edu.startDate}` : ''}
        </Typography>
        {edu.description && (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {edu.description}
          </Typography>
        )}
      </Box>
    ));
  };

  // Helper function to render work experience items
  const renderExperience = (experience = []) => {
    if (!experience || experience.length === 0) {
      return <Typography color="text.secondary">No work experience listed</Typography>;
    }

    return experience.map((exp, index) => (
      <Box key={index} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {exp.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <WorkIcon fontSize="small" color="action" />
          {exp.company}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : 
           exp.endDate ? `Until: ${exp.endDate}` : 
           exp.startDate ? `Since: ${exp.startDate}` : ''}
        </Typography>
        {exp.description && (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {exp.description}
          </Typography>
        )}
      </Box>
    ));
  };

  // Helper function to render social media links
  const renderSocialLinks = (links = '') => {
    if (!links) return null;
    
    const socialLinks = links.split(',').map(link => link.trim());
    
    return (
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        {socialLinks.map((link, index) => {
          let icon = <LanguageIcon />;
          if (link.includes('github')) icon = <GitHubIcon />;
          if (link.includes('linkedin')) icon = <LinkedInIcon />;
          
          return (
            <Tooltip key={index} title={link} arrow>
              <IconButton 
                component="a" 
                href={link.startsWith('http') ? link : `https://${link}`} 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
                size="small"
              >
                {icon}
              </IconButton>
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Skeleton variant="circular" width={80} height={80} sx={{ mr: 2 }} />
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant="text" width="70%" height={32} />
                  <Skeleton variant="text" width="50%" height={24} />
                </Box>
              </Box>
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={100} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={120} />
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={200} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[1]
          }}
        >
          {error}
          <Button 
            onClick={() => window.location.reload()} 
            color="inherit" 
            size="small" 
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  // Redirect to login if not authenticated
  if (!profile && !loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Login Required
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Please log in to view your profile.
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/login"
            sx={{ mt: 2 }}
          >
            Log In
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column - Profile Info */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={1}
            sx={{ 
              p: 3, 
              position: 'relative',
              height: '100%',
              borderRadius: theme.shape.borderRadius,
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[3],
              }
            }}
          >
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Tooltip title="Edit Profile">
                <IconButton 
                  onClick={() => navigate("/profile/edit")}
                  size="small"
                  sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Profile Picture and Name */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={profile.profilePicture}
                alt={profile.fullName}
                sx={{ 
                  width: 120, 
                  height: 120,
                  mb: 2,
                  border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  boxShadow: theme.shadows[2]
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
                {profile.fullName}
              </Typography>
              <Typography 
                variant="body1" 
                color="primary" 
                sx={{ 
                  fontWeight: 500,
                  mt: 0.5,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '16px'
                }}
              >
                {userRole === 'jobSeeker' ? 'Job Seeker' : userRole === 'recruiter' ? 'Recruiter' : 'User'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Contact Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
                Contact Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <EmailIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1.5 }} />
                <Typography variant="body2">{profile.email}</Typography>
              </Box>
              
              {profile.phoneNumber && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <PhoneIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1.5 }} />
                  <Typography variant="body2">{profile.phoneNumber}</Typography>
                </Box>
              )}
              
              {profile.profile?.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <LocationIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1.5 }} />
                  <Typography variant="body2">{profile.profile.location}</Typography>
                </Box>
              )}

              {/* Social Media Links */}
              {profile.profile?.socialMediaLinks && renderSocialLinks(profile.profile.socialMediaLinks)}
            </Box>

            {/* Resume */}
            {profile.resume && (
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined" 
                  fullWidth
                  startIcon={<DescriptionIcon />}
                  component="a"
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    py: 1,
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px',
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  View Resume
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Skills, Experience, Education */}
        <Grid item xs={12} md={8}>
          {/* Bio Section */}
          {profile.profile?.bio && (
            <Paper 
              elevation={1}
              sx={{ 
                p: 3, 
                mb: 3,
                borderRadius: theme.shape.borderRadius,
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                  boxShadow: theme.shadows[3],
                }
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                About Me
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {profile.profile.bio}
              </Typography>
            </Paper>
          )}

          {/* Skills Section */}
          <Paper 
            elevation={1}
            sx={{ 
              p: 3, 
              mb: 3,
              borderRadius: theme.shape.borderRadius,
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[3],
              }
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Skills
            </Typography>
            {renderSkills(profile.profile?.skills || [])}
          </Paper>

          {/* Work Experience Section */}
          <Paper 
            elevation={1}
            sx={{ 
              p: 3, 
              mb: 3,
              borderRadius: theme.shape.borderRadius,
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[3],
              }
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Work Experience
            </Typography>
            {renderExperience(profile.profile?.experience || [])}
          </Paper>

          {/* Education Section */}
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
              Education
            </Typography>
            {renderEducation(profile.profile?.education || [])}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
