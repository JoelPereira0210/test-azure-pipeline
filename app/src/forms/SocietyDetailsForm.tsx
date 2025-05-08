import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, ImageBackground } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { societyDetailsSchema } from '../lib/zod/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Text, Checkbox } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { validateformIfsc } from '../actions/auth';
import InputField from '../component/UI/InputField/InputField';
import TextArea from '../component/UI/TextArea/TextArea';
import CountrySelector from '../component/UI/CountrySelector/CountrySelector';
import StateSelector from '../component/UI/StateSelector/StateSelector';
import CheckboxInput from '../component/UI/CheckBox/CheckBox';
import ButtonInput from '../component/UI/Button/Button';
import { useTheme } from '../../theme/themeProvider';

const SocietyDetailsForm = ({ onNext, defaultValues }: any) => {
  const [loading, setLoading] = useState(false);
  const [societyLogo, setSocietyLogo] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('India');
  // const [membershipFees, setMembershipFees] = useState(false);
  const [ifscDetails, setIfscDetails] = useState({ bank: '', branchName: '' });
  const {theme} = useTheme();



  
  const {
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    // defaultValues: { isMembershipFees: false, ...defaultValues },
    // defaultValues:defaultSocietyDetails,
    resolver: zodResolver(societyDetailsSchema),
    mode: 'onBlur',
  });

  const ifscCode = watch('ifscCode');

  // Fetch IFSC Details
  useEffect(() => {
    const fetchIfscBankDetails = async () => {
      if (ifscCode) {
        try {
          const details = await validateformIfsc(ifscCode);
          if (details.bankName && details.branchName) {
            setValue('bank', details.bankName);
            setValue('branchName', details.branchName);
            setIfscDetails({ bank: details.bankName, branchName: details.branchName });
          } else {
            setIfscDetails({ bank: '', branchName: '' });
          }
        } catch (error) {
          console.error('Error fetching IFSC:', error);
          setIfscDetails({ bank: '', branchName: '' });
        }
      }
    };
    fetchIfscBankDetails();
  }, [ifscCode]);

   // Handle Image Upload
   const handleImagePick = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        console.log("Selected Image URI:", imageUri);
        if (imageUri) {
          setSocietyLogo(imageUri);
        }
        setValue('logo', response.assets[0] as any); // Cast to any to bypass type checking
      } else {
        console.log("Image selection was cancelled.");
      }
    });
  };

  console.log("logo data is ",watch('logo'))
  // Submit Form
  const onSubmit = (data: any) => {
    // console.log("society data",data);
    setLoading(true);
    onNext({ ...data, logo: societyLogo });
    setLoading(false);
  };

  const membershipFees = watch('isMembershipFees', false);

  const logoData = watch('logo'); // ✅ Keep track of logo

  // Set existing logo from defaultValues when the component mounts
  useEffect(() => {
    if (defaultValues?.logo) {
      setValue('logo', defaultValues.logo);
    }
  }, [defaultValues, setValue]);
  
  useEffect(() => {
    if (defaultValues?.societyCountry) {
      setValue('societyCountry', {
        ...defaultValues.societyCountry,
        phone_code: String(defaultValues.societyCountry?.phone_code || ''),
      });
    }
  }, [defaultValues, setValue]);

  useEffect(() => {
    if (defaultValues?.societyState) {
      setValue('societyState', {
        ...defaultValues.societyState,
        state_code: defaultValues.societyState?.state_code || '',
      });
    }
  }, [defaultValues, setValue]);
  
  console.log("societyDetailsForm erros",errors);

  return (




    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.stepText}>1/2</Text>
      <Text style={styles.heading}>Society Details</Text>
      <Text style={styles.subHeading}>Setup your Society for members that may join later.</Text>

      {/* Society Name */}
      <Controller
        name="societyName"
        control={control}
        render={({ field }) => (
          <InputField
            label="Society Name"
            type="text"
            required={true}
            errorMessage={
                errors.societyName
                  ? String(errors.societyName.message)
                  : undefined
              }
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {/* Building Name */}
      <Controller
        name="buildingName"
        control={control}
        render={({ field }) => (
          <InputField
            label="Building Name"
            type="text"
            required={true}
            errorMessage={
                errors.buildingName
                  ? String(errors.buildingName.message)
                  : undefined
              }
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {/* Society Description */}
      <Controller
        name="societyDescription"
        control={control}
        render={({ field }) => (
          <TextArea
            label="Society Description"
            type="text"
            required={true}
            error={
                errors.societyDescription
                  ? String(errors.societyDescription.message)
                  : undefined
              }
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />


         {/* Society Building Door Number */}
         <Controller
        name="societyBuildingDoorNumber"
        control={control}
        render={({ field }) => (
          <InputField
            label="Building Door Number"
            type="text"
            required={true}
            errorMessage={
                errors.societyBuildingDoorNumber
                  ? String(errors.societyBuildingDoorNumber.message)
                  : undefined
              }
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

<Controller
        name="societyAddress"
        control={control}
        render={({ field }) => (
          <InputField
            label="Address"
            type="text"
            required={true}
            errorMessage={
                errors.societyAddress
                  ? String(errors.societyAddress.message)
                  : undefined
              }
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />


<Controller
        name="societyStreetName"
        control={control}
        render={({ field }) => (
          <InputField
            label="Street Name"
            type="text"
            required={true}
            errorMessage={
                errors.societyStreetName
                  ? String(errors.societyStreetName.message)
                  : undefined
              }
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
<Controller
  name="societyCountry"
  control={control}
  render={({ field }) => (
    <CountrySelector
      label="Select Country"
      required={true}
      value={field.value}
      errorMessage={errors.societyCountry? String(errors.societyCountry?.message):undefined}
      onSelectCountry={(country) => {
        setValue("societyCountry", country);
        field.onChange(country);
      }}
    />
  )}
/>



<Controller
  name="societyState"
  control={control}
  render={({ field }) => (
    <StateSelector
      label="Select State"
      required={true}
      value={field.value}
      errorMessage={
        errors.societyState ? String (errors.societyState.message):undefined
      }
      countryName={watch("societyCountry")?.name}
      onSelectState={(state) => {
        setValue("societyState", state);
        field.onChange(state);
          //  console.warn(state);
      }}
    />
  )}
/>




      <Controller
        name="societyPincode"
        control={control}
        render={({ field }) => (
          <InputField
            label="Pincode"
            type="text"
            required={true}
            errorMessage={
                errors.societyPincode
                  ? String(errors.societyPincode.message)
                  : undefined
              }
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {/* Membership Fee Checkbox */}


<Controller
        name="isMembershipFees"
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <CheckboxInput
            label="Membership Fee"
            checked={field.value}
            onChange={field.onChange}
            error={errors.isMembershipFees ? String(errors.isMembershipFees.message) : undefined}
          />
        )}
      />

      {/* Membership Fee Fields */}
      {membershipFees && (
        <>
          {/* Amount */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <InputField
                label="Amount"
                type="number"
                errorMessage={
                    errors.amount
                      ? String(errors.amount.message)
                      : undefined
                  }
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

 {/* Acc Number */}
 <Controller
            name="accountNumber"
            control={control}
            render={({ field }) => (
              <InputField
                label="Bank Account Number"
                type="text"
                errorMessage={
                    errors.accountNumber
                      ? String(errors.accountNumber.message)
                      : undefined
                  }
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {/* IFSC Code */}
          <Controller
            name="ifscCode"
            control={control}
            render={({ field }) => (
              <InputField
                label="IFSC Code"
                type="text"
                errorMessage={
                    errors.ifscCode
                      ? String(errors.ifscCode.message)
                      : undefined
                  }
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

<Controller
            name="branchName"
            control={control}
            render={({ field }) => (
              <InputField
                label="Branch Name"
                type="text"
                errorMessage={
                    errors.branchName 
                      ? String(errors.branchName.message)
                      : undefined
                  }
                value={ifscDetails.branchName}
                disabled={true}
                // onChange={field.onChange}
              />
            )}
          />

<Controller
      name="accountName"
      control={control}
      render={({ field }) => (
        <InputField
          label="Account Name"
          type="text"
          errorMessage={errors.accountName ? String(errors.accountName.message) : undefined}
          value={field.value}
          onChange={field.onChange}
        />
      )}
    />

<Controller
      name="bank"
      control={control}
      render={({ field }) => (
        <InputField
          label="Bank Name"
          type="text"
          errorMessage={errors.bank ? String(errors.bank.message) : undefined}
          value={ifscDetails.bank} 
          disabled={true}
        />
      )}
    />

          {/* Bank Name & Branch (Auto-filled) */}
          {/* <InputField label="Bank Name" type="text" value={ifscDetails.bank} disabled />
          <InputField label="Branch Name" type="text" value={ifscDetails.branchName} disabled /> */}
        </>
      )}

      {/* Upload Logo */}
      <ButtonInput
 type='button'
 text={societyLogo ? 'Change Logo' : 'Upload Logo'}
  onPress={
    handleImagePick
  }
  // buttonBackgroundColor={theme.colors.background}
  // buttonFontColor={theme.colors.mainText}
/>

      {societyLogo && <Image source={{ uri: societyLogo }} style={styles.logoPreview} />}

      {/* Submit Button */}

      <ButtonInput
 type='button'
 text=' Next'
 onPress={handleSubmit(onSubmit)} 
  // buttonBackgroundColor={theme.colors.background}
  // buttonFontColor={theme.colors.mainText}
  loading={loading}
/>
   
    </ScrollView>

  );
};

const styles = StyleSheet.create({

    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 8,
      },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5,
  },
  subHeading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: '600',
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 10,
  },
  logoPreview: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default SocietyDetailsForm;
