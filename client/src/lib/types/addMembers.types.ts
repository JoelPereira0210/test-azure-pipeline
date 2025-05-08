import { z } from 'zod';
import { addMembersSchema } from "../zod/members";
export type AddMembersDataType = z.infer<typeof addMembersSchema>;