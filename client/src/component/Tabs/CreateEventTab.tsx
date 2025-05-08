'use client';
import React, { useContext }from 'react';

import { Box, Typography, Chip, Button, useTheme,useMediaQuery} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { EventContext } from '../context/EventContext';

const Tabs = ({ step, setStep}) => {
  const { setCreateEvent, setEventActionType, eventId, setEventId,eventActionType } = useContext(EventContext); 
  const theme = useTheme();
  const mode =  theme.palette.mode;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // This will return true if the screen size is small or extra small

  return (
    <Box>
      <Box sx={{ marginTop: '1%', marginBottom: '1%', marginLeft: '1%' }}>
      
        <Typography variant="text1" sx={{ marginLeft: {
      xs: "4%",  
      sm: "0%",  
      md: "0%",  
      lg: "0%"  
    }}}>{eventActionType}</Typography>
      </Box>
      <Box className="tabs">
        <button
          className={`tab ${step === 1 ? 'active' : ''}`}
          onClick={() => setStep(1)} // Always allow access to step 1
        >
          <Typography variant="text12">Details</Typography>
        </button>

        {/* Upload Tab */}
        <button
          className={`tab ${step === 2 ? 'active' : ''}`}
          onClick={() => setStep(2)} // Validation is handled inside setStep
        >
          <Typography variant="text12">Upload</Typography>
        </button>

        {/* Event Type Tab */}
        <button
          className={`tab ${step === 3 ? 'active' : ''}`}
          onClick={() => setStep(3)} // Validation is handled inside setStep
        >
          <Typography variant="text12">Event Type</Typography>
        </button>

        {/* Review Tab */}
        <button
          className={`tab ${step === 4 ? 'active' : ''}`}
          onClick={() => setStep(4)} // Validation is handled inside setStep
        >
          <Typography variant="text12">Review</Typography>
        </button>
      </Box>
    </Box>
  );
};

export default Tabs;
