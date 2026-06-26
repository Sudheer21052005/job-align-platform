// components/Recruiters/RecruiterDashBoard.jsx


import React from 'react';
import { Typography, Container, Card, CardContent, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

// Dummy data for demonstration (replace with API data)
const mockJobs = [
  { id: 1, title: 'Frontend Developer', company: 'Google' },
  { id: 2, title: 'Backend Engineer', company: 'Amazon' },
];

const RecruiterDashboard = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Welcome, {user?.name}
      </Typography>

      <Typography variant="h5" gutterBottom>
        Your Posted Jobs
      </Typography>

      <Grid container spacing={3}>
        {mockJobs.length > 0 ? (
          mockJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {job.company}
                  </Typography>
                  <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                      View Applicants
                    </Typography>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No jobs posted yet.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default RecruiterDashboard;
