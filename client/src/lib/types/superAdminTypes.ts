import { createSubscriptionSchema, createCouponSchema, bankDetailsSchema } from '../zod/superAdmin';
import { z } from 'zod';
export type CreateSubscriptionTypes = z.infer<typeof createSubscriptionSchema>;
export type CreateCouponTypes = z.infer<typeof createCouponSchema>;
export type EditBankDetailsTypes = z.infer<typeof bankDetailsSchema>;