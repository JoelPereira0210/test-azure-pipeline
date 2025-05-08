import z from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Platform } from 'react-native';

 import { errorMessages,
  fieldMaxLengthErrorMessage,
  fieldRequiredErrorMessage, } from '../constants/messages';

// Utility function to check if string contains only spaces
const notOnlySpaces = (val: string) => val.trim() !== '';
const notOnlyNumbers = (value: string): boolean => !/^\d+$/.test(value);

// Regex to validate Indian Mobile Numbers
const phoneNumberRegex = /^(\+91|\+91\-|0)?[6789]\d{9}$/;
const isBrowser = Platform.OS === 'web';

// User input schemas

export const otpSchema = z.object({
  otp: z
    .string()
    .min(4, { message: fieldRequiredErrorMessage('OTP') })
    .max(4, 'OTP can have 4 digits only'),
});

// const countrySchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   iso3: z.string(),
//   iso2: z.string(),
//   numeric_code: z.string(),
//   phone_code: z.number(),
//   capital: z.string(),
//   currency: z.string(),
//   currency_name: z.string(),
//   currency_symbol: z.string(),
//   tld: z.string(),
//   native: z.string(),
//   region: z.string(),
//   subregion: z.string(),
//   latitude: z.string(),
//   longitude: z.string(),
//   emoji: z.string(),
//   value: z.string(),
// });

// const stateSchema = z
//   .object({
//     id: z.number(),
//     name: z.string().refine(notOnlySpaces, 'State cannot contain only spaces'),
//     state_code: z.string().refine(notOnlySpaces, 'State code cannot contain only spaces'),
//     value: z.string(),
//   })
//   .refine((val) => val !== null, { message: 'State is required' });



const countrySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  iso3: z.string().optional(),
  iso2: z.string(),
  numeric_code: z.string().optional(),
  phone_code: z.string().transform((val) => Number(val)),
  capital: z.string().optional(),
  currency: z.string().optional(),
  currency_name: z.string().optional(),
  currency_symbol: z.string().optional(),
  tld: z.string().optional(),
  native: z.string().optional(),
  region: z.string().optional(),
  subregion: z.string(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  emoji: z.string().optional(),
  value: z.string().optional(),
});

const stateSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().refine(notOnlySpaces, 'State cannot contain only spaces'),
    state_code: z.string().refine(notOnlySpaces, 'State code cannot contain only spaces'),
    value: z.string().optional(),
  })
  .refine((val) => val !== null, { message: 'State is required' });
  
  // const logoSchema = isBrowser
  // ? z.array(z.instanceof(File)).optional() // Web uses `File` objects
  // : z
  //     .array(
  //       z.object({
  //         uri: z.string(), //React Native expects a `uri`
  //         type: z.string().optional(),
  //         name: z.string().optional(),
  //       })
  //     )
  //     .optional();

  const logoSchema = z.preprocess(
    (val) => (Array.isArray(val) ? val : val ? [val] : []), // ✅ Convert object to array
    z.array(
      z.object({
        uri: z.string(), // ✅ Required for React Native
        type: z.string().optional(),
        name: z.string().optional(),
      })
    ).optional()
  );
  


// Bank account number validation
const accountNumberRegexMap: { [key: string]: RegExp } = {
  US: /^\d{6,17}$/, // US Bank Account Regex
  IN: /^\d{9,18}$/, // India Bank Account Regex
  // Add other countries as needed
};

const getAccountNumberRegex = (countryCode: string): RegExp => {
  return accountNumberRegexMap[countryCode] || /^[0-9]{6,18}$/; // Default regex if country code not found
};

// Password validation schema
export const passwordValidation = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' });

// Phone number schema
export const phoneNumberSchema = z.object({
  phone_number: z.string().refine(
    (value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber && phoneNumber.isValid();
    },
    {
      message: 'Invalid phone number format',
    }
  ),
  terms_and_conditions: z.boolean().refine(
    (value) => value === true,
    {
      message: 'You must accept the terms and conditions to proceed',
    }
  ),
  actionType: z.string().optional(), 
});

// User login schema
export const loginSchema = z.object({
  phone_number: z.string().refine(
    (value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber && phoneNumber.isValid();
    },
    {
      message: 'Invalid phone number format',
    }
  ),
  password: passwordValidation,
});

// Change phone number schema
export const changePhoneNumberSchema = z.object({
  phone_number: z.string().refine(
    (value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber && phoneNumber.isValid();
    },
    {
      message: 'Invalid phone number format',
    }
  ),
});

// Society details schema
export const societyDetailsSchema = z
  .object({
    societyName: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Society Name Minimum 2 Characters') })
      .max(64, { message: fieldMaxLengthErrorMessage('Society Name', 64) })
      .refine(notOnlySpaces, 'Society Name cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Society Name cannot contain only numbers' }),

    societyDescription: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Society Description Minimum 2 Characters') })
      .max(1000, { message: fieldMaxLengthErrorMessage('', 1000) })
      .refine(notOnlySpaces, 'Society Description cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Society Description cannot contain only numbers' }),

    buildingName: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Building Name Minimum 2 Characters') })
      .max(50, { message: fieldMaxLengthErrorMessage('Building Name', 50) })
      .refine(notOnlySpaces, 'Building Name cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Building Name cannot contain only numbers' }),

    societyBuildingDoorNumber: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Society Building Door Number Minimum 2 Characters') })
      .max(50, { message: fieldMaxLengthErrorMessage('Society Building Door Number', 50) })
      .refine(notOnlySpaces, 'Society Building Door Number cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Society Building Door Number cannot contain only numbers' }),

    societyAddress: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Society Address Minimum 2 Characters') })
      .max(50, { message: fieldMaxLengthErrorMessage('Society Address', 50) })
      .refine(notOnlySpaces, 'Society Address cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Society Address cannot contain only numbers' }),

    societyStreetName: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Society Street Name Minimum 2 Characters') })
      .max(50, { message: fieldMaxLengthErrorMessage('Society Street Name', 50) })
      .refine(notOnlySpaces, 'Society Street Name cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Society Street Name cannot contain only numbers' }),

    societyState: stateSchema,
    societyCountry: countrySchema,

    societyPincode: z
      .string()
      .min(6, { message: fieldRequiredErrorMessage('Society Pincode Minimum 6 Characters') })
      .length(6, { message: 'Society Pincode must be 6 digits long' })
      .regex(/^[0-9]*$/, { message: 'Pincode must only contain numbers' }),

    logo: logoSchema,

    isMembershipFees: z.boolean(),
    amount: z.string().optional(),

    accountNumber: z
    .string()
    .optional(),
    branchName: z
    .string()
    .optional(),
    bank: z
    .string()
    .optional(),
    accountName: z
        .string()
        .optional(),
        
    ifscCode: z
        .string()
        .optional(),
  })
  .refine(
    (data) => {
      if (data.isMembershipFees && !data.amount?.trim()) return false;
      return true;
    },
    { path: ['amount'], message: 'Amount is required when Membership Fees is selected.' }
  );

// Update society details schema
export const updateSocietyDetailsSchema = z
  .object({
    societyName: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Society Name ') })
      .max(64, { message: fieldMaxLengthErrorMessage('Society Name', 64) })
      .refine(notOnlySpaces, 'Society Name cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Society Name cannot contain only numbers' }),

    societyDescription: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Society Description') })
      .max(1000, { message: fieldMaxLengthErrorMessage('Society Description', 1000) })
      .refine(notOnlySpaces, 'Society Description cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Society Description cannot contain only numbers' }),

    buildingName: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Building Name') })
      .max(50, { message: fieldMaxLengthErrorMessage('Building Name', 50) })
      .refine(notOnlySpaces, 'Building Name cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Building Name cannot contain only numbers' }),

    societyBuildingDoorNumber: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Society Building Door Number') })
      .max(50, { message: fieldMaxLengthErrorMessage('Society Building Door Number', 50) })
      .refine(notOnlySpaces, 'Society Building Door Number cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Society Building Door Number cannot contain only numbers' }),

    societyAddress: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Society Address') })
      .max(50, { message: fieldMaxLengthErrorMessage('Society Address', 50) })
      .refine(notOnlySpaces, 'Society Address cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Society Address cannot contain only numbers' }),

    societyStreetName: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Society Street Name') })
      .max(50, { message: fieldMaxLengthErrorMessage('Society Street Name', 50) })
      .refine(notOnlySpaces, 'Society Street Name cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Society Street Name cannot contain only numbers' }),

    societyState: stateSchema,
    societyCountry: countrySchema,

    societyPincode: z
      .string()
      .min(6, { message: fieldRequiredErrorMessage('Society Pincode') })
      .length(6, { message: 'Society Pincode must be 6 digits long' })
      .regex(/^[0-9]*$/, { message: 'Pincode must only contain numbers' }),
  });


// User details schema

export const userDetailsSchema = z
  .object({
    phoneNumber: z.string().refine(
      (value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber && phoneNumber.isValid();
      },
      { message: 'Invalid phone number format' }
    ),
    firstName: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('First Name Minimum 2 Characters') })
      .max(64, { message: fieldMaxLengthErrorMessage('First Name', 64) })
      .refine(notOnlyNumbers, { message: 'First Name cannot contain only numbers' })
      .refine(notOnlySpaces, 'First Name cannot contain only spaces'),

    lastName: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Last Name Minimum 2 Characters') })
      .max(64, { message: fieldMaxLengthErrorMessage('Last Name', 64) })
      .refine(notOnlySpaces, 'Last Name cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Last Name cannot contain only numbers' }),

    gender: z.string().min(1, { message: 'Gender is Required' }),

    flatNumber: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Flat Number Minimum 2 Characters') })
      .max(50, { message: fieldMaxLengthErrorMessage('Flat Number', 50) })
      .refine(notOnlySpaces, 'Flat Number cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Flat Number cannot contain only numbers' }),

    buildingDoorNumber: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Building Door Number Minimum 2 Characters') })
      .max(50, { message: fieldMaxLengthErrorMessage('Flat Number', 50) })
      .refine(notOnlySpaces, 'Building Door Number cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Building Door Number cannot contain only numbers' }),

    address: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Address Minimum 2 Characters') })
      .max(50, { message: fieldMaxLengthErrorMessage('Address', 50) })
      .refine(notOnlySpaces, 'Address cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Address cannot contain only numbers' }),

    streetName: z
      .string()
      .min(2, { message: fieldRequiredErrorMessage('Street Name Minimum 2 Characters') })
      .max(50, { message: fieldMaxLengthErrorMessage('Street Name', 50) })
      .refine(notOnlySpaces, 'Street Name cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Street Name cannot contain only numbers' }),

    state: stateSchema,
    country: countrySchema,
    pincode: z
      .string()
      .min(6, { message: fieldRequiredErrorMessage('Pincode Minimum 6 Characters') })
      .length(6, { message: 'Pincode must be 6 digits long' }),

    password: passwordValidation,
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    isAdmin: z.boolean().default(true),
    isMember: z.boolean().default(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });