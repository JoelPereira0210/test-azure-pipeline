// hashUtils.ts
import CryptoJS from 'crypto-js';

// const SECRET_KEY = 'your-very-secure-key-12345';

// Function to encrypt a value
export const encryptValue = (value: string): string => {
  const encryptedValue = CryptoJS.AES.encrypt(value, process.env.SECRET_KEY).toString();
  console.log("VVVVV:", encryptedValue)
  return encryptedValue;
};


// Function to decrypt a value
export const decryptValue = (encryptedValue: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedValue, process.env.SECRET_KEY);
  const originalValue = bytes.toString(CryptoJS.enc.Utf8);
  return originalValue;
};
// export const decryptMobileSociety = (encryptedValue: string): { phoneNumber: string, societyId: string } => {
//   // Reverse the URL-safe replacements
//   let base64Value = encryptedValue
//     .replace(/-/g, '+')  // Replace - back to +
//     .replace(/_/g, '/'); // Replace _ back to /

//   // Add necessary padding for Base64 decoding (Base64 strings should be divisible by 4)
//   while (base64Value.length % 4 !== 0) {
//     base64Value += '=';
//   }

//   // Decrypt the value
//   const bytes = CryptoJS.AES.decrypt(base64Value, process.env.SECRET_KEY as string);
//   const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

//   if (!decryptedString) {
//     throw new Error("Failed to decrypt or malformed data");
//   }

//   // Split the decrypted string to get the original values
//   const [phoneNumber, societyId] = decryptedString.split(':');
//   return { phoneNumber, societyId };
// };

// export const decryptMobileSociety = (encryptedValue: string): { phoneNumber: string; societyId: string } => {
//   // Separate the hash from the encrypted value
//   const originalHash = encryptedValue.slice(-8); // Extract the last 8 characters as the hash
//   const truncatedEncryptedValue = encryptedValue.slice(0, -8); // Remove the hash from the encrypted value

//   // Reverse the URL-safe replacements
//   let base64Value = truncatedEncryptedValue
//     .replace(/-/g, '+')  // Replace - back to +
//     .replace(/_/g, '/'); // Replace _ back to /

//   // Add necessary padding for Base64 decoding (Base64 strings should be divisible by 4)
//   while (base64Value.length % 4 !== 0) {
//     base64Value += '=';
//   }

//   // Decrypt the value
//   const bytes = CryptoJS.AES.decrypt(base64Value, process.env.SECRET_KEY as string);
//   console.log("bytes", bytes)
//   console.log("process.env.SECRET_KEY", process.env.SECRET_KEY)
//   const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
//   console.log("decryptedString", decryptedString)

//   if (!decryptedString) {
//     throw new Error("Failed to decrypt or malformed data");
//   }

//   // Split the decrypted string to get the original values
//   const [phoneNumber, societyId] = decryptedString.split(':');
//   console.log("phoneNumber", phoneNumber)
//   console.log("societyId", societyId)
//   // Verify the hash for integrity
//   const recalculatedHash = CryptoJS.SHA256(decryptedString).toString(CryptoJS.enc.Hex).slice(0, 8);
//   if (recalculatedHash !== originalHash) {
//     throw new Error("Hash mismatch: Data integrity compromised");
//   }

//   return { phoneNumber, societyId };
// };

export const decryptMobileSociety = (
  shortKey: string,
  originalEncryptedValue: string // Store or pass this securely
): { phoneNumber: string; societyId: string } => {
  console.log("Shortened Key Received for Decryption:", shortKey);
  console.log("process.env.SECRET_KEY:", process.env.SECRET_KEY);

  // Recalculate the hash and compare it
  const recalculatedKey = CryptoJS.HmacSHA256(originalEncryptedValue, process.env.SECRET_KEY as string)
    .toString(CryptoJS.enc.Base64)
    .slice(0, 55)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  console.log("Recalculated Key:", recalculatedKey);

  if (shortKey !== recalculatedKey) {
    throw new Error("Invalid or tampered data: Hash mismatch");
  }

  // Decrypt the original encrypted value
  const bytes = CryptoJS.AES.decrypt(originalEncryptedValue, process.env.SECRET_KEY as string);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  console.log("Decrypted String:", decryptedString);

  if (!decryptedString) {
    throw new Error("Failed to decrypt or malformed data");
  }

  // Split the decrypted string to get the original values
  const [phoneNumber, societyId] = decryptedString.split(':');
  console.log("Decrypted Phone Number:", phoneNumber);
  console.log("Decrypted Society ID:", societyId);

  return { phoneNumber, societyId };
};

