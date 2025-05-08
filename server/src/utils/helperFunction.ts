import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../types/user';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import { parsePhoneNumberFromString, PhoneNumber } from 'libphonenumber-js';
// import twilio from 'twilio';
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const secretKey: any = process.env.SECRET_KEY;
// const iv = crypto.randomBytes(16)
const algorithm = 'aes-256-cbc'; // Choose the correct algorithm
const key = crypto.randomBytes(32); // 32 bytes key for AES-256
const iv = crypto.randomBytes(16); // Initialization vector (16 bytes for AES)

export function handleError(res: Response, error: unknown) {
  console.error(error);
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error?.code) {
      case 'P2002':
        res
          .status(400)
          .json({ error: 'A unique constraint failed.', details: error?.meta });
        break;
      case 'P2003':
        res.status(400).json({
          error: 'A foreign key constraint failed.',
          details: error?.meta,
        });
        break;
      case 'P2004':
        res.status(400).json({
          error: 'A constraint failed on the database.',
          details: error?.meta,
        });
        break;
      case 'P2005':
        res
          .status(400)
          .json({ error: 'Invalid value for column.', details: error?.meta });
        break;
      case 'P2006':
        res
          .status(400)
          .json({ error: 'Value too long for column.', details: error?.meta });
        break;
      case 'P2007':
        res
          .status(400)
          .json({ error: 'Value too short for column.', details: error?.meta });
        break;
      default:
        res.status(500).json({
          error: 'An unknown error occurred.',
          details: error.message,
        });
        break;
    }
  } else {
    res
      .status(500)
      .json({ error: 'An unknown error occurred.', details: error });
  }
}

export const generateToken = (user: User) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign({ id: user.userId, phoneNumber: user.phoneNumber }, secret, {
    // expiresIn: '1h',
  });
};
export const generateOTP = () => {
  const otp = crypto.randomInt(0, 10000).toString(); // randomInt(0, 10000) generates numbers from 0 to 9999
  return otp.padStart(4, '0'); // Ensure it's always 4 digits
};

// type PhoneNumber = string & { __type: 'PhoneNumber' };

// export function createPhoneNumber(value: string): PhoneNumber {
//   const phoneNumberRegex = /^\d{10}$/;
//   if (!phoneNumberRegex.test(value)) {
//     throw new Error('Mobile Number must be exactly 10 numeric characters long');
//   }
//   return value as PhoneNumber;
// }
export function createPhoneNumber(value: string): PhoneNumber {
  const phoneNumber = parsePhoneNumberFromString(value);
  if (!phoneNumber || !phoneNumber.isValid()) {
    throw new Error('Invalid phone number format');
  }
  return phoneNumber; // Returns a valid PhoneNumber object
}
export const hashString = async (password: string) => {
  const pass = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS || '12', 10)
  );
  return pass;
};
export const compareString = async (password: string, DBpassword: string) => {
  return await bcrypt.compare(password, DBpassword);
};
export const createBase64 = async (data: string) => {
  if (data.startsWith('data:')) {
    const base64 = data.split(','[1]);
    return base64 || null;
  }
};
// export const sendOTP = (phoneNumber, otp) => {
//     return client.messages.create({
//         body: `Your OTP is ${otp}`,
//         from: process.env.TWILIO_PHONE_NUMBER,
//         to: phoneNumber
//     });
// };
export const encryptValues = (mobileNumber: string, societyId: string): string => {
  const concatenatedValues = `${mobileNumber}:${societyId}`; // Concatenate the values
  const encryptedValue = CryptoJS.AES.encrypt(concatenatedValues, process.env.SECRET_KEY as string).toString();

  // Make the encrypted value URL-safe by replacing URL-unsafe characters
  const urlSafeEncryptedValue = encryptedValue
    .replace(/\+/g, '-')  // Replace + with -
    .replace(/\//g, '_')  // Replace / with _
    .replace(/=+$/, '');  // Remove any trailing = characters

  return urlSafeEncryptedValue;
};
export const encryptShortCode = async (mobileNumber: string, societyId: string): Promise<string> => {
  try {
    // Concatenate the input values
    const data = `${mobileNumber}:${societyId}`;

    // Create a SHA-256 hash of the data
    const hash = crypto.createHash('sha256').update(data).digest('base64url');

    // Ensure the hash is alphanumeric and only 15 characters
    const shortHash = hash.substring(0, 15).replace(/[^a-zA-Z0-9]/g, '');

    return shortHash;
  } catch (error) {
    console.error('Error generating hash:', error);
    throw new Error('Failed to encrypt values');
  }
};
export function safeJsonStringify(obj: any) {
  return JSON.stringify(
    obj,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value) // Convert BigInt to String
  );
}