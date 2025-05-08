import { loginSchema, otpSchema, phoneNumberSchema, createPasswordSchema, userVerificationSchema } from '@/src/lib/zod/auth';
import { z } from 'zod';

export type PhoneNumberDataType = z.infer<typeof phoneNumberSchema>;
export type OTPDataType = z.infer<typeof otpSchema>;
export type LoginDataType = z.infer<typeof loginSchema>;
export type UserVerificationDataType = z.infer<typeof userVerificationSchema>;
export type createPasswordDataType = z.infer<typeof createPasswordSchema>;
// export type RegisterDataType = z.infer<typeof registerSchema>;
// export type VerifyEmailDataType = z.infer<typeof verifySchema>;
