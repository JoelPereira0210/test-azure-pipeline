
// import React from 'react';
// import {
//   Box,
//   Typography,
//   Modal,
//   IconButton,
//   Grid,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { useForm, Controller } from 'react-hook-form';
// import { useTheme } from '@mui/material';
// import InputField from '../UI/InputField/InputField';
// import ButtonInput from '../UI/Button/Button';
// import { updateMembershipAmount } from '@/src/actions/profile';

// interface UpdateMembershipProps {
//   open: boolean;
//   onClose: () => void;
//   membershipAmount?: string; // Amount received as a prop
// }

// const UpdateMembership: React.FC<UpdateMembershipProps> = ({
//   open,
//   onClose,
//   membershipAmount,
// }) => {
//   const { control, handleSubmit, formState: { errors } } = useForm({
//     defaultValues: {
//       amount: membershipAmount || '', // Prefill input with membershipAmount
//     }
//   });
//   const theme = useTheme();
//   const mode = theme.palette.mode;
//   const onSubmit = async (data) => {
//     try {
//       // Call the action function with the submitted amount
//       const result = await updateMembershipAmount(data);
//       console.log('Membership updated successfully:', result);
//       onClose(); // Close modal after successful submission
//     } catch (error) {
//       console.error('Error updating membership:', error);
//       // Optionally handle error (e.g., show a notification)
//     }
//   };
//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       aria-labelledby="modal-title"
//       aria-describedby="modal-description"
//     >
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: {
//             xs: '90%',
//             sm: '80%',
//             md: '60%',
//             lg: '50%',
//           },
//           maxWidth: '668px',
//           maxHeight: '90vh',
//           bgcolor: 'background.paper',
//           borderRadius: '20px',
//           boxShadow: 24,
//           p: 4,
//         }}
//       >
//         <IconButton
//           sx={{ position: 'absolute', top: 8, right: 8 }}
//           onClick={onClose}
//         >
//           <CloseIcon />
//         </IconButton>

//         <Typography id="modal-title" variant="h6" component="h2">
//           Membership Update
//         </Typography>

//         <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
//           <Grid container spacing={2}>
//             {/* Amount Field */}
//             <Grid item xs={12}>
//               <Controller
//                 name="amount"
//                 control={control}
//                 rules={{ required: 'Amount is required' }}
//                 render={({ field }) => (
//                   <InputField
//                     type="text"
//                     label="Amount"
//                     {...field}
//                     required
//                     placeholder="Enter amount"
//                     errorMessage={
//                       errors.amount ? String(errors.amount.message) : undefined
//                     }
//                   />
//                 )}
//               />
//             </Grid>
//           </Grid>

//           {/* Button Section */}
//           <Grid container spacing={2} sx={{ justifyContent: 'center', mt: 2 }}>
//             <Grid item>
//               <ButtonInput
//                 styles={{
//                   width: '112px',
//                   border: `1px solid ${theme?.palette?.mode === 'light' ? 'black' : 'white'}`,
//                 }}
//                 text="Delete"
//                 buttonBackgroundColor="transparent"
//                 buttonFontColor={`${theme?.palette?.mode === 'light' ? 'black' : 'white'}`}
//                 fontSize={16}
//                 fontWeight={600}
//                 type="button"
//                 onClick={onClose} // Close modal or handle delete logic
//               />
//             </Grid>
//             <Grid item>
//               <ButtonInput
//                 disabled={false}
//                 fontWeight={600}
//                 text="Submit"
//                 type="submit"
//                 styles={{
//                   width: '112px',
//                   backgroundColor: `${mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)'}`,
//                   color: `${mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-light-sidebar)'}`,
//                 }}
//               />
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default UpdateMembership;



import React, { useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '@mui/material';
import InputField from '../UI/InputField/InputField';
import ButtonInput from '../UI/Button/Button';
import { updateMembershipAmount } from '@/src/actions/profile';
import { truncate } from 'fs';
import ConfirmBoxModel from '../UI/Popup/ConfirmBoxModel';

import { z } from 'zod'; // Import Zod
import { zodResolver } from '@hookform/resolvers/zod'; // Import the Zod resolver


const amountSchema = z.object({
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a valid number with up to 2 decimal places' })
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Allow undefined or empty values
        const number = parseFloat(val);
        return number >= 1 && number <= 999999999; // Limit: 1 to 10 billion
      },
      { message: 'Amount must be between 1 and 99,99,99,999' }
    ),
});


interface UpdateMembershipProps {
  open: boolean;
  onClose: () => void;onUpdate: (newAmount: string) => void;
  membershipAmount?: string; // Amount received as a prop
}

const UpdateMembership: React.FC<UpdateMembershipProps> = ({
  open,
  onClose,onUpdate, 
  membershipAmount,
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(amountSchema), // Use Zod resolver for validation
    defaultValues: {
      amount: membershipAmount || '', // Prefill input with membershipAmount
    }
  });
  const[showConfirmBox,setShowConfirmModal]=useState(false)
  const theme = useTheme();
  const mode = theme.palette.mode;


 
  const onSubmit = async (data) => {
    try {
      // Call the action function with the submitted amount
      const result = await updateMembershipAmount(data);
      console.log('Membership updated successfully:', result);
      
      // Pass 0 if amount is null or empty
      const amountToPass = data.amount ? data.amount : '0'; // Default to '0' if amount is falsy
      onUpdate(amountToPass);
      
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error('Error updating membership:', error);
      // Optionally handle error (e.g., show a notification)
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await updateMembershipAmount({ amount: '0' });
      console.log('Membership amount set to 0:', result);
      
      onUpdate('0'); // Pass 0 as the updated amount
      setShowConfirmModal(false); // Close confirm box
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error setting membership to 0:', error);
    }
  };
  

  return (
    <>
    <Modal
      open={open}
      // onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {
            xs: '90%',
            sm: '80%',
            md: '60%',
            lg: '50%',
          },
          maxWidth: '668px',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: '20px',
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography id="modal-title" variant="h6" component="h2">
          Membership Update
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* Amount Field */}
            <Grid item xs={12}>
              <Controller
                name="amount"
                control={control}
                // No longer require the amount
                render={({ field }) => (
                  <InputField
                    type="text"
                    label="Amount"
                    {...field}
                    placeholder="Enter amount"
                    errorMessage={errors.amount ? errors.amount.message : undefined}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Button Section */}
          <Grid container spacing={2} sx={{ justifyContent: 'center', mt: 2 }}>
            <Grid item>
              <ButtonInput
                styles={{
                  width: '112px',
                  border: `1px solid ${theme?.palette?.mode === 'light' ? 'black' : 'white'}`,
                }}
                text="Delete"
                buttonBackgroundColor="transparent"
                buttonFontColor={`${theme?.palette?.mode === 'light' ? 'black' : 'white'}`}
                fontSize={16}
                fontWeight={600}
                type="button"
                onClick={()=>{setShowConfirmModal(true)}} // Close modal or handle delete logic
              />
            </Grid>
            <Grid item>
              <ButtonInput
                disabled={false}
                fontWeight={600}
                text="Submit"
                type="submit"
                styles={{
                  width: '112px',
                  backgroundColor: `${mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)'}`,
                  color: `${mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-light-sidebar)'}`,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
    {showConfirmBox && (
      <ConfirmBoxModel
      open={showConfirmBox}
      title="Suer you want to delete?"
      description="Are you sure you want to delete this?"
      onAgree={handleDeleteConfirm} // Call handleDelete on confirmation
      onDisagree={() => setShowConfirmModal(false)} // Close dialog on cancel
      onClose={() => setShowConfirmModal(false)} // Close dialog on background click
      agreeText="Yes, Delete"
      disagreeText="No, Cancel"
    />
    )}
    </>
  );
};

export default UpdateMembership;
