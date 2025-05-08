// import axios, { AxiosError } from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// const api = axios.create({
//   baseURL: API_URL,
// });

// // Request interceptor to add common headers
// api.interceptors.request.use(
//   (config) => {
//     console.log('config', config);
//     const token = localStorage.getItem('authToken');
//     // const token = "123"; // TODO: replace with cookie token
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     const societyId=localStorage.getItem('societyId');
//     if(societyId){
//       config.headers['x-society-id']=societyId
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// interface IErrorBase<T> {
//   error: Error | AxiosError<T>;
//   type: 'axios-error' | 'stock-error';
// }

// interface IAxiosError<T> extends IErrorBase<T> {
//   error: AxiosError<T>;
//   type: 'axios-error';
// }
// interface IStockError<T> extends IErrorBase<T> {
//   error: Error;
//   type: 'stock-error';
// }

// const axiosErrorHandler = <T>(
//   callback: (err: IAxiosError<T> | IStockError<T>) => void
// ) => {
//   return (error: Error | AxiosError<T>) => {
//     if (axios.isAxiosError(error)) {
//       callback({
//         error: error,
//         type: 'axios-error',
//       });
//     } else {
//       callback({
//         error: error,
//         type: 'stock-error',
//       });
//     }
//   };
// };

// export { api, axiosErrorHandler };

import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie'; // Importing js-cookie for easier cookie management
import { encryptValue } from '../utils/encryptiondecryption';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add common headers
api.interceptors.request.use(
  (config) => {
    console.log('config', config);
    const token = Cookies.get('authToken'); // Retrieve token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add the societyId from localStorage
    const societyId = localStorage.getItem('societyId');
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

// Helper function to set cookies with subdomain-specific logic
export const setAuthCookie = async (token: string, subdomain?: string, societyId?: string) => {
  // alert("SASa")
  if (subdomain){
    const lowerCaseSubdomain = subdomain.toLowerCase();
    const cookieDomain = `https://${lowerCaseSubdomain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`; // Example: sub1.example.com
    console.log("cookieDomain", cookieDomain)
  }
 
  Cookies.set('authToken', token,
    {
      // domain: cookieDomain,
      // path: '/',
      // secure: process.env.NODE_ENV === 'production', // Secure only in production
      sameSite: 'Strict', // Or 'Lax' depending on your needs
    }
  );
  // const localSocietyId = await localStorage.get('societyId');
  // if (!localSocietyId) {
  //   const encryptedSocietyId = await encryptValue(societyId)
  //   await localStorage.setItem('societyId', encryptedSocietyId)
  // }

  console.log("COOKIE", Cookies.get('authToken'))
};

// Helper function to remove cookies
export const removeAuthCookie = () => {
  Cookies.remove('authToken', {
    // domain: cookieDomain,
    path: '/',
  });
};

export { api, axiosErrorHandler };
