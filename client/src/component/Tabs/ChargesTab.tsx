'use client';
import { Box, Typography, Button } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import React, { useContext, useEffect, useState } from 'react';
import { ChargesContext } from '../context/ChargesContext';

const ChargesTab = ({ step, setStep}) => {


  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check the `flow` value from localStorage and set state
    const role = localStorage.getItem('flow');
    setIsAdmin(role === 'admin');
  }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        className="tabs"
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', sm: 'center', md: 'space-between', lg: 'space-between' },
          alignItems: 'flex-end',
        }}
      >
        <Box>
          <button
            className={`tab ${step === 1 ? 'active' : ''}`}
            onClick={() => setStep(1)}
          >
            <Typography variant="text12" className="tabs-typography">
              Pending
            </Typography>
          </button>
          <button
            className={`tab ${step === 2 ? 'active' : ''}`}
            onClick={() => setStep(2)}
          >
            <Typography variant="text12" className="tabs-typography">
              Paid
            </Typography>
          </button>
        </Box>
      </Box>
    </Box>
  );

};

export default ChargesTab;
