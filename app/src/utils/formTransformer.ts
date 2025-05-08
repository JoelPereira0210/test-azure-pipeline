import { fileToBase64Native } from "./auth";



export const societyRegistrationTransformerApp = async (data: any) => {
    try {
        // console.log("File Data:", data.logo); // Debugging Output

           // Convert Image to Base64
    let base64Logo = null;
    if (data.logo) {
      base64Logo = await fileToBase64Native(data.logo);
    }

        const transformedData = {
            phoneNumber: data.phoneNumber || '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            gender: data.gender || '',
            flatNumber: data.flatNumber || '',
            buildingDoorNumber: data.buildingDoorNumber || '',
            address: data.address || '',
            streetName: data.streetName || '',
            country: data.country || '', 
            state: data.state || null,  
            pincode: data.pincode || '',
            password: data.password || '',
            isAdmin: data.isAdmin ?? false,  
            isMember: data.isMember ?? false,

            createSociety: [
                {
                    societyName: data.societyName || '',
                    societyDescription: data.societyDescription || '',
                    buildingName: data.buildingName || '',
                    buildingDoorNumber: data.societyBuildingDoorNumber || '',
                    address: data.societyAddress || '',
                    streetName: data.societyStreetName || '',
                    state: data.societyState || null, 
                    country: data.societyCountry || '', 
                    pincode: data.societyPincode || '',
                    logo: base64Logo,
                    membershipFees: data.isMembershipFees
                        ? {
                            amount: data.amount || 0,
                            bankDetails: {
                                bank: data.bank || '',
                                accountNumber: data.accountNumber || '',
                                IFSCCode: data.ifscCode || '',
                                accountName: data.accountName || '',
                                branchName: data.branchName || ''
                            }
                        }
                        : null, 
                }
            ]
        };

        // console.log("Transformed Data:", JSON.stringify(transformedData, null, 2)); 
        // console.log("Encoded Logo Data (First 100 characters):", base64Logo?.substring(0, 100) + "...");
        return transformedData;

    } catch (error) {
        console.error("Error transforming data:", error);
        throw error;
    }
};