
import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Button, Typography } from '@mui/material';
import { decryptValue } from '@/src/utils/encryptiondecryption';

type Society = {
  societyId: string;
  societyName: string;
};

interface SocietySelectionProfileModalProps {
  open: boolean;
  societies: Society[];
  onSelect: (society: Society) => void;
  onClose: () => void;
}

export default function SocietySelectionProfileModal({
  open,
  societies,
  onSelect,
  onClose,
}: SocietySelectionProfileModalProps) {
  const currentSociety = decryptValue(localStorage.getItem('societyId'))
  console.log("currentSociety", currentSociety)
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', height: 'max-content', borderRadius: '10px', padding: '1%' } }}
      maxWidth="xs"
      open={open}
      onClose={onClose}
    >
      <DialogTitle
      >
        <Typography variant="text3" fontWeight={600}>Select Your Society</Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        {societies.map((society) => (
          <Button
            key={society.societyId}
            onClick={() => {
              onSelect(society);
              onClose();
            }}

            sx={{
              margin: '8px 0',
              width: '100%',
              textTransform: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              padding: '1.5%',
              // color: '#465FF1',
              color: `${society.societyId === currentSociety ? '#fff' : '#465FF1'}`,
              borderColor: '#465FF1',
              backgroundColor: `${society.societyId === currentSociety ? '#465FF1' : 'transparent'}`

            }}
            variant={`${society.societyId === currentSociety ? 'contained' : 'outlined'}`}
          >
            {society.societyName}
          </Button>
        ))}
      </DialogContent>
    </Dialog>
  );
}
