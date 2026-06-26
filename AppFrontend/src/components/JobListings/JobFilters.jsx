// src/components/JobListings/JobFilters.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  useTheme,
  alpha,
  Chip,
  Stack,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WorkIcon from "@mui/icons-material/Work";
import { useJobFilters } from "../../contexts/JobFiltersContext";

const JobFilters = ({ onApplyFilters }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { filters, updateFilter, resetFilters } = useJobFilters();
  
  // Local filters state for reset functionality
  const [localFilters, setLocalFilters] = useState({
    location: filters.location || "",
    jobType: filters.jobType || "",
    salaryRange: filters.salaryRange || "",
    query: filters.query || "",
  });

  // Update local filters when context filters change
  useEffect(() => {
    setLocalFilters({
      location: filters.location || "",
      jobType: filters.jobType || "",
      salaryRange: filters.salaryRange || "",
      query: filters.query || "",
    });
  }, [filters]);
  
  // Update local filters
  const handleChange = (key) => (event) => {
    const newValue = event.target.value;
    setLocalFilters(prev => ({
      ...prev,
      [key]: newValue
    }));
    
    // Also update context
    updateFilter(key, newValue);
  };

  // Handle apply filters button click
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  // Reset all filters
  const handleReset = () => {
    resetFilters();
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  return (
    <Box>
      {/* Search filter */}
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search jobs, skills, or companies"
        value={localFilters.query || ""}
        onChange={handleChange("query")}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Filter title */}
      <Typography 
        variant="subtitle2" 
        sx={{ 
          mb: 1.5,
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FilterAltIcon sx={{ fontSize: '1rem', mr: 0.5 }} /> 
        FILTERS
      </Typography>

      {/* Filter sections - more compact, modern layout */}
      <Stack spacing={1.5}>
        {/* Location filter */}
        <Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}
          >
            <LocationOnIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} /> Location
          </Typography>
          <FormControl fullWidth variant="outlined" size="small">
            <Select
              value={localFilters.location || ""}
              onChange={handleChange("location")}
              displayEmpty
              inputProps={{ 'aria-label': 'Location' }}
              sx={{ 
                '.MuiSelect-select': { 
                  py: 0.75, 
                },
                fontSize: '0.9rem',
              }}
            >
              <MenuItem value="">
                <em>All Locations</em>
              </MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
              <MenuItem value="Onsite">Onsite</MenuItem>
              <MenuItem value="Bangalore">Bangalore</MenuItem>
              <MenuItem value="Mumbai">Mumbai</MenuItem>
              <MenuItem value="Delhi">Delhi</MenuItem>
              <MenuItem value="Hyderabad">Hyderabad</MenuItem>
              <MenuItem value="Chennai">Chennai</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {/* Job Type filter */}
        <Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}
          >
            <WorkIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} /> Job Type
          </Typography>
          <FormControl fullWidth variant="outlined" size="small">
            <Select
              value={localFilters.jobType || ""}
              onChange={handleChange("jobType")}
              displayEmpty
              inputProps={{ 'aria-label': 'Job Type' }}
              sx={{ 
                '.MuiSelect-select': { 
                  py: 0.75,
                },
                fontSize: '0.9rem',
              }}
            >
              <MenuItem value="">
                <em>All Types</em>
              </MenuItem>
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
              <MenuItem value="Freelance">Freelance</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {/* Salary range filter */}
        <Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}
          >
            <AttachMoneyIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} /> Salary Range (LPA)
          </Typography>
          <FormControl fullWidth variant="outlined" size="small">
            <Select
              value={localFilters.salaryRange || ""}
              onChange={handleChange("salaryRange")}
              displayEmpty
              inputProps={{ 'aria-label': 'Salary Range' }}
              sx={{ 
                '.MuiSelect-select': { 
                  py: 0.75,
                },
                fontSize: '0.9rem',
              }}
            >
              <MenuItem value="">
                <em>Any</em>
              </MenuItem>
              <MenuItem value="0-5">0-5 LPA</MenuItem>
              <MenuItem value="5-10">5-10 LPA</MenuItem>
              <MenuItem value="10-15">10-15 LPA</MenuItem>
              <MenuItem value="15-25">15-25 LPA</MenuItem>
              <MenuItem value="25+">25+ LPA</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Filter actions */}
      <Stack direction="row" spacing={1.5}>
        <Button
          variant="outlined"
          size="small"
          color="inherit"
          onClick={handleReset}
          sx={{ 
            flex: 1,
            py: 0.75,
            borderColor: theme.palette.divider,
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            }
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleApplyFilters}
          sx={{ 
            flex: 1,
            py: 0.75,
          }}
        >
          Apply
        </Button>
      </Stack>
    </Box>
  );
};

export default JobFilters;
