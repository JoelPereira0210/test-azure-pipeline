import Cookies from 'js-cookie';
// import { cookies } from 'next/headers';
import { Society } from './../../../server/src/types/society';
import { errorMessages, successMessages } from '@/src/lib/constants/messages';
import {
  OTPDataType,
  PhoneNumberDataType,
  LoginDataType,
} from '@/src/lib/types/registerNumber.types';
import toast from 'react-hot-toast';
import { api, setAuthCookie } from './api';
import axios from 'axios';
import { SocietyRegisterType } from '../lib/types/registerSociety.types';
import { encryptValue, decryptValue } from '../utils/encryptiondecryption';

export const phoneNumberAction = async (data: PhoneNumberDataType) => {
  try {
    console.log('API', api);
    console.log('API URL:', process.env.NEXT_PUBLIC_BASE_URL);
    // const response = await api.post("/auth/register-otp", data);
    const response = await api.post(`/auth/register-otp`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('RRRR', response);
    toast.success(successMessages.OTP_SENT);
    return response;
  } catch (err: any) {
    // toast.success("ssss");
    toast.error(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR);
    return err;
  }
};

export const loginAction = async (data: LoginDataType) => {
  try {
    console.log('API', api);
    // const response = await api.post("/auth/register-otp", data);
    const response = await api.post(`/auth/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("RES", response)
    const token = response?.data?.token;
    const subdomain = response?.data?.subdomain;
    console.log('TT', token);
    const superAdmin = response?.data?.isSuperAdmin
    // if (token) {
    //   localStorage.setItem('authToken', token); // Store token in localStorage (or use cookies if necessary)
    // }
    if (superAdmin) {
      localStorage.setItem('isSuperAdmin', superAdmin); // Store token in localStorage (or use cookies if necessary)

      if (token) {
        localStorage.setItem('authToken', token); // Store token in localStorage (or use cookies if necessary)
        Cookies.set('authToken', token);
      }

    }
    // toast.success(successMessages.LOGIN_SUCCESS);
    return response;
  } catch (err: any) {
    toast.error(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR);
    return err;
  }
};

export const otpAction = async (data: OTPDataType) => {
  try {
    console.log('API', api);
    console.log('API URL:', process.env.NEXT_PUBLIC_BASE_URL);
    // const response = await api.post("/auth/register-otp", data);
    const response = await axios.post(
     `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-register-otp`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    toast.success(successMessages.OTP_VERIFIED);
    return response;
  } catch (err: any) {
    toast.error(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR);
    return err;
  }
};

export const registerSocietyAction = async (data: SocietyRegisterType) => {
  try {
    console.log('API', api.getUri());
    console.log('API URL:', process.env.NEXT_PUBLIC_BASE_URL);
    console.log("data bank", data)
    const response = await api.post('/auth/society-registration', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    toast.success(successMessages.REGISTER_SUCCESS);
    console.log("response /auth/society-registration", response)
    if (response.data?.society) {
      const society = JSON.parse(response.data.society);
      const id = society?.societyId;
      const userId = society?.createdById;
      sessionStorage.setItem('socioId', JSON.stringify(id))
      sessionStorage.setItem('userId', JSON.stringify(userId))
      const encryptedSocietyId = await encryptValue(id);
      // console.log('Encrypted Society ID:', encryptedSocietyId);
      localStorage.setItem("societyId", encryptedSocietyId);

      // Store encrypted societyId in localStorage
      // localStorage.setItem('societyId', encryptedSocietyId);
    }
    if (response?.data?.user) {

      const user = JSON.parse(response.data.user); // Deserialize user
      sessionStorage.setItem('user', JSON.stringify(user));

    }

    // Save the auth token in localStorage
    if (response?.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      Cookies.set('authToken', response.data.token);
    }
    return response;
  } catch (error) {
    console.log("Error", error)
    toast.error(error?.response?.data.error ?? errorMessages.UNKNOWN_ERROR);
  }
};



export const fetchLoggedInUserdata = async () => {
  try {
    const response = await api.get('/user');
    console.log('response:AAA', response.data);
    const membershipStatusId = response?.data?.membershipStatusId;
    console.log("stat", membershipStatusId)
  /*   await setRoleAction(); */
    if (membershipStatusId == 1) {
      await localStorage.setItem("membershipStatus", 'paid')
    } else {
      await localStorage.setItem("membershipStatus", 'unpaid')

    }
    const superAdmin = localStorage.getItem('isSuperAdmin');
    if (superAdmin) {
      return response?.data;
    }
    // const userSocieties = response.data?.user?.societyMembers[0].society ?? [];
    const userSocieties = response?.data?.societyMembers[0].society ?? [];
    // console.log("userSocieties", userSocieties)
    if (userSocieties != null) {
      const societyId = userSocieties?.societyId;
      console.log('Society ID: authAction', societyId);

      // Encrypt the societyId 
      const encryptedSocietyId = await encryptValue(societyId);
      console.log('Encrypted Society ID:', encryptedSocietyId);

      // Store encrypted societyId in localStorage
      // localStorage.setItem('societyId', encryptedSocietyId);

      // For demonstration, decrypt the value
      // const decryptedSocietyId = decryptValue(societyId)/;
      // console.log('Decrypted Society ID:', decryptedSocietyId);
    }
    // if (response.data.membershipStatusId === '4' && response.data.isAdmin) {
    //   const currentFlow = localStorage.getItem("flow");

    //   // Only set flow and reload if flow is not already "normaluser"
    //   if (currentFlow !== "normaluser") {
    //     window.location.reload();
    //     localStorage.setItem("flow", "normaluser");

    //   }
    // }
    console.log("dddmmm", response.data)
    return response?.data;
    // return response
  } catch (err: any) {
    console.log("ERRR", err)
    // toast.error(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR);
    return null;
  }
};



export const checkMembership = async (userId: string) => {
  try {
    console.log('Sending User ID to server:', userId);

    // Make an API call to the server with userId as a query parameter
    const response = await api.get('/auth/check-membership', {
      params: { userId }, // Pass userId as a query parameter
    });

    // Log the server response
    console.log('Server Response:', response.data);
    console.log('Response Status:', response.status);
    console.log("responseee", response)
    // Return the response to handle it in the component
    return response;

  } catch (error) {
    console.error('Error in checkMembership:', error);
    // toast.error('An error occurred while checking membership!');
    throw error; // Re-throw the error so it can be handled in onSubmit
  }
};



export const fetchLoggedInUserDetails = async () => {
  console.log("SuccessfullySuccessfully v")
  try {
    const response = await api.get('/user/user-details');
    console.log('Successfully logged in data:', response);

    // const userSocieties = response.data?.user?.societyMembers[0].society ?? [];
    const userSocieties = response.data?.societyMembers[0].society ?? [];
    console.log("userSocieties fetchLoggedInUserDetails", userSocieties)
    console.log("RESPONSE", response)
    if (userSocieties != null) {
      const societyId = userSocieties.societyId;
      console.log('Society ID:', societyId);
      console.log("RESPONSE", response)
      if (societyId) {
        // Encrypt the societyId
        const encryptedSocietyId = await encryptValue(societyId);
        // console.log('Encrypted Society ID:', encryptedSocietyId);

        // Store encrypted societyId in localStorage
        await localStorage.setItem('societyId', encryptedSocietyId);

        // For demonstration, decrypt the value
        // const decryptedSocietyId = decryptValue(societyId)/;
        // console.log('Decrypted Society ID:', decryptedSocietyId);
      }
    }
    console.log("userSocieties", response)
    return response.data;
  } catch (err: any) {
    console.log("errror", err)
    toast.error(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR);
    return null;
  }
};






export const fetchdatainprofile = async () => {
  try {
    const response = await api.get('/user');
    console.log('Successfully logged in datnvha:', response.data);

    console.log("data in")
    return response.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR);
    return null;
  }
};

export const updateUser = async (data) => {
  try {
    console.log("data inNNNN", data)
    const response = await api.patch('/user', data);
    console.log("data in", response)
    toast.success("User Details Updated Successfully")
    return response;
  } catch (error) {
    console.log("ERROR", error)
  }
}




export const changePasswordAction = async (userId, newPassword) => {
  try {
    // Log the received parameters
    console.log('Received parameters inn:', { userId, newPassword });

    // Prepare the request body
    const requestBody = {
      userId,

      newPassword,
    };

    const response = await api.post('/auth/change-password', requestBody);

    if (response.status === 209) {
      toast.success('Password updated successfully');
      return { success: true, message: 'Password updated successfully' };
    }
    else if (response.status === 404) {
      toast.error('User not found or account is deleted');
      return { success: false, message: 'User not found or account is deleted' };
    }
    else {
      toast.error('Internal server error');
      return { success: false, message: 'Internal server error' };
    }
  } catch (error) {
    toast.error('An error occurred while changing password');
    console.error('Error changing password:', error);
    return { success: false, message: 'An error occurred while changing password' };
  }
};




export const changePhoneNumberAction = async (userId, newMobileNumber) => {
  try {
    // Log the received parameters
    console.log('Received parameters inn:', { userId, newMobileNumber });

    // Prepare the request body
    const requestBody = {
      userId, newMobileNumber
    };

    const response = await api.post('/auth/change-phoneNumber', requestBody);

    if (response.status === 209) {
      toast.success('Mobile number updated successfully');
      return { success: true, message: 'Mobile number updated successfully' };
    }
    else if (response.status === 404) {
      toast.error('User not found or account is deleted');
      return { success: false, message: 'User not found or account is deleted' };
    }
    else {
      toast.error('Internal server error');
      return { success: false, message: 'Internal server error' };
    }
  } catch (error) {
    toast.error('An error occurred while changing mobile number');
    console.error('Error changing mobile number:', error);
    return { success: false, message: 'An error occurred while changing mobile number' };
  }
};





export const forgotPasswordAction = async (userId, newPassword) => {
  try {
    // Log the received parameters
    console.log('Received parameters in forgot:', { userId, newPassword });

    // Prepare the request body
    const requestBody = {
      userId,

      newPassword,
    };

    // Make the API call to change the password
    const response = await api.post('/auth/forgot-password', requestBody);

    if (response.status === 209) {
      toast.success('Password updated successfully');
      return { success: true, message: 'Password updated successfully' };
    }
    else if (response.status === 206) {
      toast.error('User not found or account is deleted');
      return { success: false, message: 'User not found or account is deleted' };
    }
    else {
      console.error('Failed to change password:', response.data);
      return false; // Return false on failure
    }
  } catch (error) {
    console.error('Error changing password:', error);
    return false; // Return false on failure
  }
};




export const fetchPhoneNumberAction = async (userId, actionType) => {
  try {
    // Log the received parameters
    console.log('Received parameters in forgot pass:', { userId });

    // Prepare the request body
    const requestBody = {
      userId,
      actionType

    };

    // Make the API call to change the password
    const response = await api.post('/auth/fetch-phone-number', requestBody);

    // Check if the response status is 200
    if (response.status === 200) {
      console.log('Phone number retrieved successfully:', response.data.phoneNumber);
      toast.success("OTP sent");
      return response.data.phoneNumber;
    } else if (response.status === 404) {
      console.error('Failed to retrieve phone number: User not found');
      toast.error("Failed to retrieve phone number: User not found");
      return false; // Return false for user not found

    } else if (response.status === 500) {
      console.error('Failed to send OTP via SMS');
      toast.error("Failed to send OTP via SMS");
      return false;
    }
    else {
      console.error('Failed to retrieve phone number:', response.data);
      toast.error("Failed to retrieve phone number");
      return false; // Return false for other errors
    }
  } catch (error) {
    console.error('Error fetching phone number:', error);
    return false; // Return false on error
  }
};















export const validateOldPasswordAction = async (userId, oldPassword) => {
  try {
    console.log('Received parameters in validateOldPassword:', { userId, oldPassword });

    const requestBody = { userId, oldPassword };
    const response = await api.post('/auth/validate-password', requestBody);

    if (response.status === 200) {
      // toast.success('Password matched');
      return { success: true, message: 'Password matched' };
    }
    else if (response.status === 206) {
      toast.error('User not found or account is deleted');
      return { success: false, message: 'User not found or account is deleted' };
    }
  } catch (error) {
    // If response status is 401, it indicates an incorrect password
    if (error.response && error.response.status === 401) {
      toast.error('Invalid password. Please try again.');
      return { success: false, message: 'Password does not match' };
    }
    // For any other error status
    toast.error('An error occurred while validating password');
    console.error('Error validating password:', error);
    return { success: false, message: 'An error occurred while validating password' };
  }
};

export const getPublishedSubscriptions = async () => {
  try {
    const response = await api.get('/auth/subscriptions')
    if (response.status === 200) {
      return response
    }
  } catch (error) {

  }
}

export const setRoleAction = async () => {
  try {
    const response = await api.get('/user/set-role');
    console.log("rrrrrr", response)
    if (response.status === 200) {
      const isAdmin = response.data.isAdmin; // Will be 'admin' or 'no'
      console.log("aaad", isAdmin)
      await localStorage.setItem('flow', isAdmin); // Store directly as 'admin' or 'no'
      console.log("role set is ", isAdmin);
      return response.data;
    }
  } catch (error) {
    console.error('Error setting role:', error);
  }
};

export const checkIsAdminAction = async () => {
  try {
    const response = await api.get('/user/check-admin');
    if (response.status === 200 && response.data && response.data?.isAdmin) {
      console.log("datar", response.data)
      return response.data.isAdmin; // Returns 'admin' or 'normaluser'
    } else {
      console.log('Unexpected response format from /user/check-admin');
      return null;
    }
  } catch (error) {
    console.error('Error fetching admin status:', error);
    return null;
  }
};

// export const checkisSuperAdmin = async (userId: string) => {
//   try {
//     const societyId = localStorage.getItem('societyId'); // Retrieve the societyId from localStorage

//     if (!societyId) {
//       throw new Error('No society ID found in localStorage');
//     }

//     console.log('Society ID:', societyId);
//     console.log('Checking if user is a societySuperAdminss:', userId);

//     // Make the API call to check if the user is a societySuperAdmin
//     const response = await api.get('/auth/check-superadmin', {
//       params: {
//         societyId, // Pass the societyId as a query parameter
//         userId,    // Pass the userId as a query parameter
//       },
//     });

//     if (response.status === 200) {
//       const { isSuperAdmin } = response.data;
//       return isSuperAdmin; // Return the boolean result
//     }
//   } catch (error) {
//     console.error('Error checking societySuperAdmin status:', error);
//     throw error; // Re-throw the error for further handling
//   }
// };

export const checkisSuperAdmin = async (userId: string) => {
  try {
    const societyId = localStorage.getItem('societyId'); // Retrieve the societyId from localStorage

    if (!societyId) {
      // throw new Error('No society ID found in localStorage');
      return;
    }

    console.log('Society ID:', societyId);
    console.log('Checking if user is a societySuperAdminss:', userId);

    // Make the API call to check if the user is a societySuperAdmin
    const response = await api.get('/auth/check-superadmin', {
      params: {
        societyId, // Pass the societyId as a query parameter
        userId,    // Pass the userId as a query parameter
      },
    });

    if (response.status === 200) {
      const { isSuperAdmin } = response.data;
      return isSuperAdmin; // Return the boolean result
    }
  } catch (error) {
    console.error('Error checking societySuperAdmin status:', error);
    throw error; // Re-throw the error for further handling
  }
};

export const validateformIfsc = async (ifscCode: string) => {
  console.log("Validating IFSC:", ifscCode);
  try {
    const response = await api.post('/auth/ifscbankformdetails', { ifscCode });
    console.log("IFSC validation response:", response);

    if (response && response.data) {
      return response.data; // Return bankName and branchName if valid
    }

    throw new Error('No data found for IFSC code');
  } catch (error) {
    console.error("Error validating IFSC code:", error);

    // Handle 408 error (Invalid IFSC Code)
    if (error?.response?.status === 408) {
      toast.error("You entered an invalid IFSC code. Please check and try again.");
    }
    // else {
    //   toast.error(error?.response?.data?.message ?? "Failed to validate IFSC code");
    // }

    throw error; // Re-throw to propagate the error
  }
};

export const checkAndFetchUserDetails = async (phoneNumber: string) => {
  try {
    console.log("Checking for existing user with phone number:", phoneNumber);

    // API call to fetch user details based on the phone number
    const response = await api.get('/auth/check-user', {
      params: {
        phoneNumber, // Pass phoneNumber as a query parameter
      },
    });

    console.log("/check-user response", response);
    // Check if the user exists in the response
    if (response.status === 200) {
      const { exists, user } = response.data;

      if (exists) {
        console.log("User exists. Details fetched:", user);
        // toast.success("User details fetched successfully.");
        return { exists: true, user }; // Return user details
      } else {
        console.log("User does not exist.");
        // toast.error("No user found with this phone number.");
        return { exists: false, user: null }; // Indicate user doesn't exist
      }
    } else {
      console.error("Unexpected response status:", response.status);
      // toast.error("Failed to check user details.");
      return { exists: false, user: null };
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    // toast.error("An error occurred while checking user details.");
    return { exists: false, user: null }; // Return error state
  }
};
