import { fileToBase64 } from "../utils/auth";
import Toast from "react-native-toast-message";
import { api } from "./api";
import { PhoneNumberDataType } from "../lib/types/registerNumber.types";
import { LoginDataType } from "../lib/types/registerNumber.types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';
import { encryptValue } from "../utils/encryptiondecryption";
import { errorMessages, successMessages } from "../lib/constants/messages";
import { SocietyRegisterType } from "../lib/types/registerSociety.types";
import { showToast } from "../utils/toastService";

//this below not used but societyRegistrationTransformer'APP" is used
export const societyRegistrationTransformer = async (data: any) => {
    try {
        console.log("file", data.logo[0]); // Logging file for debugging

        const transformedData = {
            phoneNumber: data.phoneNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            flatNumber: data.flatNumber,
            buildingDoorNumber: data.buildingDoorNumber,
            address: data.address,
            streetName: data.streetName,
            country: data.country, // Assuming you want the country name
            state: data.state ? data.state : null, // Handling null state
            pincode: data.pincode,
            password: data.password,
            isAdmin: data.isAdmin,
            isMember: data.isMember,
            createSociety: [
                {
                    societyName: data.societyName,
                    societyDescription: data.societyDescription,
                    buildingName: data.buildingName,
                    buildingDoorNumber: data.societyBuildingDoorNumber,
                    address: data.societyAddress,
                    streetName: data.societyStreetName,
                    state: data.societyState ? data.societyState : null, // Assuming you want the state name
                    country: data.societyCountry, // Assuming you want the country name
                    pincode: data.societyPincode,
                    logo: await fileToBase64(data?.logo[0]), // Handle the logo as a base64 string
                    membershipFees: data.isMembershipFees ? {
                        amount: data.amount,
                        bankDetails: {
                            bank: data.bank,
                            accountNumber: data.accountNumber,
                            IFSCCode: data.ifscCode,
                            accountName: data.accountName,
                            branchName: data.branchName
                        }
                    } : null // If isMembershipFees is false, membershipFees is null
                }
            ]
        };

        return transformedData;

    } catch (error) {
        console.error("Error transforming data:", error);
        throw error; // You can handle the error as needed
    }
};

export const phoneNumberAction = async (data: PhoneNumberDataType) => {
  console.log("got data in phoneNumberAction",data)
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
  
      showToast(successMessages.OTP_SENT, "success");
    console.log('OTP_SENT');
      return response;
    } catch (err: any) {
    showToast(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR, "error");
    console.log('ERROR');
      return err;
    }
  };


  export const loginAction = async (data:LoginDataType) => {
    try {
      console.log('Sending Login Request:', data);
  
      const response = await api.post('/auth/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Login Response:', response);
  
      const token = response?.data?.token;
      const isSuperAdmin = response?.data?.isSuperAdmin;
  
      if (token) {
        await AsyncStorage.setItem('authToken', token); // Store token in AsyncStorage
      }
  
      if (isSuperAdmin) {
        await AsyncStorage.setItem('isSuperAdmin', JSON.stringify(isSuperAdmin));
      }

      showToast("Login Succesfully", "success");
      return response;
    } catch (error:any) {
      // console.error('Login Error:', error.response?.data || error.message);
      showToast(error.response?.data.message, "error");
      return { error: error.response?.data?.message || 'An unexpected error occurred' };
    }
  };


  export const otpAction = async (data: any) => {
    try {
      console.log('API', api);
      console.log('API URL:', process.env.NEXT_PUBLIC_BASE_URL);
      // const response = await api.post("/auth/register-otp", data);
      const response = await api.post(
        '/auth/verify-register-otp',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // toast.success(successMessages.OTP_VERIFIED);
      showToast(successMessages.OTP_VERIFIED, "success");
    
      console.log("OTP_VERIFIED");
      return response;
    } catch (err: any) {
      // toast.error(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR);
      // ToastAndroid.show(
      //   errorMessages.UNKNOWN_ERROR, 
      //   ToastAndroid.LONG
      // );
      showToast(errorMessages.UNKNOWN_ERROR, "error");
      console.log(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR);
      return err;
    }
  };
  

  export const registerSocietyAction = async (data: SocietyRegisterType) => { 
    try {
      console.log('API Base URL:', api.getUri());
      console.log("Sending data to API:", data);
  
      const response = await api.post('/auth/society-registration', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Show success toast
      showToast(successMessages.REGISTER_SUCCESS, "success");
      console.log("Response from /auth/society-registration:", response);
  
      if (response?.data?.society) {
        const society = JSON.parse(response.data.society);
        const id = society?.societyId;
        const userId = society?.createdById;
  
        await AsyncStorage.setItem('socioId', JSON.stringify(id));
        await AsyncStorage.setItem('userId', JSON.stringify(userId));
  
        const encryptedSocietyId = await encryptValue(id);
        await AsyncStorage.setItem('societyId', encryptedSocietyId);
      }
  
      if (response?.data?.user) {
        const user = JSON.parse(response.data.user);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
  
      // Save the auth token
      if (response?.data?.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
      }
  
      return response;
    } catch (error) {
      console.error("Error:", error);
      
      // Show error toast
      // ToastAndroid.show(
      //   error?.response?.data?.error ?? errorMessages.UNKNOWN_ERROR, 
      //   ToastAndroid.LONG
      // );
      showToast(errorMessages.UNKNOWN_ERROR, "error");
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


  export const validateformIfsc = async (ifscCode: string) => {
    console.log("Validating IFSC:", ifscCode);
    try {
      const response = await api.post('/auth/ifscbankformdetails', { ifscCode });
      console.log("IFSC validation response:", response);
  
      if (response && response.data) {
        return response.data; // Return bankName and branchName if valid
      }
  
      throw new Error('No data found for IFSC code');
    } catch (error:any) {
      console.error("Error validating IFSC code:", error);
  
      // Handle 408 error (Invalid IFSC Code)
      if (error?.response?.status === 408) {
        // Show error toast
        // ToastAndroid.show(
        //   error?.response?.data?.error ?? errorMessages.UNKNOWN_ERROR, 
        //   ToastAndroid.LONG
        // );
        showToast(errorMessages.UNKNOWN_ERROR,"error")
      }
      // else {
      //   toast.error(error?.response?.data?.message ?? "Failed to validate IFSC code");
      // }
  
      throw error; // Re-throw to propagate the error
    }
  };

  export const checkisSuperAdmin = async (userId: string) => {
    try {
      const societyId = await AsyncStorage.getItem('societyId'); // Retrieve the societyId from localStorage
  
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

  export const fetchStatesAction = async (country: string) => {
    try {
      const response = await api.post('/auth/fetch-states', { country });
  
      if (response && response.data && !response.data.error) {
        return response.data; 
      }
  
     
    } catch (error) {
      console.error("Error fetching states:", error);
      return null; 
    }
  };
  
  export const fetchLoggedInUserdata = async () => {
    console.log("fetchLoggedInUserdata called")
    try {
      const response = await api.get('/user');
      console.log('response:AAA', response.data);
      const membershipStatusId = response?.data?.membershipStatusId;
      console.log("stat", membershipStatusId)
    /*   await setRoleAction(); */
      if (membershipStatusId == 1) {
        await AsyncStorage.setItem("membershipStatus", 'paid')
      } else {
        await AsyncStorage.setItem("membershipStatus", 'unpaid')
  
      }
      const superAdmin = await AsyncStorage.getItem('isSuperAdmin');
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

  
export const getPublishedSubscriptions = async () => {
  try {
    const response = await api.get('/auth/subscriptions')
    if (response.status === 200) {
      return response
    }
  } catch (error) {

  }
}

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


export const fetchdatainprofile = async () => {
  try {
    const response = await api.get('/user');
    console.log('Successfully logged in datnvha:', response.data);

    console.log("data in")
    return response.data;
  } catch (err: any) {
    showToast(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR,'error');
    return null;
  }
};

export const updateUser = async (data:any) => {
  try {
    console.log("data inNNNN", data)
    const response = await api.patch('/user', data);
    console.log("data in", response)
    showToast("User Details Updated Successfully",'success')
    return response;
  } catch (error) {
    console.log("ERROR", error)
  }
}

export const fetchLoggedInUserDetails = async () => {
  console.log("SuccessfullySuccessfully v")
  try {
    const response = await api.get('/user/user-details');
    // console.log('Successfully logged in data:', response);

    // const userSocieties = response.data?.user?.societyMembers[0].society ?? [];
    const userSocieties = response.data?.societyMembers[0].society ?? [];
    // console.log("userSocieties fetchLoggedInUserDetails", userSocieties)
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
        await AsyncStorage.setItem('societyId', encryptedSocietyId);

        // For demonstration, decrypt the value
        // const decryptedSocietyId = decryptValue(societyId)/;
        // console.log('Decrypted Society ID:', decryptedSocietyId);
      }
    }
    console.log("userSocieties", response)
    return response.data;
  } catch (err: any) {
    console.log("errror", err)
    showToast(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR,'error');
    return null;
  }
}

export const changePasswordAction = async (userId: string, newPassword: string) => {
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
      showToast('Password updated successfully','success');
      return { success: true, message: 'Password updated successfully' };
    }
    else if (response.status === 404) {
      showToast('User not found or account is deleted','error');
      return { success: false, message: 'User not found or account is deleted' };
    }
    else {
      showToast('Internal server error','error');
      return { success: false, message: 'Internal server error' };
    }
  } catch (error) {
    showToast('An error occurred while changing password','error');
    console.error('Error changing password:', error);
    return { success: false, message: 'An error occurred while changing password' };
  }
};

export const changePhoneNumberAction = async (userId: string, newMobileNumber: any) => {
  try {
    // Log the received parameters
    console.log('Received parameters inn:', { userId, newMobileNumber });

    // Prepare the request body
    const requestBody = {
      userId, newMobileNumber
    };

    const response = await api.post('/auth/change-phoneNumber', requestBody);

    if (response.status === 209) {
      showToast('Mobile number updated successfully','success');
      return { success: true, message: 'Mobile number updated successfully' };
    }
    else if (response.status === 404) {
      showToast('User not found or account is deleted','error');
      return { success: false, message: 'User not found or account is deleted' };
    }
    else {
      showToast('Internal server error','error');
      return { success: false, message: 'Internal server error' };
    }
  } catch (error) {
   showToast('An error occurred while changing mobile number','error');
    console.error('Error changing mobile number:', error);
    return { success: false, message: 'An error occurred while changing mobile number' };
  }
};

export const forgotPasswordAction = async (userId:string, newPassword:string) => {
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
      showToast('Password updated successfully','success');
      return { success: true, message: 'Password updated successfully' };
    }
    else if (response.status === 206) {
      showToast('User not found or account is deleted','error');
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



export const fetchPhoneNumberAction = async (userId:string, actionType:string) => {
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
      showToast("OTP sent","success");
      return response.data.phoneNumber;
    } else if (response.status === 404) {
      console.error('Failed to retrieve phone number: User not found');
      showToast("Failed to retrieve phone number: User not found","error");
      return false; // Return false for user not found

    } else if (response.status === 500) {
      console.error('Failed to send OTP via SMS');
      showToast("Failed to send OTP via SMS",'error');
      return false;
    }
    else {
      console.error('Failed to retrieve phone number:', response.data);
      showToast("Failed to retrieve phone number",'error');
      return false; // Return false for other errors
    }
  } catch (error) {
    console.error('Error fetching phone number:', error);
    return false; // Return false on error
  }
};


export const validateOldPasswordAction = async (userId:string, oldPassword:string) => {
  try {
    console.log('Received parameters in validateOldPassword:', { userId, oldPassword });

    const requestBody = { userId, oldPassword };
    const response = await api.post('/auth/validate-password', requestBody);

    if (response.status === 200) {
      // toast.success('Password matched');
      return { success: true, message: 'Password matched' };
    }
    else if (response.status === 206) {
      showToast('User not found or account is deleted','error');
      return { success: false, message: 'User not found or account is deleted' };
    }
  } catch (error:any) {
    // If response status is 401, it indicates an incorrect password
    if (error.response && error.response.status === 401) {
      showToast('Invalid password. Please try again.','error');
      return { success: false, message: 'Password does not match' };
    }
    // For any other error status
    showToast('An error occurred while validating password','error');
    console.error('Error validating password:', error);
    return { success: false, message: 'An error occurred while validating password' };
  }
};

export const setRoleAction = async () => {
  try {
    const response = await api.get('/user/set-role');
    console.log("rrrrrr", response)
    if (response.status === 200) {
      const isAdmin = response.data.isAdmin; // Will be 'admin' or 'no'
      console.log("aaad", isAdmin)
      await AsyncStorage.setItem('flow', isAdmin); // Store directly as 'admin' or 'no'
      console.log("role set is ", isAdmin);
      return response.data;
    
    }
  } catch (error) {
    console.error('Error setting role:', error);
  }
};

export const checkIsAdminAction = async () => {
  try {
    const socioIddd = await AsyncStorage.getItem('societyId');
    console.log("checkIsAdminAction socioIddd",socioIddd);
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