import z from 'zod';
import { fieldMaxLengthErrorMessage,fieldMinLengthErrorMessage,errorMessages,fieldRequiredErrorMessage } from '../constants/messages';
import { parsePhoneNumberFromString } from 'libphonenumber-js';


export const createSubscriptionSchema = z.object({
  planName: z.string().min(3, { message: fieldRequiredErrorMessage('Plan Name') }).max(60, { message: fieldMaxLengthErrorMessage('Plan Name', 60) }),
  planDescription: z.string().min(3, { message: fieldRequiredErrorMessage('Plan Description') })
    .max(250, { message: fieldMaxLengthErrorMessage('Plan Description', 250) }),
  maxUsers: z.string()
    .max(14, { message: fieldMaxLengthErrorMessage('Max Users', 14) })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Max User must be a non-negative number',
    }),
  /* 
      amount: z.string().max(14, { message: fieldMaxLengthErrorMessage('Amount', 14) })
          .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
              message: 'Amount must be a non-negative number',
          }), */
  amount: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a valid number with up to 2 decimal places' })
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Allow undefined or empty values
        const number = parseFloat(val);
        return number >= 1 && number <= 10000000000; // Limit: 10 billion
      },
      { message: 'Amount must be between 1 and 10,000,000,000' }
    ),

  /* duration: z.string().max(14, { message: fieldMaxLengthErrorMessage('Duration', 14) })
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: 'Duration must be a positive number',
      }), */
  duration: z.string()
    .max(14, { message: fieldMaxLengthErrorMessage('Duration', 14) })
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0 && Number.isInteger(num) && num >= 1 && num <= 1000; // Ensure it's within the specific range
    }, {
      message: 'Duration must be a positive whole number between 1 and 1000 (no decimals)',
    }),
  shouldPublish: z.boolean().default(true)
})




export const createCouponSchema = z.object({
  couponName: z.string().min(3, { message: fieldRequiredErrorMessage('Coupon Name') }).max(60, { message: fieldMaxLengthErrorMessage('Coupon Name', 60) }),
  couponCode: z
    .string()
    .min(2, { message: fieldRequiredErrorMessage('Coupon Code must be atleast 2 characters long') })
    .max(8, { message: fieldMaxLengthErrorMessage('Coupon Code must be exactly 8 characters long', 8) }),
  //   .refine(
  //     (val) => /^[a-zA-Z0-9]{8}$/.test(val),
  //     { message: 'Coupon Code must contain only lowercase letters, uppercase letters, and digits' }
  //   ),

  couponDescription: z.string().min(3, { message: fieldRequiredErrorMessage('Coupon Description') }).max(250, { message: fieldMaxLengthErrorMessage('Coupon Code', 250) }),

  /*  maxUses: z.string().min(1, { message: 'Max Uses is required' })
       .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
           message: 'Max User must be a non-negative number',
       }), */
  maxUses: z.string().min(1, { message: 'Max Uses is required' })
    .regex(/^\d+$/, { message: 'Max Uses must be a valid whole number' }) // Allow only integers
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Allow undefined or empty values
        const number = parseFloat(val);
        return number >= 1 && number <= 10000; // Limit: 10 thousand
      },
      { message: 'Max Uses must be between 1 and 10,000' }
    ),

  societyId: z.string().optional(),
  expiryDate: z
    .string().min(1, 'Expiry date is required')
    .refine((date) => {
      const currentDate = new Date();
      const selectedDate = new Date(date);
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

      return selectedDate > currentDate && selectedDate <= oneMonthFromNow;
    }, {
      message: 'Expiry date must be within one month from today and in the future',
    }),


  /* percentage: z.string()
      .refine((val) => {
          const num = Number(val);
          return !isNaN(num) && num >= 1 && num <= 99;
      }, {
          message: 'Percentage must be a number between 1 and 99',
      }),
  shouldPublish: z.boolean().default(true)
}) */
  percentage: z.string()
    .refine((val) => {
      const num = parseInt(val, 10); // Ensure it's an integer
      return !isNaN(num) && num >= 1 && num <= 99 && Number(val) === num; // Check that it's a whole number
    }, {
      message: 'Percentage must be a whole number between 1 and 99',
    }),
  shouldPublish: z.boolean().default(true)
})

/* export const bankDetailsSchema = z.object({
  accountNumber: z
    .string()
    .min(9, { message: "Bank Account Number must be at least 9 digits" })
    .max(18, { message: "Bank Account Number cannot exceed 18 digits" }),

  accountName: z
    .string()
    .min(3, { message: "Account Name must be at least 3 characters" })
    .max(60, { message: "Account Name cannot exceed 60 characters" }),

  // bank: z
  //     .string()
  //     .min(3, { message: "Bank Name must be at least 3 characters" })
  //     .max(250, { message: "Bank Name cannot exceed 250 characters" }),

  // branchName: z
  //     .string()
  //     .min(3, { message: "Branch Name must be at least 3 characters" })
  //     .max(250, { message: "Branch Name cannot exceed 250 characters" }),

  ifscCode: z
    .string()
    .min(11, { message: "IFSC Code must be exactly 11 characters" })
    .max(11, { message: "IFSC Code must be exactly 11 characters" }),
}); */
export const bankDetailsSchema = z.object({
  bankAccountNumber: z
    .string()
    .min(9, { message: "Bank Account Number must be at least 9 digits" })
    .max(18, { message: "Bank Account Number cannot exceed 18 digits" }),

  accountName: z
    .string()
    .min(3, { message: "Account Name must be at least 3 characters" })
    .max(60, { message: "Account Name cannot exceed 60 characters" }),

  // bank: z
  //     .string()
  //     .min(3, { message: "Bank Name must be at least 3 characters" })
  //     .max(250, { message: "Bank Name cannot exceed 250 characters" }),

  // branchName: z
  //     .string()
  //     .min(3, { message: "Branch Name must be at least 3 characters" })
  //     .max(250, { message: "Branch Name cannot exceed 250 characters" }),

  ifscCode: z
    .string()
    .min(11, { message: "IFSC Code must be exactly 11 characters" })
    .max(11, { message: "IFSC Code must be exactly 11 characters" }),
});



export const landingCardSchema = z.object({
  landingCardId: z.string().optional(),
  cardTitle: z.string().optional(),
  cardSubTitle: z.string().optional(),
  cardDescription: z.string().optional(),
  buttonText: z.string().optional(),
  type: z.enum(["HEADER", "DISCOVER", "ABOUT_US", "PLANS", "GENERIC", "CONTACT"]),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .nullable(),
  phoneNumber: z.string().optional().nullable(),

  
}).superRefine((data, ctx) => {
  // Apply validation only if type is 'CONTACT'
  if (data.type === "CONTACT") {
    const phoneNumber = parsePhoneNumberFromString(data.phoneNumber || "", "IN"); // Specify the country code
    if (!phoneNumber || !phoneNumber.isValid()) {
      ctx.addIssue({
        code: "custom", // Specify the issue code as "custom"
        path: ["phoneNumber"], // Field causing the issue
        message: "Invalid phone number format. Please provide a valid phone number.",
      });
    }
  }
});