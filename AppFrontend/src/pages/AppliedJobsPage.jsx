import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import JobApplications from '../components/JobSeekers/JobApplicationslist';

const AppliedJobsPage = () => {
  const { user, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in or not a job seeker
    if (!isAuthenticated) {
      navigate('/login?returnTo=/applied-jobs');
      return;
    }

    if (userRole && userRole !== 'jobSeeker') {
      navigate('/unauthorized');
      return;
    }
  }, [isAuthenticated, userRole, navigate]);

  return <JobApplications />;
};

export default AppliedJobsPage; 