// hashUtils.ts
import CryptoJS from 'crypto-js';

// const SECRET_KEY = 'your-very-secure-key-12345';

// Function to encrypt a value
export const encryptValue = (value: string): string => {
  const encryptedValue = CryptoJS.AES.encrypt(value, process.env.SECRET_KEY as string).toString();
  return encryptedValue;
};


// Function to decrypt a value
export const decryptValue = (encryptedValue: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedValue, process.env.SECRET_KEY as string);
  const originalValue = bytes.toString(CryptoJS.enc.Utf8);
  return originalValue;
};
