import React from 'react';

import {
  Box,
  Typography,
  Modal,
  IconButton,
  Grid,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '@mui/material';
import InputField from '../UI/InputField/InputField';
import { useEffect, useState } from 'react';
import { fetchBankDetails, updateBankDetails,  validateIfsc} from '@/src/actions/profile';
import ButtonInput from '../UI/Button/Button';
import { z } from 'zod';
import { bankDetailsSchema } from '@/src/lib/zod/superAdmin';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

interface UpdateBankDetailsProps {
  open: boolean;
  onClose: () => void;
}

const UpdateBankDetails: React.FC<UpdateBankDetailsProps> = ({
  open,
  onClose,
}) => {
  const {
    control, clearErrors,
    handleSubmit,
    formState: { errors },
    setValue, watch,
  } = useForm({
    resolver: zodResolver(bankDetailsSchema), // Use Zod schema for validation
  });
  const [bankDetails, setBankDetails] = useState<any>(null); // Change to any for better flexibility
  const theme = useTheme();
  const mode = theme.palette.mode;
  useEffect(() => {
    if (open) {
      const fetchDetails = async () => {
        try {
          const details = await fetchBankDetails(); // Call the fetchBankDetails action
          setBankDetails(details); // Set the fetched details in state
          console.log('Received Bank Details in useEffect:', details); // Log the details received

          // Prefill form fields with fetched data
          setValue('bankAccountNumber', details.accountNumber);
          setValue('accountName', details.accountName);
          setValue('bank', details.bank);
          setValue('branchName', details.branchName);
          setValue('ifscCode', details.IFSCCode);
        } catch (error) {
          console.error('Error in fetchDetails:', error);
        }
      };

      fetchDetails();
    }
  }, [open, setValue]);
  const ifscCode = watch('ifscCode');
  const swiftCode = watch('swiftCode');

  useEffect(() => {
    // Trigger IFSC validation whenever IFSC code changes
    const fetchIfscBankDetails = async () => {
      try {
        if (ifscCode) {
          // Check if the IFSC code is valid before fetching details
          const details = await validateIfsc(ifscCode); // Fetch bank and branch details
          console.log('IFSC Validation Details:', details);
  
          // If IFSC code is valid, update branch and bank fields
          if (details.bankName && details.branchName) {
            setValue('bank', details.bankName);
            setValue('branchName', details.branchName);
            clearErrors('bank');
          }
        } else {
          // Clear the branch and bank details if IFSC code is empty
          setValue('bank', ''); // Clear bank name
          setValue('branchName', ''); // Clear branch name
        }
      } catch (error) {
        console.error('Error in validateIfsc:', error);
  
        // Handle clearing the fields if the IFSC code is invalid
        setValue('bank', ''); // Clear bank name
        setValue('branchName', ''); // Clear branch name
      }
    };
  
    fetchIfscBankDetails();
  }, [ifscCode, setValue]);
  

  // useEffect(() => {
  //   const fetchSwiftBankDetails = async () => {
  //     try {
  //       if (swiftCode) {
  //         const details = await validateSwift(swiftCode);
  //         console.log('SWIFT Validation Details:', details);
  
  //         if (details.bankName && details.branchName) {
  //           setValue('bank', details.bankName);
  //           setValue('branchName', details.branchName);
  //         }
  //       } else {
  //         setValue('bank', ''); // Clear bank name
  //         setValue('branchName', ''); // Clear branch name
  //       }
  //     } catch (error) {
  //       console.error('Error in validateSwift:', error);
  //       setValue('bank', ''); // Clear bank name
  //       setValue('branchName', ''); // Clear branch name
  //     }
  //   };
  
  //   fetchSwiftBankDetails();
  // }, [ifscCode, swiftCode, setValue]);



  
  const onSubmit = async (data) => {
    try {
      const bank = watch('bank') || data.bank; // Fallback to form data if watch fails
      const branchName = watch('branchName') || data.branchName;
 
      const submissionData = {
        ...data,
        bank,
        branchName,
      };
 
      const response = await updateBankDetails(submissionData);
 console.log("first",response)
      if (response.success) {
       
        console.log('Bank details updated successfully:', response.data);
        setBankDetails(response.data);
        onClose();
      } else {
        console.error('Failed to update bank details:', response);
      }
    } catch (error) {
      console.error('Error updating bank details:', error);
    }
  };


  console.log("bank errors",errors);
  // console.log("BANK NAMEEE",watch('bank'));
  return (
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
          overflowX: 'auto',
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
          Update Bank Details
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* Bank Account Number Field */}
            <Grid item xs={12}>
              <Controller
                name="bankAccountNumber"
                control={control}
                // rules={{ required: 'Bank account number is required' }}
                render={({ field }) => (
                  <InputField
                    type="text"
                    label="Bank Account Number"
                    {...field}
                    required
                    placeholder="Bank Account Number"
                    errorMessage={
                      errors.bankAccountNumber
                        ? String(errors.bankAccountNumber.message)
                        : undefined
                    }
                  />
                )}
              />
            </Grid>


              {/* Account Holder's Name Field */}
              <Grid item xs={12}>
  <Controller
    name="accountName"
    control={control}
    rules={{ required: "Account holder's name is required" }}
    render={({ field }) => (
      <InputField
        type="text"
        label="Account Name"
        {...field}
        required
        placeholder="Account Name"
        errorMessage={
          errors.accountName ? String(errors.accountName.message) : undefined
        }
      />
    )}
  />
</Grid>

                {/* IFSC Code Field */}
            <Grid item xs={12}>
              <Controller
                // name="ifscCode"
                 name="ifscCode"
                control={control}
                // rules={{ required: 'IFSC code is required' }}
                render={({ field }) => (
                  <InputField
                    type="text"
                    label="IFSC Code"
                    {...field}
                    required
                    placeholder="IFSC Code"
                    errorMessage={
                      errors.ifscCode
                        ? String(errors.ifscCode.message)
                        : undefined
                    }
                  />
                )}
              />
            </Grid>



            {/* <Grid item xs={12}>
              <Controller
                name="swiftCode"
                control={control}
                rules={{ required: 'SWIFT code is required' }}
                render={({ field }) => (
                  <InputField
                    type="text"
                    label="SWIFT Code"
                    {...field}
                    required
                    placeholder="SWIFT Code"
                    
                  />
                )}
              />
            </Grid> */}







          


  {/* Address Field */}
  <Grid item xs={12}>
              <Controller
                name="branchName"
                control={control}
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <InputField
                    type="text"
                    label="Branch Name"
                    {...field}
                    required
                    placeholder="Branch Name"
                    errorMessage={
                      errors.address
                        ? String(errors.branchName.message)
                        : undefined
                    }
                    readOnly
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="bank"
                control={control}
                // rules={{ required: "Bank's name is required" }}
                render={({ field }) => (
                  <InputField
                    type="text"
                    label="Bank's Name"
                    {...field}
                    required
                    placeholder="Banks Name"
                    errorMessage={
                      errors.bank ? String(errors.bank.message) : undefined
                    }
                  readOnly
                  />
                )}
              />
            </Grid>
          
            
          </Grid>

          {/* Button Section */}
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            <Grid item>
              <ButtonInput
                styles={{
                  width: '112px',
                  border: `1px solid ${
                    theme?.palette?.mode === 'light' ? 'black' : 'white'
                  }`,
                }}
                text="Cancel"
                buttonBackgroundColor="transparent"
                buttonFontColor={`${
                  theme?.palette?.mode === 'light' ? 'black' : 'white'
                }`}
                fontSize={16}
                fontWeight={600}
                type="button"
                disabled={false}
                loading={false}
                onClick={onClose}
              />
            </Grid>
            <Grid item>
              <ButtonInput
                disabled={false}
                fontWeight={600}
                text={bankDetails ? 'Update' : 'Add'}
                type="submit"
                styles={{
                  width: '112px',
                  backgroundColor: `${
                    mode === 'light'
                      ? 'var(--tw-bg-light-main)'
                      : 'var(--tw-bg-light-main)'
                  }`,
                  color: `${
                    mode === 'light'
                      ? 'var(--tw-bg-light-sidebar)'
                      : 'var(--tw-bg-light-sidebar)'
                  }`,
                  borderColor: `${mode === 'light' ? 'red' : 'red'}`,
                }}
                onClick={handleSubmit(onSubmit)} // Make sure to trigger the form submission
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateBankDetails;
