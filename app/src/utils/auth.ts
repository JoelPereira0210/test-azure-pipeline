import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptValue, setSocietyId } from "./encryptiondecryption";
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';

type Society = {
  societyId: string;
  societyName: string;
};

export async function isAuthenticated(): Promise<string> {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const superAdmin = await AsyncStorage.getItem('isSuperAdmin');

    console.log("token", !!token);
    console.log("superAdmin", superAdmin);

    if (!!token && !!superAdmin) {
      return 'superAdmin';
    } else if (!!token) {
      return 'societyUser';
    } else {
      return 'guest';
    }
  } catch (error) {
    console.error("Error fetching auth status:", error);
    return 'false';
  }
}

//used only for socioLogo png later change name
export const fileToBase64Native = async (fileUri:any) => {
    try {
    //   console.log("Reading file from:", fileUri); // ✅ Debug log
      const base64String = await RNFS.readFile(fileUri, 'base64');
    //   console.log("Converted Base64 String (First 100 chars):", base64String.substring(0, 100) + "...");
      return `data:image/png;base64,${base64String}`; // ✅ Prefix with proper MIME type
    } catch (error) {
    //   console.error('Error converting file to base64:', error);
      return null;
    }
  };

  //convert all types of files
  export async function fileToBase64(file: any): Promise<string> {
    try {
      // If already a data URI, return it as-is
      if (file.uri.startsWith('data:')) {
        return file.uri;
      } else {
        // Read file from local path
        const base64String = await RNFS.readFile(file.uri, 'base64');
        // Use the file's type (e.g. "image/jpeg", "video/mp4", etc.) to construct the data URI
        const mimeType = file.type || 'application/octet-stream';
        return `data:${mimeType};base64,${base64String}`;
      }
    } catch (error) {
      console.error('fileToBase64 error:', error);
      throw error;
    }
  }

export const setSocietyIdInAsyncStorage = async (society: Society): Promise<boolean|undefined> => {
  try {
    if (society) {
      await setSocietyId(society?.societyId); // Store in AsyncStorage
      
      // const encryptedSocietyId = await encryptValue(society?.societyId); // Encrypt societyId
      // await AsyncStorage.setItem('societyId', encryptedSocietyId); // Store in AsyncStorage
      console.log("SOCIETY SET IN ASYNC STORAGE", society);
      return true;
    }
  } catch (error) {
    console.error('Error setting societyId in AsyncStorage:', error);
    return false;
  }
};

export const setSocietyIdInLocalStorage = async (society: Society) => {
  try {
    if (society) {
    
      const encryptedSocietyId = await encryptValue(society); // Encrypt societyId
      console.log("ENCRYPTED SOCIETY ID", encryptedSocietyId);
      AsyncStorage.setItem('societyId', encryptedSocietyId); // Store in localStorage
      console.log("SOCIETY SET IN LOCAL IS", society);
      return true;
    }

  } catch (error) {
    console.error('Error setting societyId in AsyncStorage:', error);
    return false;
  }
};

export const requestStoragePermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'Storage permission is required to save file.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  // For Android 13+ (API 33+), WRITE_EXTERNAL_STORAGE is no longer needed for Downloads
  return true;
};