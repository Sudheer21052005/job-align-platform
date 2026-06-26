import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import JobAssistant from './JobAssistant';

/**
 * JobAssistantWrapper
 * 
 * This component conditionally renders the JobAssistant based on the user's role.
 * It only shows the assistant for authenticated users with the 'jobSeeker' role.
 */
const JobAssistantWrapper = () => {
  const { userRole, isAuthenticated } = useAuth();
  const [showAssistant, setShowAssistant] = useState(false);
  
  useEffect(() => {
    // Only show the assistant for job seekers
    if (isAuthenticated && userRole === 'jobSeeker') {
      setShowAssistant(true);
    } else {
      setShowAssistant(false);
    }
  }, [isAuthenticated, userRole]);
  
  // Only render JobAssistant if the user is a job seeker
  if (!showAssistant) {
    return null;
  }
  
  return <JobAssistant />;
};

export default JobAssistantWrapper; 