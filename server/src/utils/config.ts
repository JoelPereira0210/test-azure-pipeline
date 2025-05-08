import dotenv from 'dotenv';

// Determine the current environment or default to 'development'
const env = process.env.NODE_ENV || 'development';

// Load the appropriate .env file
dotenv.config({ path: `.env.${env}` });

console.log(`Environment: ${env}`);

// You can also export commonly used environment variables here
export const CONFIG = {
    DATABASE_URL: process.env.DATABASE_URL,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    SECRET_KEY: process.env.SECRET_KEY,
    RAZORPAY_URL: process.env.RAZORPAY_URL,
    HDSOFT_ACC_NO: process.env.HDSOFT_ACC_NO
    // Add other environment variables as needed
};
