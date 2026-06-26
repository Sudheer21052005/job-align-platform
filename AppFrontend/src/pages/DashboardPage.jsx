// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  LinearProgress, 
  Container,
  useTheme,
  Button,
  Paper,
  Avatar,
  Chip,
  Skeleton
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import { useAuth } from "../auth/AuthContext";
import { fetchJobs } from "../api/api";
import JobCard from "../components/JobListings/JobCard";
import WorkIcon from "@mui/icons-material/Work";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();

  // Dummy metrics – replace with real data if available
  const applicationsCount = 8;
  const savedJobsCount = 4;
  const profileCompleteness = 75; // in percentage
  const unreadNotifications = 3;

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchJobs();
        if (!data.jobs || data.jobs.length === 0) {
          setError("No jobs found.");
        } else {
          setJobs(data.jobs.slice(0, 6)); // Limit to 6 jobs for dashboard
        }
      } catch (err) {
        setError("Error fetching jobs.");
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  // Dashboard metric card component
  const MetricCard = ({ icon, value, label, color }) => (
    <Card sx={{ 
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1],
      height: "100%",
      transition: theme.transitions.create(['transform', 'box-shadow']),
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[3],
      }
    }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: `${color}20`,  
              color: color, 
              mr: 2,
              width: 42,
              height: 42
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" component="div" fontWeight={theme.typography.fontWeightBold}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight={theme.typography.fontWeightBold} 
              sx={{ 
                mb: 1,
                color: 'text.primary' 
              }}
            >
              Welcome back, {user?.name || "Job Seeker"}!
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                mb: 1
              }}
            >
              Here's what's happening with your job search today.
            </Typography>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
            <Button 
              variant="contained" 
              component={Link}
              to="/jobs"
              sx={{
                mr: 2,
                borderRadius: theme.shape.borderRadius,
                fontWeight: theme.typography.fontWeightMedium,
                boxShadow: theme.shadows[2],
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Find Jobs
            </Button>
            <Button 
              variant="outlined"
              component={Link}
              to="/profile"
              sx={{
                borderRadius: theme.shape.borderRadius,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Dashboard Summary Section */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard 
            icon={<WorkIcon />} 
            value={applicationsCount} 
            label="Applications" 
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard 
            icon={<BookmarkIcon />} 
            value={savedJobsCount} 
            label="Saved Jobs" 
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard 
            icon={<PersonIcon />} 
            value={`${profileCompleteness}%`} 
            label="Profile Completion" 
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard 
            icon={<NotificationsIcon />} 
            value={unreadNotifications} 
            label="New Notifications" 
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      {/* Profile Completion Card */}
      <Card 
        sx={{ 
          mb: 5,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={theme.typography.fontWeightBold} gutterBottom>
                Complete Your Profile
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                A complete profile increases your chances of finding the perfect job.
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              component={Link}
              to="/profile"
              sx={{
                borderRadius: theme.shape.borderRadius,
                borderWidth: 2,
                alignSelf: { xs: 'flex-start', sm: 'center' },
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              Update Profile
            </Button>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" fontWeight={theme.typography.fontWeightMedium}>
                Profile Completion: {profileCompleteness}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profileCompleteness < 100 ? 'In Progress' : 'Complete'}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={profileCompleteness}
              sx={{
                height: 8,
                borderRadius: 4,
                mt: 1,
                mb: 2,
                backgroundColor: 'secondary.light',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: profileCompleteness < 50 
                    ? 'warning.main' 
                    : profileCompleteness < 80 
                      ? 'info.main' 
                      : 'success.main',
                  borderRadius: 4,
                }
              }}
            />
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: theme.shape.borderRadius,
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Chip 
                    label="✓" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'success.main', 
                      color: 'success.contrastText',
                      width: 24,
                      height: 24,
                      mr: 1.5
                    }} 
                  />
                  <Typography variant="body2">Basic Information</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: theme.shape.borderRadius,
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Chip 
                    label="✓" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'success.main', 
                      color: 'success.contrastText',
                      width: 24,
                      height: 24,
                      mr: 1.5
                    }} 
                  />
                  <Typography variant="body2">Work Experience</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: theme.shape.borderRadius,
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Chip 
                    label="!" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'warning.main', 
                      color: 'warning.contrastText',
                      width: 24,
                      height: 24,
                      mr: 1.5
                    }} 
                  />
                  <Typography variant="body2">Skills & Resume</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Recommended Jobs Section */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h5" component="h2" fontWeight={theme.typography.fontWeightBold}>
            Recommended Jobs
          </Typography>
          <Button 
            variant="text" 
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={() => {}}
            sx={{ 
              textTransform: 'none',
              borderRadius: theme.shape.borderRadius,
            }}
          >
            Refresh
          </Button>
        </Box>
        
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(3)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ 
                  borderRadius: theme.shape.borderRadius,
                  boxShadow: theme.shadows[1],
                  height: "100%" 
                }}>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" height={22} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: theme.shape.borderRadius / 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Skeleton variant="rounded" width="30%" height={36} sx={{ borderRadius: theme.shape.borderRadius / 2 }} />
                      <Skeleton variant="rounded" width="30%" height={36} sx={{ borderRadius: theme.shape.borderRadius / 2 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: theme.shape.borderRadius,
              bgcolor: 'error.light',
              color: 'error.main',
            }}
          >
            <Typography>{error}</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id || job.id}>
                <JobCard job={job} />
              </Grid>
            ))}
          </Grid>
        )}
        
        {!loading && !error && jobs.length > 0 && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button 
              variant="outlined" 
              component={Link}
              to="/jobs"
              sx={{
                borderRadius: theme.shape.borderRadius,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                }
              }}
            >
              View All Jobs
            </Button>
          </Box>
        )}
      </Box>

      {/* Recent Activity Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" fontWeight={theme.typography.fontWeightBold} sx={{ mb: 3 }}>
          Recent Activity
        </Typography>
        
        <Card sx={{ 
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
          border: `1px solid ${theme.palette.divider}`
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              p: 2, 
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center'
            }}>
              <Avatar 
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  color: 'primary.main',
                  mr: 2
                }}
              >
                <WorkIcon fontSize="small" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight={theme.typography.fontWeightMedium}>
                  You applied for <Link to="/jobs/detail/123" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>Senior Software Engineer</Link> at TechCorp
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  2 days ago
                </Typography>
              </Box>
              <Chip label="Applied" size="small" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
            </Box>
            
            <Box sx={{ 
              p: 2, 
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center'
            }}>
              <Avatar 
                sx={{ 
                  bgcolor: alpha(theme.palette.success.main, 0.1), 
                  color: 'success.main',
                  mr: 2
                }}
              >
                <TrendingUpIcon fontSize="small" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight={theme.typography.fontWeightMedium}>
                  Profile views increased by 15% last week
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  5 days ago
                </Typography>
              </Box>
              <Chip label="Profile" size="small" sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }} />
            </Box>
            
            <Box sx={{ 
              p: 2,
              display: 'flex',
              alignItems: 'center'
            }}>
              <Avatar 
                sx={{ 
                  bgcolor: alpha(theme.palette.warning.main, 0.1), 
                  color: 'warning.main',
                  mr: 2
                }}
              >
                <BookmarkIcon fontSize="small" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight={theme.typography.fontWeightMedium}>
                  You saved <Link to="/jobs/detail/456" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>Full Stack Developer</Link> at InnovateCo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1 week ago
                </Typography>
              </Box>
              <Chip label="Saved" size="small" sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default DashboardPage;
