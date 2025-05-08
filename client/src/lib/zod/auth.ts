// import z from 'zod';
// import {
//   errorMessages,
//   fieldMaxLengthErrorMessage,
//   fieldRequiredErrorMessage,
// } from '@/src/lib/constants/messages';
// import { parsePhoneNumberFromString } from 'libphonenumber-js';
// // Regex to validate Indian Mobile Numbers
// const phoneNumberRegex = /^(\+91|\+91\-|0)?[6789]\d{9}$/;
// const isBrowser = typeof window !== 'undefined';

// export const otpSchema = z.object({
//   otp: z
//     .string()
//     .min(4, { message: fieldRequiredErrorMessage('OTP') })
//     .max(4, 'OTP can have 4 digit only'),
// });
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
// const accountNumberRegexMap: { [key: string]: RegExp } = {
//   US: /^\d{6,17}$/, // US Bank Account Regex
//   IN: /^\d{9,18}$/, // India Bank Account Regex
//   // Add other countries as needed
// };

// const getAccountNumberRegex = (countryCode: string): RegExp => {
//   return accountNumberRegexMap[countryCode] || /^[0-9]{6,18}$/; // Default regex if country code not found
// };
// const stateSchema = z
//   .object({
//     id: z.number(),
//     name: z.string(),
//     state_code: z.string(),
//     value: z.string(),
//   })
//   .refine((val) => val !== null, { message: 'State is required' });
// const passwordValidation = z
//   .string()
//   .min(8, { message: 'Password must be at least 8 characters long' })
//   .regex(/[A-Z]/, {
//     message: 'Password must contain at least one uppercase letter',
//   })
//   .regex(/[a-z]/, {
//     message: 'Password must contain at least one lowercase letter',
//   })
//   .regex(/[0-9]/, { message: 'Password must contain at least one number' })
//   .regex(/[^A-Za-z0-9]/, {
//     message: 'Password must contain at least one special character',
//   });
// export const phoneNumberSchema = z.object({
//   phone_number: z.string().refine(
//     (value) => {
//       console.log('val', value);
//       const phoneNumber = parsePhoneNumberFromString(value);
//       return phoneNumber && phoneNumber.isValid();
//     },
//     {
//       message: 'Invalid phone number format',
//     }
//   ),
//   terms_and_conditions: z.boolean().refine(
//     (value) => value === true,
//     {
//       message: 'You must accept the terms and conditions to proceed',
//     }
//   ),
//   // .min(1, { message: 'Phone number is required' }) // Ensure it's not empty
//   // .regex(phoneNumberRegex, { message: 'Invalid phone number format' }),
// });
// export const loginSchema = z.object({
//   phone_number: z.string().refine(
//     (value) => {
//       const phoneNumber = parsePhoneNumberFromString(value);
//       return phoneNumber && phoneNumber.isValid();
//     },
//     {
//       message: 'Invalid phone number format',
//     }
//   ),
//   password: passwordValidation,
// });
// export const societyDetailsSchema = z
//   .object({
//     societyName: z
//       .string()
//       .min(1, { message: fieldRequiredErrorMessage('Society Name') }),

//     societyDescription: z
//       .string()
//       .min(1, { message: fieldRequiredErrorMessage('Society Description') })
//       .max(250, {
//         message: fieldMaxLengthErrorMessage('Society Description', 250),
//       }),

//     buildingName: z
//       .string()
//       .min(1, { message: fieldRequiredErrorMessage('Building Name') }),

//     societyBuildingDoorNumber: z.string().min(1, {
//       message: fieldRequiredErrorMessage('Society Building Door Number'),
//     }),

//     societyAddress: z
//       .string()
//       .min(1, { message: fieldRequiredErrorMessage('Society Address') }),

//     societyStreetName: z
//       .string()
//       .min(1, { message: fieldRequiredErrorMessage('Society Street Name') }),

//     societyState: stateSchema,

//     societyCountry: countrySchema,

//     societyPincode: z
//       .string()
//       .min(6, { message: fieldRequiredErrorMessage('Society Pincode') })
//       .length(6, { message: 'Society Pincode must be 6 digits long' })
//       .regex(/^[0-9]*$/, { message: 'must only contain numbers' }),

//     logo: isBrowser
//       ? z.array(z.instanceof(File)).optional()
//       : z.array(z.any()).optional(),

//     isMembershipFees: z.boolean(),
//     amount: z.string().optional(), // Initially optional, will be conditionally required

//     bank: z.string().optional(), // Initially optional, will be conditionally required

//     accountNumber: z.string().optional(), // Initially optional, will be conditionally required

//     IFSCCode: z.string().optional(), // Initially optional, will be conditionally required

//     accountHolder: z.string().optional(), // Initially optional, will be conditionally required

//     bankAddress: z.string().optional(), // Initially optional, will be conditionally required
//   })
//   .refine(
//     (data) => {
//       console.log('data', data);
//       // Check if isMembershipFees is true and amount is empty
//       if (data.isMembershipFees && !data.amount) {
//         return false;
//       }
//       return true;
//     },
//     {
//       path: ['amount'], // Point to the 'amount' field
//       message: 'Amount is required when Membership Fees is selected.',
//     }
//   )
//   .refine(
//     (data) => {
//       console.log('data', data);
//       // Check if isMembershipFees is true and amount is empty
//       if (data.isMembershipFees && !data.bank) {
//         return false;
//       }

//       return true;
//     },
//     {
//       path: ['bank'], // Point to the 'amount' field
//       message: 'Bank Name is required when Membership Fees is selected.',
//     }
//   )
//   .refine(
//     (data) => {
//       console.log('data', data);
//       // Check if isMembershipFees is true and amount is empty

//       if (data.isMembershipFees && !data.bankAddress) {
//         return false;
//       }
//       return true;
//     },
//     {
//       path: ['bankAddress'], // Point to the 'amount' field
//       message: 'Bank Address is required when Membership Fees is selected.',
//     }
//   )
//   .refine(
//     (data) => {
//       console.log('data', data);
//       // Check if isMembershipFees is true and amount is empty
//       if (data.isMembershipFees && !data.accountHolder) {
//         return false;
//       }

//       return true;
//     },
//     {
//       path: ['accountHolder'], // Point to the 'amount' field
//       message:
//         'Account Holder Name is required when Membership Fees is selected.',
//     }
//   )
//   .refine(
//     (data) => {
//       // Get the regex based on the selected country's ISO2 code
//       const countryCode = data.societyCountry.iso2;
//       const regex = getAccountNumberRegex(countryCode);

//       // If membership fees are enabled, validate the account number using the regex
//       if (data.isMembershipFees && !regex.test(data.accountNumber || '')) {
//         return false;
//       }

//       return true;
//     },
//     {
//       path: ['accountNumber'],
//       message: 'Invalid account number format for the selected country',
//     }
//   )
//   .refine(
//     (data) => {
//       console.log('data', data);
//       // Check if isMembershipFees is true and amount is empty
//       if (data.isMembershipFees && !data.IFSCCode) {
//         return false;
//       }
//       return true;
//     },
//     {
//       path: ['IFSCCode'], // Point to the 'amount' field
//       message: 'IFSC Code is required when Membership Fees is selected.',
//     }
//   );
// export const userDetailsSchema = z
//   .object({
//     phoneNumber: z.string().refine(
//       (value) => {
//         const phoneNumber = parsePhoneNumberFromString(value);
//         return phoneNumber && phoneNumber.isValid();
//       },
//       {
//         message: 'Invalid phone number format',
//       }
//     ),
//     firstName: z
//       .string()
//       .min(1, { message: fieldRequiredErrorMessage('First Name') }),
//     lastName: z
//       .string()
//       .min(1, { message: fieldRequiredErrorMessage('Last Name') }),
//     gender: z.string().min(1, { message: 'Gender is Required' }),
//     flatNumber: z
//       .string()
//       .min(1, { message: fieldRequiredErrorMessage('Flat Number') }),
//     buildingDoorNumber: z
//       .string()
//       .min(1, { message: fieldRequiredErrorMessage('Building Door Number') }),
//     address: z
//       .string()
//       .min(1, { message: fieldRequiredErrorMessage('Address') }),
//     streetName: z
//       .string()
//       .min(1, { message: fieldRequiredErrorMessage('Street Name') }),
//     state: stateSchema,
//     country: countrySchema,
//     pincode: z
//       .string()
//       .min(1, { message: fieldRequiredErrorMessage('Pincode') })
//       .length(6, { message: 'Pincode must be 6 digits long' }),
//     password: passwordValidation,
//     confirmPassword: z
//       .string()
//       .min(8, { message: 'Password must be at least 8 characters long' }),
//     isAdmin: z.boolean().default(true),
//     isMember: z.boolean().default(true), // Default value is true
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: 'Password do not match',
//     path: ['confirmPassword'],
//   });
// export const societyRegistrationSchema = z.object({
//   societyDetails: societyDetailsSchema,
//   userDetails: userDetailsSchema,
// });



import z from 'zod';
import {
  errorMessages,
  fieldMaxLengthErrorMessage,
  fieldRequiredErrorMessage,
} from '@/src/lib/constants/messages';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Utility function to check if string contains only spaces
const notOnlySpaces = (val: string) => val.trim() !== '';
const notOnlyNumbers = (value) => !/^\d+$/.test(value);

// Regex to validate Indian Mobile Numbers
const phoneNumberRegex = /^(\+91|\+91\-|0)?[6789]\d{9}$/;
const isBrowser = typeof window !== 'undefined';

export const otpSchema = z.object({
  otp: z
    .string()
    .min(4, { message: fieldRequiredErrorMessage('OTP') })
    .max(4, 'OTP can have 4 digits only'),
});

const countrySchema = z.object({
  id: z.number(),
  name: z.string(),
  iso3: z.string(),
  iso2: z.string(),
  numeric_code: z.string(),
  phone_code: z.number(),
  capital: z.string(),
  currency: z.string(),
  currency_name: z.string(),
  currency_symbol: z.string(),
  tld: z.string(),
  native: z.string(),
  region: z.string(),
  subregion: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  emoji: z.string(),
  value: z.string(),
});

const accountNumberRegexMap: { [key: string]: RegExp } = {
  US: /^\d{6,17}$/, // US Bank Account Regex
  IN: /^\d{9,18}$/, // India Bank Account Regex
  // Add other countries as needed
};

const getAccountNumberRegex = (countryCode: string): RegExp => {
  return accountNumberRegexMap[countryCode] || /^[0-9]{6,18}$/; // Default regex if country code not found
};

const stateSchema = z
  .object({
    id: z.number(),
    name: z.string().refine(notOnlySpaces, 'State cannot contain only spaces'),
    state_code: z.string().refine(notOnlySpaces, 'State code cannot contain only spaces'),
    value: z.string(),
  })
  .refine((val) => val !== null, { message: 'State is required' });


  
export const passwordValidation = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' });

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

    logo: isBrowser ? z.array(z.instanceof(File)).optional() : z.array(z.any()).optional(),

    isMembershipFees: z.boolean(),
    amount: z.string().optional(),

    // bank: z.string().optional(),
    // bankAccountNumber: z.string().optional(),

    
    accountNumber: z
    .string()
    // .min(9, { message: "Bank Account Number must be at least 9 digits" })
    // .max(18, { message: "Bank Account Number cannot exceed 18 digits" })
    .optional(),
    branchName: z
    .string()
    // .min(1, { message: "Banch name must be at least 1 digits" })
    .optional(),
    bank: z
    .string()
    // .min(1, { message: "Bank name must be at least 1 characters" })
    .optional(),
    accountName: z
        .string()
        // .min(3, { message: "Account Name must be at least 3 characters" })
        // .max(60, { message: "Account Name cannot exceed 60 characters" })
        .optional(),
        
        ifscCode: z
        .string()
        // .min(11, { message: "IFSC Code must be exactly 11 characters" })
        // .max(11, { message: "IFSC Code must be exactly 11 characters" })
        .optional(),
  })
  .refine(
    (data) => {
      if (data.isMembershipFees && !data.amount?.trim()) return false;
      return true;
    },
    { path: ['amount'], message: 'Amount is required when Membership Fees is selected.' }
  );


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

  // export const bankDetailsSchema = z
  // .object({
  //   accountNumber: z
  //     .string()
  //     .min(9, 'Account number must have minimum 3 characters ')
  //     .max(18, 'Account number cannot exceed 18 characters'), // Name validation
  // })

export const societyRegistrationSchema = z.object({
  societyDetails: societyDetailsSchema,
  userDetails: userDetailsSchema,
  
});
export const userVerificationSchema = z.object({
  phoneNumber: z.string().refine(
    (value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber && phoneNumber.isValid();
    },
    {
      message: 'Invalid phone number format',
    }
  ),
  societyName: z.string()
  .min(2, { message: fieldRequiredErrorMessage('Society Name') })
  .max(64, { message: fieldMaxLengthErrorMessage('Society Name', 64) })
  .refine(notOnlySpaces, 'Society Name cannot contain only spaces')
  .refine(notOnlyNumbers, { message: 'Society Name cannot contain only numbers' }),
  societyId: z.string(),
})
export const createPasswordSchema = z.object({
  password: passwordValidation,
  confirmPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password do not match',
  path: ['confirmPassword'],
});

