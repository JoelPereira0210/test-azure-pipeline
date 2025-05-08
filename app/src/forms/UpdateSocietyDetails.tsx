import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateSocietyDetailsSchema } from '../lib/zod/auth';
import { decryptValue } from '../utils/encryptiondecryption';
import { updateSocietyDetailsAction } from '../actions/profile';
import { getSocietyAction } from '../actions/society';
import InputField from '../component/UI/InputField/InputField';
import TextArea from '../component/UI/TextArea/TextArea';
import CountrySelector from '../component/UI/CountrySelector/CountrySelector';
import StateSelector from '../component/UI/StateSelector/StateSelector';
import ButtonInput from '../component/UI/Button/Button';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/themeProvider';

interface FormData {
  societyName: string;
  description: string;
  address: string;
  state: { name: string; state_code: string };
  country: { iso2: string; name: string; phone_code: any; subregion: string };
  pincode: string;
  buildingDoorNumber: string;
  buildingName: string;
  streetName: string;
  chargeMembershipFees: boolean;
  membershipFeeAmount: string;
}

const defaultValues: FormData = {
  societyName: '',
  description: '',
  address: '',
  state: { name: '', state_code: '' },
  country: { iso2: '', name: '', phone_code: 0 , subregion: '' },
  pincode: '',
  buildingDoorNumber: '',
  buildingName: '',
  streetName: '',
  chargeMembershipFees: false,
  membershipFeeAmount: '',
};

const UpdateSocietyDetails: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Initialize react-hook-form with Zod and defaultValues
  const methods = useForm<FormData>({
    resolver: zodResolver(updateSocietyDetailsSchema),
    defaultValues,
  });
  const {
    control,
    setValue,
    formState: { errors },
    getValues,
    watch,
  } = methods;

  const [loading, setLoading] = useState(false);

  // Fetch society details from AsyncStorage and then from the API
  useEffect(() => {
    (async () => {
      try {
        const encryptedId = await AsyncStorage.getItem('societyId');
        if (!encryptedId) return;

        const societyID = await decryptValue(encryptedId);
        if (!societyID) return;

        // Call the API with societyID (as in the web version)
        const values = await getSocietyAction();
        if (!values?.data?.society) return;

        const s = values.data.society;
        // Populate form fields using setValue
        setValue('societyName', s.societyName || '');
        setValue('description', s.description || '');
        setValue('address', s.address || '');
        setValue('pincode', s.pincode || '');
        setValue('buildingDoorNumber', s.buildingDoorNumber || '');
        setValue('buildingName', s.buildingName || '');
        setValue('streetName', s.streetName || '');
        setValue('chargeMembershipFees', s.chargeMembershipFees || false);
        setValue('membershipFeeAmount', s.membershipFeeAmount || '');
        // For country and state, store entire objects
        setValue('state', s.state || { name: '', state_code: '' });
        setValue('country', s.country || { iso2: '', name: '', phone_code: 0, subregion: '' });
      } catch (error) {
        console.error('Error fetching society details:', error);
      }
    })();
  }, [setValue]);

  // Handle update button press
  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Get the final form data
      const data = getValues();
      const response = await updateSocietyDetailsAction(data);

      if (response.success) {
        
        //@ts-ignore
              navigation.navigate('Profile', { screen: 'ProfileMain' })
       
      }
    } catch (error) {
      console.error('Error updating society details:', error);
      Alert.alert('Error', 'An error occurred while updating society details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: theme.colors.mainText }]}>
            Society Details
          </Text>
          <Text style={[styles.subHeader, { color: theme.colors.mainText }]}>
            Setup your Society for members that may join later.
          </Text>
        </View>

        {loading && (
          <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
        )}

        <FormProvider {...methods}>
          <View style={styles.form}>
            {/* Society Name (read-only) */}
            <Controller
              name="societyName"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Society Name"
                  value={field.value}
                  onChange={field.onChange}
                  errorMessage={errors.societyName?.message}
                  readOnly
         
                />
              )}
            />

            {/* Building Name (read-only) */}
            <Controller
              name="buildingName"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Building Name"
                  value={field.value}
                  onChange={field.onChange}
                  errorMessage={errors.buildingName?.message}
                  readOnly
              
                />
              )}
            />

            {/* Society Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  label="Society Description"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.description?.message}
                />
              )}
            />

            {/* Building Door Number (read-only) */}
            <Controller
              name="buildingDoorNumber"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Building Door Number"
                  value={field.value}
                  onChange={field.onChange}
                  errorMessage={errors.buildingDoorNumber?.message}
                  readOnly
               
                />
              )}
            />

            {/* Address */}
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Address"
                  value={field.value}
                  onChange={field.onChange}
                  errorMessage={errors.address?.message}
                />
              )}
            />

            {/* Street Name (read-only) */}
            <Controller
              name="streetName"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Street Name"
                  value={field.value}
                  onChange={field.onChange}
                  errorMessage={errors.streetName?.message}
                  readOnly
                
                />
              )}
            />

            {/* Country (disabled to mimic web version) */}
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <CountrySelector
                  label="Select Country"
                  required
                  value={field.value}
                  errorMessage={
                    errors.country ? String(errors.country?.message) : undefined
                  }
                  onSelectCountry={(country) => {
                    field.onChange(country);
                  }}
                  disabled={true}
                  readOnly={true}
                  
                />
              )}
            />

            {/* State (disabled to mimic web version) */}
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <StateSelector
                  label="Select State"
                  required
                  value={field.value}
                  errorMessage={
                    errors.state ? String(errors.state?.message) : undefined
                  }
                  // Pass the country name from the form values
                  countryName={watch('country')?.name}
                  onSelectState={(selectedState) => {
                    field.onChange(selectedState);
                  }}
                  readOnly={true}
                  disabled={true}
                />
              )}
            />

            {/* Pincode (read-only) */}
            <Controller
              name="pincode"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Pincode"
                  value={field.value}
                  onChange={field.onChange}
                  errorMessage={errors.pincode?.message}
                  readOnly
             
                />
              )}
            />
          </View>

          {/* Update Button */}
          <View style={styles.buttonContainer}>
            <ButtonInput
              disabled={loading}
              text="Update"
              onPress={handleUpdate}
              loading={loading}
              styles={{ width: 210, alignSelf: 'center', marginTop: 20 }}
            />
          </View>
        </FormProvider>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UpdateSocietyDetails;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 16,
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  form: {
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
});
