// src/components/Recruiters/ApplicantRow.jsx

import React from 'react';
import { ListItem, ListItemText } from '@mui/material';

const ApplicantRow = ({ applicant }) => {
  return (
    <ListItem key={applicant.id}>
      <ListItemText 
        primary={applicant.name} 
        secondary={`Email: ${applicant.email}`}
      />
    </ListItem>
  );
};

export default ApplicantRow;
