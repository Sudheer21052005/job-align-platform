// components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
  Divider,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
} from '@mui/material';
import {
  Work as WorkIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  MoreVert as MoreVertIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  MonetizationOn as MoneyIcon,
  School as SchoolIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useJobContext } from '../../contexts/JobContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { getRecommendedJobs, getRecentApplications } = useJobContext();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    savedJobs: 0,
    profileViews: 0,
  });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch recommended jobs
        const jobs = await getRecommendedJobs();
        setRecommendedJobs(jobs);

        // Fetch recent activity
        const activity = await getRecentApplications();
        setRecentActivity(activity);

        // Mock stats for now
        setStats({
          applications: 12,
          interviews: 3,
          savedJobs: 8,
          profileViews: 45,
        });
      } catch (err) {
        setError(err.message);
        showSnackbar('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getRecommendedJobs, getRecentApplications, showSnackbar]);

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: 3,
          borderColor: color
        } : {}
      }}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: `${color}15`,
            color: color,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Last 30 days
      </Typography>
    </Paper>
  );

  const JobCard = ({ job }) => (
      <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            src={job.companyLogo}
            alt={job.companyName}
            sx={{ width: 48, height: 48, mr: 2 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {job.companyName}
            </Typography>
          </Box>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<LocationIcon />}
            label={job.location}
            size="small"
            sx={{ 
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.dark,
              '& .MuiChip-icon': {
                color: theme.palette.primary.dark
              }
            }}
          />
          <Chip
            icon={<TimeIcon />}
            label={job.jobType}
            size="small"
            sx={{ 
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.dark,
              '& .MuiChip-icon': {
                color: theme.palette.primary.dark
              }
            }}
          />
          <Chip
            icon={<MoneyIcon />}
            label={job.salary}
            size="small"
            sx={{ 
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.dark,
              '& .MuiChip-icon': {
                color: theme.palette.primary.dark
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {job.skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              size="small"
              sx={{ 
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.secondary.dark,
              }}
            />
          ))}
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {job.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={job.matchScore}
            sx={{
              flexGrow: 1,
              height: 6,
              borderRadius: 3,
              bgcolor: theme.palette.secondary.light,
              '& .MuiLinearProgress-bar': {
                bgcolor: theme.palette.primary.main,
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {job.matchScore}% match
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          variant="contained" 
          fullWidth
          startIcon={<WorkIcon />}
        >
          Apply Now
        </Button>
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Paper
        sx={{
          p: 3,
          textAlign: 'center',
          bgcolor: theme.palette.error.light + "10",
          borderLeft: `4px solid ${theme.palette.error.main}`,
        }}
      >
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
            <Button
              variant="contained"
          onClick={() => window.location.reload()}
            >
          Try Again
            </Button>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your job search
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Applications"
            value={stats.applications}
            icon={<WorkIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Interviews"
            value={stats.interviews}
            icon={<TrendingUpIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Saved Jobs"
            value={stats.savedJobs}
            icon={<StarIcon />}
            color={theme.palette.warning.main}
            onClick={() => navigate('/saved-jobs')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Profile Views"
            value={stats.profileViews}
            icon={<BusinessIcon />}
            color={theme.palette.info.main}
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recommended Jobs */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
                sx={{
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Recommended Jobs
                  </Typography>
              <Button variant="text" color="primary">
                View All
                    </Button>
                  </Box>

            <Grid container spacing={3}>
              {recommendedJobs.map((job) => (
                <Grid item xs={12} key={job.id}>
                  <JobCard job={job} />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                        {activity.type === 'application' && <WorkIcon />}
                        {activity.type === 'interview' && <TrendingUpIcon />}
                        {activity.type === 'profile_view' && <BusinessIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {activity.description}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block' }}
                          >
                            {activity.time}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
          </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
