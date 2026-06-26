import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const JobFiltersContext = createContext();

// Define the default filter state
const defaultFilters = {
  location: '',
  jobType: '',
  salaryRange: '',
  query: '',
};

// Provider component
export const JobFiltersProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [filters, setFilters] = useState(() => {
    try {
      const savedFilters = localStorage.getItem('jobFilters');
      return savedFilters ? JSON.parse(savedFilters) : defaultFilters;
    } catch (error) {
      console.error('Error loading filters from localStorage:', error);
      return defaultFilters;
    }
  });

  // Save to localStorage whenever filters change
  useEffect(() => {
    try {
      localStorage.setItem('jobFilters', JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters to localStorage:', error);
    }
  }, [filters]);

  // Update a single filter
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <JobFiltersContext.Provider value={{
      filters,
      updateFilter,
      resetFilters,
      setFilters
    }}>
      {children}
    </JobFiltersContext.Provider>
  );
};

// Hook for using the filters context
export const useJobFilters = () => {
  return useContext(JobFiltersContext);
};

export default JobFiltersProvider; 