import React ,{useContext} from 'react';
import { Box, Typography, Modal, useTheme, IconButton } from '@mui/material';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import ButtonInput from '@/src/component/UI/Button/Button';
import InputField from '@/src/component/UI/InputField/InputField';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { PaymentContext } from '../context/PaymentContext';
import { registerFreeEventAction } from '../EventPayment';
import { useUser } from '@/src/component/context/UserContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
interface JoinEventModalProps {
    open: boolean;
    onClose: () => void;
    amountPerPerson?: number;
    eventId: string; // Added eventId prop
    eventType: string; // Added eventType prop
    eventName:string;
    allowFamilyFriends: boolean;
    remainingCapacity: number; // New prop for remaining capacity
    chargePerPerson: boolean;
  }
const JoinEventModal: React.FC<JoinEventModalProps> = ({  open,
    onClose,
    amountPerPerson,
    eventId,
    eventType,
    allowFamilyFriends,
    eventName,
    remainingCapacity,
    chargePerPerson
  }) => {

    const {
      paymentItemAmount,
      setPaymentItemAmount,
      paymentItemName,
      setPaymentItemName,
      paymentItemId, 
      setPaymentItemId,
      paymentItemSection, 
      setPaymentItemSection,
      setEventRegistrationCount
    } = useContext(PaymentContext);

    
  const theme = useTheme();
  const mode = theme.palette.mode;
  const router = useRouter();
  const { user } = useUser();

  const JoinEventModalSchema = z.object({
    numberOfPeople: z
      .union([z.string(), z.number()])
      .refine((val) => !isNaN(parseInt(val.toString())), { message: 'Invalid number.' }) // Ensure input is numeric
      .transform((val) => parseInt(val.toString())) // Transform to number
      .refine((val) => val >= 1, { message: 'You must register at least one person.' }) // Validate minimum
      .refine((val) => val <= remainingCapacity, {
        message: `Cannot exceed ${remainingCapacity} people.`,
      }), // Validate against remaining capacity
  });
  


  const methods = useForm<{ numberOfPeople:number }>({
    resolver: zodResolver(JoinEventModalSchema),
    defaultValues: { numberOfPeople: 1 },
  });

  const onCloseHandler = () => {
    reset(); // Reset the form state
    onClose(); // Call the passed onClose prop
  };

  const { handleSubmit, control, watch,formState: { errors },reset } = methods;

  const numberOfPeople = watch('numberOfPeople') || 1;

  // Conditional amount calculation based on `chargePerPerson`
  const amountToPay = chargePerPerson
    ? amountPerPerson * numberOfPeople
    : amountPerPerson;


  const onSubmit = (data: { numberOfPeople: number }) => {
    const eventData = {
      ...data,
      eventId,
      eventType,
      eventName,
      amount: amountToPay,
    };
    console.log('Join Event Form Data', eventData);
    onClose();

    setPaymentItemAmount(amountToPay);
    setPaymentItemName(eventName);
    setPaymentItemId(eventId);
    setPaymentItemSection('Event Payment');
    setEventRegistrationCount(numberOfPeople);
    //  Navigate to the PaymentGatewayPage and pass data


    if (eventType === 'paid') {
     router.push(
      `/cart-checkout`
    );
  }

  else {
    registerFreeEventAction({
      eventId,
      userId: user.userId, // Replace with the actual user ID
      numberOfRegistrations: numberOfPeople,
    });
  }
    

  };

  console.log("join event modal erros",errors);

  return (
    <Modal open={open} onClose={onCloseHandler} aria-labelledby="join-event-modal-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          maxWidth: '400px',
          bgcolor: 'background.paper',
          borderRadius: '20px',
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={onCloseHandler}>
          <CloseIcon />
        </IconButton>

        <Typography id="join-event-modal-title" variant="text12" fontWeight={500} >
          Join Event
        </Typography>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Amount Per Person Field */}
            {eventType==='paid' && (
                <Box mt={2}>

                <InputField

                      label="Amount Per Person"
                      type="text"
                      value= {`Rs ${amountPerPerson}`}
                      readOnly={true}
                      style={{color:'red',fontWeight:600}}
                    />
                </Box>
            )}
           

            
            {/* Number of People Field */}
            {allowFamilyFriends === true  && (
 <Box mt={2}>
 <Controller
   name="numberOfPeople"
   control={control}
   render={({ field }) => (
     <InputField
       {...field}
       label="Number of People (Including You)"
       type="number"
       placeholder="Number of People"
       error={!!errors.numberOfPeople}
      errorMessage={errors.numberOfPeople?.message} // Show error message
     />
   )}
 />
</Box>
            )}
           

            {/* Amount to be Paid Field */}
            {eventType==='paid' && (
            <Box mt={2}>
  
              <InputField

                    label="Amount to be Paid"
                    type="text"
                    value= {`Rs ${amountToPay}`}
                    readOnly={true}
                    style={{color:'red'}}
                    />
            </Box>
            )}

            {/* Buttons */}
            <Box mt={4}    sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: { xs: '5%', sm: '5%', md: '5%', lg: '5%' },
                    mt: 4,
                  }}>
            <>
                      {/* Edit Button for Admin */}
                      <ButtonInput
                        disabled={false}
                        fontWeight={600}
                        text="Cancel"
                        type="button"
                        onClick={() => {
                          onCloseHandler
                        }}
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
                      {/* Delete Button for Admin */}
                      <ButtonInput
                        disabled={false}
                        fontWeight={600}
                        text= {eventType==='paid'?'Pay':'Register'}
                        type="submit"
                        // onClick={() => {
                        // console.log("PAY FOR EVENT clicked");
                        // }}
                        styles={{
                            width: '45%',
                            backgroundColor: '#3b82f6', // Blue color as shown in the image
                            color: '#ffffff',
                            borderRadius: '8px',
                            padding: '10px 0',
                            fontSize: '1rem',
                          }}
                      />
                    </>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default JoinEventModal;

