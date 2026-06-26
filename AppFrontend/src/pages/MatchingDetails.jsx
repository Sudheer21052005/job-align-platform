// src/pages/MatchingDetails.jsx

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Grid,
  Box,
  Paper,
  Chip,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  alpha,
  useTheme,
  Avatar,
} from "@mui/material";
import { fetchApplicationMatchDetails } from "../api/api";
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import CloseIcon from '@mui/icons-material/Close';

const MatchingDetails = ({ applicationId, open, onClose }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return; // Only fetch details when modal is open
    const fetchDetails = async () => {
      setLoading(true);
      try {
        // The API is expected to return an object with a "matchDetails" property or the analysis details directly.
        const data = await fetchApplicationMatchDetails(applicationId);
        setMatchDetails(data.matchDetails || data);
      } catch (err) {
        setError(err.message || "Failed to load matching details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [applicationId, open]);

  // Get icon for each category
  const getCategoryIcon = (category) => {
    const normalizedCategory = category.toLowerCase();
    if (normalizedCategory.includes('skill')) return <CodeIcon />;
    if (normalizedCategory.includes('education')) return <SchoolIcon />;
    if (normalizedCategory.includes('experience')) return <WorkIcon />;
    return <AssessmentIcon />;
  };

  // Get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Renders each detailed score section as a grid item.
  const renderDetailedScores = () => {
    if (!matchDetails || !matchDetails.detailedScores) return null;
    const { detailedScores } = matchDetails;
    return (
      <Grid container spacing={3}>
        {Object.entries(detailedScores).map(([key, value]) => {
          const scoreColor = getScoreColor(value.score);
          return (
            <Grid item xs={12} sm={6} key={key}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  borderColor: alpha(scoreColor, 0.3),
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 4px 12px ${alpha(scoreColor, 0.2)}`
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(scoreColor, 0.1), color: scoreColor, mr: 1.5 }}>
                      {getCategoryIcon(key)}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ flexGrow: 1, mr: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={value.score} 
                          sx={{ 
                            height: 10, 
                            borderRadius: 5,
                            bgcolor: alpha(scoreColor, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: scoreColor
                            }
                          }} 
                        />
                      </Box>
                      <Typography variant="body1" fontWeight="bold" color={scoreColor}>
                        {value.score}%
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Comment
                  </Typography>
                  <Typography variant="body2">
                    {value.comment}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{ 
        sx: { 
          borderRadius: 2,
          overflow: 'hidden'
        } 
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: alpha(theme.palette.primary.main, 0.05),
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        display: 'flex',
        alignItems: 'center',
      }}>
        <AssessmentIcon color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Matching Analysis Details
        </Typography>
        <Button 
          variant="text" 
          color="inherit" 
          onClick={onClose}
          sx={{ minWidth: 'auto', p: 1 }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading analysis details...
            </Typography>
          </Box>
        ) : error ? (
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: alpha(theme.palette.error.main, 0.05), 
              color: theme.palette.error.main,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              borderRadius: 2
            }}
          >
            <Typography fontWeight="medium">{error}</Typography>
          </Paper>
        ) : matchDetails ? (
          <>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3, 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2, 
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  Match Analysis
                </Typography>
                <Chip 
                  label={`${matchDetails.overallScore}% Match`}
                  color={matchDetails.overallScore >= 80 ? "success" : matchDetails.overallScore >= 60 ? "warning" : "error"}
                  sx={{ fontWeight: 'bold', fontSize: '1rem', height: 32, px: 1 }}
                />
              </Box>
              <Typography variant="body1">
                {matchDetails.summaryComment}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Analysis conducted on {new Date(matchDetails.analysisTimestamp).toLocaleString()}
              </Typography>
            </Paper>

            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <AssessmentIcon sx={{ mr: 1 }} />
              Detailed Score Breakdown
            </Typography>
            {renderDetailedScores()}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No analysis details found.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.8)}` }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          color="primary"
          sx={{ 
            borderRadius: 2,
            px: 3
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchingDetails;
