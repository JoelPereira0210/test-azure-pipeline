import { designationSchema } from '../zod/designationZod';
import { z } from 'zod';
export type Add_designationTypes = z.infer<typeof designationSchema>;