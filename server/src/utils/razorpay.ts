import Razorpay from "razorpay";
import dotenv from 'dotenv';
import { CONFIG } from "./config";

dotenv.config(); // Load environment variables from .env file

// Retrieve Razorpay credentials from environment variables
const keyId: string | undefined = CONFIG.RAZORPAY_KEY_ID;
const keySecret: string | undefined = CONFIG.RAZORPAY_KEY_SECRET;

if (keyId === undefined || keySecret === undefined) {
    throw new Error('Razorpay key ID or secret is undefined');
}

export const razorpay = new Razorpay({
    key_id: keyId, // Use the environment variable value
    key_secret: keySecret // Use the environment variable value
});

// Placeholder function, not used in this code
function getRazorKeyId(): string | undefined {
    throw new Error("Function not implemented.");
}
