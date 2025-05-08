const axios = require('axios');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

export const sendSMS = async (phoneNumbers: any, variables: any, messageCode: string) => {
  // const API_KEY = 'by';

  // return true;
  return {
          success: true,
          // message: errorMessage,
          // error: data
        };
  // // Format phone numbers
  // const formattedNumbers = phoneNumbers.map((phone: any) => {
  //   const parsedPhoneNumber = parsePhoneNumberFromString(phone);
  //   if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
  //     // Format phone as a national (local) number without country code
  //     let formatted = parsedPhoneNumber.formatNational().replace(/\D/g, ''); // Remove non-numeric characters
  //     // Remove leading zero if it exists
  //     if (formatted.startsWith('0')) {
  //       formatted = formatted.substring(1);
  //     }
  //     return formatted;
  //   } else {
  //     throw new Error(`Invalid phone number format: ${phone}`);
  //   }
  // }).join(',');

  // console.log('Formatted Numbers:', formattedNumbers);

  // // Combine variables with a pipe "|" separator
  // const variablesValues = variables.join('|') + '|';

  // console.log('Variables Values:', variablesValues);

  // // Prepare the SMS data
  // const smsData = {
  //   route: 'dlt',
  //   sender_id: 'HDSTSM',
  //   message: messageCode,
  //   variables_values: variablesValues,
  //   flash: 0,
  //   numbers: formattedNumbers
  // };

  // try {
  //   const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', smsData, {
  //     headers: {
  //       Authorization: process.env.SMS_API_KEY,
  //       'Content-Type': 'application/json'
  //     }
  //   });

  //   console.log('SMS sent successfully:', response.data);
  //   return {
  //     success: true,
  //     message: 'SMS sent successfully',
  //     data: response.data
  //   };
  // } catch (error:any) {
  //   if (error.response) {
  //     const { status, data } = error.response;
  //     let errorMessage = 'Error sending SMS';

  //     if (status === 401) {
  //       errorMessage = 'Unauthorized: Invalid API key. Please verify your credentials.';
  //     } else if (status === 412) {
  //       errorMessage = 'Invalid request data. Please check the message format and route.';
  //     } else if (status === 400) {
  //       errorMessage = 'Bad request. Please verify all parameters.';
  //     } else {
  //       errorMessage = `Unexpected error: ${data.message || 'An error occurred'}`;
  //     }

  //     console.error('Error details:', data);
  //     return {
  //       success: false,
  //       message: errorMessage,
  //       error: data
  //     };
  //   } else {
  //     console.error('Network or unknown error:', error.message);
  //     return {
  //       success: false,
  //       message: 'Network error: Unable to send SMS. Please check your internet connection.',
  //       error: error.message
  //     };
  //   }
  // }
};
