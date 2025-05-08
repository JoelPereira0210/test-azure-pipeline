import { fileToBase64 } from "./auth";

export const societyRegistrationTransformer = async (data) => {
    console.log("file", process.env.NEXT_PUBLIC_BASE_URL, data.logo[0])
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
                logo: await fileToBase64(data?.logo[0]),
                membershipFees: data.isMembershipFees ? {
                    amount: data.amount,
                    bankDetails: {
                        bank: data.bank,
                        accountNumber: data.accountNumber,
                        IFSCCode: data.
                        ifscCode
                        ,
                        accountName: data.accountName,
                        branchName: data.branchName
                    }
                } : null // If isMembershipFees is false, membershipFees is null
            }
        ]
    };
    return transformedData;
}