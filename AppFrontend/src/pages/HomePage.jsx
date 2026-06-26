// src/pages/HomePage.jsx

import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Container,
  useTheme,
  Paper,
  Stack,
  alpha
} from "@mui/material";
import { Link } from "react-router-dom";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";

const HomePage = () => {
  const theme = useTheme();

  // Feature card component for reuse
  const FeatureCard = ({ icon, title, description }) => (
    <Card 
      sx={{
        height: "100%",
        p: { xs: 2, md: 3 },
        backgroundColor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
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
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            mb: 2,
            color: 'primary.main'
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" gutterBottom fontWeight={theme.typography.fontWeightBold}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* HERO SECTION */}
      <Box 
        sx={{
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.8)} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
          pt: { xs: 10, md: 16 },
          pb: { xs: 12, md: 20 },
        }}
      >
        {/* Purple gradient shapes */}
        <Box 
          sx={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.2)} 0%, transparent 70%)`,
            top: "-50px",
            left: "-50px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.2)} 0%, transparent 70%)`,
            bottom: "50px",
            right: "100px",
          }}
        />
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <Typography 
                  component="h1" 
                  variant="h2" 
                  fontWeight={theme.typography.fontWeightBold}
                  sx={{ 
                    mb: 2,
                    color: 'text.primary',
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    lineHeight: 1.2
                  }}
                >
                  Find Your Dream Job With <span style={{ color: theme.palette.primary.main }}>JobAlign</span>
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4, 
                    color: 'text.secondary',
                    fontWeight: theme.typography.fontWeightRegular,
                    maxWidth: "90%",
                    lineHeight: 1.6
                  }}
                >
                  Connect with top employers and discover opportunities tailored to your skills and career aspirations.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/jobs"
                    size="large"
                    sx={{
                      py: 1.5,
                      px: 3,
                      borderRadius: theme.shape.borderRadius,
                      fontWeight: theme.typography.fontWeightMedium,
                      boxShadow: theme.shadows[2],
                      transition: theme.transitions.create(['transform', 'box-shadow']),
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4],
                      }
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Explore Jobs
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to="/register"
                    size="large"
                    sx={{
                      py: 1.5,
                      px: 3,
                      borderRadius: theme.shape.borderRadius,
                      borderWidth: 2,
                      fontWeight: theme.typography.fontWeightMedium,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
              <Box sx={{ 
                position: 'relative',
                height: '500px',
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                {/* Main circle */}
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulse 3s infinite ease-in-out',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'translate(-50%, -50%) scale(1)',
                    },
                    '50%': {
                      transform: 'translate(-50%, -50%) scale(1.05)',
                    },
                    '100%': {
                      transform: 'translate(-50%, -50%) scale(1)',
                    },
                  }
                }}>
                  <WorkIcon sx={{ 
                    fontSize: '80px',
                    color: theme.palette.primary.main,
                    animation: 'float 3s infinite ease-in-out',
                    '@keyframes float': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' },
                      '100%': { transform: 'translateY(0px)' },
                    }
                  }} />
                </Box>

                {/* Orbiting elements */}
                {[
                  { Icon: PersonIcon, delay: '0s' },
                  { Icon: BusinessCenterIcon, delay: '0.5s' },
                  { Icon: SchoolIcon, delay: '1s' },
                  { Icon: StarIcon, delay: '1.5s' }
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '400px',
                      height: '400px',
                      animation: `orbit 10s infinite linear`,
                      transformOrigin: '50% 50%',
                      animationDelay: item.delay,
                      '@keyframes orbit': {
                        '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                        '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
                      }
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        borderRadius: '50%',
                        p: 2,
                        boxShadow: theme.shadows[4],
                        animation: 'counterOrbit 10s infinite linear',
                        '@keyframes counterOrbit': {
                          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                          '100%': { transform: 'translate(-50%, -50%) rotate(-360deg)' },
                        }
                      }}
                    >
                      <item.Icon sx={{ 
                        fontSize: '24px',
                        color: theme.palette.primary.main,
                      }} />
                    </Box>
                  </Box>
                ))}

                {/* Decorative circles */}
                {[...Array(3)].map((_, index) => (
                  <Box
                    key={`circle-${index}`}
                    sx={{
                      position: 'absolute',
                      top: `${30 + index * 20}%`,
                      right: `${10 + index * 15}%`,
                      width: `${20 + index * 10}px`,
                      height: `${20 + index * 10}px`,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      animation: `float 3s infinite ease-in-out ${index * 0.5}s`,
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* STATS SECTION */}
      <Container maxWidth="lg" sx={{ mt: { xs: -6, md: -10 }, position: "relative", zIndex: 2 }}>
        <Paper
          elevation={6}
          sx={{
            borderRadius: theme.shape.borderRadius * 1.5,
            py: { xs: 3, md: 4 },
            px: { xs: 2, md: 4 },
            boxShadow: theme.shadows[8],
            backgroundColor: 'background.paper',
          }}
        >
          <Grid container spacing={3} divider={<Box sx={{ borderRight: 1, borderColor: "divider" }} />}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="primary" fontWeight={theme.typography.fontWeightBold}>
                  5,000+
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Job Opportunities
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="primary" fontWeight={theme.typography.fontWeightBold}>
                  1,200+
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Companies
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="primary" fontWeight={theme.typography.fontWeightBold}>
                  97%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Success Rate
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* FEATURES SECTION */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            fontWeight={theme.typography.fontWeightBold} 
            sx={{ mb: 2 }}
          >
            Why Choose <span style={{ color: theme.palette.primary.main }}>JobAlign</span>
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              maxWidth: "700px", 
              mx: "auto", 
              mb: 6 
            }}
          >
            JobAlign offers the best features to help you find the perfect job match and advance your career.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<SearchIcon fontSize="large" />}
              title="Smart Search"
              description="Find the perfect job match with our advanced AI-powered search and matching algorithms."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<BusinessIcon fontSize="large" />}
              title="Top Companies"
              description="Connect with leading companies and organizations across various industries."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<PsychologyIcon fontSize="large" />}
              title="Skill Assessment"
              description="Evaluate your skills and get personalized job recommendations based on your strengths."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<WorkIcon fontSize="large" />}
              title="Career Growth"
              description="Access resources and opportunities that help you grow in your professional journey."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<GroupsIcon fontSize="large" />}
              title="Networking"
              description="Connect with professionals and expand your network in your desired industry."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{
                height: "100%",
                p: { xs: 2, md: 3 },
                backgroundColor: 'primary.main',
                borderLeft: "none",
                color: 'primary.contrastText',
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[4],
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h6" gutterBottom fontWeight={theme.typography.fontWeightBold}>
                  Ready to Get Started?
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                  Join thousands of professionals who have already found their dream jobs with JobAlign.
                </Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to="/register"
                  sx={{
                    bgcolor: 'background.paper',
                    color: 'primary.main',
                    fontWeight: theme.typography.fontWeightMedium,
                    '&:hover': {
                      bgcolor: alpha('#fff', 0.9),
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Sign Up Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* TESTIMONIAL SECTION */}
      <Box sx={{ 
        backgroundColor: 'secondary.light', 
        py: { xs: 6, md: 10 } 
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h3" component="h2" fontWeight={theme.typography.fontWeightBold} mb={2}>
              Success Stories
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                maxWidth: "700px", 
                mx: "auto"
              }}
            >
              Hear from professionals who found their dream jobs through JobAlign.
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Card 
                sx={{ 
                  p: { xs: 3, md: 4 },
                  boxShadow: theme.shadows[3],
                  textAlign: "center",
                  borderRadius: theme.shape.borderRadius,
                }}
              >
                <Box 
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    mx: "auto",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: 'primary.main',
                    fontSize: "2rem",
                    fontWeight: theme.typography.fontWeightBold
                  }}
                >
                  JS
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3, 
                    fontStyle: "italic",
                    fontSize: "1.1rem",
                    lineHeight: 1.7
                  }}
                >
                  "JobAlign helped me find a job that perfectly matches my skills and career goals. The platform's intuitive interface and smart matching algorithms made the job search process so much easier."
                </Typography>
                <Typography variant="h6" fontWeight={theme.typography.fontWeightBold}>
                  Jane Smith
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Senior Developer at TechCorp
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA SECTION */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Card 
          sx={{ 
            borderRadius: theme.shape.borderRadius * 1.5,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'primary.contrastText',
            py: { xs: 4, md: 6 },
            px: { xs: 3, md: 5 },
            textAlign: "center",
            boxShadow: theme.shadows[6],
          }}
        >
          <Typography variant="h3" component="h2" fontWeight={theme.typography.fontWeightBold} mb={2}>
            Start Your Job Search Today
          </Typography>
          <Typography variant="h6" fontWeight={theme.typography.fontWeightRegular} sx={{ maxWidth: "800px", mx: "auto", mb: 4, opacity: 0.9 }}>
            Join thousands of job seekers who have found their perfect career match with JobAlign.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              component={Link}
              to="/register"
              size="large"
              sx={{ 
                bgcolor: 'background.paper', 
                color: 'primary.main',
                py: 1.5,
                px: 4,
                borderRadius: theme.shape.borderRadius,
                fontWeight: theme.typography.fontWeightMedium,
                transition: theme.transitions.create(['transform', 'box-shadow']),
                '&:hover': { 
                  bgcolor: alpha('#fff', 0.9),
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              Create Account
            </Button>
            <Button 
              variant="outlined" 
              component={Link}
              to="/jobs"
              size="large"
              sx={{ 
                color: 'primary.contrastText', 
                borderColor: 'primary.contrastText',
                py: 1.5,
                px: 4,
                borderRadius: theme.shape.borderRadius,
                borderWidth: 2,
                fontWeight: theme.typography.fontWeightMedium,
                '&:hover': { 
                  bgcolor: alpha('#fff', 0.1),
                  borderColor: 'primary.contrastText',
                  transform: 'translateY(-2px)',
                  borderWidth: 2,
                }
              }}
            >
              Browse Jobs
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
};

export default HomePage;
