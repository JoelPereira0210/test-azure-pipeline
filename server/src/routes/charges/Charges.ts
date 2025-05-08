import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  AuthenticatedRequest,
  authenticateRole,
  authenticateToken,
} from '../../middlewares/authorizeUser';

import CryptoJS from 'crypto-js';
import { CONFIG } from '../../utils/config';
import { PhoneNumber } from 'libphonenumber-js';

const chargeRouter = express.Router();
const prisma = new PrismaClient();

const secretKey = CONFIG.SECRET_KEY;

function safeJsonStringify(obj: any) {
  return JSON.stringify(
    obj,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value) // Convert BigInt to String
  );
}

async function getPaidMemberCount(eventId: string) {
  try {
    // Query the database to get the count of members who have completed payments for the given eventId
    const paidMemberCount = await prisma.subscriptionPayments.count({
      where: {
        eventId: eventId,
        status: 'Completed', // Assuming "Completed" is the status indicating payment is successful
      },
    });
console.log("getPaidMemberCount",eventId);
    return paidMemberCount;
  } catch (error) {
    console.error('Error fetching paid members count:', error);
    throw new Error('Could not fetch paid members count');
  }
}

chargeRouter.post(
  '/create-charge',
  authenticateToken,
  authenticateRole,
  async (req: AuthenticatedRequest, res: Response) => {
    const {
      name,
      description,
      dueDate,
      amount,
      feeType,
      shouldPublish,
      isDeleted,
      encryptedSocietyId,
    } = req.body;

    if (req.isAdmin !== 'admin') {
      return res.status(702).send('You are not authorized to create a designation.');
    }

    try {
      let feeTypeId;
      let feeTYPE;

      // Decrypt the societyId
      if (!encryptedSocietyId || !secretKey) {
        throw new Error('Society ID or secret key is missing');
      }

      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      if (!societyId) {
        throw new Error('Failed to decrypt society ID');
      }

      console.log('societyId:', req.role);

      try {
        // Check if feeType exists in the master table (case insensitive)
        const existingFeeType = await prisma.feeTypeMaster.findFirst({
          where: {
            feeType: {
              equals: feeType,
              mode: 'insensitive', // Case-insensitive search to avoid duplicate fee types
            },
          },
        });

        if (existingFeeType) {
          // If feeType exists, use the existing ID
          feeTypeId = existingFeeType.id;
          feeTYPE = existingFeeType.feeType;
          console.log('FeeType found in master table:', existingFeeType);
        } else {
          // If feeType does not exist, create a new one in the master table
          const newFeeType = await prisma.feeTypeMaster.create({
            data: {
              feeType: feeType,
            },
          });

          feeTypeId = newFeeType.id;
          console.log('New FeeType created in master table:', newFeeType);
        }
      } catch (error) {
        console.error('Error handling feeType:');
        return res.status(500).json({
          success: false,
          message: 'Error handling feeType: ',
        });
      }

      // Insert charge data into the event table using Prisma
      const newCharge = await prisma.event.create({
        data: {
          eventName: name,
          eventDescription: description,
          eventRegistrationDate: new Date(dueDate), // Ensure the date is in the correct format
          amount: amount.toString(), // Ensure amount is a float
          feeTypeId: feeTypeId, // Use the feeTypeId from the master table
          shouldPublish: shouldPublish, // Default to false if not provided
          isDeleted: isDeleted ?? 'NOT_DELETED', // Default to false if not provided
          societyId: societyId, // Ensure societyId is an integer
          createdById: req.user?.id || '', // Use user ID for createdBy with optional chaining
          modifiedById: req.user?.id || '', // Use user ID for modifiedBy with optional chaining
         
// 
          eventStartDate: new Date(dueDate),
          eventEndDate: new Date(dueDate),
          eventStartTime: new Date(dueDate),
          eventEndTime: new Date(dueDate),
          eventTypeId: null, // Use the ID of the event type
          maxPeopleAllowed: '', // Optional, set to null
          acceptDonation: null, // Optional, set to null
          ChargePerPerson: null, // Optional, set to null
          allowFamilyandFriends: false, // Optional, set to null
        },
      });

      console.log('New Charge Created:', newCharge);

      // Send the response with the newly created charge
      res.status(200).json({
        success: true,
        message: 'Charge created successfully',
        data: JSON.parse(safeJsonStringify(newCharge)),
      });
    } catch (error: any) {
      console.error('Error creating charge:', error.message);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
);

chargeRouter.get(
  '/fetch-charges',
  authenticateToken,
  authenticateRole,
  async (req: Request, res: Response) => {
    try {
      const encryptedSocietyId = req.query.societyId as string;
      const status = req.query.status as string; // Add status to the query (upcoming, past, draft, deleted)

      console.log('encryptedSocietyId:', encryptedSocietyId);
      console.log('status:', status);

      if (!encryptedSocietyId) {
        return res.status(400).json({ error: 'societyId is required' });
      }

      // Ensure encryptedSocietyId is defined before decrypting
      if (!encryptedSocietyId || !secretKey) {
        throw new Error('Society ID or secret key is missing');
      }

      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      if (!societyId) {
        throw new Error('Failed to decrypt society ID');
      }

      console.log('Decrypted Society ID:', societyId);
      console.log('Status:', status);

      const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10
      const offset = parseInt(req.query.offset as string, 10) || 0; // Default offset to 0

      // Define the default where clause (to filter by societyId and non-deleted charges)
      let whereClause: any = {
        societyId: societyId,
        isDeleted: 'NOT_DELETED', // Ensure you're only fetching non-deleted charges unless fetching deleted
        eventTypeId: null,
        feeTypeId:{
            not:null
        }
        
      };

      let orderByClause: any = {};

      // Apply filters based on status
      if (status === 'upcoming') {
        whereClause.eventRegistrationDate = { gte: new Date().toISOString() }; // Future charges
        whereClause.shouldPublish = true; // Only published charges
        orderByClause = { eventRegistrationDate: 'asc' };
      } else if (status === 'past') {
        whereClause.eventRegistrationDate = { lt: new Date().toISOString() }; // Past charges
        orderByClause = { eventRegistrationDate: 'desc' };
      } else if (status === 'draft') {
        whereClause.shouldPublish = false; // Draft charges (not published)
        orderByClause = { eventRegistrationDate: 'desc' };
      } else if (status === 'deleted') {
        whereClause.isDeleted = 'SOFT_DELETED'; // Soft-deleted charges
        orderByClause = { eventRegistrationDate: 'desc' };
      } else {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      // Fetch charges from the Charges table where the conditions match
      const charges = await prisma.event.findMany({
        where: whereClause,
        orderBy: orderByClause,
        take: limit, // Pagination limit
        skip: offset, // Pagination offset
        select: {
          eventId: true,
          eventName: true,
          eventDescription: true,
          eventRegistrationDate: true,
          feeType: true,
          shouldPublish: true,
          amount: true,
        },
      });


        // Get total count of matching records
        const totalRecords = await prisma.event.count({
          where: whereClause,
        });
      
        
       // Fetch the paid member count for each charge
       const enrichedCharges = await Promise.all(
        charges.map(async (charge) => {
          const paidMemberCount = await getPaidMemberCount(charge.eventId); // Get paid member count from the payment table
          return {
            ...charge,
            totalRecords,
            membersPaid: paidMemberCount, // Add the paid members count
          };
        })
      );

     
      // Send the fetched charge data as a response
      res.status(200).json(JSON.parse(safeJsonStringify(enrichedCharges)));
    } catch (error) {
      console.error('Error fetching charges:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

//fetch user charges for non admin for the normaluser
chargeRouter.get(
  '/fetch-user-charges',
  authenticateToken,
  authenticateRole,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not authenticated'
        });
      }
  
      const encryptedSocietyId = req.query.societyId as string;
      const status = req.query.status as string; // 'pending' or 'paid'
      const userId = req.user.id; // Assuming the userId is stored in req.user after authentication

      console.log('encryptedSocietyId:', encryptedSocietyId);
      console.log('status:', status);

      if (!encryptedSocietyId) {
        return res.status(400).json({ error: 'societyId is required' });
      }

           // Ensure encryptedSocietyId is defined before decrypting
           if (!encryptedSocietyId || !secretKey) {
            throw new Error('Society ID or secret key is missing');
          }
    

      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      if (!societyId) {
        throw new Error('Failed to decrypt society ID');
      }

      
      console.log('Decrypted Society ID:', societyId);

      const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10
      const offset = parseInt(req.query.offset as string, 10) || 0; // Default offset to 0

      // Fetch charges from events table where `feeTypeId` is not null or `eventTypeId` is null
      const charges = await prisma.event.findMany({
        where: {
          societyId: societyId,
          feeTypeId: { not: null },
          eventTypeId: null,
          isDeleted: 'NOT_DELETED',
          shouldPublish:true
        },
        take:limit,
        skip:offset,
        select: {
          eventId: true,
          eventName: true,
          eventRegistrationDate: true,
          amount: true,
          feeType:true
        },
      });

      const totalRecords = await prisma.event.count({
        where: {
          societyId: societyId,
          feeTypeId: { not: null },
          eventTypeId: null,
          isDeleted: 'NOT_DELETED',
          shouldPublish:true
        }
      })

      console.log("tot",totalRecords)

      // Filter charges based on the `status` parameter
      const enrichedCharges = await Promise.all(
        charges.map(async (charge) => {
          const payment = await prisma.subscriptionPayments.findFirst({
            where: {
              eventId: charge.eventId,
              userId: userId,
            },
            select: {
              status: true,
              eventId:true
            },
          });

          // Determine if the user has paid based on the payment status
          const isPaid = payment?.status === 'Completed';
          const isPending = !isPaid;

          // Filter based on the requested status
          if ((status === 'paid' && isPaid) || (status === 'pending' && isPending)) {
            return {
              chargeId:charge.eventId,
              feeName: charge.eventName,
              dueDate: charge.eventRegistrationDate,
              amount: charge.amount,
              status: isPaid ? 'Paid' : 'Pending',
              buttonText: isPaid ? 'Reciept' : 'Pay Now',
              feeType: charge.feeType?.feeType,
              totalRecords
            };
          } else {
            // If it doesn't match the requested status, return null
            return null;
          }
        })
      );

      // Filter out null values (charges that didn't match the status filter)
      const filteredCharges = enrichedCharges.filter((charge) => charge !== null);

      // If no charges found, return an empty array
      if (filteredCharges.length === 0) {
        return res.status(200).json([]);
      }

      console.log('Filtered User Charges:', filteredCharges);
      res.status(200).json(filteredCharges);
    } catch (error) {
      console.error('Error fetching user charges:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);


//fetch payment details of indivuals for the view status of charges page
chargeRouter.get('/fetch-payment-details', async (req: AuthenticatedRequest, res: Response) => {


  try {
    const encryptedSocietyId = req.query.societyId as string;
    const chargeId = req.query.chargeId as string; // Add status to the query (upcoming, past, draft, deleted)

    console.log('encryptedSocietyId:', encryptedSocietyId);
    console.log('chargeId:', chargeId);

    if (!encryptedSocietyId) {
      return res.status(400).json({ error: 'societyId is required' });
    }

         // Ensure encryptedSocietyId is defined before decrypting
         if (!encryptedSocietyId || !secretKey) {
          throw new Error('Society ID or secret key is missing');
        }
  
    const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10
    const offset = parseInt(req.query.offset as string, 10) || 0; // Default offset to 0

    // Decrypt the societyId
    const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
    const societyId = bytes.toString(CryptoJS.enc.Utf8);

    if (!societyId) {
      throw new Error('Failed to decrypt society ID');
    }


  if (!chargeId) {
    return res.status(400).json({ error: 'chargeId is required' });
  }

    // Fetch total count of users in society
    const totalRecords = await prisma.societyMember.count({
      where: { societyId },
    });

  try {

    // Fetch the dueDate (registrationDueDate) from the events table
    const paymentDueDate = await prisma.event.findUnique({
      where: {
        eventId: chargeId, // Assuming eventId corresponds to chargeId
        eventTypeId: null,
        feeTypeId:{
            not:null
        }
      },
      select: {
        eventRegistrationDate: true, // Fetch the due date
        amount:true
      },
    });

    if (!paymentDueDate) {
      return res.status(404).json({ message: 'Event not found' });
    }


    
    // Step 1: Fetch all users linked to the specified societyId from SocietyMember table
const societyMembers = await prisma.societyMember.findMany({
  where: {
    societyId: societyId, // Use the decrypted societyId
  },
  take: limit,
  skip: offset,
  select: {
    userId: true, // Fetch only the userId
  },
});

// Step 2: Extract user IDs from the societyMembers result
const userIds = societyMembers.map((member) => member.userId);

if (userIds.length === 0) {
  return res.status(404).json({ message: 'No users found for the given society.' });
}

// Step 3: Fetch user details for those userIds
const allUsers = await prisma.user.findMany({
  where: {
    userId: {
      in: userIds, // Filter users whose userId exists in the SocietyMember table
    },
    membershipStatusId:1
  },
  select: {
    userId: true,
    firstName: true,
    lastName: true,
    phoneNumber: true,
  },
});

console.log('All users fetched:', allUsers);
      
    // Fetch payment details from the payment table 
    const paymentDetails = await prisma.subscriptionPayments.findMany({
      where: {
        eventId: chargeId, // Assuming eventId corresponds to chargeId in your use case
      },
      select: {
        userId: true,
        amount: true,
        createdAt: true,
        status: true,
        subscriptionPaymentDate:true
      },
    });

    const societyDetails = await prisma.society.findUnique({
      where:{
        societyId:societyId
      },
      select:{
        societyName:true,
        streetName:true,
        state:true,
        pincode:true
      }
    })
    
    const userPaymentsMap = new Map();
    paymentDetails.forEach((payment) => {
      userPaymentsMap.set(payment.userId, payment);
    });

    const enrichedPayments = await Promise.all(
      allUsers.map(async (user) => {
        const payment = userPaymentsMap.get(user.userId);
        const profilePic = await prisma.media.findFirst({
          where: {
            tableId: user.userId,
            tableType: 'user',
            type: 'image',
          },
          select: {
            data: true,
          },
        });

        const profilePicBase64 = profilePic
          ? `data:image/png;base64,${profilePic.data.toString('base64')}`
          : null;


          const societyLogo = await prisma.media.findFirst({
            where:{
              tableId:societyId,
              tableType:'society',
              type:'image',
              eventId:null,
              userId:null,
              landingCardId:null,
              sliderCardId:null
            },
            select:{
              data:true
            }
          })
      
          const societyLogoBase64 = societyLogo
          ? `data:image/png;base64,${societyLogo.data.toString('base64')}`
          : null;

          return {
            userId: user.userId,
            userName: `${user.firstName} ${user.lastName}`,
            userMobile: user.phoneNumber,
            dueDate: paymentDueDate.eventRegistrationDate,
            FeeAmount: paymentDueDate.amount,
            profilePicture: profilePicBase64,
            amount: payment?.amount || 0,
            createdAt: payment?.createdAt || null,
            status: payment?.status || 'Not Paid',
            societyDetails:societyDetails,
            paidDate: payment?.subscriptionPaymentDate || null,
            societyLogoBase64:societyLogoBase64,
            totalRecords
          };
      })
    );

    return res.status(200).json(enrichedPayments);
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} catch (error) {
  console.error('Error processing the request:', error);
  return res.status(500).json({ error: 'Internal Server Error' });
}
});


//fetch the indivual charges according to chargeId for edit charge or display or copy
chargeRouter.get('/fetch-charge-receipt', authenticateToken, authenticateRole, async (req, res) => {
  try {
    const encryptedSocietyId = req.query.societyId as string;
    const chargeId = req.query.chargeId as string;

    console.log('Fetching charge for chargeId:', chargeId);
    console.log('Encrypted societyId:', encryptedSocietyId);

    if (!encryptedSocietyId) {
      return res.status(400).json({ error: 'societyId is required' });
    }

         // Ensure encryptedSocietyId is defined before decrypting
         if (!encryptedSocietyId || !secretKey) {
          throw new Error('Society ID or secret key is missing');
        }
  

    if (!chargeId) {
      return res.status(400).json({ error: 'chargeId is required' });
    }

    // Decrypt societyId (if it's encrypted)
    const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
    const societyId = bytes.toString(CryptoJS.enc.Utf8);

    if (!societyId) {
      throw new Error('Failed to decrypt society ID');
    }

    console.log('Decrypted societyId:', societyId);

    // Fetch the charge (event) details from the database
    const charge = await prisma.event.findFirst({
      where: {
        eventId: chargeId,
        societyId: societyId, // Ensure it matches the societyId
        // isDeleted: 'NOT_DELETED', // Ensure you are fetching non-deleted charges
        eventTypeId: null,
        feeTypeId:{
            not:null
        }

      },
      select: {
        eventId: true,
        eventName: true,
        eventDescription: true,
        eventRegistrationDate: true,
        amount: true, // Add fields that you want to retrieve
        feeType: true,
        shouldPublish: true,
      },
    });

    if (!charge) {
      return res.status(404).json({ error: 'Charge not found' });
    }

    console.log("fetch-charge",charge);
    // Fetch subscription payment details for the charge and user
    const subscriptionPayment = await prisma.subscriptionPayments.findFirst({
      where: {
        eventId: chargeId,
      },
      select: {
        subscriptionPaymentDate: true,
        gatewayResponse: true,
        paymentId:true,
        createdById:true
      },
    });

    console.log("fetch-charge subscriptionPayment",subscriptionPayment);

    const society = await prisma.society.findUnique({
      where:{
        societyId:societyId
      },
      select:{
        societyName:true,
        streetName:true,
        state:true,
        pincode:true
      }
    })


    console.log("fetch-charge society",society); 

    const societyLogo = await prisma.media.findFirst({
      where:{
        tableId:societyId,
        tableType:'society',
        type:'image',
        eventId:null,
        userId:null,
        landingCardId:null,
        sliderCardId:null
      },
      select:{
        data:true
      }
    })

    const societyLogoBase64 = societyLogo
    ? `data:image/png;base64,${societyLogo.data.toString('base64')}`
    : null;


    let createdBy = null;
    let PhoneNumber = null;
    let buildingDoorNumber = null;
    let flatNumber = null;


    if (subscriptionPayment) {
      // Fetch the user details for the `createdBy` field if subscriptionPayment exists
      const user = await prisma.user.findUnique({
        where: {
          userId: subscriptionPayment.createdById,
        },
        select: {
          firstName: true,
          lastName: true,
          phoneNumber:true,
          buildingDoorNumber:true,
          flatNumber:true,

        },
      });

      if (user) {
        createdBy = `${user.firstName} ${user.lastName}`;
        PhoneNumber = user.phoneNumber; // Correctly assigning the phone number
        buildingDoorNumber = user.buildingDoorNumber; // Assuming this is intended
        flatNumber = user.flatNumber; // Assuming this is intended
          }

        // Prepare the response, including `subscriptionPayment` only if it exists
        const response = {
          ...charge,
          societyLogoBase64,
          subscriptionPayment: subscriptionPayment
            ? {
                ...subscriptionPayment,
                createdBy,
                PhoneNumber,
                buildingDoorNumber,
                flatNumber,
                society
              }
            : null,
        };
    // Send the fetched charge data as a response
    res.status(200).json(JSON.parse(safeJsonStringify(response)));
  }} catch (error) {
    console.error('Error fetching charge:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
);

chargeRouter.get('/fetch-charge', authenticateToken, authenticateRole, async (req, res) => {
  try {
    const encryptedSocietyId = req.query.societyId as string;
    const chargeId = req.query.chargeId as string;

    console.log('Fetching charge for chargeId:', chargeId);
    console.log('Encrypted societyId:', encryptedSocietyId);

    if (!encryptedSocietyId) {
      return res.status(400).json({ error: 'societyId is required' });
    }

         // Ensure encryptedSocietyId is defined before decrypting
         if (!encryptedSocietyId || !secretKey) {
          throw new Error('Society ID or secret key is missing');
        }
  
    if (!chargeId) {
      return res.status(400).json({ error: 'chargeId is required' });
    }

    // Decrypt societyId (if it's encrypted)
    const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
    const societyId = bytes.toString(CryptoJS.enc.Utf8);

    if (!societyId) {
      throw new Error('Failed to decrypt society ID');
    }

    console.log('Decrypted societyId:', societyId);

    // Fetch the charge (event) details from the database
    const charge = await prisma.event.findFirst({
      where: {
        eventId: chargeId,
        societyId: societyId, // Ensure it matches the societyId
        // isDeleted: 'NOT_DELETED', // Ensure you are fetching non-deleted charges
        eventTypeId: null,
        feeTypeId:{
            not:null
        }

      },
      select: {
        eventId: true,
        eventName: true,
        eventDescription: true,
        eventRegistrationDate: true,
        amount: true, // Add fields that you want to retrieve
        feeType: true,
        shouldPublish: true,
      },
    });

    if (!charge) {
      return res.status(404).json({ error: 'Charge not found' });
    }

    // Fetch subscription payment details for the charge and user
    const subscriptionPayment = await prisma.subscriptionPayments.findFirst({
      where: {
        eventId: chargeId,
      },
      select: {
        subscriptionPaymentDate: true,
        gatewayResponse: true,
        paymentId:true,
        createdById:true
      },
    });

    let createdBy = null;

    if (subscriptionPayment) {
      // Fetch the user details for the `createdBy` field if subscriptionPayment exists
      const user = await prisma.user.findUnique({
        where: {
          userId: subscriptionPayment.createdById,
        },
        select: {
          firstName: true,
          lastName: true,
        },
      });

      if (user) {
        createdBy = `${user.firstName} ${user.lastName}`;
      }
    }

// Prepare the response, including `subscriptionPayment` only if it exists
const response = {
  ...charge,
  subscriptionPayment: subscriptionPayment
    ? {
        ...subscriptionPayment,
        createdBy,
      }
    : null,
};
    // Send the fetched charge data as a response
    res.status(200).json(JSON.parse(safeJsonStringify(response)));
  } catch (error) {
    console.error('Error fetching charge:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// PUT route to update an existing charge
chargeRouter.put(
  '/edit-charge/:chargeId', // Ensure route path includes chargeId
  authenticateToken,
  authenticateRole,
  async (req: AuthenticatedRequest, res: Response) => {
    const {
      name,
      description,
      dueDate,
      amount,
      feeType,
      shouldPublish,
      isDeleted,
      encryptedSocietyId,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated'
      });
    }

    
    if (req.isAdmin !== 'admin') {
      return res.status(702).send('You are not authorized to create a designation.');
    }
    const { chargeId } = req.params; // Extract chargeId from route parameters

    if (!chargeId) {
      return res.status(400).json({
        success: false,
        message: 'Charge ID is required',
      });
    }

         // Ensure encryptedSocietyId is defined before decrypting
         if (!encryptedSocietyId || !secretKey) {
          throw new Error('Society ID or secret key is missing');
        }
  

    try {
      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      if (!societyId) {
        throw new Error('Failed to decrypt society ID');
      }

      let feeTypeId;

      // Check if feeType is provided, otherwise skip the feeType logic
      if (feeType) {
        const existingFeeType = await prisma.feeTypeMaster.findFirst({
          where: {
            feeType: {
              equals: feeType,
              mode: 'insensitive', // Case-insensitive search
            },
          },
        });

        if (existingFeeType) {
          feeTypeId = existingFeeType.id;
        } else {
          const newFeeType = await prisma.feeTypeMaster.create({
            data: { feeType },
          });
          feeTypeId = newFeeType.id;
        }
      }

      // Update the charge in the event (charges) table using Prisma
      const updatedCharge = await prisma.event.update({
        where: {
          eventId: chargeId, // The charge ID to update
        },
        data: {
          eventName: name || undefined, // Only update if name is provided
          eventDescription: description || undefined, // Only update if description is provided
          eventRegistrationDate: dueDate ? new Date(dueDate) : undefined, // Format the date properly
          amount: amount ? amount.toString() : undefined, // Ensure amount is a string
          feeTypeId: feeTypeId || undefined, // Use the ID of the fee type if available
          shouldPublish: shouldPublish !== undefined ? shouldPublish : false, // Default to false if not provided
          isDeleted: isDeleted ?? 'NOT_DELETED', // Default to 'NOT_DELETED'
          createdById: req.user.id,
          societyId:societyId, // Decrypted societyId
          modifiedById: req.user.id, // Assuming user information is available in the request

          // Optional fields
          eventStartDate: dueDate ? new Date(dueDate) : undefined,
          eventEndDate: dueDate ? new Date(dueDate) : undefined,
          eventStartTime: dueDate ? new Date(dueDate) : undefined,
          eventEndTime: dueDate ? new Date(dueDate) : undefined,
          eventTypeId: null, // Adjust this as needed
          maxPeopleAllowed: '', // Optional
          acceptDonation: null, // Optional
          ChargePerPerson: null, // Optional
          allowFamilyandFriends: false, // Optional
        },
      });

      // Send response with updated charge data
      res.status(200).json({
        success: true,
        message: 'Charge updated successfully',
        data: JSON.parse(safeJsonStringify(updatedCharge)),
      });
    } catch (error: any) {
      console.error('Error updating charge:', error.message);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
);


//soft delete charge from upcoming tab
chargeRouter.put(
  '/soft-delete-charge/:chargeId',
  authenticateToken,
  authenticateRole,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated'
      });
    }

 
    if (req.isAdmin !== 'admin') {
      return res.status(702).send('You are not authorized to create a designation.');
    }

    const { chargeId } = req.params;

    if (!chargeId) {
      return res.status(400).json({
        success: false,
        message: 'Charge ID is required',
      });
    }

    try {
      // Find the charge to be soft-deleted
      const charge = await prisma.event.findUnique({
        where: {
          eventId: chargeId,
          eventTypeId:null,
          feeTypeId:{
            not:null
          }
        },
      });

      if (!charge) {
        return res.status(404).json({
          success: false,
          message: 'Charge not found',
        });
      }

      // Perform the soft delete by updating the `isDeleted` field
      const updatedCharge = await prisma.event.update({
        where: {
          eventId: chargeId,
        },
        data: {
          isDeleted: 'SOFT_DELETED', // Soft delete the charge
          modifiedById: req.user.id, // Set the user who performed the soft-delete
        },
      });

      console.log('Soft Deleted Charge:', updatedCharge);

      // Send response with success message
      res.status(200).json({
        success: true,
        message: 'Charge Deleted Successfully',
        data: JSON.parse(safeJsonStringify(updatedCharge)) ,
      });
    } catch (error: any) {
      console.error('Error soft deleting charge:', error.message);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
);

  // PUT route to hard delete a charge if no payments are associated with it
chargeRouter.put(
  '/hard-delete-charge/:chargeId',
  authenticateToken,
  authenticateRole,
  async (req: AuthenticatedRequest, res: Response) => {
    
    if (req.isAdmin !== 'admin') {
      return res.status(702).send('You are not authorized to create a designation.');
    }
    const { chargeId } = req.params;

    try {
      // Check if there are any payments associated with this charge (eventId)
      const payments = await prisma.subscriptionPayments.findMany({
        where: {
          eventId: chargeId, // Assuming eventId is the foreign key in the payment table for charges
          status: 'Completed', // Only check for completed payments
        },
      });

      // If there are any payments, prevent deletion
      if (payments.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the charge. Payments have been made.',
        });
      }

      // If no payments, proceed with hard deletion
      const deletedCharge = await prisma.event.delete({
        where: {
          eventId: chargeId, // Use chargeId (which is eventId) for deletion
        },
      });

      console.log('Charge hard deleted:', deletedCharge);

      // Respond with success
      return res.status(200).json({
        success: true,
        message: 'Charge hard deleted successfully',
        data: JSON.parse(safeJsonStringify(deletedCharge)),
      });
    } catch (error: any) {
      console.error('Error hard deleting charge:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
);


//fetch feeType
chargeRouter.get('/fetch-fee-type', async (req: Request, res: Response) => {

  try {
    const encryptedSocietyId = req.query.societyId as string;

    console.log('encryptedSocietyId:', encryptedSocietyId);


    if (!encryptedSocietyId) {
      return res.status(400).json({ error: 'societyId is required' });
    }
         // Ensure encryptedSocietyId is defined before decrypting
         if (!encryptedSocietyId || !secretKey) {
          throw new Error('Society ID or secret key is missing');
        }
  

    // Decrypt the societyId
    const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
    const societyId = bytes.toString(CryptoJS.enc.Utf8);

    if (!societyId) {
      throw new Error('Failed to decrypt society ID');
    }

// Fetch the feeTypeId(s) associated with the given societyId from the events table
const eventData = await prisma.event.findMany({
  where: {
    societyId: societyId,
  },
  select: {
    feeTypeId: true,
  },
});

    // Extract unique feeTypeIds from the event data, filtering out null values
    const feeTypeIds = [...new Set(eventData.map(event => event.feeTypeId).filter(id => id !== null))];

    if (feeTypeIds.length === 0) {
      return res.status(404).json({ message: 'No fee types found for the specified society' });
    }

  try {


    const fetchedFeeType = await prisma.feeTypeMaster.findMany({
     
      where: {
        id: { in: feeTypeIds },
      },
      select: {
        id:true,
        feeType: true, 
      },
    });

    
console.log("fetchedFeeType",fetchedFeeType)
    return res.status(200).json(JSON.parse(safeJsonStringify(fetchedFeeType)));
  } catch (error) {
    console.error('Error fetching fee type:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} catch (error) {
  console.error('Error processing the request:', error);
  return res.status(500).json({ error: 'Internal Server Error' });
}
});

export default chargeRouter;
