export const errorMessages = {
    INVALID_EMAIL: "Email is invalid.",
    EMAIL_REQUIRED: "Email is required.",
    PASSWORD_REQUIRED: "Password is required.",
    PASSWORD_INVALID:
        "Password must be at least 8 characters long & must contain at least one letter, one number & one special character.",
    UNKNOWN_ERROR: "Something Went wrong",
    ERROR_TO_JOIN: "Could not Process the Request",
    DUPLICATE_DESIGNATION: "This designation already exists.",
    UPDATE_DESIGNATION_FAILED: "Designation updated failed."
};

export const fieldRequiredErrorMessage = (name: string) => {
    return `${name} is required.`;
};
export const fieldMinLengthErrorMessage = (name: string, length: number) => {
    return `${name} should be at least ${length} characters.`;
};

export const fieldMaxLengthErrorMessage = (name: string, length: number) => {
    return `${name} cannot be more than ${length} characters.`;
};

export const successMessages = {
    LOGIN_SUCCESS: "Logged in successfully.",
    OTP_SENT: "OTP sent to your Mobile Number",
    OTP_VERIFIED: "OTP has been verified",
    SOCIETY_USER_REGISTER_SUCCESS: "Your account and society has been registered.",
    REGISTER_SUCCESS: "Your account and society has been registered.",
    DESIGNATION_SUCCESS: "Designation added successfully.",
    REQUEST_TO_JOIN: "Joining Link has been send to all the Members on the Mobile Number",
    DESIGNATION_UPDATE_SUCCESS: "Designation updated successfully."
};
