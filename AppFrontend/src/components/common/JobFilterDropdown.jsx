// components/Common/JobFilterDropdown.jsx

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, useTheme } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

const JobFilterDropdown = ({ jobs = [], selectedJob, onChange, size = 'medium' }) => {
  const theme = useTheme();
  
  return (
    <FormControl 
      fullWidth 
      variant="outlined" 
      size={size}
      sx={{ 
        mb: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: theme.shape.borderRadius,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.light',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          }
        }
      }}
    >
      <InputLabel id="job-filter-label">Filter by Job</InputLabel>
      <Select
        labelId="job-filter-label"
        id="job-filter-dropdown"
        value={selectedJob}
        onChange={onChange}
        label="Filter by Job"
        startAdornment={
          <Box sx={{ color: 'text.secondary', mr: 1, display: 'flex', alignItems: 'center' }}>
            <WorkIcon fontSize="small" />
          </Box>
        }
      >
        <MenuItem value="">
          <em>All Jobs</em>
        </MenuItem>
        {jobs.map((job) => (
          <MenuItem key={job.id} value={job.id}>
            {job.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default JobFilterDropdown;
