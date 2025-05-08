import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonInput from '../Button/Button';

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  note?: string;
  buttonText: string;
}

const alertModalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '500px',  // Increased width for larger screens
  maxWidth: '95%', // Make it responsive for smaller screens
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  '@media (max-width: 600px)': {
    padding: '16px', // Reduced padding on smaller screens
  },
};

const AlertModal: React.FC<AlertModalProps> = ({ open, onClose, title, note, buttonText }) => {
  return (
    <Modal
      open={open}
      onClose={() => { }} // Disable closing the modal via the backdrop
      BackdropProps={{
        onClick: () => { },  // Prevent backdrop click from closing the modal
      }}
      aria-labelledby="alert-modal-title"
      aria-describedby="alert-modal-description"
    >
      <Box sx={alertModalStyle}>
        <Typography
          id="alert-modal-title"
          variant="h6"
          component="h2"
          sx={{
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>
        <Typography
          id="alert-modal-note"
          variant="body2"
          gutterBottom
          sx={{
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          {note}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <ButtonInput
            text={buttonText}
            type="button"
            onClick={onClose}  // Close only when this button is clicked
            styles={{
              backgroundColor: 'black',
              color: '#FFF',
              borderColor: '#4F4F4F',
              borderWidth: '1px',
              borderStyle: 'solid',
              padding: '8px 16px',
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default AlertModal;
