// import React, { useContext } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Modal, Button, Text, TextInput, IconButton } from 'react-native-paper';
// import { PaymentContext } from '../context/PaymentContext';
// import { useForm, Controller, FormProvider } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useTheme } from '../../../theme/themeProvider';

// const donationSchema = z.object({
//   donationAmount: z
//     .string()
//     .regex(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a valid number with up to 2 decimal places' })
//     .optional()
//     .refine(
//       (val) => {
//         if (!val) return true;
//         const number = parseFloat(val);
//         return number >= 1 && number <= 999999999;
//       },
//       { message: 'Amount must be between 1 and 99,99,99,999' }
//     ),
// });

// interface DonationModalProps {
//   open: boolean;
//   onClose: () => void;
//   eventId: string;
//   eventName?: string;
// }

// const DonationModal: React.FC<DonationModalProps> = ({ open, onClose, eventId, eventName }) => {
//   const { theme } = useTheme(); // Access theme and mode from useTheme hook

//     const {
//     setPaymentItemAmount,
//     setPaymentItemName,
//     setPaymentItemId,
//     setPaymentItemSection,
//     setEventRegistrationCount,
//   } = useContext(PaymentContext);

//   const methods = useForm<{ donationAmount: string }>({
//     resolver: zodResolver(donationSchema),
//     defaultValues: { donationAmount: '' },
//   });

//   const { handleSubmit, control, formState: { errors } } = methods;

//   const onSubmit = (data: { donationAmount: string }) => {
//     const donationAmount = parseFloat(data.donationAmount);
//     const donationData = { eventId, eventName, donationAmount };
//     console.log('Donation Data:', donationData);
//     onClose();

//     setPaymentItemAmount(donationAmount);
//     setPaymentItemName(eventName || 'Donation');
//     setPaymentItemId(eventId);
//     setPaymentItemSection('Donation Payment');
//     setEventRegistrationCount(0);
//   };

//   return (
//     <Modal visible={open} onDismiss={onClose} contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
//       <IconButton icon="close" size={24} onPress={onClose} style={styles.closeButton} />

//       <Text variant="titleMedium" style={[theme.typography.text1, styles.title]}>
//         Enter Amount For Donation
//       </Text>

//       <FormProvider {...methods}>
//         <View>
//           <Controller
//             name="donationAmount"
//             control={control}
//             render={({ field }) => (
//               <TextInput
//                 {...field}
//                 label="Amount"
//                 keyboardType="numeric"
//                 error={!!errors.donationAmount}
//                 mode="outlined"
//                 style={styles.input}
//               />
//             )}
//           />
//           {!!errors.donationAmount && <Text style={styles.error}>{errors.donationAmount?.message}</Text>}

//           <View style={styles.buttonContainer}>
//             <Button
//               mode="outlined"
//               onPress={onClose}
//               style={[styles.button, { borderColor: theme.colors.text }]}
//               labelStyle={styles.buttonLabel}
//             >
//               No, cancel
//             </Button>
//             <Button
//               mode="contained"
//               onPress={handleSubmit(onSubmit)}
//               style={[styles.button, { backgroundColor: theme.colors.primary }]}
//               labelStyle={styles.buttonLabel}
//             >
//               Yes, confirm
//             </Button>
//           </View>
//         </View>
//       </FormProvider>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     padding: 24,
//     marginHorizontal: 20,
//     borderRadius: 16,
//     elevation: 10,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//   },
//   title: {
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   input: {
//     marginTop: 16,
//   },
//   error: {
//     color: 'red',
//     marginTop: 8,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 24,
//   },
//   button: {
//     width: '45%',
//   },
//   buttonLabel: {
//     fontWeight: '600',
//   },
// });

// export default DonationModal;
import React, { useContext } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ButtonInput from '../UI/Button/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PaymentContext } from '../context/PaymentContext';
import InputField from '../UI/InputField/InputField';
import { useNavigation } from '@react-navigation/native'; 
import { useTheme } from '../../../theme/themeProvider';

const donationSchema = z.object({
  donationAmount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, {
      message:
        'Amount must be a valid number with up to 2 decimal places',
    })
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const number = parseFloat(val);
        return number >= 1 && number <= 999999999;
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

const DonationModal: React.FC<DonationModalProps> = ({
  open,
  onClose,
  eventId,
  eventName,
}) => {
  const { theme, mode } = useTheme();

  const {
    setPaymentItemAmount,
    setPaymentItemName,
    setPaymentItemId,
    setPaymentItemSection,
    setEventRegistrationCount,
  } = useContext(PaymentContext);

  const methods = useForm<{ donationAmount: string }>({
    resolver: zodResolver(donationSchema),
    defaultValues: { donationAmount: '' },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

    const navigation = useNavigation();


  const onSubmit = (data: { donationAmount: string }) => {
    const donationAmount = parseFloat(data.donationAmount);
    const donationData = { eventId, eventName, donationAmount };
    console.log('Donation Data:', donationData);
    onClose();

    setPaymentItemAmount(donationAmount);
    setPaymentItemName(eventName || 'Donation');
    setPaymentItemId(eventId);
    setPaymentItemSection('Donation Payment');
    setEventRegistrationCount(0);
    //@ts-ignore
    navigation.navigate('UnauthNavigator',{screen:'CartCheckoutPage'});
    
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={theme.colors.mainText} />
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.title, { color: theme.colors.mainText }]}>
            Enter Amount For Donation
          </Text>

          {/* Form */}
          <FormProvider {...methods}>
            <View style={styles.form}>
              <Controller
                name="donationAmount"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Enter Donation Amount"
                    type="numeric"
                    errorMessage={errors.donationAmount?.message}
                  />
                )}
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <ButtonInput
                text="No, cancel"
                type="button"
                onPress={onClose}
                width={130}
                buttonBackgroundColor={theme.colors.background}
                borderColor={theme.colors.mainText}
                buttonFontColor={theme.colors.mainText}

              />
              <ButtonInput
                text="Donate"
                type="submit"
                onPress={handleSubmit(onSubmit)}
                width={130}
                
              />
            </View>
          </FormProvider>
        </View>
      </View>
    </Modal>
  );
};

export default DonationModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%', // Matches web's 80% width
    maxWidth: 700, // Approximate max-width in dp
    borderRadius: 20,
    padding: 24,
    alignItems: 'flex-start',
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '500', // Use 500 to mirror web's fontWeight
    marginBottom: 20,
    marginTop:20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    // paddingVertical: 10,
    borderRadius: 8,
  },

});
