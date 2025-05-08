import z from 'zod';
import { fieldMaxLengthErrorMessage,fieldMinLengthErrorMessage,errorMessages,fieldRequiredErrorMessage } from '../constants/messages';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const notOnlyNumbers = (value: string) => !/^\d+$/.test(value);
const notOnlySpaces = (val: string) => val.trim() !== '';


export const addMembersSchema = z
    .object({
        mobileNumber: z.string().refine(
            (value) => {
                const phoneNumber = parsePhoneNumberFromString(value);
                return phoneNumber && phoneNumber.isValid();
            },
            {
                message: 'Invalid phone number format',
            }
        ),
        firstName: z
            .string()
            .min(3, { message: fieldMinLengthErrorMessage('First Name', 3) })
            .max(64, { message: fieldMaxLengthErrorMessage('First Name', 64) })
            .refine(notOnlySpaces, 'First Name cannot contain only spaces')
            .refine(notOnlyNumbers, { message: 'First Name cannot contain only numbers' }),

        lastName: z
            .string()
            .min(3, { message: fieldMinLengthErrorMessage('Last Name', 3) })
            .max(64, { message: fieldMaxLengthErrorMessage('Last Name', 64) })
            .refine(notOnlySpaces, 'Last Name cannot contain only spaces')
            .refine(notOnlyNumbers, { message: 'Last Name cannot contain only numbers' }),
    })