import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
    authenticateToken,
    authenticateRole,
    AuthenticatedRequest,
} from '../../middlewares/authorizeUser';
import CryptoJS from 'crypto-js';
import { CONFIG } from '../../utils/config';
import axios from 'axios';
const profileRouter = express.Router();
const prisma = new PrismaClient();
const secretKey = CONFIG.SECRET_KEY;
const ifsc = require('ifsc')


// Helper function to safely stringify JSON, handling BigInt values
function safeJsonStringify(obj: any) {
    return JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value // Convert BigInt to String
    );
}

// Route to check if a user is a societySuperAdmin
profileRouter.get(
    '/check-society-superadmin',
    authenticateToken,
    authenticateRole,
    async (req: Request, res: Response) => {
        const encryptedSocietyId = req.query.societyId as string;
        const userId = req.query.userId as string;
console.log("uiddd",userId)
        if (!encryptedSocietyId || !userId) {
            return res.status(400).json({ error: 'societyId and userId are required' });
        }

        try {
            // Decrypt the societyId
            if (!encryptedSocietyId || !secretKey) {
                throw new Error('Society ID or secret key is missing');
            }
            const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
            const societyId = bytes.toString(CryptoJS.enc.Utf8);

            if (!societyId) {
                return res.status(400).json({ error: 'Failed to decrypt society ID' });
            }

            console.log('Decrypted Society ID:', societyId);

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

            if (!societyMember) {
                return res.status(404).json({ error: 'User not found in the society' });
            }

            const { roleId } = societyMember;

            // Fetch the role from CommitteeRoleMaster table using roleId
            const committeeRole = await prisma.committeeRoleMaster.findUnique({
                where: { designationId: roleId },
                select: { designationName: true },
            });

            if (!committeeRole) {
                return res.status(404).json({ error: 'Role not found in CommitteeRoleMaster' });
            }

            // Check if the user has the societySuperAdmin role
            const isSuperAdmin = committeeRole.designationName === 'societySuperAdmin';

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

profileRouter.put(
  '/update-society-details', // Ensure this matches the frontend route exactly
  authenticateToken,
  authenticateRole,
  async (req: Request, res: Response) => {
    try {
      const encryptedSocietyId = req.query.societyId as string;

      if (!encryptedSocietyId) {
        return res.status(400).json({ error: 'societyId is required' });
      }

      if (!encryptedSocietyId || !secretKey) {
        throw new Error('Society ID or secret key is missing');
    }

      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      if (!societyId) {
        return res.status(400).json({ error: 'Failed to decrypt society ID' });
      }

      console.log("Decrypted Society ID:", societyId);

      // Log the received form data
      console.log("Received form data:", req.body);

      // Fetch the society from the database using the decrypted societyId
      const society = await prisma.society.findUnique({
        where: { societyId: societyId },
      });

      if (!society) {
        return res.status(404).json({ error: 'Society not found' });
      }

      // Update the description and address in the society object
      const updatedSociety = await prisma.society.update({
        where: { societyId: societyId },
        data: {
          description: req.body.description,
          address: req.body.address,
        },
      });

      // Return a success response
      res.status(200).json({
        message: 'Society details updated successfully',
        society: updatedSociety,
      });

    } catch (error) {
      console.error('Error updating society details:', error);
      res.status(500).json({ message: 'Failed to process society details update' });
    }
  }
);
// Route to change societySuperAdmin
profileRouter.patch(
    '/change-society-superadmin',
    authenticateToken,
    authenticateRole,
    async (req: Request, res: Response) => {
        const { currentSuperAdminId, newSuperAdminId, societyId: encryptedSocietyId } = req.body;

        if (!currentSuperAdminId || !newSuperAdminId || !encryptedSocietyId) {
            return res.status(400).json({ error: 'currentSuperAdminId, newSuperAdminId, and societyId are required' });
        }

        if (!encryptedSocietyId || !secretKey) {
          throw new Error('Society ID or secret key is missing');
      }

        try {
            // Decrypt the societyId
            const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
            const societyId = bytes.toString(CryptoJS.enc.Utf8);

            if (!societyId) {
                return res.status(400).json({ error: 'Failed to decrypt society ID' });
            }

            console.log('Decrypted Society ID:', societyId);

            // Fetch the roleId for 'societySuperAdmin' and 'member' from CommitteeRoleMaster table
            const superAdminRole = await prisma.committeeRoleMaster.findFirst({
                where: { designationName: 'societySuperAdmin' },
                select: { designationId: true },
            });

            const memberRole = await prisma.committeeRoleMaster.findFirst({
                where: { designationName: 'member' },
                select: { designationId: true },
            });

            if (!superAdminRole || !memberRole) {
                return res.status(404).json({ error: 'Roles not found in CommitteeRoleMaster' });
            }

            // Begin a transaction to ensure atomicity
            const result = await prisma.$transaction(async (prisma) => {
                // Update the current Super Admin (currentSuperAdminId) to 'member'
                await prisma.societyMember.updateMany({
                    where: {
                        userId: currentSuperAdminId,
                        societyId: societyId,
                    },
                    data: {
                        roleId: memberRole.designationId,
                    },
                });

                // Update the selected user to 'societySuperAdmin'
                await prisma.societyMember.updateMany({
                    where: {
                        userId: newSuperAdminId,
                        societyId: societyId,
                    },
                    data: {
                        roleId: superAdminRole.designationId,
                    },
                });
            });

            return res.status(200).json({ message: 'Super Admin role successfully transferred' });
        } catch (error) {
            console.error('Error changing societySuperAdmin:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            await prisma.$disconnect();
        }
    }
);



profileRouter.get(
  '/bank-details',
  authenticateToken,
  authenticateRole,
  async (req: Request, res: Response) => {
    try {
      const encryptedSocietyId = req.query.societyId as string; // Type assertion for TypeScript
      console.log('Received societyId:', encryptedSocietyId);
      
      if (!encryptedSocietyId) {
        return res.status(400).json({ error: 'societyId is required' });
      }
      
      if (!encryptedSocietyId || !secretKey) {
        throw new Error('Society ID or secret key is missing');
    }

      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey); // Access AES directly
      const societyId = bytes.toString(CryptoJS.enc.Utf8); // Access enc directly

      if (!societyId) {
        throw new Error('Failed to decrypt society ID');
      }
      console.log("Decrypted Society ID in profile:", societyId);
      
      // Fetch bank details matching the decrypted societyId
      const bankDetail = await prisma.bankDetails.findUnique({
        where: {
          societyId: societyId,
        },
        select: {
          accountNumber: true,
          accountName: true,
          branchName: true,
          IFSCCode: true,
          isDeleted: true,
          bank:true// Include isDeleted to check its status
        },
      });

      // Check if bank detail is found and is not deleted
      if (!bankDetail || bankDetail.isDeleted) {
        return res.status(404).json({ error: 'No active bank details found for the provided society ID.' });
      }

     

      // Respond with the fetched bank details
      res.status(200).json(bankDetail);
      
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      await prisma.$disconnect(); // Ensure the Prisma Client is disconnected
    }
  }
);



// profileRouter.put(
//   '/update-bank-details', // Ensure this matches the frontend route exactly
//   authenticateToken,
//   authenticateRole,
//   async (req: Request, res: Response) => {
//     try {
//       const encryptedSocietyId = req.query.societyId as string; // Type assertion for TypeScript
//       console.log('Received societyId:', encryptedSocietyId);
      
//       if (!encryptedSocietyId) {
//         return res.status(400).json({ error: 'societyId is required' });
//       }
      
//       // Decrypt the societyId
//       const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
//       const societyId = bytes.toString(CryptoJS.enc.Utf8);

//       if (!societyId) {
//         throw new Error('Failed to decrypt society ID');
//       }
//       console.log("Decrypted Society ID in profile update:", societyId);
      
//       // Log the received data from the request body
//       console.log("Received bank details data to update:", req.body);
      
//       // Query the BankDetails table to find a match
//       const bankDetail = await prisma.bankDetails.findUnique({
//         where: { societyId: societyId } // Adjust this based on your actual schema
//       });

//       if (bankDetail) {
//         console.log("Matched Bank Details ID:", bankDetail.id); // Log the matched ID

//         // Update the matched bank details record with the new values
//         await prisma.bankDetails.update({
//           where: { id: bankDetail.id },
//           data: {
//             accountNumber: req.body.bankAccountNumber,
//             IFSCCode: req.body.ifscCode, 
//             accountName: req.body.accountName,
//             branchName: req.body.address,
//             bank: req.body.bank,
//             modifiedDate: new Date(),
//             modifiedById: req.user.id,
//             isDeleted: false,
//           },
//         });
        
//         res.status(200).json({ message: 'Bank details updated successfully' });
//       } 
//       else {
//         // console.log("No bank details found for society ID:", societyId);

//         // return res.status(404).json({ message: 'No bank details found for the provided society ID' });
//         await prisma.bankDetails.create({
//           data: {
//             societyId: societyId,
//             bank: req.body.bank,
//             accountNumber: req.body.bankAccountNumber,
//             IFSCCode: req.body.ifscCode,
//             accountName: req.body.accountName,
//             branchName: req.body.branchName,
//             createdDate: new Date(),
//             createdById: req.user.id,
//             modifiedDate: new Date(),
//             modifiedById: req.user.id,
//             isDeleted: false,
//           },
//         });
//       }
//       res.status(200).json({ message: 'Bank details created successfully' });
//     } catch (error) {
//       console.error('Error updating bank details:', error);
//       res.status(500).json({ message: 'Failed to update bank details' });
//     }
//   }
// );

/* profileRouter.put(
  '/update-bank-details', // Ensure this matches the frontend route exactly
  authenticateToken,
  authenticateRole,
  async (req: Request, res: Response) => {
    try {
      const encryptedSocietyId = req.query.societyId as string;

      if (!encryptedSocietyId) {
        return res.status(400).json({ error: 'societyId is required' });
      }

      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      if (!societyId) {
        return res.status(400).json({ error: 'Failed to decrypt society ID' });
      }

      console.log("Decrypted Society ID:", societyId);

      const { bank, bankAccountNumber, ifscCode, accountName, branchName } = req.body;

      if (!bank || !bankAccountNumber || !ifscCode || !accountName || !branchName) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Query to find existing bank details
      const bankDetail = await prisma.bankDetails.findUnique({
        where: { societyId },
      });

      if (bankDetail) {
        // Update existing bank details
        const updatedBankDetail = await prisma.bankDetails.update({
          where: { id: bankDetail.id },
          data: {
            accountNumber: bankAccountNumber,
            IFSCCode: ifscCode,
            accountName,
            branchName,
            bank,
            modifiedDate: new Date(),
            modifiedById: req.user.id,
            isDeleted: false,
          },
        });
        return res.status(200).json({
          message: 'Bank details updated successfully',
          data: updatedBankDetail,
        });
      }

      // Create new bank details if none exist
      const newBankDetail = await prisma.bankDetails.create({
        data: {
          societyId,
          bank,
          accountNumber: bankAccountNumber,
          IFSCCode: ifscCode,
          accountName,
          branchName,
          createdDate: new Date(),
          createdById: req.user.id,
          modifiedDate: new Date(),
          modifiedById: req.user.id,
          isDeleted: false,
        },
      });

      return res.status(201).json({
        message: 'Bank details created successfully',
        data: newBankDetail,
      });
    } catch (error) {
      console.error('Error updating bank details:', error);
      res.status(500).json({ message: 'Failed to process bank details update' });
    }
  }
);
 */
profileRouter.put(
  '/update-bank-details', // Ensure this matches the frontend route exactly
  authenticateToken,
  authenticateRole,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const encryptedSocietyId = req.query.societyId as string;
 
      if (!encryptedSocietyId) {
        return res.status(400).json({ error: 'societyId is required' });
      }
 
      if (!encryptedSocietyId || !secretKey) {
        throw new Error('Society ID or secret key is missing');
    }

    
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated'
      });
    }


      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);
 
      if (!societyId) {
        return res.status(400).json({ error: 'Failed to decrypt society ID' });
      }
 
      console.log("Decrypted Society ID:", societyId);
 
      const { bank, bankAccountNumber, ifscCode, accountName, branchName } = req.body;
 
      if (!bank || !bankAccountNumber || !ifscCode || !accountName || !branchName) {
        return res.status(400).json({ error: 'All fields are required' });
      }
 
      // Query to find existing bank details
      const bankDetail = await prisma.bankDetails.findUnique({
        where: { societyId },
      });
      const society= await prisma.society.findUnique({
        where:{societyId}
      })
      const user=await prisma.user.findUnique({
        where:{userId:req?.user?.id}
      })
 
      if (bankDetail) {
        let updatedBankDetail = await prisma.bankDetails.update({
          where: { id: bankDetail.id },
          data: {
            accountNumber: bankAccountNumber,
            IFSCCode: ifscCode,
            accountName,
            branchName,
            bank,
            modifiedDate: new Date(),
            modifiedById: req.user.id,
            isDeleted: false,
          },
        });
       const contactDetails= {
          "name": society?.societyName,
          "contact": user?.phoneNumber,
          "type": "employee"
        }
        const response =await axios.patch(`${CONFIG.RAZORPAY_URL}/contacts/${updatedBankDetail?.contactId}`,contactDetails,
                 {
                  headers: {
                      Authorization: `Basic ${Buffer.from(
                          `${CONFIG.RAZORPAY_KEY_ID}:${CONFIG.RAZORPAY_KEY_SECRET}`
                      ).toString("base64")}`,
                  },
              }
        )
          const fundData= {
              contact_id:response?.data?.id,
              account_type:"bank_account",
              bank_account: {
                  name: society?.societyName,
                  ifsc: updatedBankDetail?.IFSCCode,
                  account_number: updatedBankDetail?.accountNumber
                }
          }
          console.log("fundData",fundData)
          const fundResponse=await axios.post(
              `${CONFIG.RAZORPAY_URL}/fund_accounts`,fundData,{
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${CONFIG.RAZORPAY_KEY_ID}:${CONFIG.RAZORPAY_KEY_SECRET}`
                    ).toString("base64")}`,
                },
            }
          )
          console.log("fundaaa",fundResponse?.data)
          updatedBankDetail = await prisma.bankDetails.update({
            where: { id: bankDetail.id },
            data:{
                contactId: fundResponse.data?.contact_id,
                fundAccount: fundResponse?.data?.id
            }
          })
          return res.status(200).json( {message: 'Bank details updated successfully'} );
      }
      else{
 
      console.log("USERRR",user)
      console.log("societyBAnk",society)
 
 
      // Create new bank details if none exist
      let newBankDetail = await prisma.bankDetails.create({
        data: {
          societyId,
          bank,
          accountNumber: bankAccountNumber,
          IFSCCode: ifscCode,
          accountName,
          branchName,
          createdDate: new Date(),
          createdById: req.user.id,
          modifiedDate: new Date(),
          modifiedById: req.user.id,
          isDeleted: false,
        },
      });
      const razData = {
        "name": society?.societyName,
        "contact": user?.phoneNumber,
        "type": "vendor",
      }
      console.log("razData",razData)
 
      const response = await axios.post(
        `${CONFIG.RAZORPAY_URL}/contacts`,
        razData,
        {
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `${CONFIG.RAZORPAY_KEY_ID}:${CONFIG.RAZORPAY_KEY_SECRET}`
                ).toString("base64")}`,
            },
        }
    );
    console.log("Response",response)
    const details = await prisma.bankDetails.findUnique({
        where: { societyId: society?.societyId }
    })
    const fundAccountRequestData = {
        "contact_id": response?.data?.id,
        "account_type": 'bank_account',
        "bank_account": {
            "name": society?.societyName,
            "ifsc": details?.IFSCCode,
            "account_number": details?.accountNumber
        }
    }
 
    const fundAccountResponse = await axios.post(`${CONFIG.RAZORPAY_URL}/fund_accounts`, fundAccountRequestData, {
        headers: {
            Authorization: `Basic ${Buffer.from(
                `${CONFIG.RAZORPAY_KEY_ID}:${CONFIG.RAZORPAY_KEY_SECRET}`
            ).toString("base64")}`,
        },
    })
    console.log("fundAccountResponse", fundAccountResponse)
    newBankDetail= await prisma.bankDetails.update({
        where: { societyId: society?.societyId },
        data: {
            contactId: response.data?.id,
            fundAccount: fundAccountResponse?.data?.id
        }
    })
    console.log("newBankDetail", newBankDetail)
 
      return res.status(201).json({
        message: 'Bank details created successfully',
        data: newBankDetail,
      });
    }
    } catch (error) {
      console.error('Error updating bank details:', error);
      res.status(500).json({ message: 'Failed to process bank details update' });
    }
  }
);

profileRouter.get(
  '/fetch-membership-data/', 
  authenticateToken,
  authenticateRole,
  async (req: Request, res: Response) => {
    try {
      const encryptedSocietyId = req.query.societyId as string; // Type assertion for TypeScript
      console.log('Received societyId:', encryptedSocietyId);
      
      if (!encryptedSocietyId) {
        return res.status(400).json({ error: 'societyId is required' });
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
      console.log("Decrypted Society ID in membership update:", societyId);
      
      // Fetch corresponding chargeMembershipFees and membershipFeeAmount from Society table using Prisma
      const societyData = await prisma.society.findUnique({
        where: { societyId }, // Assuming societyId is the primary key in the Society table
        select: {
          chargeMembershipFees: true,
          membershipFeeAmount: true,
        }
      });

      if (!societyData) {
        return res.status(404).json({ error: 'Society not found' });
      }

      // Conditionally set membershipFeeAmount based on chargeMembershipFees
      const membershipFeeAmount = societyData.chargeMembershipFees
        ? societyData.membershipFeeAmount ?? 0  // If `chargeMembershipFees` is true, use the amount or 0 if null
        : 0;  // If `chargeMembershipFees` is false, set to 0

      console.log('Membership fee data:', {
        chargeMembershipFees: societyData.chargeMembershipFees,
        membershipFeeAmount,
      });

      // Respond with the fetched data
      res.status(200).json({ 
        message: '/Membership data fetched successfully', 
        data: {
          chargeMembershipFees: 
          societyData.chargeMembershipFees,
          membershipFeeAmount
        } 
      });
      
    } catch (error) {
      console.error('Error updating membership data:', error);
      res.status(500).json({ message: 'Failed to update membership data' });
    }
  }
);









profileRouter.put(
  '/update-membership-amount/',
  authenticateToken,
  authenticateRole,
  async (req: Request, res: Response) => {
    try {
      const encryptedSocietyId = req.query.societyId as string; // Type assertion for TypeScript
      console.log('Received societyId:', encryptedSocietyId);

      if (!encryptedSocietyId) {
        return res.status(400).json({ error: 'societyId is required' });
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
      console.log("Decrypted Society ID in member update:", societyId);

      // Log the received data from the request body
      console.log("Received membership data to update:", req.body);

      // Fetch the current membership data
      const membershipData = await prisma.society.findUnique({
        where: { societyId: societyId } // Matching societyId with the society table
      });

      // Check if the society exists
      if (!membershipData) {
        return res.status(404).json({ error: 'Society not found' });
      }

      const { amount } = req.body; // Change 'membershipFeeAmount' to 'amount'

      // Log the membership fee amount
      console.log('Membership Fee Amount:', amount);

      // Determine the values for chargeMembershipFees and membershipFeeAmount
      let chargeMembershipFees = true; // Default to true
      let membershipFeeAmount = amount; // Initialize with amount

      if (!amount || amount === '0') {
        chargeMembershipFees = false; // Set to false if amount is empty or zero
        membershipFeeAmount = null; // Set membershipFeeAmount to null
      }

      // Update the membershipFeeAmount and chargeMembershipFees
      const updatedMembershipData = await prisma.society.update({
        where: { societyId: societyId },
        data: {
          membershipFeeAmount: membershipFeeAmount, // Set to null if amount is empty or zero
          chargeMembershipFees: chargeMembershipFees // Boolean value
        }
      });

      // Respond with the updated data
      return res.status(200).json(updatedMembershipData);
    } catch (error) {
      console.error('Error updating membership fee amount:', error);
      res.status(500).json({ message: 'Failed to update membership fee amount' });
    }
  }
);



profileRouter.post(
  '/ifscbankdetails',
  authenticateToken,
  authenticateRole,
  async (req: Request, res: Response) => {
    try {
      // Retrieve the IFSC code from the request body
      const { ifscCode } = req.body;
      console.log('Received IFSC Code:', ifscCode);

      if (!ifscCode) {
        return res.status(400).json({ error: 'IFSC code is required' });
      }
     

      if (ifsc.validate(ifscCode)) {
        console.log("IFSC is validated");
        
        // Fetch the bank details using the IFSC code
        const details = await ifsc.fetchDetails(ifscCode);
       
          const { BANK, BRANCH } = details;

          // Send the response with the bank name and branch name
          return res.status(200).json({
            message: 'IFSC code is valid',
            bankName: BANK,
            branchName: BRANCH
          });
      } else {
        console.log("IFSC is not valid");
        return res.status(408).json({ error: 'Invalid IFSC code' });
      }
      
    } catch (error) {
      console.error('Error processing IFSC code:', error);
      res.status(500).json({ message: 'Failed to process IFSC code' });
    }
  }
);




export default profileRouter;


// const axios = require('axios');
// const { validateBIC } = require('ibantools');
// const API_KEY = 'uvHY1tqnPatWjsltuJk9hDJiJFppXcSj'; // Replace with your actual API key
 
// profileRouter.post(
//   '/swiftbankdetails',
//   authenticateToken,
//   authenticateRole,
//   async (req: Request, res: Response) => {
//     try {
//       const { swiftCode } = req.body;
//       console.log('Received SWIFT Code:', swiftCode);
 
//       if (!swiftCode) {
//         return res.status(400).json({ error: 'SWIFT code is required' });
//       }
 
//       // Validate SWIFT/BIC code format using ibantools
//       const isValidSWIFT = validateBIC(swiftCode);
//       console.log('SWIFT Validation Result:', isValidSWIFT);
 
//       if (!isValidSWIFT.valid) {
//         console.log('SWIFT code is not valid');
//         return res.status(408).json({ error: 'Invalid SWIFT code' });
//       }
 
//       // Make API call to get bank details
//       const apiUrl = `https://api.apilayer.com/bank_data/swift_check?swift_code=${swiftCode}`;
//       const config = {
//         method: 'GET',
//         url: apiUrl,
//         headers: { apikey: API_KEY },
//       };
 
//       const response = await axios(config);
//       console.log('API Response:', response.data);
//       if (response.data && response.data.result) {
//         const bankDetails = response.data.result;
//         console.log("bank details",bankDetails)
//         return res.status(200).json({
//           message: 'Bank details found',
//           bankName: bankDetails.bank_name || 'Not available',
//           branchName: bankDetails.branch_name || 'Not available',
//           city: bankDetails.city || 'Not available',
//           country: bankDetails.country || 'Not available'
//         });
//       } else {
//         console.log('No bank details found for this SWIFT code');
//         return res.status(404).json({ message: 'Bank details not found' });
//       }
 
//     } catch (error) {
//       console.error('Error processing SWIFT code:', error);
//       res.status(500).json({ message: 'Failed to retrieve bank details' });
//     }
//   }
// );
 
// export default profileRouter;