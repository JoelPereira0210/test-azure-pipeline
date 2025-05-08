import z from 'zod';

const notOnlyNumbers = (value) => !/^\d+$/.test(value);

export const designationSchema = z.object({
    designationName: z.string()
      .min(3, "Designation name must be at least 3 characters long")
      .max(25, "Designation name cannot exceed 25 characters")
      .refine(notOnlyNumbers, { message: 'Designation Name cannot contain only numbers' }),
      numberOfPositions: z.number().min(1, "Number of positions is required"),
    adminPrivileges: z.boolean().default(true),
  });
  