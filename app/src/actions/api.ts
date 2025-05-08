import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_PUBLIC_BASE_URL } from '@env';

/* import { encryptValue } from '../utils/encryptiondecryption';
 */
// const API_URL = process.env.EXPO_PUBLIC_BASE_URL;
// const API_URL ='http://10.0.2.2:9000/api'; 

// const API_URL = process.env['EXPO_PUBLIC_BASE_URL']
// const API_URL = process.env['EXPO_PUBLIC_BASE_URL']
const API_URL = EXPO_PUBLIC_BASE_URL;

console.log("API URL",API_URL);

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add common headers
api.interceptors.request.use(
  async (config) => {
    console.log('config', config);
    const token = await AsyncStorage.getItem('authToken'); // Retrieve token from AsyncStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add the societyId from AsyncStorage
    const societyId = await AsyncStorage.getItem('societyId');
    if (societyId) {
      config.headers['x-society-id'] = societyId; // Custom header for societyId
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface IErrorBase<T> {
  error: Error | AxiosError<T>;
  type: 'axios-error' | 'stock-error';
}

interface IAxiosError<T> extends IErrorBase<T> {
  error: AxiosError<T>;
  type: 'axios-error';
}
interface IStockError<T> extends IErrorBase<T> {
  error: Error;
  type: 'stock-error';
}

const axiosErrorHandler = <T>(
  callback: (err: IAxiosError<T> | IStockError<T>) => void
) => {
  return (error: Error | AxiosError<T>) => {
    if (axios.isAxiosError(error)) {
      callback({
        error: error,
        type: 'axios-error',
      });
    } else {
      callback({
        error: error,
        type: 'stock-error',
      });
    }
  };
};

// Helper function to set auth token in AsyncStorage
export const setAuthToken = async (token: string, societyId?: string) => {
  await AsyncStorage.setItem('authToken', token);
  
  const localSocietyId = await AsyncStorage.getItem('societyId');
/*   if (!localSocietyId && societyId) {
    const encryptedSocietyId = await encryptValue(societyId);
    await AsyncStorage.setItem('societyId', encryptedSocietyId);
  } */
};

// Helper function to remove auth token
export const removeAuthToken = async () => {
  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('societyId');
};

export { api, axiosErrorHandler };

