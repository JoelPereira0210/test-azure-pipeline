import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonInput from '../Button/Button';
import ErrorIcon from '@mui/icons-material/Error'; // Importing Error Icon from MUI

interface ErrorAlertModalProps {
  open: boolean;
  onClose: () => void;
  errorMessage: string;
}

const errorModalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350, // Increased width
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const ErrorAlertModal: React.FC<ErrorAlertModalProps> = ({ open, onClose, errorMessage }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="error-alert-modal-title"
      aria-describedby="error-alert-modal-description"
    >
      <Box sx={errorModalStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <ErrorIcon sx={{ color: 'red', fontSize: 30, marginRight: '8px' }} /> {/* Error Icon */}
          <Typography id="error-alert-modal-title" variant="h6" component="h2">
            Error
          </Typography>
        </Box>
        <Typography id="error-alert-modal-description" gutterBottom>
          {errorMessage}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <ButtonInput
            text="Close"
            type="button"
            onClick={onClose}
            styles={{
              backgroundColor: 'black',
              color: '#FFF',
              borderColor: '#4F4F4F',
              borderWidth: '1px',      // Adding border width
              borderStyle: 'solid',    // Adding border style
              padding: '8px 16px',     // Adjust padding for better button styling
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default ErrorAlertModal;
