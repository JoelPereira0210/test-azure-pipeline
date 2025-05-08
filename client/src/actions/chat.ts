// import { api } from "./api";

// export const getChatsAction = async (societyId: string) => {
//     try {
//         // const response = await api.post("/auth/register-otp", data);
//         const response = await api.get(`/chats`, {
//             params: {
//                 societyId: societyId
//             }
//         });
//         console.log('RRRR', response.data);
//         if (response.status === 200) {
//             console.log("SSSS", response)
//             // toast.success(successMessages.REQUEST_TO_JOIN);
//         }
//         return response;
//     } catch (err: any) {
//         // toast.success("ssss");
//         // toast.error(err?.response?.data?.message ?? errorMessages.UNKNOWN_ERROR);
//         return err;
//     }
// };

import { api } from "./api";
export const getChatsAction = async (societyId: string, page: number = 1, limit: number = 15) => {
    try {
        const response = await api.get(`/chats`, {
            params: {
                societyId: societyId,
                page: page,        // Page number for pagination
                limit: limit       // Number of messages per page
            }
        });
        console.log('RRRR', response.data);
        if (response.status === 200) {
            return response;  // Return the response if successful
        }
    } catch (err: any) {
        console.error("Error fetching chat messages", err);
        return err;
    }
};