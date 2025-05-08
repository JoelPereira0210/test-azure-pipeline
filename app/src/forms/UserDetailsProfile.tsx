import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { userDetailsSchema } from '../lib/zod/auth';
import { fetchLoggedInUserDetails, updateUser } from '../actions/auth';
import { fileToBase64 } from '../utils/auth';
import { useNavigation } from '@react-navigation/native';
import InputField from '../component/UI/InputField/InputField';
import MobileInput from '../component/UI/MobileInput/MobileInput';
import SelectDropDown from '../component/UI/DropDownInputField/SelectDropDown';
import CountrySelector from '../component/UI/CountrySelector/CountrySelector';
import StateSelector from '../component/UI/StateSelector/StateSelector';
import ButtonInput from '../component/UI/Button/Button';
import ProfileImageUpload from '../component/UI/ProfileImageUpload/ProfileImageUpload';

import { useTheme } from '../../theme/themeProvider';
import { set } from 'zod';


interface UserData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  flatNumber: string;
  buildingDoorNumber: string;
  address: string;
  streetName: string;
  state: { name: string; state_code: string };
  country: { iso2: string; name: string; phone_code: any; subregion: string };
  pincode: string;
  password: string;
  confirmPassword: string;
  profilePictureId: string;
  picture?: string;
}

interface UserDetailsProfileProps {
  backHandler: () => void;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'others', label: 'Others' },
];

interface CountryData {
  cca2: string;
  name: string;
  callingCode: string;
  subregion: string;
}


const UserDetailsProfile: React.FC<UserDetailsProfileProps> = ({ backHandler }) => {
  const { theme } = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Base64 from server
  const [selectedImageData, setSelectedImageData] = useState<any | null>(null); // Raw file from local device


  const methods = useForm<UserData>({
    resolver: zodResolver(userDetailsSchema),
    mode: 'onBlur',
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const navigation = useNavigation();

  useEffect(() => {
    if (userData) {
      // Ensure country phone_code is a string before setting it in the form.
      setValue('country', {
        ...userData.country,
        phone_code: String(userData?.country?.phone_code),
      });
      // Optionally set state as well if needed.
      setValue('state', userData.state);
    }
  }, [userData, setValue]);
  
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await fetchLoggedInUserDetails();
        setUserData(data);
        if (!data) return;
        // Construct the user object with all fields.
        const user: UserData = {
          firstName: data?.firstName || '',
          lastName: data?.lastName || '',
          phoneNumber: data?.phoneNumber || '',
          gender: data?.gender || '',
          flatNumber: data?.flatNumber || '',
          buildingDoorNumber: data?.buildingDoorNumber || '',
          address: data?.address || '',
          streetName: data?.streetName || '',
          country: data?.country || { iso2: '', name: '', phone_code: 0, subregion: '' },
          state: data?.state || { name: '', state_code: '' },
          pincode: data?.pincode || '',
          password: data?.password || '',
          confirmPassword: data?.password || '',
          profilePictureId: data?.profilePictureId || '',
          picture: data?.picture || '',
        };
  
        setSelectedImage(user.picture || null);
        setUserData(user);
        reset(user);
        if (user.phoneNumber) {
          setValue('phoneNumber', user.phoneNumber);
        }
      } catch (error) {
        console.log('Error fetching user details:', error);
      }
    };
    fetchData();
  }, [reset, setValue]);
  
  const formValues = watch();
  const selectedCountry = watch('country');
  const selectedGender = watch('gender');

  const onSubmit = async (data: UserData) => {
    try {
      if (selectedImageData && selectedImageData[0]) {
        data.profilePictureId = await fileToBase64(selectedImageData[0]);
      }
      const response = await updateUser(data);
      if (response?.status === 200) {
        // Alert.alert('Success', 'User profile updated successfully.');
        //@ts-ignore
        navigation.navigate('Profile',{screen:'ProfileMain'});
      } else {
        // Alert.alert('Error', 'Failed to update user profile.');
      }
    } catch (error) {
      console.log('Error updating user profile:', error);
      // Alert.alert('Error', 'An error occurred while updating user profile.');
    }
  };


  // console.log("watch gender",watch('gender'));


  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FormProvider {...methods}>
      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        <Text style={[styles.header, { color: theme.colors.mainText }]}>Your Details</Text>
        <Text style={[styles.subHeader, { color: theme.colors.mainText }]}>
          Setup your Personal Details
        </Text>
        <ProfileImageUpload
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          setSelectedImageData={setSelectedImageData}
        />
      </View>
        {/* First Name */}
        <Controller
          name="firstName"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputField
              label="First Name"
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.firstName ? String(errors.firstName.message) : undefined}
            />
          )}
        />

        {/* Last Name */}
        <Controller
          name="lastName"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputField
              label="Last Name"
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.lastName ? String(errors.lastName.message) : undefined}
            />
          )}
        />

        {/* Phone Number (Read-Only) */}
        <Controller
          name="phoneNumber"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputField
              label="Phone Number"
              value={field.value}
              // onChange={field.onChange}
              readOnly={true}
              // errorMessage={errors.lastName ? String(errors.lastName.message) : undefined}
            />
          )}
        />
{/* 
<Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <MobileInput
                name={field.name}
                control={control}
                label="Mobile Number"
                required={true}
                placeholder="Mobile Number"
                country="IN"
                // disabled={true}
              />
              )}
            /> */}


        {/* Gender Dropdown */}
        <Controller
          name="gender"
          control={control}
          render={({ field }) => {
            return (
              <SelectDropDown
                 label="Gender"
                placeholder="Select  Gender"
          
                options={genderOptions}
                required
                   mode="outlined"
                errorMessage={errors.gender ? String(errors.gender.message) : undefined}
                
                
                value={genderOptions.find((option) => option.value === field.value) || null}
                onChange={(selectedOption:any) => {
                  setValue('gender', selectedOption.value);
                  field.onChange(selectedOption.value);
                }}
              />
            );
          }}
        />

        {/* Flat Number */}
        <Controller
          name="flatNumber"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputField
              label="Flat Number"
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.flatNumber ? String(errors.flatNumber.message) : undefined}
            />
          )}
        />

        {/* Building Door Number */}
        <Controller
          name="buildingDoorNumber"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputField
              label="Building Door Number"
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.buildingDoorNumber ? String(errors.buildingDoorNumber.message) : undefined}
            />
          )}
        />

        {/* Address */}
        <Controller
          name="address"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputField
              label="Address"
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.address ? String(errors.address.message) : undefined}
            />
          )}
        />

        {/* Street Name */}
        <Controller
          name="streetName"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputField
              label="Street Name"
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.streetName ? String(errors.streetName.message) : undefined}
            />
          )}
        />

        {/* Country Selector */}
        <Controller
          name="country"
          control={control}
        
          render={({ field }) => (
            <CountrySelector
              label="Select Country"
              required={true}
              value={field.value} // Pass full country object
              onSelectCountry={(country) => {
                //@ts-ignore
                setValue("country", country);
                field.onChange(country);
              }}
              errorMessage={errors.country ? String(errors.country.message) : undefined}
            />
          )}
        />

        {/* State Selector */}
        <Controller
          name="state"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <StateSelector
              label="Select State"
              required
              countryName={selectedCountry?.name || ''}
              value={field.value} // Pass full state object
              onSelectState={(val) => field.onChange(val)}
              errorMessage={errors.state ? String(errors.state.message) : undefined}
            />
          )}
        />

        {/* Pincode */}
        <Controller
          name="pincode"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputField
              label="Pincode"
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.pincode ? String(errors.pincode.message) : undefined}
            />
          )}
        />

        <View style={styles.buttonRow}>
        <ButtonInput text="Cancel" onPress={backHandler} width={130}           
                  buttonBackgroundColor={theme.colors.background}
                  borderColor={theme.colors.mainText}
                  buttonFontColor={theme.colors.mainText} />
          <ButtonInput text="Update" onPress={handleSubmit(onSubmit)} width={130} />
        
        </View>

        
      </FormProvider>
    </ScrollView>
  );
};

export default UserDetailsProfile;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap:10,
    marginTop: 30,
    marginBottom: 30,
  },
});
