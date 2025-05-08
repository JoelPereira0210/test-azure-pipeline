import z from 'zod';

const notOnlyNumbers = (value: string) => !/^\d+$/.test(value);
const notOnlySpaces = (val: string) => val.trim() !== '';

export const chargeFeeSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Charge/Fee minimum 3 characters required')
      .max(60, 'Name cannot exceed 60 characters') // Name validation
      .refine(notOnlySpaces, 'Charge/Fee Name cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Name cannot contain only numbers' }),


    description: z
      .string()
      .min(3, 'Fee description minimum 3 characters required')
      .max(1000, 'Description cannot exceed 1000 characters') // Description validation
      .refine(notOnlySpaces, 'Charge/Fee Description cannot contain only spaces')
      .refine(notOnlyNumbers, { message: 'Fee description cannot contain only numbers' }),


    dueDate: z
      .string().min(1, 'Due date is required')
      .refine((date) => new Date(date) > new Date(), {
        message: 'Due date must be a future date', // Ensures the due date is in the future
      }),

      /* amount: z
      .string()
      .min(1, 'Amount must be provided')
      .transform((val) => val !== null && val !== undefined ? Number(val) : undefined)
      .refine((val) => val === undefined || val > 0, {  // Ensures positive value if provided
        message: 'Amount must be greater than 0',
      }), */

   amount: z
   .string()
   .regex(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a valid number with up to 2 decimal places' })
   .optional()
   .refine(
     (val) => {
       if (!val) return true; // Allow undefined or empty values
       const number = parseFloat(val);
       return number >= 1 && number <= 999999999; // Limit: 10 billion
     },
     { message: 'Amount must be between 1 and 99,99,99,999' }
   ),
  
    feeType: z.string().min(3, 'Fee type is required'), // Fee type is required
  });
