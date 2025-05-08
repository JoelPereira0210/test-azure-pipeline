import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ButtonInput from '../UI/Button/Button';
import InputField from '../UI/InputField/InputField';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; 
import { PaymentContext } from '../context/PaymentContext';
import { useUser } from '../context/UserContext';
import { useTheme } from '../../../theme/themeProvider';
import { registerFreeEventAction } from '../EventPayment';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { registerFreeEventAction } from '../actions/EventPayment'; 

// Props definition (if using TypeScript)
interface JoinEventModalProps {
  open: boolean;
  onClose: () => void;
  amountPerPerson?: number;
  eventId: string;
  eventType: string;
  eventName: string;
  allowFamilyFriends: boolean;
  remainingCapacity: number;
  chargePerPerson: boolean;
}

const JoinEventModal: React.FC<JoinEventModalProps> = ({
  open,
  onClose,
  amountPerPerson = 0,
  eventId,
  eventType,
  eventName,
  allowFamilyFriends,
  remainingCapacity,
  chargePerPerson,
}) => {


  // Payment context
  const {
    setPaymentItemAmount,
    setPaymentItemName,
    setPaymentItemId,
    setPaymentItemSection,
    setEventRegistrationCount,
  } = useContext(PaymentContext);

  const [membershipStatus, setMembershipStatus] = useState('unpaid');

  // Navigation hook (replaces Next.js router)
  const navigation = useNavigation();
  const {theme} = useTheme();
  // Current user from your context
  const { user } = useUser();

  // Zod schema
  const JoinEventModalSchema = z.object({
    numberOfPeople: z
      .union([z.string(), z.number()])
      .refine((val) => !isNaN(parseInt(val.toString())), {
        message: 'Invalid number.',
      })
      .transform((val) => parseInt(val.toString()))
      .refine((val) => val >= 1, {
        message: 'You must register at least one person.',
      })
      .refine((val) => val <= remainingCapacity, {
        message: `Cannot exceed ${remainingCapacity} people.`,
      }),
  });

  // react-hook-form setup
  const methods = useForm<{
    numberOfPeople: number;
  }>({
    resolver: zodResolver(JoinEventModalSchema),
    defaultValues: { numberOfPeople: 1 },
  });

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = methods;

  // Watch numberOfPeople
  const numberOfPeople = watch('numberOfPeople') || 1;
  

  // Conditional amount calculation
  const amountToPay = chargePerPerson
    ? amountPerPerson * numberOfPeople
    : amountPerPerson;

  // Close handler
  const onCloseHandler = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    const getLocalData = async () => {
      const role = await AsyncStorage.getItem('flow');
      const membership = await AsyncStorage.getItem('membershipStatus');
      setMembershipStatus(membership || '');
    };
    getLocalData();
  }, []);
  
  // Submit logic
  const onSubmit = (data: { numberOfPeople: number }) => {
    const eventData = {
      ...data,
      eventId,
      eventType,
      eventName,
      amount: amountToPay,
    };
    console.log('Join Event Form Data', eventData);

    onCloseHandler(); // close the modal

    // Set Payment context values
    setPaymentItemAmount(amountToPay || null);
    setPaymentItemName(eventName);
    setPaymentItemId(eventId);
    setPaymentItemSection('Event Payment');
    setEventRegistrationCount(data.numberOfPeople);

    // If paid event, navigate to cart checkout
    if (eventType === 'paid') {
      //@ts-ignore
      navigation.navigate('UnauthNavigator',{screen:'CartCheckoutPage'});
    } else {
    

      registerFreeEventAction({
        eventId,
        userId: user?.userId, // from context
        numberOfRegistrations: data.numberOfPeople,
      });
    }
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={onCloseHandler}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer,{backgroundColor:theme.colors.background}]}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onCloseHandler}
          >
            <Icon name="close" size={24} color={theme.colors.mainText} />
          </TouchableOpacity>

          <Text style={[styles.title,{color:theme.colors.mainText}]}>Join Event</Text>

          <FormProvider {...methods}>
            <View style={styles.form}>
              {/* Amount Per Person (Read-Only) */}
              {eventType === 'paid' && (
                <View style={styles.inputRow}>
                  <InputField
                    label="Amount Per Person"
                    value={`Rs ${amountPerPerson ?? 0}`}
                    readOnly
                  />
                </View>
              )}

              {/* Number of People Field (only if allowFamilyFriends) */}
              {allowFamilyFriends && (
                <View style={styles.inputRow}>
                  <Controller
                    name="numberOfPeople"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="Number of People (Including You)"
                        required
                        // value={field.value}
                        onChange={field.onChange}
                        type="number"
                        errorMessage={errors.numberOfPeople?.message}
                      />
                    )}
                  />
                </View>
              )}

              {/* Amount to be Paid */}
              {eventType === 'paid' && (
                <View style={styles.inputRow}>
                  <InputField
                    label="Amount to be Paid"
                    value={`Rs ${amountToPay ?? 0}`}
                    readOnly
                  />
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <ButtonInput
                  text="Cancel"
                  type="button"
                  onPress={onCloseHandler}
                  width={130}
                  buttonBackgroundColor={theme.colors.background}
                  borderColor={theme.colors.mainText}
                  buttonFontColor={theme.colors.mainText}
  
                  // styles={[styles.buttonCancel, { marginRight: 10 }]}

                />
                <ButtonInput
                  text={eventType === 'paid' ? 'Pay' : 'Register'}
                  type="submit"
                  onPress={handleSubmit(onSubmit)}
                  disabled={membershipStatus === 'unpaid'}
                  // styles={styles.buttonSubmit}
                  width={130}
                />
              </View>
            </View>
          </FormProvider>
        </View>
      </View>
    </Modal>
  );
};

export default JoinEventModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 20,
    padding: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  form: {
    marginTop: 20,
  },
  inputRow: {
    marginBottom: 15,
  },
  buttonRow: {
    // marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap:10
  },
  buttonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 10,
    flex: 1,
  },
  buttonSubmit: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 10,
    flex: 1,
  },
});
