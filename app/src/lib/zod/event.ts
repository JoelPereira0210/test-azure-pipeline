import z from 'zod';

//alister
export const eventSchema = (minAttendees = 1) => {

    const validMinAttendees = minAttendees > 0 ? minAttendees : 1; // Ensure minimum is at least 1
    const notOnlyNumbers = (value: string) => !/^\d+$/.test(value);
    const notOnlySpaces = (val: string) => val.trim() !== '';

    return z.object({
        eventName: z
            .string()
            .min(3, 'Minimun 3 characters required')
            .max(60, 'Not more than 60 characters')
            .refine(notOnlySpaces, 'Event Name cannot contain only spaces')
            .refine(notOnlyNumbers, { message: 'Event Name cannot contain only numbers' }),
        eventDescription: z
            .string()
            .min(3, 'Minimum 3 characters required')
            .max(1000, 'not more than 1000 characters')
            .refine(notOnlySpaces, 'Event Description cannot contain only spaces')
            .refine(notOnlyNumbers, { message: 'Event Description cannot contain only numbers' }),

        registrationDueDate: z.string().min(1, 'Registration due date is required'),
        eventStartDate: z.string().min(1, 'Event start date is required'),
        eventEndDate: z.string().min(1, 'Event end date is required'),
        eventStartTime: z.string().min(1, 'Event start time is required'),
        eventEndTime: z.string().min(1, 'Event end time is required'),

        // Step 2

        uploadedFiles: z
            .array(
                z.object({
                    name: z.string(), // File name validation
                    type: z
                        .string()
                        .refine(
                            (fileType) =>
                                [
                                    'image/jpeg',
                                    'image/png',
                                    'image/jpg',
                                    'video/mp4',
                                    'video/mov',
                                    'audio/mpeg',
                                    'audio/mp3',
                                ].includes(fileType),
                            {
                                message:
                                    'Only .jpg, .jpeg, .png, .mp4, and .mov files are accepted.',
                            }
                        ),
                    size: z
                        .number()
                        .refine(
                            (size) => size <= 10 * 1024 * 1024 || size <= 10 * 1024 * 1024,
                            {
                                message:
                                    'File size must be less than 10MB.',
                            }
                        ),
                })
            )
            .max(3, 'You can upload up to 3 files.')
            .optional(),
        eventType: z.enum(['paid', 'free']).default('free'),

        maxAttendees: z
            .string()
            .transform((val) => (val ? Number(val) : undefined)) // Convert string to number
            .refine((val) => val !== undefined && val >= validMinAttendees, {
                message: `Must have at least ${validMinAttendees} attendee`,
            })
            .refine((val) => val !== undefined && val >= 1 && val <= 99999, {
                message: 'Attendees must be between 1 and 99999',
             }),

        // Only required for paid events
        amountPerPerson: z
            .string()
            .regex(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a valid number with up to 2 decimal places' })
            .optional()
            .transform((val) => (val ? Number(val) : undefined))
            .refine(
                (val) => {
                  if (!val) return true; // Allow undefined or empty values
                  const number = Number(val);
                  return number >= 1 && number <= 999999999; // Limit: 10 billion
                },
                { message: 'Amount must be between 1 and 99,99,99,999' }
              ),

        allowFamilyAndFriends: z.boolean().default(false),
        ChargePerPerson: z.boolean().default(false),
        acceptDonation: z.boolean().default(false),
    })
        .refine(
            (data) => {
                if (data.eventType === 'paid') {
                    // For paid events, amountPerPerson and maxAttendees are required
                    return (
                        data.amountPerPerson !== undefined &&
                        data.amountPerPerson > 0 &&
                        data.maxAttendees !== undefined
                    );
                }
                // For free events, only maxAttendees is required
                return data.maxAttendees !== undefined;
            },
            {
                message:
                    'Max attendees and amount per person are required for paid events',
                path: ['amountPerPerson'], // Customize error path
            }
        )
};