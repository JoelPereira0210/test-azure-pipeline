// import React, { useState } from 'react';
// import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { Text, Portal, Modal, IconButton } from 'react-native-paper';
// import { useForm, Controller } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import InputField from '../UI/InputField/InputField';
// import ButtonInput from '../UI/Button/Button';
// import { updateMembershipAmount } from '../../actions/profile';
// import ConfirmBoxModal from '../UI/Popup/ConfirmBoxModal';
// import { useTheme } from '../../../theme/themeProvider';

// // Zod validation schema for the amount field.
// const amountSchema = z.object({
//   amount: z
//     .string()
//     .regex(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a valid number with up to 2 decimal places' })
//     .optional()
//     .refine(
//       (val) => {
//         if (!val) return true; // Allow undefined or empty values
//         const number = parseFloat(val);
//         return number >= 1 && number <= 999999999; // Limit: 1 to 99,99,99,999
//       },
//       { message: 'Amount must be between 1 and 99,99,99,999' }
//     ),
// });

// interface UpdateMembershipProps {
//   open: boolean;
//   onClose: () => void;
//   onUpdate: (newAmount: string) => void;
//   membershipAmount?: string;
// }

// const UpdateMembership: React.FC<UpdateMembershipProps> = ({
//   open,
//   onClose,
//   onUpdate,
//   membershipAmount,
// }) => {
//   const { control, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(amountSchema),
//     defaultValues: {
//       amount: membershipAmount || '',
//     },
//   });
//   const [showConfirmBox, setShowConfirmModal] = useState(false);
//   const { theme } = useTheme();
//   // mode is not used further here, but could be extracted if needed:
//   // const mode = theme.palette.mode;

//   const onSubmit = async (data: any) => {
//     try {
//       // Call the action function with the submitted amount
//       const result = await updateMembershipAmount(data);
//       console.log('Membership updated successfully:', result);
//       // Pass 0 if amount is null or empty
//       const amountToPass = data.amount ? data.amount : '0';
//       onUpdate(amountToPass);
//       onClose();
//     } catch (error) {
//       console.error('Error updating membership:', error);
//       // Optionally handle error (e.g., show a notification)
//     }
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       const result = await updateMembershipAmount({ amount: '0' });
//       console.log('Membership amount set to 0:', result);
//       onUpdate('0');
//       setShowConfirmModal(false);
//       onClose();
//     } catch (error) {
//       console.error('Error setting membership to 0:', error);
//     }
//   };

//   return (
//     <>
//       <Portal>
//         <Modal
//           visible={open}
//           onDismiss={onClose}
//           contentContainerStyle={styles.modalWrapper}
//         >
//           <ScrollView contentContainerStyle={styles.scrollContainer}>
//             <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
//               {/* Close Button */}
//               <IconButton
//                 icon="close"
//                 onPress={onClose}
//                 style={styles.closeButton}
//                 iconColor={theme.colors.mainText}
//               />

//               <Text style={[styles.title, { color: theme.colors.mainText }]}>
//                 Membership Update
//               </Text>

//               <View style={styles.formContainer}>
//                 <Controller
//                   name="amount"
//                   control={control}
//                   rules={{ required: 'Amount is required' }}
//                   render={({ field: { onChange, value } }) => (
//                     <InputField
//                       label="Enter Amount"
//                       onChange={onChange}
//                       value={value}
                 
//                       errorMessage={errors.amount ? String(errors.amount.message) : undefined}
             
       
//                     />
//                   )}
//                 />
//               </View>

//               {/* Button Section */}
//               <View style={styles.buttonRow}>
//                 <ButtonInput
//                   text="Delete"
//                   onPress={() => setShowConfirmModal(true)}
//                   width={130}
//                   buttonBackgroundColor={theme.colors.background}
//                   buttonFontColor={theme.colors.mainText}
//                   borderColor={theme.colors.mainText}
//                   fontSize={16}
             
//                 />
//                 <ButtonInput
//                   text="Submit"
//                   onPress={handleSubmit(onSubmit)}
//                   width={130}
//                   disabled={false}
               
//                 />
//               </View>
//             </View>
//           </ScrollView>
//         </Modal>
//       </Portal>

//       {showConfirmBox && (
//         <ConfirmBoxModal
//           open={showConfirmBox}
//           title="Sure you want to delete?"
//           description="Are you sure you want to delete this?"
//           onAgree={handleDeleteConfirm}
//           onDisagree={() => setShowConfirmModal(false)}
//           onClose={() => setShowConfirmModal(false)}
//           agreeText="Yes, Delete"
//           disagreeText="No, Cancel"
//         />
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   modalWrapper: {
//     marginHorizontal: 20,
//     marginVertical: 50,
//     borderRadius: 20,
//     maxHeight: '90%',
//     width: '90%',
//     alignSelf: 'center',
//   },
//   scrollContainer: {
//     padding: 16,
//   },
//   modalContainer: {
//     borderRadius: 20,
//     padding: 16,

//   },
//   closeButton: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   formContainer: {
//     marginTop: 40,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 16,
//     gap: 10,
//   },
// });

// export default UpdateMembership;



import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Portal, Modal, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../UI/InputField/InputField';
import ButtonInput from '../UI/Button/Button';
import { updateMembershipAmount } from '../../actions/profile';
import ConfirmBoxModal from '../UI/Popup/ConfirmBoxModal';
import { useTheme } from '../../../theme/themeProvider';

// Zod validation schema for the amount field.
const amountSchema = z.object({
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a valid number with up to 2 decimal places' })
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Allow undefined or empty values
        const number = parseFloat(val);
        return number >= 1 && number <= 999999999; // Limit: 1 to 99,99,99,999
      },
      { message: 'Amount must be between 1 and 99,99,99,999' }
    ),
});

interface UpdateMembershipProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (newAmount: string) => void;
  membershipAmount?: any
}

const UpdateMembership: React.FC<UpdateMembershipProps> = ({
  open,
  onClose,
  onUpdate,
  membershipAmount,
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(amountSchema),
    defaultValues: {
      amount: membershipAmount || '',
    },
  });

  const [showConfirmBox, setShowConfirmModal] = useState(false);
  const { theme } = useTheme();

  const onSubmit = async (data: any) => {
    try {
      const result = await updateMembershipAmount(data);
      console.log('Membership updated successfully:', result);
      const amountToPass = data.amount ? data.amount : '0';
      onUpdate(amountToPass);
      onClose();
    } catch (error) {
      console.error('Error updating membership:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await updateMembershipAmount({ amount: '0' });
      console.log('Membership amount set to 0:', result);
      onUpdate('0');
      setShowConfirmModal(false);
      onClose();
    } catch (error) {
      console.error('Error setting membership to 0:', error);
    }
  };

  return (
    <>
      <Portal>
        {/* Main Modal */}
        <Modal
          visible={open}
          onDismiss={onClose}
          dismissable
          contentContainerStyle={[
            styles.modalWrapper,
            {
              // Remove shadow around the modal:
              backgroundColor: theme.colors.background,
              elevation: 0,
              shadowColor: 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0,
              shadowRadius: 0,
            },
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.modalContainer}>
              {/* Close Button */}

                 <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                
            <Text style={[styles.title, { color: theme.colors.mainText }]}>
              Membership Update
            </Text>
                
                 <IconButton
              
              icon="close"
              onPress={onClose}
            //   style={styles.closeButton}
              iconColor={theme.colors.mainText}
            />

                    
                     </View>
              

              <View style={styles.formContainer}>
                <Controller
                  name="amount"
                  control={control}
                  rules={{ required: 'Amount is required' }}
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      label="Enter Amount"
                      onChange={onChange}
                      value={value}
                      errorMessage={errors.amount ? String(errors.amount.message) : undefined}
                    />
                  )}
                />
              </View>

              {/* Button Section */}
              <View style={styles.buttonRow}>
                <ButtonInput
                  text="Delete"
                  onPress={() => setShowConfirmModal(true)}
                  width={130}
                  buttonBackgroundColor={theme.colors.background}
                  buttonFontColor={theme.colors.mainText}
                  borderColor={theme.colors.mainText}
                  fontSize={16}
                />
                <ButtonInput
                  text="Submit"
                  onPress={handleSubmit(onSubmit)}
                  width={130}
                  disabled={false}
                />
              </View>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      {/* Confirm Delete Dialog */}
      {showConfirmBox && (
        <ConfirmBoxModal
          open={showConfirmBox}
          title="Sure you want to delete?"
          description="Are you sure you want to delete this?"
          onAgree={handleDeleteConfirm}
          onDisagree={() => setShowConfirmModal(false)}
          onClose={() => setShowConfirmModal(false)}
          agreeText="Yes, Delete"
          disagreeText="No, Cancel"
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    marginHorizontal: 20,
    marginVertical: 50,
    borderRadius: 20,
    maxHeight: '90%',
    width: '90%',
    alignSelf: 'center',
  },
  scrollContainer: {
    padding: 16,
  },
  modalContainer: {
    borderRadius: 20,
    padding: 16,
  },
  closeButton: {
    // position: 'absolute',
    // top: 8,
    // right: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    // marginBottom: 16,
  },
  formContainer: {
    marginTop: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 10,
  },
});

export default UpdateMembership;
