import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';

type Society = {
  societyId: string;
  societyName: string;
};

type Props = {
  societies: Society[];
  onSelect: (society: Society) => void;
};

const SocietySelectionModal: React.FC<Props> = ({ societies, onSelect }) => {

  console.log("societies in SocietySelectionModal", societies);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { 'xs': 300, 'sm': 300, 'md': 400, 'lg': 400, 'xl': 400 },
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '8px',
      }}
    >
      <Typography fontWeight={600}>Select Your Society</Typography>
      {societies.map((society) => (
        <Button
          key={society.societyId}
          onClick={() => onSelect(society)}
          sx={{ margin: '8px 0', width: '100%', textTransform: 'none' }}
          variant="outlined"
          size="large"
        >
          {society.societyName}
        </Button>
      ))}
    </Box>
  );
};

export default SocietySelectionModal;
