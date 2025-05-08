import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';
import {
  generateOTP,
  createPhoneNumber,
  compareString,
  hashString,
  createBase64,
  encryptValues,
  // safeJsonStringify,
  encryptShortCode,
} from '../../utils/helperFunction';
import { CONFIG } from '../../utils/config';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import {
  authenticateRole,
  authenticateToken,
  AuthenticatedRequest
} from '../../middlewares/authorizeUser';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { sendSMS } from '../../utils/sendSms';
import { off } from 'process';
const env = process.env.NODE_ENV || 'development';
const secretKey = CONFIG.SECRET_KEY;

// Load the appropriate .env file
dotenv.config({ path: `.env.${env}` });
const userRouter = express.Router();
const prisma = new PrismaClient();

function safeJsonStringify(obj: any) {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value // Convert BigInt to String
  );
}

// userRouter.get('/', authenticateToken, async (req: any, res: Response) => {
//   console.log('ENV', process.env.SALT_ROUNDS);
//   try {
//     const userId = req.user.id;
//     // console.log("uid", userId)
//     const user = await prisma.user.findUnique({
//       where: { userId },
//       include: {
//         Society: true,
//         societyMembers: {
//           include: {
//             society: true,
//           },
//         },
//       },
//     });
//     console.log("SUER", JSON.parse(safeJsonStringify(user)))
//     return res.json(JSON.parse(safeJsonStringify(user)));
//   } catch (error) {
//     console.log("error", error)
//     return res.json({ error: error });
//   }
// });

userRouter.get('/', authenticateToken, async (req: any, res: Response) => {
  console.log('ENV', process.env.SALT_ROUNDS);
  try {
    const userId = req.user.id;

    // Fetch user details including associated Society and societyMembers data
    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        Society: true,
        societyMembers: {
          include: {
            society: true,
          },
        },
      },
    });
    console.log("USSSSS", user)
    // If the user is found, retrieve their profile picture
    if (user) {
      const profilePicRecord = await prisma.media.findFirst({
        where: {
          tableId: user.userId,
          tableType: 'user', // Ensure this matches your tableType for users
          type: 'image', // Fetching image type media
        },
        select: {
          data: true, // Fetch the image data
        },
      });

      // Convert the image data to a Base64 string if it exists
      const profilePicture = profilePicRecord
        ? `data:image/png;base64,${profilePicRecord.data.toString('base64')}`
        : null;

      // Add the profile picture to the user object
      const userWithProfilePic = {
        ...user,
        profilePicture: profilePicture, // Add profilePicture to user details
      };

      console.log('User with Profile Picture:', JSON.parse(safeJsonStringify(userWithProfilePic)));

      // Respond with the user details, including the profile picture
      return res.json(JSON.parse(safeJsonStringify(userWithProfilePic)));
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

userRouter.get('/user-details', authenticateToken, async (req: any, res: Response) => {
  // console.log('ENV', process.env.SALT_ROUNDS);
  try {
    const userId = req.user.id;
    console.log("userId user-details", userId)
    let user = await prisma.user.findUnique({
      where: { userId },
      include: {
        Society: true,
        societyMembers: {
          include: {
            society: true,
          },
        },
      },
    });
    let finalUser = user as any;
    if (user?.profilePictureId) {
      const media = await prisma.media.findUnique({
        where: {
          id: user?.profilePictureId
        }

      })
      const picture = media?.data ? Buffer.from(media.data).toString('base64') : null;
      console.log("picuture", picture)
      if (finalUser) {
        finalUser.picture = picture;
      }
    }
    console.log("Final", finalUser)
    return res.status(200).json(JSON.parse(safeJsonStringify(finalUser)));
    // return res.status(200).json(finalUser);
  } catch (error) {
    console.log("error", error)
    return res.status(500).json({ error: error });
  }
});

userRouter.post(
  '/invite-members',
  authenticateToken,
  authenticateRole,
  async (req: Request, res: Response) => {
    try {
      // const newMembers = req.body;
      const { societyId: encryptedSocietyId, newMembers } = req.body;

      if (!encryptedSocietyId || !Array.isArray(newMembers)) {
        return res.status(400).json({ message: 'Invalid payload' });
      }

      if (!encryptedSocietyId || !secretKey) {
        throw new Error('Society ID or secret key is missing');
      }

      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      if (!societyId) {
        throw new Error('Failed to decrypt society ID');
      }

      console.log("invite-members societyId", societyId);
      console.log("invite-members newMembers", newMembers);

      let urls: string[] = [];
      let checkedData = [];
      // const societyId = req?.role?.societyId;
      const society = await prisma.society.findUnique({
        where: { societyId },
      });
      // console.log('COde', society?.country?.phone_code);
      interface CountryData {
        phone_code: string;
        [key: string]: any;
      }
      const countryData = typeof society?.country === 'object' ? society?.country as CountryData : null;
      const societyCountryCode = countryData?.phone_code;
      for (let i = 0; i < newMembers.length; i++) {
        const { mobileNumber, firstName, lastName } = newMembers[i];

        // Parse the phone number using libphonenumber-js
        const phoneNumber = parsePhoneNumberFromString(mobileNumber);

        if (!phoneNumber || !phoneNumber.isValid()) {
          // Add society country code if phone number is incomplete
          const SocietyCountryCodeMobileNumber = `+${societyCountryCode}${mobileNumber}`;
          const newPhoneNumber = parsePhoneNumberFromString(
            SocietyCountryCodeMobileNumber
          );

          const newNumber = newPhoneNumber?.number;

          if (!newPhoneNumber || !newPhoneNumber.isValid()) {
            // If the phone number is invalid, add it to checkedData with an error message
            checkedData.push({
              mobileNumber,
              firstName,
              lastName,
              error: 'Invalid phone number format',
            });
          } else {
            // Check if the number is already present in the society
            const existingMember = await prisma.societyMember.findFirst({
              where: {
                societyId: societyId,
                user: {
                  phoneNumber: newNumber, // Compare with phone number in User table
                },
              },
            });

            if (existingMember) {
              // Phone number already exists in the society
              checkedData.push({
                mobileNumber: newNumber,
                firstName,
                lastName,
                error: 'Phone number already present in the society',
              });
            } else {
              // Phone number is valid and not a duplicate
              checkedData.push({
                mobileNumber: newNumber,
                firstName,
                lastName,
                error: null,
              });
            }
          }
          continue;
        } else {
          // Check if the parsed phone number already exists in the society
          const existingMember = await prisma.societyMember.findFirst({
            where: {
              societyId: societyId,
              user: {
                phoneNumber: phoneNumber.number, // Use the parsed phone number
              },
            },
          });

          if (existingMember) {
            // Phone number already exists in the society
            checkedData.push({
              mobileNumber: phoneNumber.number,
              firstName,
              lastName,
              error: 'Phone number already present in the society',
            });
          } else {
            // Phone number is valid and not a duplicate
            checkedData.push({
              mobileNumber: phoneNumber.number,
              firstName,
              lastName,
              error: null,
            });
          }
        }
      }
      const errorFreeData = checkedData.every((entry) => entry.error === null);
      if (errorFreeData) {
        await prisma.$transaction(async (prisma) => {
          const memberRole = await prisma.committeeRoleMaster.findMany({
            where: { societyId: societyId, designationName: 'member' },
          });
          let smsSendData = [];
          for (let i = 0; i < checkedData.length; i++) {

            // Check if the user already exists
            let user = await prisma.user.findUnique({
              where: {
                phoneNumber: checkedData[i]?.mobileNumber,
              },
            });

            if (!user) {
              user = await prisma.user.create({
                data: {
                  phoneNumber: checkedData[i].mobileNumber?.toString() || '',
                  firstName: checkedData[i].firstName,
                  lastName: checkedData[i].lastName,
                  isAdmin: false,
                  flatNumber: null,
                  buildingDoorNumber: null,
                  address: null,
                  state: '',
                  streetName: null,
                  country: '',
                  pincode: null,
                  password: null,
                },
              });

            } else {
              console.log(`User with phone number ${checkedData[i].mobileNumber} already exists.`);
            }
            let societyMember = await prisma.societyMember.create({
              data: {
                userId: user.userId,
                societyId: societyId,
                roleId: memberRole[0]?.designationId,
                isAdmin: false,
              },
            });

            const membershipId = await prisma.membershipStatus.findFirst({
              where: {
                status: 'Invitation Pending',
              },
            });
            if (membershipId) {
              user = await prisma.user.update({
                where: {
                  userId: user.userId,
                },
                data: {
                  membershipStatusId: membershipId.id,
                },
              });
            }

            // Function to sent SMS to every users and make status "invited"
            const encryptedData = await encryptShortCode(
              checkedData[i]?.mobileNumber || '',
              societyId
            );
            // console.log("url", encryptedData)
            societyMember = await prisma.societyMember.update({
              where: {
                userId_societyId: { userId: user.userId, societyId: societyId },
              },
              data: {
                inviteCode: encryptedData,
              },
            });
            // console.log("societyMember", societyMember)

            const invitedMembershipId = await prisma.membershipStatus.findFirst(
              {
                where: {
                  status: 'Invited',
                },
              }
            );
            if (invitedMembershipId) {
              user = await prisma.user.update({
                where: {
                  userId: user.userId,
                },
                data: {
                  membershipStatusId: invitedMembershipId.id,
                },
              });
            }
            console.log("societySSSSS", society?.societyName)
            // smsSendData.push({
            //   phoneNumber:checkedData[i]?.mobileNumber,
            //   shortCode:encryptedData
            // })
            // const baseUrl = 'http://localhost:3000/';
            const baseUrl =   `https://${process.env.MAIN_DOMAIN}/`; // Use the main domain from environment variable
            const registrationPath = `user-reg/${encryptedData}`.trim(); // Ensure no extra spaces
            const registrationUrl = `${baseUrl}${registrationPath}`; // Complete URL for logging/debugging
            const mobileNumber = checkedData[i]?.mobileNumber;
            if (mobileNumber && typeof mobileNumber === 'string') {
              const smsResponse = await sendSMS(
                [mobileNumber], // Pass the string as array
                [`${society?.societyName}`, baseUrl, registrationPath], // Pass parts separately as required
                '175680' // Template message code
              );
            }
            // const smsResponse = await sendSMS(
            //   [checkedData[i]?.mobileNumber], // Pass phone number as an array
            //   [`${society?.societyName}`, `http://localhost:3000/user-reg`, `istration/${encryptedData}`], // Pass OTP as a variable
            //   '175680' // Template message code
            // );
            // console.log('UU', user);
            urls.push(
              `https://${process.env.MAIN_DOMAIN}/user-reg/${encryptedData}`
            );
          }
        });
        return res.status(200).json({
          message: 'Members were invited',
        })
        // return res.status(200).json({
        //   message: 'Members were added',
        //   data: urls,
        // });
        // const smsResponse = await sendSMS(
        //   [user.phoneNumber], // Pass phone number as an array
        //   [otp], // Pass OTP as a variable
        //   '175679' // Template message code
        // );
      } else {
        // Return the checked data as a response
        return res.status(501).json({
          /*  message: 'There are some errors in the Data Provided', */
          message: 'User with same number exist in the Society',
          data: checkedData,
        });
      }
    } catch (error:any) {
      console.log('ERROR', error);
      return res.status(500).json({
        message: 'An error occurred while checking duplicate users',
        error: error.message,
      });
    }
  }
);

userRouter.get('/invite-member-data/:code', async (req: Request, res: Response) => {
  try {
    const code = req.params.code;
    console.log("code", code)
    const societyMember = await prisma.societyMember.findUnique({
      where: { inviteCode: code }
    })
    const user = await prisma.user.findUnique({
      where: { userId: societyMember?.userId }
    })
    return res.status(200).json({
      userId: user?.userId,
      phoneNumber: user?.phoneNumber,
      societyId: societyMember?.societyId
    })
  } catch (error) {
    console.log("Error in /invite-member-data/:code", error)
    return res.status(500).json("Internal Server Error")
  }
})
// userRouter.get(
//   '/display-members',
//   authenticateToken,
//   authenticateRole,
//   async (req: Request, res: Response) => {
//     try {
//       const encryptedSocietyId = req.query.societyId as string;
//       const roleFilter = (req.query.roleId as string) || '';
//       const sortOption = (req.query.sortOption as string) || '';
//       const searchTerm = (req.query.searchTerm as string) || '';


//       if (!encryptedSocietyId) {
//         console.log('No encryptedSocietyId received from client.');
//         return res.status(400).json({ error: 'societyId is required' });
//       }

//       console.log(
//         'Encrypted Society ID received from client:',
//         encryptedSocietyId
//       );

//       // Decrypt the societyId
//       const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
//       const societyId = bytes.toString(CryptoJS.enc.Utf8);

//       if (!societyId) {
//         console.log('Decryption failed: Unable to retrieve society ID.');
//         return res.status(400).json({ error: 'Failed to decrypt society ID' });
//       }

//       console.log('Decrypted Society ID is:', societyId);

//       // Query the Prisma model for all SocietyMembers with the matching societyId
//       const matchingSocietyMembers = await prisma.societyMember.findMany({
//         where: {
//           societyId: societyId,
//           ...(roleFilter && { roleId: roleFilter }), // Filter by roleId if provided
//         },
//         select: {
//           userId: true,
//           roleId: true,
//         },
//       });

//       if (matchingSocietyMembers.length > 0) {
//         console.log(
//           'Matching societyId found in SocietyMember table:',
//           matchingSocietyMembers
//         );

//         // Now fetch the users from the User table using the userIds from the matchingSocietyMembers
//         const userIds = matchingSocietyMembers.map((member) => member.userId);
//         let matchingUsers = await prisma.user.findMany({
//           where: { userId: { in: userIds },
//           isDeleted: false },
//           select: {
//             userId: true, // Include userId
//             firstName: true, // Include firstName
//             lastName: true, // Include lastName
//             phoneNumber: true, // Include phoneNumber
//             membershipStatusId: true, // Include membershipStatusId to fetch status
//           },
//         });

//         // Filter matchingUsers based on searchTerm
//         if (searchTerm) {
//           const lowerCaseSearchTerm = searchTerm.toLowerCase();
//           matchingUsers = matchingUsers.filter(
//             (user) =>
//               user.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
//               user.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
//               user.phoneNumber?.toString().includes(lowerCaseSearchTerm)
//           );
//         }

//         if (sortOption) {
//           if (sortOption === 'A-Z') {
//             matchingUsers.sort((a, b) =>
//               a.firstName.localeCompare(b.firstName)
//             );
//           } else if (sortOption === 'Z-A') {
//             matchingUsers.sort((a, b) =>
//               b.firstName.localeCompare(a.firstName)
//             );
//           }
//         }

//         const userDetailsArray: Array<{
//           userId: string;
//           firstName: string;
//           lastName: string;
//           phoneNumber: string;
//           designationName: string | null;
//           membershipStatus: any;
//            membershipStatusId: BigInt | null;
//         }> = [];

//         if (matchingUsers.length > 0) {
//           console.log('Matching users found in User table:', matchingUsers);

//           // Iterate through each user and fetch the membershipStatus from the MembershipStatus table
//           for (const user of matchingUsers) {
//             let designationName = null; // Initialize designationName
//             const membershipStatusId = user.membershipStatusId;

//             // Fetch the membership status if it exists
//             let membershipStatus = null; // Initialize membershipStatus
//             if (membershipStatusId) {
//               membershipStatus = await prisma.membershipStatus.findUnique({
//                 where: { id: membershipStatusId },
//               });

//               if (membershipStatus) {
//                 console.log(
//                   `Membership Status for userId ${user.userId}:`,
//                   membershipStatus
//                 );
//                 membershipStatus = membershipStatus.status; // Store only the status
//               } else {
//                 console.log(
//                   `No membership status found for userId ${user.userId}`
//                 );
//               }
//             } else {
//               console.log(
//                 `No membershipStatusId found for userId ${user.userId}`
//               );
//             }

//             // Fetch designation names based on roleIds
//             const member = matchingSocietyMembers.find(
//               (m) => m.userId === user.userId
//             );
//             if (member) {
//               const roleId = member.roleId;
//               if (roleId) {
//                 const committeeRole =
//                   await prisma.committeeRoleMaster.findUnique({
//                     where: { designationId: roleId },
//                   });

//                 if (committeeRole) {
//                   designationName = committeeRole.designationName;
//                   console.log(
//                     `Designation Name for roleId ${roleId}:`,
//                     designationName
//                   );
//                 } else {
//                   console.log(`No designation found for roleId ${roleId}`);
//                 }
//               } else {
//                 console.log(`No roleId found for userId ${user.userId}`);
//               }
//             }

//             // Push user details into the userDetailsArray
//             userDetailsArray.push({
//               userId: user.userId,
//               firstName: user.firstName,
//               lastName: user.lastName,
//               phoneNumber: user.phoneNumber,
//               designationName: designationName,
//               membershipStatusId: membershipStatusId,
//               membershipStatus: membershipStatus, // Store only membership status
//             });
//           }

//           // Console log the array with user details
//           console.log('User Details Array:', userDetailsArray);
//         } else {
//           console.log(
//             'No matching users found in User table for the provided userIds:',
//             userIds
//           );
//         }



//         // Respond back with the result, including membership statuses
//         res.status(200).json(JSON.parse(safeJsonStringify({
//           decryptedSocietyId: societyId,
//           matchingSocietyMembers: matchingSocietyMembers,
//           matchingUsers: matchingUsers,
//           userDetails: userDetailsArray, // Include user details in the response
//         })));
//       } else {
//         console.log('No matching societyId found in SocietyMember table.');
//         res.status(404).json({ error: 'No matching societyId found' });
//       }
//     } catch (error) {
//       console.error('Error processing request:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   }
// );


userRouter.get(
  '/display-members',
  authenticateToken,
  authenticateRole,
  async (req: AuthenticatedRequest, res: Response) => {
    // if (req.isAdmin !== "admin") {
    //   console.log('User is not an admin.');
    //   return res.status(702).send( 'Access denied: Admin rights required' );
    // }
    try {



      const encryptedSocietyId = req.query.societyId as string;
      const roleFilter = (req.query.roleId as string) || '';
      const sortOption = (req.query.sortOption as string) || '';
      const searchTerm = (req.query.searchTerm as string) || '';




      if (!encryptedSocietyId) {
        console.log('No encryptedSocietyId received from client.');
        return res.status(400).json({ error: 'societyId is required' });
      }

      if (!encryptedSocietyId || !secretKey) {
        throw new Error('Society ID or secret key is missing');
      }

      console.log(
        'Encrypted Society ID received from client:',
        encryptedSocietyId
      );

      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      if (!societyId) {
        console.log('Decryption failed: Unable to retrieve society ID.');
        return res.status(400).json({ error: 'Failed to decrypt society ID' });
      }

      console.log('Decrypted Society ID is:', societyId);

      const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10
    const offset = parseInt(req.query.offset as string, 10) || 0; // Default offset to 0


      // Query the Prisma model for all SocietyMembers with the matching societyId
      const matchingSocietyMembers = await prisma.societyMember.findMany({
        where: {
          societyId: societyId,
          ...(roleFilter && { roleId: roleFilter }), // Filter by roleId if provided
        },
        select: {
          userId: true,
          roleId: true,
        },
      });

      if (matchingSocietyMembers.length > 0) {
        console.log(
          'Matching societyId found in SocietyMember in userACtion:',
          matchingSocietyMembers
        );

        // Now fetch the users from the User table using the userIds from the matchingSocietyMembers
        const userIds = matchingSocietyMembers.map((member) => member.userId);
        let matchingUsers = await prisma.user.findMany({
          where: { userId: { in: userIds }, isDeleted: false },
          skip: offset, // Apply offset for pagination
          take: limit,  // Apply limit for pagination
          select: {
            userId: true, // Include userId
            firstName: true, // Include firstName
            lastName: true, // Include lastName
            phoneNumber: true, // Include phoneNumber
            membershipStatusId: true, // Include membershipStatusId to fetch status
          },
        });

        // Filter matchingUsers based on searchTerm
        if (searchTerm) {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          matchingUsers = matchingUsers.filter(
            (user) =>
              user.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
              user.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
              user.phoneNumber?.toString().includes(lowerCaseSearchTerm)
          );
        }

        if (sortOption) {
          if (sortOption === 'A-Z') {
            matchingUsers.sort((a, b) =>
              a.firstName.localeCompare(b.firstName)
            );
          } else if (sortOption === 'Z-A') {
            matchingUsers.sort((a, b) =>
              b.firstName.localeCompare(a.firstName)
            );
          }
        }

        type FullUserDetails = {
          userId: string;
          firstName: string;
          lastName: string;
          phoneNumber: string;
          designationName: string | null;
          membershipStatus: any;
          membershipStatusId: BigInt | null;
          profilePicture: string | null;
        };
        
        type LimitedUserDetails = {
          firstName: string;
          lastName: string;
          designationName: string | null;
          profilePicture: string | null;
        };

        
        // const userDetailsArray: Array<{
        //   userId: string;
        //   firstName: string;
        //   lastName: string;
        //   phoneNumber: string;
        //   designationName: string | null;
        //   membershipStatus: any;
        //   membershipStatusId: BigInt | null;
        //   profilePicture: string | null; // Add profilePicture field here
        // }> = [];


        const userDetailsArray: (FullUserDetails | LimitedUserDetails)[] = [];


        if (matchingUsers.length > 0) {
          console.log('Matching users found in User table:', matchingUsers);

          // Iterate through each user and fetch the membershipStatus from the MembershipStatus table
          for (const user of matchingUsers) {
            let designationName = null; // Initialize designationName
            const membershipStatusId = user.membershipStatusId;

            // Fetch the membership status if it exists
            let membershipStatus = null; // Initialize membershipStatus
            if (membershipStatusId) {
              membershipStatus = await prisma.membershipStatus.findUnique({
                where: { id: membershipStatusId },
              });

              if (membershipStatus) {
                console.log(
                  `Membership Status for userId ${user.userId}:`,
                  membershipStatus
                );
                membershipStatus = membershipStatus.status; // Store only the status
              } else {
                console.log(
                  `No membership status found for userId ${user.userId}`
                );
              }
            } else {
              console.log(
                `No membershipStatusId found for userId ${user.userId}`
              );
            }

            // Fetch designation names based on roleIds
            const member = matchingSocietyMembers.find(
              (m) => m.userId === user.userId
            );
            if (member) {
              const roleId = member.roleId;
              if (roleId) {
                const committeeRole =
                  await prisma.committeeRoleMaster.findUnique({
                    where: { designationId: roleId },
                  });

                if (committeeRole) {
                  designationName = committeeRole.designationName;
                  console.log(
                    `Designation Name for roleId ${roleId}:`,
                    designationName
                  );
                } else {
                  console.log(`No designation found for roleId ${roleId}`);
                }
              } else {
                console.log(`No roleId found for userId ${user.userId}`);
              }
            }

            // Fetch profile picture for the user
            let profilePic = null;
            const profilePicRecord = await prisma.media.findFirst({
              where: {
                tableId: user.userId,
                tableType: 'user', // Ensure this matches your tableType for users
                type: 'image', // Fetching image type media
              },
              select: {
                data: true, // Fetch the image data
              },
            });

            const profilePicBase64 = profilePicRecord
              ? `data:image/png;base64,${profilePicRecord.data.toString('base64')}`
              : null;

            // Push user details into the userDetailsArray
            //   userDetailsArray.push({
            //     userId: user.userId,
            //     firstName: user.firstName,
            //     lastName: user.lastName,
            //     phoneNumber: user.phoneNumber,
            //     designationName: designationName,
            //     membershipStatusId: membershipStatusId,
            //     membershipStatus: membershipStatus,
            //     profilePicture: profilePicBase64, // Add profilePicture to user details
            //   });
            // }

            if (req.isAdmin === "admin") {
              userDetailsArray.push({
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                designationName: designationName,
                membershipStatusId: membershipStatusId,
                membershipStatus: membershipStatus,
                profilePicture: profilePicBase64,
              });
            } else {
              userDetailsArray.push({
                firstName: user.firstName,
                lastName: user.lastName,
                designationName: designationName,
                profilePicture: profilePicBase64,
              });
            }
          }

          // Console log the array with user details
          console.log('User Details Array:', userDetailsArray);
        } else {
          console.log(
            'No matching users found in User table for the provided userIds:',
            userIds
          );
        }

        const totalRecords = await prisma.user.count({
          where: { userId: { in: userIds }, isDeleted: false },
        });

        
        // Respond back with the result, including profile pictures and other details
        res.status(200).json(JSON.parse(safeJsonStringify({
          decryptedSocietyId: societyId,
          matchingSocietyMembers: matchingSocietyMembers,
          matchingUsers: matchingUsers,
          userDetails: userDetailsArray, // Include user details with profile pictures in the response
          totalRecords: totalRecords,
        })));
      } else {
        console.log('No matching societyId found in SocietyMember table.');
        res.status(404).json({ error: 'No matching societyId found' });
      }
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

userRouter.get(
  '/display-filterDesignation',
  authenticateToken,
  authenticateRole,
  async (req: Request, res: Response) => {
    try {
      const encryptedSocietyId = req.query.societyId as string;

      if (!encryptedSocietyId) {
        console.log('No encryptedSocietyId received from client.');
        return res.status(400).json({ error: 'societyId is required' });
      }

      if (!encryptedSocietyId || !secretKey) {
        throw new Error('Society ID or secret key is missing');
      }

      console.log(
        'Encrypted Society ID received from client:',
        encryptedSocietyId
      );

      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      if (!societyId) {
        console.log('Decryption failed: Unable to retrieve society ID.');
        return res.status(400).json({ error: 'Failed to decrypt society ID' });
      }

      console.log('Decrypted Society ID:', societyId);

      // Fetch matching designations and role IDs directly based on the societyId
      const matchingDesignations = await prisma.committeeRoleMaster.findMany({
        where: {
          societyId: societyId, // Match directly with societyId in committeeRoleMaster
          isDeleted: false,
          designationName: {
            not: 'societySuperAdmin', // Exclude 'societySuperAdmin' from the results
          },
        },
        select: {
          designationName: true, // Fetch only the designation name
          designationId: true, // Fetch the roleId as well
        },
      });

      // Log the matching designations
      if (matchingDesignations.length > 0) {
        console.log(`Matched Designations Found:`, matchingDesignations);
      } else {
        console.log('No matching designations found for the given society ID.');
      }

      // Return the array of designation names and role IDs in the response
      return res.status(200).json(matchingDesignations); // Send the entire matchingDesignations array
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

userRouter.get(
  '/filteredDesignation',
  authenticateToken,
  authenticateRole,
  async (req: Request, res: Response) => {
    const designationId = req.query.designationId as string;

    // Check if designationId is provided
    if (!designationId) {
      console.log('No designationId provided'); // Log the message
      return res.status(400).json({ message: 'No designationId provided' }); // Return a 400 Bad Request
    }

    try {
      console.log('designationId in backend is ', designationId);

      // Query to match the designationId with the roleId from the societyMember table
      const matchingRecord = await prisma.societyMember.findFirst({
        where: {
          roleId: designationId, // Assuming roleId and designationId are comparable fields
        },
      });

      if (matchingRecord) {
        // If a match is found, log and return a success message
        console.log('Match found:', matchingRecord.roleId);
        return res.status(200).json({ record: matchingRecord.roleId });
      } else {
        // If no match is found, return a message indicating that
        console.log('No match found');
        return res.status(405).json({ message: 'No match found' }); // Return a 404 Not Found
      }
    } catch (error:any) {
      console.error('Error fetching designation:', error);
      // 500 Internal Server Error - Some server error occurred
      return res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  }
);

userRouter.delete(
  '/delete-user/:userId',
  authenticateToken,
  authenticateRole,
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    console.log('userid in serve', req.params.userId);

    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          userId: String(userId), // Change this to String

          isDeleted: false, // Ensure you're only looking at active records
        },
      });

      if (!existingUser) {
        return res.status(404).send('Designation not found');
      }

      await prisma.user.update({
        where: {
          userId: String(userId), // Change this to String
        },
        data: {
          isDeleted: true, // Mark as deleted
        },
      });

      res.status(200).send('Designation deleted successfully');
    } catch (error) {
      console.error('Error deleting designation:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

userRouter.patch('/', authenticateToken, async (req: any, res: Response) => {
  console.log("userId,", req.user.id)
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { userId }
    })
    // console.log("REESS", req.body)
    const newData = req.body
    const pic = newData.profilePictureId
    console.log("pic",)
    if (pic?.includes('data')) {
      console.log("KKKKKK")
      // const logo = await createBase64(newData.profilePictureId);
      const logo = newData.profilePictureId
      const [mediaTypePart, base64Data] = logo.split(',');
      let mediaType = 'unknown';
      if (mediaTypePart.includes('image')) {
        mediaType = 'image';
      } else if (mediaTypePart.includes('video')) {
        mediaType = 'video';
      }
      else if (mediaTypePart.includes('audio')) {
        mediaType = 'audio';
      }

      const eventFileStringSplit = logo.toString();

      // const base64Data = eventFileStringSplit.split(",")[1]; // Only use the data part
      const BuffereventFile = Buffer.from(base64Data, 'base64'); // Convert to buffer

      console.log("BuffereventFile", BuffereventFile)

      // // Create a media record for each file
      // const media = await prisma.media.create({
      //   data: {
      //     type: mediaType,
      //     data: BuffereventFile,
      //     tableId: userId,
      //     tableType: 'user',
      //   },
      // });
      // console.log("media", media)


      const existingMedia = await prisma.media.findFirst({
        where: {
          tableId: userId,
          tableType: 'user',
          type: 'image'
        }
      });

      if (existingMedia) {
        // If exists, patch (update) that media record
        const updatedMedia = await prisma.media.update({
          where: { id: existingMedia.id },
          data: {
            data: BuffereventFile
          }
        });
        await prisma.user.update({
          where: { userId },
          data: { profilePictureId: updatedMedia.id }
        });
      } else {
        // Else, create a new media record with tableType 'user' and type 'image'
        const newMedia = await prisma.media.create({
          data: {
            type: 'image',
            data: BuffereventFile,
            tableId: userId,
            tableType: 'user'
          }
        });
        await prisma.user.update({
          where: { userId },
          data: { profilePictureId: newMedia.id }
        });
      }
    }


     
    

    await prisma.user.update({
      where: { userId: userId },
      data: {
        phoneNumber: newData.phoneNumber,
        firstName: newData.firstName,
        lastName: newData.lastName,
        gender: newData.gender,
        flatNumber: newData.flatNumber,
        buildingDoorNumber: newData.buildingDoorNumber,
        address: newData.address,
        state: newData.state,
        streetName: newData.streetName,
        country: newData.country,
        pincode: newData.pincode,
      }
    })
    // console.log("user,", user)
    res.status(200).json(JSON.parse(safeJsonStringify(user)))
  } catch (error) {
    console.log("error in user put", error)
  }
})


userRouter.get(
  '/set-role',
  authenticateToken,
  authenticateRole,
  async (req: any, res: Response) => {
    try {


      // Return the user's role based on isAdmin
      return res.status(200).json({ isAdmin: req.isAdmin }); // Will be 'admin' or 'normaluser'
    } catch (error) {
      console.error('Error checking user role:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

userRouter.get(
  '/check-admin',
  authenticateToken,
  authenticateRole,
  async (req: any, res: Response) => {
    try {
      // Check if the user has admin privileges
      if (req.isAdmin === 'admin') {
        return res.status(200).json({ isAdmin: 'admin' });
      } else {
        return res.status(200).json({ isAdmin: 'normaluser' });
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);


export default userRouter;

