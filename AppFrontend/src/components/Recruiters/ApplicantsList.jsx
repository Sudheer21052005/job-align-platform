// src/components/Recruiters/ApplicantsList.jsx

import React, { useState } from 'react';
import {
  Typography,
  Container,
  List,
  CircularProgress,
  Alert,
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import useFetchJobApplications from '../../hooks/useFetchJobApplications';
import ApplicantRow from './ApplicantRow';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { format } from 'date-fns';

const ApplicantsList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { applications: applicants, loading, error } = useFetchJobApplications(id);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'name'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter applicants based on search term
  const filteredApplicants = applicants.filter(applicant =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort applicants
  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.appliedDate) - new Date(b.appliedDate)
        : new Date(b.appliedDate) - new Date(a.appliedDate);
    } else {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleViewDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedApplicant(null);
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Applicants
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manage and review job applications
        </Typography>

        <Paper sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip title="Sort by date">
              <IconButton
                onClick={() => handleSort('date')}
                color={sortBy === 'date' ? 'primary' : 'default'}
              >
                <SortIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sort by name">
              <IconButton
                onClick={() => handleSort('name')}
                color={sortBy === 'name' ? 'primary' : 'default'}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Showing {sortedApplicants.length} of {applicants.length} applicants
          </Typography>
        </Paper>

        {sortedApplicants.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No applicants found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search criteria
            </Typography>
          </Paper>
        ) : (
          <Paper>
            <List>
              {sortedApplicants.map((applicant, index) => (
                <React.Fragment key={applicant.id}>
                  <ApplicantRow
                    applicant={applicant}
                    onViewDetails={() => handleViewDetails(applicant)}
                  />
                  {index < sortedApplicants.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* Applicant Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Applicant Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedApplicant && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedApplicant.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedApplicant.email}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Applied: {format(new Date(selectedApplicant.appliedDate), 'PPP')}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Match Score: {selectedApplicant.matchScore || 'Not analyzed yet'}
              </Typography>
              {selectedApplicant.coverLetter && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Cover Letter
                  </Typography>
                  <Typography variant="body2">
                    {selectedApplicant.coverLetter}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ApplicantsList;
