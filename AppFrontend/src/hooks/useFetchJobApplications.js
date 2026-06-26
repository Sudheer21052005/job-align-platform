// src/hooks/useFetchJobApplications.js

import { useState, useEffect, useCallback } from 'react';
import { fetchJobSeekerApplications, fetchJobDetails, fetchCompanyById } from '../api/api';

const useFetchJobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJobDetails = useCallback(async (applications) => {
    if (!Array.isArray(applications) || applications.length === 0) {
      return [];
    }

    try {
      const enhancedApplications = await Promise.all(
        applications.map(async (application) => {
          // If application already has all the job details we need, just return it
          if (application.job && typeof application.job === 'object' &&
            application.job.title && application.job.companyName) {
            // Check if job.company is a string ID and we need to fetch company data
            if (application.job.company && typeof application.job.company === 'string') {
              try {
                const companyData = await fetchCompanyById(application.job.company);
                if (companyData) {
                  application.job.company = companyData;
                  application.company = companyData;
                }
              } catch (companyErr) {
                console.error(`Error fetching company for application:`, companyErr);
              }
            }

            return application;
          }

          // Get job ID from either application.jobId or application.job
          const jobId = application.jobId ||
            (typeof application.job === 'string' ? application.job : application.job?._id);

          if (!jobId) {
            return application;
          }

          try {
            const jobDetails = await fetchJobDetails(jobId);

            let companyData = null;
            if (jobDetails.company && typeof jobDetails.company === 'string') {
              try {
                companyData = await fetchCompanyById(jobDetails.company);
                jobDetails.company = companyData;
              } catch (companyErr) {
                console.error(`Error fetching company for job ${jobId}:`, companyErr);
              }
            }

            return {
              ...application,
              job: jobDetails,
              jobTitle: jobDetails.title,
              companyName: jobDetails.companyName || companyData?.name || jobDetails.company?.name || "Unknown Company",
              location: jobDetails.location,
              company: companyData || jobDetails.company || null
            };
          } catch (err) {
            console.error(`Error fetching job details for application (${application._id || application.id}):`, err);
            return application;
          }
        })
      );

      return enhancedApplications;

    } catch (err) {
      console.error("Error enhancing applications with job details:", err);
      return applications;
    }
  }, []);

  const getUserApplications = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetchJobSeekerApplications();

      let applicationData = [];
      if (response?.applications && Array.isArray(response.applications)) {
        applicationData = response.applications;
      } else if (Array.isArray(response)) {
        applicationData = response;
      } else {
        applicationData = [];
      }

      const enhancedApplications = await loadJobDetails(applicationData);
      setApplications(enhancedApplications);

    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to fetch job applications');
    } finally {
      setLoading(false);
    }
  }, [loadJobDetails]);

  useEffect(() => {
    const controller = new AbortController();

    getUserApplications();

    return () => {
      controller.abort();
    };
  }, [getUserApplications]);

  return {
    applications,
    loading,
    error,
    refetch: () => getUserApplications()
  };
};

export default useFetchJobApplications;
