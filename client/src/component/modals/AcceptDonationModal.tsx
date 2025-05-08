import React,{useContext} from 'react';
import { Box, Typography, Modal, useTheme, IconButton } from '@mui/material';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import ButtonInput from '@/src/component/UI/Button/Button';
import InputField from '@/src/component/UI/InputField/InputField';
import CloseIcon from '@mui/icons-material/Close';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentContext } from '../context/PaymentContext';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/component/context/UserContext';


const donationSchema = z.object({
    donationAmount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a valid number with up to 2 decimal places' })
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Allow undefined or empty values
        const number = parseFloat(val);
        return number >= 1 && number <= 999999999; // Limit: 10 billion
      },
      { message: 'Amount must be between 1 and 99,99,99,999' }
    ),
  });

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventName?: string;
}

const DonationModal: React.FC<DonationModalProps> = ({ open, onClose, eventId, eventName  }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const router = useRouter();
  const {
      setPaymentItemAmount,
      setPaymentItemName,
      setPaymentItemId,
      setPaymentItemSection,
      setEventRegistrationCount
  } = useContext(PaymentContext);

  const methods = useForm<{ donationAmount: string }>({
    resolver: zodResolver(donationSchema), // Use Zod resolver
    defaultValues: { donationAmount: '' },
  });

  const { handleSubmit, control, formState: { errors } } = methods;

  const onSubmit = (data: { donationAmount: string }) => {
    const donationAmount = parseFloat(data.donationAmount);
   
    const donationData = {
      eventId,
      eventName,
      donationAmount,
  };
  console.log('Donation Data:', donationData);
  onClose();

     // For Razorpay payment handling
     setPaymentItemAmount(donationAmount);
     setPaymentItemName(eventName || 'Donation');
     setPaymentItemId(eventId);
     setPaymentItemSection('Donation Payment');
     setEventRegistrationCount(0);
     router.push(`/cart-checkout`);

  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="donation-modal-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '700px',
          bgcolor: 'background.paper',
          borderRadius: '20px',
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>

        <Typography id="donation-modal-title" variant="text12" fontWeight={500}>
          Enter Amount For Donation
        </Typography>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Donation Amount Field */}
            <Box mt={2}>
              <Controller
                name="donationAmount"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Amount"
                    type="text"
                    error={!!errors.donationAmount}
                    style={{ fontWeight: 600 }}
                    errorMessage={errors.donationAmount?.message}
                  />
                )}
              />
            </Box>

            {/* Buttons */}
            <Box
              mt={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: '5%', sm: '5%', md: '5%', lg: '5%' },
              }}
            >
              <ButtonInput
                disabled={false}
                fontWeight={600}
                text="No, cancel"
                type="button"
                onClick={onClose}
                styles={{
                  width: '45%',
                  backgroundColor: 'transparent',
                  color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
                  border: `1px solid ${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
                  borderRadius: '8px',
                  padding: '10px 0',
                  fontSize: '1rem',
                }}
              />
              <ButtonInput
                disabled={false}
                fontWeight={600}
                text="Yes, confirm"
                type="submit"
                styles={{
                  width: '45%',
                  backgroundColor: '#3b82f6', // Blue color as shown in the image
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '10px 0',
                  fontSize: '1rem',
                }}
              />
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default DonationModal;
