import { SocietyRegisterRequest } from './../../types/society';
import express, { Request, Response } from 'express';
import {
  generateOTP,
  createPhoneNumber,
  compareString,
  hashString,
  createBase64,
  generateToken,
} from '../../utils/helperFunction';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import sharp from 'sharp';
import CryptoJS from 'crypto-js';
import { CONFIG } from '../../utils/config';
import { sendSMS } from '../../utils/sendSms';
const secretKey = CONFIG.SECRET_KEY;
const ifsc = require('ifsc');
const authRouter = express.Router();
const prisma = new PrismaClient();
import axios from 'axios';

import { safeJsonStringify } from '../../utils/helperFunction';
import { AuthenticatedRequest } from '../../middlewares/authorizeUser';

authRouter.post('/register-otp', async (req: Request, res: Response) => {
  const { phone_number } = req.body;
  const actionType = req.body.actionType;
  console.log('SSSSSSSSSSSSSSSSSSSSSSSphone_number', phone_number);
  try {
    const validatePhoneNumber = createPhoneNumber(phone_number);
    console.log('validatePhoneNumber', validatePhoneNumber);
    if (validatePhoneNumber) {
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes from now
      const hashedOTP = await hashString(otp);
      console.log('hashedOTP', hashedOTP);

      await prisma.oTP.create({
        data: {
          phoneNumber: validatePhoneNumber.number,
          otpCode: hashedOTP,
          expiry: expiresAt,
        },
      });
      console.log('otp', otp);

      let smsResponse = null;
      // Send the OTP via SMS
      try {
        if (actionType === 'confirmPhoneNumber') {
          smsResponse = await sendSMS(
            [validatePhoneNumber.number], // Pass phone number as an array
            [otp, 'Confirm new Phone Number'], // Pass OTP as a variable
            '176064'
          );
        } else {
          smsResponse = await sendSMS(
            [validatePhoneNumber.number], // Pass phone number as an array
            [otp], // Pass OTP as a variable
            '175681'
          );
        }

        console.log('SMS Response:', smsResponse);

        if (smsResponse.success) {
          res.status(200).json({ data: otp, message: 'OTP sent via SMS' });
        } else {
          res
            .status(500)
            .json({
              error: 'Failed to send OTP via SMS',
              details: smsResponse,
            });
        }
      } catch (smsError) {
        console.error('Error sending OTP via SMS:', smsError);
        res
          .status(500)
          .json({ error: 'Failed to send OTP via SMS', details: smsError });
      }
    } else {
      throw new Error('Invalid phone number');
    }
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message ===
        'Mobile Number must be exactly 10 numeric characters long'
      ) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error during OTP registration:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } finally {
    await prisma.$disconnect();
  }
});


authRouter.get('/check-membership', async (req, res) => {
  const { userId } = req.query; // Extract userId from query parameters

  console.log('Received User ID on Server:', userId); // Log the userId on the server

  try {
    // Query the database to find the status of the subscription
    const subscription = await prisma.subscriptionPayments.findFirst({
      where: { userId: String(userId) },
      select: { status: true },
    });

    if (subscription) {
      console.log('Subscription Status:', subscription.status); // Log the status to the console

      if (subscription.status === 'Completed') {
        return res.status(200).json({ message: 'User paid membership amount' });
      }
      if (subscription.status === 'Not Completed') {
        return res.status(209).json({ message: 'User has not paid membership amount' });  // Change to 400 or a different appropriate status
      }
    }
    else {
      console.log('No user found in subscriptionPayments for User ID:', userId);
      return res.status(309).json({ message: 'No subscription record found for the given User ID' });
    }

  } catch (error:any) {
    console.error('Error fetching subscription status:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});




authRouter.post('/user-register-otp', async (req: Request, res: Response) => {
  const { phoneNumber, societyId } = req.body;
  const society = await prisma.society.findUnique({
    where: { societyId },
  });
  console.log('SSSSSSSSSSSSSSSSSSSSSSSphone_number', phoneNumber);
  console.log('societySSSSS', society?.societyName);
  try {
    const validatePhoneNumber = createPhoneNumber(phoneNumber);
    console.log('validatePhoneNumber', validatePhoneNumber);
    if (!validatePhoneNumber) {
      throw 'Invalid Number';
    }
    const ActiveOrPendingOrAcceptedMembershipIds =
      await prisma.membershipStatus.findMany({
        where: {
          OR: [
            { status: 'Active' },
            { status: 'Invitation Pending' },
            { status: 'Accepted' },
          ],
        },
      });
    const membershipIds = ActiveOrPendingOrAcceptedMembershipIds.map(
      (item) => item.id
    );
    console.log('membershipIds', membershipIds);
    const user = await prisma.user.findUnique({
      where: { phoneNumber: phoneNumber },
    });
    console.log('user', user);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
 
    const isMembershipStatusValid = !user?.membershipStatusId || !membershipIds.includes(
      user.membershipStatusId
    );

    if (!isMembershipStatusValid) {
      return res.status(400).json({
        message: 'User with this phone number has already joined the society',
      });
    }
    const societyMember = await prisma.societyMember.findUnique({
      where: {
        userId_societyId: {
          userId: user?.userId,
          societyId: societyId, // Assuming you have societyId available
        },
      },
    });
    console.log('societyMember', societyMember);
    if (!societyMember) {
      return res.status(404).json({
        message: 'User not invited to the society',
      });
    }
    if (
      validatePhoneNumber &&
      societyMember &&
      isMembershipStatusValid &&
      user
    ) {
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes from now
      const hashedOTP = await hashString(otp);
      console.log('hashedOTP', hashedOTP);
      await prisma.oTP.create({
        data: {
          phoneNumber: validatePhoneNumber.number,
          otpCode: hashedOTP,
          expiry: expiresAt,
        },
      });
      console.log('otp', otp);
      // Send the OTP via SMS
      try {
        const smsResponse = await sendSMS(
          [validatePhoneNumber.number], // Pass phone number as an array
          [otp, society?.societyName], // Pass OTP as a variable
          '175991'
        );
        console.log('SMS Response:', smsResponse);

        if (smsResponse.success) {
          res.status(200).json({ data: otp, message: 'OTP sent via SMS' });
        } else {
          res
            .status(500)
            .json({
              error: 'Failed to send OTP via SMS',
              details: smsResponse,
            });
        }
      } catch (smsError) {
        console.error('Error sending OTP via SMS:', smsError);
        res
          .status(500)
          .json({ error: 'Failed to send OTP via SMS', details: smsError });
      }
    } else {
      throw new Error('Invalid phone number');
    }
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message ===
        'Mobile Number must be exactly 10 numeric characters long'
      ) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error during OTP registration:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } finally {
    await prisma.$disconnect();
  }
});

authRouter.post('/verify-register-otp', async (req: Request, res: Response) => {
  const { phone_number, otp } = req.body;
  console.log('OTP', otp);
  try {
    const dbOtp = await prisma.oTP.findFirst({
      where: {
        phoneNumber: phone_number,
        expiry: { gte: new Date() }, // Ensure OTP has not expired
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (dbOtp) {
      const isValidOTP = await compareString(otp, dbOtp.otpCode);
      console.log('isValidOTP', isValidOTP);
      if (isValidOTP) {
        await prisma.oTP.delete({
          where: { id: dbOtp.id },
        });
        res.status(200).json({
          data: { phone_number: dbOtp.phoneNumber },
          message: 'OTP verified successfully',
        });
      } else {
        res.status(400).json({ error: 'Invalid OTP' });
      }
    } else {
      console.log('db', dbOtp);
      res.status(400).json({ message: 'Invalid OTP or OTP expired' });
    }
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

// authRouter.post(
//   '/society-registration',
//   async (req: Request, res: Response) => {
//     const {
//       phoneNumber,
//       firstName,
//       lastName,
//       gender,
//       flatNumber,
//       buildingDoorNumber,
//       address,
//       state,
//       streetName,
//       country,
//       pincode,
//       password,
//       createSociety,
//     }: SocietyRegisterRequest = req.body;

//     const societyData = createSociety[0];
//     console.log('societyData', societyData);

//     try {
//       // Check if a society with the same combination of fields already exists
//       const result = await prisma.$transaction(async (prisma) => {
//         const existingSociety = await prisma.society.findFirst({
//           where: {
//             societyName: societyData.societyName,
//             buildingName: societyData.buildingName,
//             address: societyData.address,
//             streetName: societyData.streetName,
//             pincode: societyData.pincode,
//           },
//         });
//         console.log('existingSociety', existingSociety);

//         if (existingSociety) {
//           return res
//             .status(400)
//             .json({ error: 'A society with the same details already exists.' });
//         }

//         let createdUser: any = null;
//         let existingUser: any = null;

//         // Check if the user already exists
//         existingUser = await prisma.user.findUnique({
//           where: { phoneNumber },
//         });
//         if (!existingUser) {
//           // If user does not exist, create a new user
//           const hashedPassword = await hashString(password);

//           createdUser = await prisma.user.create({
//             data: {
//               phoneNumber,
//               firstName,
//               lastName,
//               gender,
//               flatNumber,
//               buildingDoorNumber,
//               address,
//               state,
//               streetName,
//               country,
//               pincode,
//               password: hashedPassword,
//               isAdmin: true,
//             },
//           });
//         } else {
//           console.log('Existing user found:', existingUser);
//           createdUser = existingUser; // Reuse existing user details
//         }

//         // Create the society
//         const createdSociety = await prisma.society.create({
//           data: {
//             societyName: societyData.societyName,
//             buildingName: societyData.buildingName,
//             description: societyData.societyDescription,
//             buildingDoorNumber: societyData.buildingDoorNumber,
//             address: societyData.address,
//             state: societyData.state,
//             streetName: societyData.streetName,
//             country: societyData.country,
//             pincode: societyData.pincode,
//             createdById: createdUser.userId,
//           },
//         });

//         // Create the super admin role
//         const societySuperAdmin = await prisma.committeeRoleMaster.create({
//           data: {
//             designationName: 'societySuperAdmin',
//             numberOfPositions: 1,
//             adminPrivileges: true,
//             createdById: createdUser.userId,
//             modifiedById: createdUser.userId,
//             isDeleted: false,
//             createdDate: new Date(),
//             modifiedDate: new Date(),
//             societyId: createdSociety.societyId,
//           },
//         });

//         // Create the member role
//         await prisma.committeeRoleMaster.create({
//           data: {
//             designationName: 'member',
//             numberOfPositions: -1,
//             adminPrivileges: false,
//             createdById: createdUser.userId,
//             modifiedById: createdUser.userId,
//             isDeleted: false,
//             createdDate: new Date(),
//             modifiedDate: new Date(),
//             societyId: createdSociety.societyId,
//           },
//         });

//         // Add user as a society member
//         await prisma.societyMember.create({
//           data: {
//             userId: createdUser.userId,
//             societyId: createdSociety.societyId,
//             roleId: societySuperAdmin?.designationId, // Assuming 1 is the role ID for 'societySuperAdmin'
//           },
//         });

//         // Update user's membership status if available
//         const membershipId = await prisma.membershipStatus.findFirst({
//           where: { status: 'Active' },
//         });

//         if (membershipId) {
//           await prisma.user.update({
//             where: { userId: createdUser.userId },
//             data: { membershipStatusId: membershipId.id },
//           });
//         }

//         // Handle membership fees and bank details
//         if (societyData.membershipFees) {
//           await prisma.bankDetails.create({
//             data: {
//               societyId: createdSociety.societyId,
//               bank: societyData.membershipFees.bankDetails.bank,
//               accountNumber:
//                 societyData.membershipFees.bankDetails.accountNumber,
//               IFSCCode: societyData.membershipFees.bankDetails.IFSCCode,
//               accountName: societyData.membershipFees.bankDetails.accountName,
//               branchName: societyData.membershipFees.bankDetails.branchName,
//               createdDate: new Date(),
//               createdById: createdUser.userId,
//               modifiedDate: new Date(),
//               modifiedById: createdUser.userId,
//               isDeleted: false,
//             },
//           });
//         }
//         return { createdSociety, createdUser };
//       });

//       // Step 3: Generate authToken for the registered user
//       const token = await generateToken(result.createdUser);

//       console.log('Auth token generated for user:', token);

//       if (societyData?.logo && result.createdSociety) {
//         try {
//           const logoBase64 = societyData.logo;
//           const [mediaTypePart, base64Data] = logoBase64.split(',');

//           if (mediaTypePart.includes('image')) {
//             const imageBuffer = Buffer.from(base64Data, 'base64');

//             // Use sharp to resize the image to be square and add a transparent background
//             const resizedImageBuffer = await sharp(imageBuffer)
//               .resize(512, 512, {
//                 fit: 'contain',
//                 background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
//               })
//               .png() // Ensure the output format supports transparency
//               .toBuffer();

//             // Create media entry in the database
//             const media = await prisma.media.create({
//               data: {
//                 type: 'image',
//                 data: resizedImageBuffer, // Save the resized image buffer
//                 tableId: result.createdSociety.societyId,
//                 tableType: 'society',
//               },
//             });

//             // Update the society with the logoId
//             await prisma.society.update({
//               where: { societyId: result.createdSociety.societyId },
//               data: { logoId: media.id },
//             });
//           }
//         } catch (err) {
//           console.error('Error processing the logo:', err);
//           return res.status(500).json({ error: 'Error processing logo' });
//         }
//       }



//       return res
//         .status(200)
//         .json({
//           message: 'Society Created',
//           society: (result.createdSociety),
//           user: (result.createdUser),
//           token,
//         });
//     } catch (error) {
//       console.error('Error during society registration:', error);
//       return res.status(500).json({ error: 'Internal server error' });
//     } finally {
//       await prisma.$disconnect();
//     }
//   }
// );

// authRouter.post('/change-password', async (req: Request, res: Response) => {
//   try {
//     const { userId, password, newPassword } = req.body;
//     console.log("response in change pass route",req.body)
//     console.log("pas",userId,password,newPassword)
//     const user = await prisma.user.findUnique({
//       where: { userId: userId },
//     });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     const passwordMatch = await compareString(password, user.password);
//     if (!passwordMatch) {
//       return res.status(400).json({ error: 'Old password is incorrect' });
//     }
//     const hashedPassword = await hashString(newPassword);
//     console.log('hashed', hashedPassword);
//     // Update the user with the new password
//     await prisma.user.update({
//       where: { userId: userId },
//       data: { password: hashedPassword },
//     });

//     res.status(200).json({ message: 'Password updated successfully' });
//   } catch (error) {
//     console.error('Error changing password:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   } finally {
//     await prisma.$disconnect();
//   }
// });

// authRouter.post('/login', async (req: Request, res: Response) => {
//   try {
//     const { phone_number, password } = req.body;
//     console.log(phone_number, password);
//     const user = await prisma.user.findFirst({
//       where: {
//         phoneNumber: phone_number,
//       },
//     });
//     console.log('user', user);
//     if (user) {
//       console.log('userasas');
//       console.log('user', user);
//       const passwordCompare = await compareString(password, user.password);
//       if (passwordCompare) {
//         const token = await generateToken(user);
//         console.log('token', token);

//         return res.json({
//           token,
//         });
//       } else {
//         return res.status(404).json({
//           message: 'Password Invalid or Wrong',
//         });
//       }
//     } else {
//       return res.status(404).json({
//         type: 'Error',
//         message: 'User Not Found',
//       });
//     }
//   } catch (error) {
//     console.log('ERRR', error);
//     return res.json(error);
//   }
// });


/* authRouter.post(
  '/society-registration',
  async (req: Request, res: Response) => {
    const {
      phoneNumber,
      firstName,
      lastName,
      gender,
      flatNumber,
      buildingDoorNumber,
      address,
      state: String(state),
      streetName,
      country: String(country),
      pincode,
      password,
      createSociety,
    }: SocietyRegisterRequest = req.body;

    const societyData = createSociety[0];
    console.log('societyData', societyData);

    try {
      // Check if a society with the same combination of fields already exists
      const result = await prisma.$transaction(async (prisma) => {

        const existingSociety = await prisma.society.findFirst({
          where: {
            societyName: societyData.societyName,
            buildingName: societyData.buildingName,
            address: societyData.address,
            streetName: societyData.streetName,
            pincode: societyData.pincode,
          },
        });

        console.log('existingSociety', existingSociety);

        if (existingSociety) {
          return res
            .status(400)
            .json({ error: 'A society with the same details already exists.' });
        }


        // let existingUser: any = null;

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
          where: { phoneNumber },
        });


        let createdUser;

        if (!existingUser) {
          console.log('No existing user found. Creating a new user...');

          // If user does not exist, create a new user
          const hashedPassword = await hashString(password);

          createdUser = await prisma.user.create({
            data: {
              phoneNumber,
              firstName,
              lastName,
              gender,
              flatNumber,
              buildingDoorNumber,
              address,
              state: String(state),
              streetName,
              country,
              pincode,
              password: hashedPassword,
              isAdmin: true,
            },
          });
        } else {
          // Check if there are changes and update the user record

          console.log('Existing user found. Skipping update and using existing data.');
          createdUser = existingUser; // Use the existing user as-is

        }


        // Create the society
        const createdSociety = await prisma.society.create({
          data: {
            societyName: societyData.societyName,
            buildingName: societyData.buildingName,
            description: societyData.societyDescription,
            buildingDoorNumber: societyData.buildingDoorNumber,
            address: societyData.address,
            state: String(societyData.state),
            streetName: societyData.streetName,
            country: societyData.country,
            pincode: societyData.pincode,
            createdById: createdUser.userId,
          },
        });

        // Create the super admin role
        const societySuperAdmin = await prisma.committeeRoleMaster.create({
          data: {
            designationName: 'societySuperAdmin',
            numberOfPositions: 1,
            adminPrivileges: true,
            createdById: createdUser.userId,
            modifiedById: createdUser.userId,
            isDeleted: false,
            createdDate: new Date(),
            modifiedDate: new Date(),
            societyId: createdSociety.societyId,
          },
        });

        // Create the member role
        await prisma.committeeRoleMaster.create({
          data: {
            designationName: 'member',
            numberOfPositions: -1,
            adminPrivileges: false,
            createdById: createdUser.userId,
            modifiedById: createdUser.userId,
            isDeleted: false,
            createdDate: new Date(),
            modifiedDate: new Date(),
            societyId: createdSociety.societyId,
          },
        });

        // Add user as a society member
        await prisma.societyMember.create({
          data: {
            userId: createdUser.userId,
            societyId: createdSociety.societyId,
            roleId: societySuperAdmin?.designationId, // Assuming 1 is the role ID for 'societySuperAdmin'
            isAdmin: true,
          },
        });

        // Update user's membership status if available
        const membershipId = await prisma.membershipStatus.findFirst({
          where: { status: 'Active' },
        });

        if (membershipId) {
          await prisma.user.update({
            where: { userId: createdUser.userId },
            data: { membershipStatusId: membershipId.id },
          });
        }
        console.log("bankkk", societyData.membershipFees?.bankDetails)
        // Handle membership fees and bank details
        if (societyData.membershipFees) {
          await prisma.bankDetails.create({
            data: {
              societyId: createdSociety.societyId,
              bank: societyData.membershipFees.bankDetails.bank,
              accountNumber:
                societyData.membershipFees.bankDetails.accountNumber,
              IFSCCode: societyData.membershipFees.bankDetails.IFSCCode,
              accountName: societyData.membershipFees.bankDetails.accountHolder,
              branchName: societyData.membershipFees.bankDetails.branchName,
              createdDate: new Date(),
              createdById: createdUser.userId,
              modifiedDate: new Date(),
              modifiedById: createdUser.userId,
              isDeleted: false,
            },
          });
          const membershipFeeAmount = societyData.membershipFees?.amount.toString(); // Convert to string
          await prisma.society.update({
            where: { societyId: createdSociety.societyId },
            data: {
              chargeMembershipFees: true,
              membershipFeeAmount: membershipFeeAmount, // Assign string value
            },
          });

        }
        return { createdSociety, createdUser };
      });

      // Step 3: Generate authToken for the registered user
      const token = await generateToken({
        ...result.createdUser,
        isMember: false, // Add default value for isMember
        createdSociety: false // Add default value for createdSociety
      });

      console.log('Auth token generated for user:', token);

      if (societyData?.logo && result.createdSociety) {
        try {
          const logoBase64 = societyData.logo;
          const [mediaTypePart, base64Data] = logoBase64.split(',');

          if (mediaTypePart.includes('image')) {
            const imageBuffer = Buffer.from(base64Data, 'base64');

            // Use sharp to resize the image to be square and add a transparent background
            const resizedImageBuffer = await sharp(imageBuffer)
              .resize(512, 512, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
              })
              .png() // Ensure the output format supports transparency
              .toBuffer();

            // Create media entry in the database
            const media = await prisma.media.create({
              data: {
                type: 'image',
                data: resizedImageBuffer, // Save the resized image buffer
                tableId: result.createdSociety.societyId,
                tableType: 'society',
              },
            });

            // Update the society with the logoId
            await prisma.society.update({
              where: { societyId: result.createdSociety.societyId },
              data: { logoId: media.id },
            });
          }
        } catch (err) {
          console.error('Error processing the logo:', err);
          return res.status(500).json({ error: 'Error processing logo' });
        }
      }



      return res
        .status(200)
        .json({
          message: 'Society Created',
          society: safeJsonStringify(result.createdSociety),
          user: safeJsonStringify(result.createdUser),
          token,
        });
    } catch (error) {
      console.error('Error during society registration:', error);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  }
); */


authRouter.post(
  '/society-registration',
  async (req: Request, res: Response) => {
    const {
      phoneNumber,
      firstName,
      lastName,
      gender,
      flatNumber,
      buildingDoorNumber,
      address,
      state,
      streetName,
      country,
      pincode,
      password,
      createSociety,
    }: SocietyRegisterRequest = req.body;

    const societyData = createSociety[0];
    console.log('societyData', societyData);

    try {
      // Using a Prisma transaction to ensure atomicity
      const result = await prisma.$transaction(async (prisma) => {
        const existingSociety = await prisma.society.findFirst({
          where: {
            societyName: societyData.societyName,
            buildingName: societyData.buildingName,
            address: societyData.address,
            streetName: societyData.streetName,
            pincode: societyData.pincode,
          },
        });

        if (existingSociety) {
          throw new Error('A society with the same details already exists.');
        }

        const existingUser = await prisma.user.findUnique({
          where: { phoneNumber },
        });

        let createdUser;

        if (!existingUser) {
          const hashedPassword = await hashString(password);
          createdUser = await prisma.user.create({
            data: {
              phoneNumber,
              firstName,
              lastName,
              gender,
              flatNumber,
              buildingDoorNumber,
              address,
              state: String(state),
              streetName,
              country: String(country),
              pincode,
              password: hashedPassword,
              isAdmin: true,
            },
          });
        } else {
          createdUser = existingUser;
        }

        const createdSociety = await prisma.society.create({
          data: {
            societyName: societyData.societyName,
            buildingName: societyData.buildingName,
            description: societyData.societyDescription,
            buildingDoorNumber: societyData.buildingDoorNumber,
            address: societyData.address,
            state: String(societyData.state),
            streetName: societyData.streetName,
            country: String(societyData.country),
            pincode: societyData.pincode,
            createdById: createdUser.userId,
          },
        });

        const societySuperAdmin = await prisma.committeeRoleMaster.create({
          data: {
            designationName: 'societySuperAdmin',
            numberOfPositions: 1,
            adminPrivileges: true,
            createdById: createdUser.userId,
            modifiedById: createdUser.userId,
            isDeleted: false,
            createdDate: new Date(),
            modifiedDate: new Date(),
            societyId: createdSociety.societyId,
          },
        });

        await prisma.committeeRoleMaster.create({
          data: {
            designationName: 'member',
            numberOfPositions: -1,
            adminPrivileges: false,
            createdById: createdUser.userId,
            modifiedById: createdUser.userId,
            isDeleted: false,
            createdDate: new Date(),
            modifiedDate: new Date(),
            societyId: createdSociety.societyId,
          },
        });

        await prisma.societyMember.create({
          data: {
            userId: createdUser.userId,
            societyId: createdSociety.societyId,
            roleId: societySuperAdmin.designationId,
            isAdmin: true,
          },
        });

        const membershipId = await prisma.membershipStatus.findFirst({
          where: { status: 'Active' },
        });

        if (membershipId) {
          await prisma.user.update({
            where: { userId: createdUser.userId },
            data: { membershipStatusId: membershipId.id },
          });
        }

        if (societyData.membershipFees) {
          const bankDetail = await prisma.bankDetails.create({
            data: {
              societyId: createdSociety.societyId,
              bank: societyData.membershipFees.bankDetails.bank,
              accountNumber: societyData.membershipFees.bankDetails.accountNumber,
              IFSCCode: societyData.membershipFees.bankDetails.IFSCCode,
              accountName: societyData.membershipFees.bankDetails.accountName,
              branchName: societyData.membershipFees.bankDetails.branchName,
              createdDate: new Date(),
              createdById: createdUser.userId,
              modifiedDate: new Date(),
              modifiedById: createdUser.userId,
              isDeleted: false,
            },
          });

          const razData = {
            name: societyData.societyName,
            contact: createdUser.phoneNumber,
            type: 'vendor',
          };

          const razorpayResponse = await axios.post(
            `${CONFIG.RAZORPAY_URL}/contacts`,
            razData,
            {
              headers: {
                Authorization: `Basic ${Buffer.from(
                  `${CONFIG.RAZORPAY_KEY_ID}:${CONFIG.RAZORPAY_KEY_SECRET}`
                ).toString('base64')}`,
              },
            }
          );

          const fundAccountRequestData = {
            contact_id: razorpayResponse.data.id,
            account_type: 'bank_account',
            bank_account: {
              name: societyData.societyName,
              ifsc: bankDetail.IFSCCode,
              account_number: bankDetail.accountNumber,
            },
          };

          const fundAccountResponse = await axios.post(
            `${CONFIG.RAZORPAY_URL}/fund_accounts`,
            fundAccountRequestData,
            {
              headers: {
                Authorization: `Basic ${Buffer.from(
                  `${CONFIG.RAZORPAY_KEY_ID}:${CONFIG.RAZORPAY_KEY_SECRET}`
                ).toString('base64')}`,
              },
            }
          );

          await prisma.bankDetails.update({
            where: { id: bankDetail.id },
            data: {
              contactId: razorpayResponse.data.id,
              fundAccount: fundAccountResponse.data.id,
            },
          });

          await prisma.society.update({
            where: { societyId: createdSociety.societyId },
            data: {
              chargeMembershipFees: true,
              membershipFeeAmount: societyData.membershipFees.amount.toString(),
            },
          });
        }

        return { createdSociety, createdUser };
      });

      const token = await generateToken(result.createdUser);

      if (societyData.logo && result.createdSociety) {
        try {
          const logoBase64 = societyData.logo;
          const [mediaTypePart, base64Data] = logoBase64.split(',');

          if (mediaTypePart.includes('image')) {
            const imageBuffer = Buffer.from(base64Data, 'base64');

            const resizedImageBuffer = await sharp(imageBuffer)
              .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
              .png()
              .toBuffer();

            const media = await prisma.media.create({
              data: {
                type: 'image',
                data: resizedImageBuffer,
                tableId: result.createdSociety.societyId,
                tableType: 'society',
              },
            });

            await prisma.society.update({
              where: { societyId: result.createdSociety.societyId },
              data: { logoId: media.id },
            });
          }
        } catch (err) {
          console.error('Error processing the logo:', err);
          return res.status(500).json({ error: 'Error processing logo' });
        }
      }

      return res.status(200).json({
        message: 'Society Created',
        society: safeJsonStringify(result.createdSociety),
        user: safeJsonStringify(result.createdUser),
        token,
      });
    } catch (error) {
      console.error('Error during society registration:', error);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  }
);


authRouter.post('/change-password', async (req: Request, res: Response) => {
  try {
    const { userId, newPassword } = req.body;
    console.log('Received data in change-password route:', req.body);

    // Fetch the user from the database by userId to confirm existence
    const user = await prisma.user.findUnique({
      where: { userId: userId },
    });

    if (!user || user.isDeleted) {
      console.log('User not found or account is deleted');
      return res
        .status(404)
        .json({ error: 'User not found or account is deleted' });
    }

    // Hash the new password
    const hashedPassword = await hashString(newPassword);

    // Update the user's password in the database
    await prisma.user.update({
      where: { userId: userId },
      data: { password: hashedPassword },
    });

    console.log('Password updated successfully');
    return res.status(209).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

authRouter.post('/change-phoneNumber', async (req: Request, res: Response) => {
  try {
    const { userId, newMobileNumber } = req.body;
    console.log('Received data in change-password route:', req.body);

    // Fetch the user from the database by userId to confirm existence
    const user = await prisma.user.findUnique({
      where: { userId: userId },
    });

    if (!user || user.isDeleted) {
      console.log('User not found or account is deleted');
      return res
        .status(404)
        .json({ error: 'User not found or account is deleted' });
    }

    // Update the user's password in the database
    await prisma.user.update({
      where: { userId: userId },
      data: { phoneNumber: newMobileNumber },
    });

    console.log('Mobile number updated successfully');
    return res
      .status(209)
      .json({ message: 'Mobile number updated successfully' });
  } catch (error) {
    console.error('Error changing number:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

authRouter.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { userId, newPassword } = req.body;
    console.log('Received data in change-password route:', req.body);

    // Fetch the user from the database by userId
    const user = await prisma.user.findUnique({
      where: { userId: userId },
    });

    if (!user || user.isDeleted) {
      console.log('User not found or account is deleted');
      return res
        .status(206)
        .json({ error: 'User not found or account is deleted' });
    }

    // Use hashString to hash the new password
    const hashedPassword = await hashString(newPassword);

    // Update the user's password in the database
    await prisma.user.update({
      where: { userId: userId },
      data: { password: hashedPassword },
    });

    return res.status(209).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

authRouter.post('/fetch-phone-number', async (req: Request, res: Response) => {
  try {
    const { userId, actionType } = req.body;
    console.log('Received data in fetch-phone-number route:', req.body);

    // Fetch the user by userId
    const user = await prisma.user.findUnique({
      where: { userId: userId, isDeleted: false }, // Adjust this according to your user model's primary key
      select: { phoneNumber: true }, // Select only the phoneNumber field
    });

    if (user) {
      console.log('User phone number:', user.phoneNumber);

      const otp = generateOTP(); // Function to generate OTP
      const expiresAt = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes
      const hashedOTP = await hashString(otp);
      console.log('Generated OTP:', otp);

      // Store the OTP in the OTP table
      await prisma.oTP.create({
        data: {
          phoneNumber: user.phoneNumber,
          otpCode: hashedOTP,
          expiry: expiresAt,
        },
      });

      // Send the OTP via SMS
      try {
        const smsResponse = await sendSMS(
          [user.phoneNumber], // Pass phone number as an array
          [otp, actionType], // Pass OTP as a variable
          '176064' // Template message code
        );

        console.log('SMS Response:', smsResponse);

        if (smsResponse) {
          res
            .status(200)
            .json({
              message: 'Phone number retrieved and OTP sent successfully',
              phoneNumber: user.phoneNumber,
            });
        } else {
          res.status(500).json({
            error: 'Failed to send OTP via SMS',
            details: smsResponse,
          });
        }
      } catch (smsError) {
        console.error('Error sending OTP via SMS:', smsError);
        res.status(500).json({
          error: 'Failed to send OTP via SMS',
          details: smsError,
        });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error in fetch-phone-number route:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    // Ensure Prisma disconnects after the operation
    await prisma.$disconnect();
  }
});

authRouter.post('/validate-password', async (req: Request, res: Response) => {
  try {
    const { userId, oldPassword } = req.body;
    console.log('Received data in validate-password route:', req.body);

    const user = await prisma.user.findUnique({
      where: { userId: userId },
    });

    if (!user || user.isDeleted) {
      console.log('User not found or account is deleted');
      return res
        .status(206)
        .json({ error: 'User not found or account is deleted' });
    }

    if (!user.password) {
      console.log('User password is not set');
      return res.status(400).json({ error: 'Password not set for this user' });
    }

    const isPasswordMatch = await compareString(oldPassword, user.password);

    if (isPasswordMatch) {
      console.log('Password matched');
      return res.status(200).json({ message: 'Password matched' });
    } else {
      console.log('Incorrect password');
      return res.status(401).json({ error: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error validating password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone_number, password } = req.body;
    console.log('phone_number, password', phone_number, password);
    const user = await prisma.user.findFirst({
      where: {
        phoneNumber: phone_number,
      },
    });
    console.log('user ', user);
    if (user && user.password) {
      const passwordCompare = await compareString(password, user.password);

      if (passwordCompare) {
        const token = await generateToken(
          user    
        );
        console.log('token', token);

        // Fetch societyId associated with the user, if applicable
        const societyMember = await prisma.societyMember.findMany({
          where: {
            userId: user.userId,
          },
          include: {
            society: true,
          },
        });

        const societies = societyMember.map((membership) => membership.society);

        if (user.phoneNumber === '+919130681854') {
          return res.json({
            token,
            isSuperAdmin: true,
          });
        }

        // if (societyMember) {
        //   console.log(
        //     'User is a member of society with ID:',
        //     societyMember.society.societyId
        //   );
        // }


        const serializedSocieties = societies.map((society) =>
          JSON.parse(
            JSON.stringify(society, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
          )
        );

        return res.json({
          token,
          societies: serializedSocieties,
        });
      } else {
        return res.status(404).json({
          message: 'Invalid password',
        });
      }
    } else {
      return res.status(404).json({
        type: 'Error',
        message: 'User Not Found',
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

authRouter.get('/subscriptions', async (req: Request, res: Response) => {
  try {
    const subscriptions = await prisma.subscriptionMaster.findMany({
      where: { shouldPublish: true, isDeleted: 'NOT_DELETED' },
    });
    console.log('subscriptions', subscriptions);
    return res.status(200).json(subscriptions);
  } catch (error) {
    return res.status(500).json(error);
  }
});
cron.schedule('*/10 * * * *', async () => {
  // Runs every 10 minutes
  try {
    await prisma.oTP.deleteMany({
      where: {
        expiry: { lt: new Date() },
      },
    });
    console.log('Expired OTPs cleaned up.');
  } catch (error) {
    console.error('Error during OTP cleanup:', error);
  }
});

// authRouter.post('/user-accept', async (req: Request, res: Response) => {
//   try {
//     const { phoneNumber, societyId, password } = req.body;
//     console.log("data in action me",req.body)
//     const hashedPassword = await hashString(password);
//     let user = await prisma.user.findUnique({
//       where: { phoneNumber }
//     })
//     console.log("USER", user)
//     const society = await prisma.society.findUnique({
//       where: { societyId }
//     })
//     console.log("co", society)
//     if (society?.chargeMembershipFees === true) {
//       const acceptedMembershipId = await prisma.membershipStatus.findFirst({
//         where: {
//           status: 'Accepted'
//         }
//       });
//       if (acceptedMembershipId) {
//         user = await prisma.user.update({
//           where: {
//             userId: user?.userId,
//           },
//           data: {
//             password: hashedPassword,
//             membershipStatusId: acceptedMembershipId.id,
//           },
//         });
//       }
//       const societyMember = await prisma.societyMember.update({
//         where: {
//           userId_societyId: { userId: user?.userId, societyId: societyId },
//         },
//         data: {
//           inviteCode: null,
//         },
//       })
//       res.status(200).json({ message: "User Registration is Completed Please Pay Membership Fees to unlock all the features of the App" })

//     } else {
//       const ActiveMembershipId = await prisma.membershipStatus.findFirst({
//         where: {
//           status: 'Active'
//         }
//       });
//       if (ActiveMembershipId) {
//         user = await prisma.user.update({
//           where: {
//             userId: user?.userId,
//           },
//           data: {
//             password: hashedPassword,
//             membershipStatusId: ActiveMembershipId.id,
//           },
//         });
//         const societyMember = await prisma.societyMember.update({
//           where: {
//             userId_societyId: { userId: user?.userId, societyId: societyId },
//           },
//           data: {
//             inviteCode: null,
//           },
//         })

//       }
//       res.status(209).json({ message: "User Registration is Completed" })

//     }

//     console.log("USER", user)

//   } catch (error) {
//     console.log("error", error)
//     res.status(500).json({ message: "Internal Server Error" })
//   }
// });

authRouter.post('/user-accept', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, societyId, password } = req.body;
    console.log("data in action me", req.body);
    const hashedPassword = await hashString(password);

    // Fetch user details
    let user = await prisma.user.findUnique({
      where: { phoneNumber }
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch society details including membershipFeeAmount
    const society = await prisma.society.findUnique({
      where: { societyId },
      select: {
        chargeMembershipFees: true,
        membershipFeeAmount: true,
      },
    });
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    console.log("Society Details:", society);

    if (society?.chargeMembershipFees) {
      // Fetch Accepted membership status
      const acceptedMembership = await prisma.membershipStatus.findFirst({
        where: { status: 'Accepted' }
      });
      console.log("accepted", acceptedMembership)
      if (!acceptedMembership) {
        return res.status(404).json({ message: "Accepted membership status not found" });
      }

      // Update user and society member data
      user = await prisma.user.update({
        where: { userId: user.userId },
        data: {
          password: hashedPassword,
          membershipStatusId: Number(acceptedMembership.id),
        },
      });

      await prisma.societyMember.update({
        where: { userId_societyId: { userId: user.userId, societyId } },
        data: { inviteCode: null },
      });

      res.status(200).json({
        message: `User Registration is Completed. Please Pay Membership Fees to unlock all the features of the App.`,
        membershipFeeAmount: society.membershipFeeAmount, // Passing the amount in response
      });
    } else {
      console.log("ELSE")

      // Fetch Active membership status
      const activeMembership = await prisma.membershipStatus.findFirst({
        where: { status: 'Active' }
      });
      console.log("activeMembership", Number(activeMembership?.id))
      console.log("HHHHHH")

      if (!activeMembership) {
        return res.status(404).json({ message: "Active membership status not found" });
      }
      console.log("IIIIIII")
      // Update user and society member data
      user = await prisma.user.update({
        where: { userId: user.userId },
        data: {
          password: hashedPassword,
          membershipStatusId: Number(activeMembership?.id),
        },
      });
      console.log("JJJJJ")
      await prisma.societyMember.update({
        where: { userId_societyId: { userId: user.userId, societyId } },
        data: { inviteCode: null },
      });

      res.status(209).json({ data: safeJsonStringify(user), message: "User Registration is Completed" });
    }

    console.log("USER", user);
  } catch (error) {
    console.log("errordasdadada", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



authRouter.get('/checkMembership', async (req: Request, res: Response) => {
  try {
    const { storedSocietyId } = req.query; // Extract query parameters
    const societyId = typeof storedSocietyId === 'string' ? storedSocietyId.replace(/['"]+/g, '') : '';

    console.log("Data received from query parameters:", req.query);

    if (!societyId) {
      return res.status(400).send({ message: 'societyId is required' });
    }

    // Query the society table to find a match
    const society = await prisma.society.findUnique({
      where: { societyId },
      select: {
        societyId: true,
        chargeMembershipFees: true,
        membershipFeeAmount: true,
      },
    });

    if (society) {
      console.log("Matched societyId:", societyId);

      // Check the value of chargeMembershipFees and respond accordingly
      if (society.chargeMembershipFees) {
        console.log("There is an amount present.");
        console.log("Membership Fee Amount:", society.membershipFeeAmount);
        return res.status(200).send({
          message: 'Membership fee is required',
          membershipFeeAmount: society.membershipFeeAmount,
        });
      } else {
        console.log("No amount.");
        return res.status(209).send({ message: 'No membership fee required' });
      }
    } else {
      console.log("No societyId matched");
      return res.status(404).send({ message: 'No societyId matched' });
    }
  } catch (error) {
    console.error("Error checking societyId:", error);
    res.status(500).send({ message: 'Internal server error' });
  }
});



authRouter.post('/create-designation', async (req: AuthenticatedRequest, res: Response) => {
  const { designationName, numberOfPositions, adminPrivileges } = req.body;

  // Log the received data
  console.log('Received data:', {
    designationName,
    numberOfPositions,
    adminPrivileges,
  });

  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'User not authenticated'
    });
  }


  try {
    // Validate input using your schema
    // const parsed = designationSchema.parse({
    //   designationName,
    //   numberOfPositions,
    //   adminPrivileges,
    // });

    // Log the parsed data
    // console.log('Validated and parsed data:', parsed);

    // Create a new designation
    const newDesignation = await prisma.committeeRoleMaster.create({
      data: {
        // designationName: parsed.designationName,
        // numberOfPositions: parsed.numberOfPositions,
        // adminPrivileges: parsed.adminPrivileges,
        designationName: designationName,
        numberOfPositions: numberOfPositions,
        adminPrivileges: adminPrivileges,

        createdDate: new Date(),
        modifiedDate: new Date(),
        isDeleted: false,
        // createdById: req.user?.id ?? '',
        // modifiedById: req.user?.id ?? '',
        createdById: req.user?.id ,
        modifiedById: req.user?.id ,
      },
    });

    res
      .status(201)
      .json({
        data: newDesignation,
        message: 'Designation created successfully',
      });
  } catch (error) {
    if (error instanceof Error) {
      // Handle validation errors or other known errors
      if (error.message.includes('Validation error')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error during designation creation:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } finally {
    await prisma.$disconnect(); // Ensure to disconnect properly based on your setup
  }
});

authRouter.get(
  '/check-superadmin',
  // authenticateToken,
  // authenticateRole,
  async (req: Request, res: Response) => {
    const encryptedSocietyId = req.query.societyId as string;
    const userId = req.query.userId as string;
    console.log('uidddss', userId);
    console.log('sssss', encryptedSocietyId);
    // if (!encryptedSocietyId || !userId) {
    //     return res.status(400).json({ error: 'societyId and userId are required' });
    // }

    try {
      // Ensure encryptedSocietyId and secretKey are defined before decrypting
      if (!encryptedSocietyId || !secretKey) {
        throw new Error('Society ID or secret key is missing');
      }

      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);
      console.log('ssiddd', societyId);

      if (!societyId) {
        return res.status(400).json({ error: 'Failed to decrypt society ID' });
      }

      console.log('Decrypted Society ID:33', societyId);
      console.log('uidsid', userId, societyId);
      // Fetch the societyMember record for the user and society
      const societyMember = await prisma.societyMember.findFirst({
        where: {
          userId: userId,
          societyId: societyId,
        },
        select: {
          roleId: true,
        },
      });
      console.log('ssmen', societyMember);
      if (!societyMember) {
        return res.status(408).json({ error: 'User not found in the society' });
      }

      const { roleId } = societyMember;

      // Fetch the role from CommitteeRoleMaster table using roleId
      const committeeRole = await prisma.committeeRoleMaster.findUnique({
        where: { designationId: roleId },
        select: { designationName: true },
      });

      if (!committeeRole) {
        return res
          .status(404)
          .json({ error: 'Role not found in CommitteeRoleMaster' });
      }

      // Check if the user has the societySuperAdmin role
      const isSuperAdmin =
        committeeRole.designationName === 'societySuperAdmin';

      // Return the result
      return res.status(200).json({ isSuperAdmin });
    } catch (error) {
      console.error('Error checking societySuperAdmin status:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  }
);

authRouter.post(
  '/ifscbankformdetails',

  async (req: Request, res: Response) => {
    try {
      // Retrieve the IFSC code from the request body
      const { ifscCode } = req.body;
      console.log('Received IFSC Code:', ifscCode);

      if (!ifscCode) {
        return res.status(400).json({ error: 'IFSC code is required' });
      }

      if (ifsc.validate(ifscCode)) {
        console.log('IFSC is validated');

        // Fetch the bank details using the IFSC code
        const details = await ifsc.fetchDetails(ifscCode);

        const { BANK, BRANCH } = details;

        // Send the response with the bank name and branch name
        return res.status(200).json({
          message: 'IFSC code is valid',
          bankName: BANK,
          branchName: BRANCH,
        });
      } else {
        console.log('IFSC is not valid');
        return res.status(408).json({ error: 'Invalid IFSC code' });
      }
    } catch (error) {
      console.error('Error processing IFSC code:', error);
      res.status(500).json({ message: 'Failed to process IFSC code' });
    }
  }
);


authRouter.get('/check-user', async (req: Request, res: Response) => {
  const { phoneNumber } = req.query;

  try {

    const user = await prisma.user.findUnique({
      where: { phoneNumber: String(phoneNumber) },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        flatNumber: true,
        buildingDoorNumber: true,
        address: true,
        state: true,
        streetName: true,
        country: true,
        pincode: true,
        gender: true,
        isAdmin: true,
        // password:true
        // Exclude password and any other sensitive data
      },
    });

    console.log("user found in check user", user);
    if (user) {
      // Sanitize BigInt fields
      const sanitizedUser = JSON.parse(
        JSON.stringify(user, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      );
      return res.status(200).json({ exists: true, user: sanitizedUser });
    }

    return res.status(200).json({ exists: false, user: null }); // User does not exist
  } catch (error) {
    console.error("Error checking user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

authRouter.post('/fetch-states', async (req: Request, res: Response) => {
  try {
    const { country } = req.body;

    // Validate input
    if (!country) {
      return res.status(400).json({ error: true, message: 'Country is required' });
    }

    // API Request to fetch states
    const response = await axios.post('https://countriesnow.space/api/v0.1/countries/states', {
      country,
    });

    // Check API response
    if (!response.data || response.data.error) {
      return res.status(404).json({ error: true, message: 'No states found for this country' });
    }

    // Send successful response
    return res.status(200).json({
      error: false,
      message: `States in ${country} retrieved successfully`,
      data: response.data.data.states, // Extracting states array
    });

  } catch (err) {
    console.error('Error fetching states:', err);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

export default authRouter;

