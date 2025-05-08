import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RAZORPAY_KEY_ID,EXPO_PUBLIC_BASE_URL,SECRET_KEY } from '@env';

  // const SECRET_KEY=process.env['SECRET_KEY']
  // const SECRET_KEY=process.env['SECRET_KEY']
  console.log("SECRET KEY in App",SECRET_KEY);
// Encrypt a value using AES
export const encryptValue = async (value: any): Promise<string> => {
  try {
    console.log("got societyId in encrypt value function",value);
    //@ts-ignore
    const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
    // console.warn("Encrypted Value:", encryptedValue);
    return encryptedValue;
  } catch (error) {
    console.error("Encryption Error:", error);
    return '';
  }
};

// Decrypt an AES encrypted value
export const decryptValue = async (encryptedValue: any): Promise<string> => {
  try {
    //@ts-ignore
    const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
    const originalValue = bytes.toString(CryptoJS.enc.Utf8);
    return originalValue;
  } catch (error) {
    console.error("Decryption Error:", error);
    return '';
  }
};

// Function to securely store societyId using AsyncStorage
export const setSocietyId = async (societyId: string) => {
  try {
    console.log("mystep 3 got societyId in setSocietyId",societyId);
    const encryptedId = await encryptValue(societyId);
    console.log("mystep 4 got encryptedId in setSocietyId",encryptedId);
    await AsyncStorage.setItem('societyId', encryptedId);
    // console.warn("Society ID Stored Securely");
  } catch (error) {
    console.error("Failed to store Society ID:", error);
  }
};

// Function to retrieve and decrypt societyId
export const getSocietyId = async (): Promise<string | null> => {
  try {
    const encryptedId = await AsyncStorage.getItem('societyId');
    if (!encryptedId) return null;
    return await decryptValue(encryptedId);
  } catch (error) {
    console.error("Failed to retrieve Society ID:", error);
    return null;
  }
};

// Function to decrypt society details with integrity check
export const decryptMobileSociety = async (
  shortKey: string,
  originalEncryptedValue: string
): Promise<{ phoneNumber: string; societyId: string } | null> => {
  try {
    console.warn("Received Short Key:", shortKey);

    // Recalculate the hash and verify
    //@ts-ignore
    const recalculatedKey = CryptoJS.HmacSHA256(originalEncryptedValue, SECRET_KEY)
      .toString(CryptoJS.enc.Base64)
      .slice(0, 55)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    if (shortKey !== recalculatedKey) {
      throw new Error("Data Integrity Compromised: Hash Mismatch");
    }

    // Decrypt the original encrypted value
    //@ts-ignore
    const bytes = CryptoJS.AES.decrypt(originalEncryptedValue, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) throw new Error("Malformed data or decryption failed");

    const [phoneNumber, societyId] = decryptedString.split(':');
    return { phoneNumber, societyId };
  } catch (error) {
    console.error("Decryption Failed:", error);
    return null;
  }
};


// import { getRandomBytes } from 'react-native-securerandom';
// import CryptoJS from 'crypto-js';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Ensure you load the SECRET_KEY from environment variables or hardcoded for testing
// const SECRET_KEY = process.env['SECRET_KEY'] || 'your-secret-key';

// /** 🔹 Generate Secure Random Bytes */
// export const generateRandomBytes = async (size = 16): Promise<string> => {
//   try {
//     const randomBytes = await getRandomBytes(size);
//     return Buffer.from(randomBytes).toString('hex');
//   } catch (error) {
//     console.error("Error generating secure random bytes:", error);
//     return '';
//   }
// };

// /** 🔹 AES Encrypt a Value */
// export const encryptValue = async (value: string): Promise<string> => {
//   try {
//     const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
//     console.warn("Encrypted Value:", encryptedValue);
//     return encryptedValue;
//   } catch (error) {
//     console.error("Encryption Error:", error);
//     return '';
//   }
// };

// /** 🔹 AES Decrypt a Value */
// export const decryptValue = async (encryptedValue: string): Promise<string> => {
//   try {
//     const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
//     const originalValue = bytes.toString(CryptoJS.enc.Utf8);
//     return originalValue || '';
//   } catch (error) {
//     console.error("Decryption Error:", error);
//     return '';
//   }
// };

// /** 🔹 Securely Store Society ID */
// export const setSocietyId = async (societyId: string) => {
//   try {
//     const encryptedId = await encryptValue(societyId);
//     await AsyncStorage.setItem('societyId', encryptedId);
//     console.warn("Society ID Stored Securely");
//   } catch (error) {
//     console.error("Failed to store Society ID:", error);
//   }
// };

// /** 🔹 Retrieve & Decrypt Society ID */
// export const getSocietyId = async (): Promise<string | null> => {
//   try {
//     const encryptedId = await AsyncStorage.getItem('societyId');
//     if (!encryptedId) return null;
//     return await decryptValue(encryptedId);
//   } catch (error) {
//     console.error("Failed to retrieve Society ID:", error);
//     return null;
//   }
// };

// /** 🔹 Decrypt Mobile Society with Integrity Check */
// export const decryptMobileSociety = async (
//   shortKey: string,
//   originalEncryptedValue: string
// ): Promise<{ phoneNumber: string; societyId: string } | null> => {
//   try {
//     console.warn("Received Short Key:", shortKey);

//     // Recalculate the HMAC-SHA256 hash for integrity check
//     const recalculatedKey = CryptoJS.HmacSHA256(originalEncryptedValue, SECRET_KEY)
//       .toString(CryptoJS.enc.Base64)
//       .slice(0, 55)
//       .replace(/\+/g, '-')
//       .replace(/\//g, '_')
//       .replace(/=+$/, '');

//     if (shortKey !== recalculatedKey) {
//       throw new Error("Data Integrity Compromised: Hash Mismatch");
//     }

//     // Decrypt the value
//     const bytes = CryptoJS.AES.decrypt(originalEncryptedValue, SECRET_KEY);
//     const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

//     if (!decryptedString) throw new Error("Malformed data or decryption failed");

//     const [phoneNumber, societyId] = decryptedString.split(':');
//     return { phoneNumber, societyId };
//   } catch (error) {
//     console.error("Decryption Failed:", error);
//     return null;
//   }
// };
