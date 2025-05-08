import { errorMessages, successMessages } from '@/src/lib/constants/messages';
import toast from 'react-hot-toast';
import { api } from './api';
import { UserVerificationDataType } from '../lib/types/registerNumber.types';

export const getSocietyAction = async (societyId: string) => {
    try {
        // const response = await api.post("/auth/register-otp", data);
        const response = await api.get(`/society/restricted-society/${societyId}`);
        console.log('RRRR', response);
        if (response.status === 200) {
            console.log("SocietyData", response)
            // toast.success(successMessages.REQUEST_TO_JOIN);
        }
        return response;
    } catch (err: any) {
        toast.error(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR);
        return err;
    }
}
export const getInviteUserAction = async (params: string) => {
    try {
        const response = await api.get(`/user/invite-member-data/${params}`)
        if (response.status === 200) {
            console.log("getInviteUserAction", response)

            return response.data
        }
    } catch (error) {
        console.log("getInviteUserAction Error", error)
    }
}
export const verifySocietyUserAction = async (data: UserVerificationDataType) => {
    try {
        console.log('API', api);
        console.log('API URL:', process.env.NEXT_PUBLIC_BASE_URL);
        // const response = await api.post("/auth/register-otp", data);
        const response = await api.post(`/auth/user-register-otp`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('RRRR', response);
        toast.success(successMessages.OTP_SENT);
        return response;
    } catch (err: any) {
        console.log("ERRR", err)
        toast.error(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR);
        return err;
    }
};
// export const acceptUserAction = async (data: any) => {
//     try {
//         console.log('API', api.getUri());
//         console.log('API URL:', process.env.NEXT_PUBLIC_BASE_URL);
//         const response = await api.post('/auth/user-accept', data, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         toast.success(response?.data.message ?? successMessages.SOCIETY_USER_REGISTER_SUCCESS);
//         console.log("response", response)

//         return response;
//     } catch (error) {
//         console.log("Error", error)
//         toast.error(error?.response?.data.error ?? errorMessages.UNKNOWN_ERROR);
//     }
// }
export const acceptUserAction = async (data: any) => {
    try {
        console.log('API', api.getUri());
        console.log('API URL:', process.env.NEXT_PUBLIC_BASE_URL);

        // Make the API request
        const response = await api.post('/auth/user-accept', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check the response status and display appropriate toast messages
        if (response?.status === 200) {
            if (response?.data) {
                sessionStorage.setItem("user", JSON.stringify(response?.data?.data))
            }
            console.log("amoun", response.data.membershipFeeAmount
            )
            toast.success(
                response?.data.message ||
                "User Registration is Completed. Please Pay Membership Fees to unlock all the features of the App."
            );
        } else if (response?.status === 209) {
            if (response?.data) {
                sessionStorage.setItem("user", JSON.stringify(response?.data?.data))
            }
            toast.success(
                response?.data.message ||
                "User Registration is Completed."
            );
        }

        console.log("Response:", response);
        return response;
    } catch (error) {
        // Handle and log errors
        console.error("Error:", error);
        toast.error(
            error?.response?.data?.error ||
            "An unknown error occurred. Please try again later."
        );
    }
};



export const checkMembership = async () => {
    const storedSocietyId = sessionStorage.getItem('societyId');
    console.log("Society ID retrieved from sessionStorage:", storedSocietyId);

    if (!storedSocietyId) {
        toast.error("Society ID is not available in sessionStorage.");
        return;
    }

    try {
        const response = await api.get('/auth/checkMembership', {
            params: { storedSocietyId },
        });

        // Handle different response statuses
        if (response.status === 200) {
            console.log("Membership Fee Amount:", response.data.membershipFeeAmount);
            toast.success(response.data.message ?? "Membership fee is applicable.");
        } else if (response.status === 209) {
            console.log("No membership fee required no amount found.");
            // toast.info(response.data.message ?? "No membership fee is applicable.");
        }
    } catch (error) {
        console.log("Error:", error);
        toast.error(
            error?.response?.data?.message ?? "An unknown error occurred."
        );
    }
};




export const getSocietyDataAction = async (societyId) => {
    try {
        const response = await api.get(`/society`, {
            params: { societyId }
        });
        console.log("response API", response)
        return response;
    } catch (error) {
        console.log("ERRR", error)
    }

}
export const societySubscriptionAction = async (societyId) => {
    try {
        const response = await api.get(`society/${societyId}/subscription-details`);
        console.log("societySubscriptionAction API", response)
        return response?.data;
    } catch (error) {
        console.log("ERRR", error)
    }

}