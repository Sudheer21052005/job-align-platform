// src/hooks/useFetchJob.js
import { useState, useEffect, useCallback } from 'react';
import { fetchJobDetails } from '../api/api'; // This function calls GET /api/jobseekers/jobs/:id

const useFetchJob = (jobId) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch job details based on jobId
  const fetchJob = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      // Assuming the API returns either an object with a "job" field or the job object directly.
      const data = await fetchJobDetails(jobId);
      setJob(data.job || data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId, fetchJob]);

  return { job, loading, error, refetch: fetchJob };
};

export default useFetchJob;
