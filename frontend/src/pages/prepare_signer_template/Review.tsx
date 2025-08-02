import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  // Define your props here
}

const Review: React.FC<Props> = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Review Template
      </Typography>
      <Typography variant="body1">
        Review the details before saving the template.
      </Typography>
    </Box>
  );
};

export default Review;
