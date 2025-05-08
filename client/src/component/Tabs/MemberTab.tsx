'use client';
import { Box, Typography, Button } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { MemberContext } from '../context/MemberContext';
import React, {useContext} from 'react';

const Tabs = () => {
  const {  viewMembersForm, setViewmembersForm,MemberActionType, setMemberActionType,contextUserId, setContextUserId ,step, 
    setStep} = useContext(MemberContext);
  return (
    <Box sx={{ position: 'relative' }}>
      
      <Box
        className="tabs"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Box>
        <button
            className={`tab ${step === 1 || step === 4 ? 'active' : ''}`}
            onClick={() => setStep(1)}
            disabled={step === 4} // Disable clicking when in edit mode
          >
            <Typography variant="text12" className="tabs-typography">
              Personal Information
            </Typography>
          </button>
          {step !== 4 && ( // Hide tabs if step is 4
            <>
              <button
                className={`tab ${step === 2 ? 'active' : ''}`}
                onClick={() => setStep(2)}
              >
                <Typography variant="text12" className="tabs-typography">
                  Registered Event
                </Typography>
              </button>
              <button
                className={`tab ${step === 3 ? 'active' : ''}`}
                onClick={() => setStep(3)}
              >
                <Typography variant="text12" className="tabs-typography">
                  Maintenance Fees
                </Typography>
              </button>
            </>
          )}
         
        </Box>
       
      </Box>
    </Box>
  );
};

export default Tabs;
