/** @type {import('next').NextConfig} */
import nextPWA from 'next-pwa';
import path from 'path';
import { env } from 'process';
import { fileURLToPath } from 'url';

// Convert the current file URL to a file path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name from the file path
const __dirname = path.dirname(__filename);

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    env: {
        NEXT_PUBLIC_BASE_URL: 'https://socitey-backend-docker-aeg3fwbjdpdgc0fv.centralindia-01.azurewebsites.net/api',
        NEXT_PUBLIC_RAZORPAY_KEY_ID: "rzp_test_KJC59YcI9b7ra5",//HDSOFT
        // SECRET_KEY: 'your-very-secure-key-12345'
        SECRET_KEY: 'societyZ1@samudaay*31',
        NEXT_PUBLIC_MAIN_DOMAIN: 'stagingsocietyapp-dydrbzaqfnd7fqhd.centralindia-01.azurewebsites.net'
    },
    eslint: {
        // Completely ignore ESLint during both build and dev
        ignoreDuringBuilds: true,
    }
};

const withPWA = nextPWA({
    dest: 'public',
    register: true,
    skipWaiting: true
})(nextConfig);

export default withPWA;
