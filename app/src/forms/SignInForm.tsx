
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Portal, Modal, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../lib/zod/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import MobileInput from '../component/UI/MobileInput/MobileInput';
import SocietySelectionModal from '../component/modals/SocietySelectionModal';
import { loginAction, setRoleAction } from '../actions/auth';
import ButtonInput from '../component/UI/Button/Button';
import { useTheme } from '../../theme/themeProvider';
import InputField from '../component/UI/InputField/InputField';
import { setSocietyId } from '../utils/encryptiondecryption';

type Society = {
  societyId: string;
  societyName: string;
};

const SignInForm = () => {
  const { theme } = useTheme(); // Apply theme
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const navigation = useNavigation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  // Store society ID in AsyncStorage
  const setSocietyIdInAsyncStorage = async (society: Society) => {
    console.log("mystep2 got setSocietyIdInAsyncStorage",society.societyId);
    try {
      await setSocietyId(society.societyId);
      return true;
    } catch (error) {
      console.error('Error setting societyId:', error);
      return false;
    }
  };

  // Handle Society Selection
  const handleSocietySelection = async (society: Society, token?: string) => {
    console.log("mystep 1: got society in handleSocietySelection",society);
    const success = await setSocietyIdInAsyncStorage(society);
    if (success) {
      if (pendingToken || token) {
        const formattedSocietyName = society.societyName.replace(/[\s.]+/g, '-').toLowerCase();
        // await setRoleAction();
        console.log(`Redirecting to: ${formattedSocietyName}`);
        // navigation.navigate('Members');
        //@ts-ignore
        navigation.navigate("AuthNavigator", { screen: "Members" });
      }
    } else {
      console.error('Failed to set society in AsyncStorage.');
    }
  };

  const handleModalSelect = async (society: Society) => {
    setShowModal(false);
    await handleSocietySelection(society);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response: any = await loginAction(data);

      if (response.status === 200) {
        const token = response.data.token;
        const societies = response.data.societies;

        if (token) {
          setPendingToken(token);
          await AsyncStorage.setItem('authToken', token);
        }

        if (societies.length > 1) {
          setSocieties(societies);
          setShowModal(true);
        } else if (societies.length === 1) {
          await handleSocietySelection(societies[0], token);
        } else {
          console.error('No societies associated with this user.');
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
        {/* Title */}
        <Text style={[styles.heading, theme.typography.text13, { color: theme.colors.text }]}>Sign In</Text>
        <Text style={[styles.subHeading, theme.typography.text5, { color: theme.colors.text }]}>
          Enter your phone number and password
        </Text>

        {/* Mobile Number Input */}
        <Controller
          name="phone_number"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <MobileInput
              name={field.name}
              control={control}
              label="Mobile Number"
              required={true}
              placeholder="Mobile Number"
              error={errors.phone_number ? String(errors.phone_number.message) : undefined}
              country="IN"
            />
          )}
        />

   

        {/* Password Field */}


        <Controller
  name="password"
  control={control}
  rules={{ required: true }}
  render={({ field: { onChange, value } }) => (
    <InputField
      label="Password"
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      required={true}
      errorMessage={errors.password ? String(errors.password.message) : undefined}
      icon={showPassword ? 'eye-off' : 'eye'}
      // customStyles={{ width: '92%' }} 
    />
  )}
/>



        {/* Submit Button */}
        <ButtonInput text="Login" onPress={handleSubmit(onSubmit)} loading={loading} />
      
      

        {/* Society Selection Modal */}
        <Portal>
          <Modal visible={showModal} onDismiss={() => setShowModal(false)} contentContainerStyle={styles.modalContainer}>
            <SocietySelectionModal societies={societies} onSelect={handleModalSelect} visible={showModal} onDismiss={() => setShowModal(false)} />
          </Modal>
        </Portal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subHeading: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    width: '95%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
});

export default SignInForm;
