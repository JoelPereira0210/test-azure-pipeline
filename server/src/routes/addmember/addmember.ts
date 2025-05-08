import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  AuthenticatedRequest,
  authenticateMembership,
  authenticateRole,
  authenticateToken,
} from '../../middlewares/authorizeUser';
import { safeJsonStringify } from '../../utils/helperFunction';


import CryptoJS from 'crypto-js';
import { CONFIG } from '../../utils/config';
const secretKey = CONFIG.SECRET_KEY || '' ;

const prisma = new PrismaClient();
const addMemberRouter = express.Router();



addMemberRouter.get(
    '/fetchMemberData',
    authenticateToken,
    authenticateRole,
    async (req: AuthenticatedRequest, res: Response) => {
      const contextUserId = req.query.contextUserId as string;
      const encryptedSocietyId = req.query.societyId as string;

      console.log("contextUserId", contextUserId);
      console.log("fetchMemberData encryptedSocietyId",encryptedSocietyId);
      if (req.isAdmin !== 'admin') {
        return res.status(702).send('You are not authorized to view this data.');
      }
      try {
        
      //    Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      if (!societyId) {
        return res.status(400).json({ message: 'Failed to decrypt society ID' });
      }

      console.log("fetchMemberData Decrypted Society ID:", societyId);
        // Fetch the user data from the User table
        const user = await prisma.user.findUnique({
          where: { userId: contextUserId }, // Assuming userId is the primary key
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
            isAdmin: true,
            gender: true,membershipStatusId:true
          },
        });

        
  
        if (user) {
          console.log('Fetched user data:', user); // Log the fetched user data
  
          // Fetch the first role from the societyMember table
          const societyMember = await prisma.societyMember.findFirst({
            where: {
              userId: contextUserId, // Match userId
              societyId: societyId, // Match societyId
            },
            select: {
              roleId: true, // Fetch roleId
              isAdmin: true, // Fetch isAdmin from SocietyMember table
            },
          });
  
          if (societyMember) {
            const roleId = societyMember.roleId; // Extract roleId
  
            const societyMemberIsAdmin = societyMember.isAdmin;

               // Determine final isAdmin value
            // const finalIsAdmin = user.isAdmin || societyMemberIsAdmin;
            const finalIsAdmin = societyMemberIsAdmin;


            // Fetch the corresponding designationName from committeeRoleMaster table
            const designation = await prisma.committeeRoleMaster.findUnique({
              where: {
                designationId: roleId, // Match roleId with designationId (PK)
              },
              select: {
                designationName: true, // Fetch designationName
              },
            });
  
            // if (designation) {
            //   // Return the user data along with the designationName
            //   return res.status(200).json({
            //     ...user,
            //     designationName: designation.designationName, // Pass single designationName instead of an array
            //   });
            // } 
            if (designation) {
              // Prepare the response object
              const finalResponse = {
                ...user,
                isAdmin: finalIsAdmin,
                designationName: designation.designationName,
              };
  
              // Use safeJsonStringify to handle BigInt serialization
              const safeResponse = safeJsonStringify(finalResponse);
  
              // Return the safely stringified and re-parsed response
              return res.status(200).json(JSON.parse(safeResponse));
            } 
            else {
              console.log('Designation not found for roleId:', roleId);
              return res.status(203).json({ message: 'Designation not found' });
            }
          } else {
            console.log('User found in User table but not found in societyMember table');
            return res.status(203).json({ message: 'User not found in societyMember table' });
          }
        } else {
          console.log('User not found');
          return res.status(203).json({ message: 'User not found' });
        }
      } catch (error) {
        console.error('Error fetching member data:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }
  );
  

  addMemberRouter.get(
    '/fetchEventDetails',
    authenticateToken,
    authenticateRole,
    async (req: AuthenticatedRequest, res: Response) => {
      const contextUserId = req.query.contextUserId as string;
      console.log("contextUserId in event", contextUserId);
      const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10
      const offset = parseInt(req.query.offset as string, 10) || 0; // Default offset to 0
  
      if (req.isAdmin !== 'admin') {
        return res.status(702).send( 'You are not authorized to access event details.' );
      }
      try {
        // Step 1: Fetch all eventIds from the payment table
        const paymentRecords = await prisma.subscriptionPayments.findMany({
          where: {
            userId: contextUserId,
          },
          select: {
            eventId: true,
          },
        });
  
        if (paymentRecords.length === 0) {
          console.log("No payment records found for this user.");
          return res.status(203).json({ message: "No events found." });
        }
  
        // Step 2: Extract eventIds from the payment records
        const eventIds = paymentRecords.map(record => record.eventId).filter((id): id is string => id !== null);

        const totalRecords = await prisma.event.count({
          where: {
            eventId: { in: eventIds}, // Ensure eventIds is an array
            eventTypeId: { not: null }, // Only fetch events with a non-null eventTypeId
            isDeleted: 'NOT_DELETED',
          },
        });
  
        // Step 3: Fetch event details from the Event table based on the fetched eventIds
        const eventDetails = await prisma.event.findMany({
          where: {
            eventId: { in: eventIds },
            eventTypeId: { not: null }, // Only fetch events with a non-null feeTypeId
            isDeleted: 'NOT_DELETED',
          },
          skip: offset,  // Apply offset
          take: limit,   // Apply limit
          select: {
            eventName: true,
            eventStartDate: true,
            eventTypeId: true,
          },
        });
  
        if (eventDetails.length > 0) {
          // Log found event details
          console.log("Event Details:", eventDetails);
  
          // Step 4: Fetch event types corresponding to the fetched eventTypeIds
          const eventTypeIds = eventDetails.map(event => event.eventTypeId).filter((id): id is bigint => id !== null);
          const eventTypes = await prisma.eventTypeMaster.findMany({
            where: {
              id: { in: eventTypeIds },
            },
            select: {
              id: true,
              eventType: true, // Assuming eventType is the column name in eventTypeMaster
            },
          });
  
          // Create a map of eventTypeId to eventType for easy lookup
          const eventTypeMap = new Map(eventTypes.map(eventType => [eventType.id, eventType.eventType]));
  
          // Attach the corresponding eventType to each event detail without including eventTypeId
          const enrichedEventDetails = eventDetails.map(event => ({
            eventName: event.eventName,
            eventStartDate: event.eventStartDate,
            eventType: event.eventTypeId ? eventTypeMap.get(event.eventTypeId) : null, // Add eventType, if available
            totalRecords
          }));
  
          // Log enriched event details
          console.log("Enriched Event Details:", enrichedEventDetails);
  
          // Use safeJsonStringify to serialize enrichedEventDetails
          res.status(200).json(JSON.parse(safeJsonStringify(enrichedEventDetails)));
        } else {
          // If no events are found, respond with 203
          console.log("No events found for the fetched eventIds.");
          res.status(203).json({ message: "No events found." });
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        res.status(500).json({ error: 'Error fetching event details' });
      }
    }
  );









  addMemberRouter.get(
    '/fetchDesignation',
    authenticateToken,
    authenticateRole,
    async (req: Request, res: Response) => {
      const contextUserId = req.query.contextUserId as string;
      const encryptedSocietyId = req.query.societyId as string;

      console.log("contextUserId in fetchDesi:", contextUserId);
    
      try {

         //    Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      if (!societyId) {
        return res.status(400).json({ message: 'Failed to decrypt society ID' });
      }

      console.log("societyId in fetchDesi",societyId);
        // Fetch all matching members from societyMember table where userId matches contextUserId
        const members = await prisma.societyMember.findMany({
          where: {
            userId: contextUserId, // Match with the userId field
            societyId:societyId
          },
          select: {
            societyId: true, // Select only the societyId field
          },
        });
    
        console.log("fetchDesignation members",members);

        if (members.length > 0) {
          // If members are found, log their societyIds
          const societyIds = members.map(member => member.societyId);
          console.log("Fetched societyIds:", societyIds);
          
          // Fetch designationNames and their designationIds from committeeRoleMaster table
          const roles = await prisma.committeeRoleMaster.findMany({
            where: {
              societyId: {
                in: societyIds, // Match with the societyId field
              },
              isDeleted: false, // Check for non-deleted records
              designationName: {
                not: 'societySuperAdmin', // Exclude 'societySuperAdmin'
              },
            },
            select: {
              designationName: true, // Select designationName
              designationId: true, // Select designationId
            },
          });
  
          // Check if roles are found
          if (roles.length > 0) {
            console.log("Fetched roles:", roles);
            // Return the roles in the response
            res.json({ roles });
          } else {
            console.log("No roles found for the provided societyIds");
            res.status(404).json({ error: 'No roles found' });
          }
        } else {
          console.log("No members found with the provided userId");
          res.status(404).json({ error: 'Member not found' });
        }
      } catch (error) {
        console.error("Error fetching designation:", error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  );




  addMemberRouter.patch(
    '/update-member-data/:contextUserId',
    authenticateToken,
    authenticateRole,authenticateMembership,
    async (req: AuthenticatedRequest, res: Response) => {
      const { contextUserId } = req.params; // Get userId from route parameters
      const { designationId, designationName, adminPrivilege,societyId:encryptedSocietyId } = req.body; // Extract data from the body
  
       // Decrypt the societyId
       const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
       const societyId = bytes.toString(CryptoJS.enc.Utf8);
 
       if (!societyId) {
         throw new Error('Failed to decrypt society ID');
       }

      // Log the received data
      console.log("Received update request for userId:", contextUserId);
      if (req.isAdmin !== 'admin') {
        return res.status(702).send('You are not authorized to upddate data.');
      }
      try {
        // Check if the user exists
        const existingUser = await prisma.user.findUnique({
          where: { userId: contextUserId, isDeleted: false }, // Ensure user is not deleted
        });
  
        // If user doesn't exist, return a 404 error
        if (!existingUser) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        // Handle designation update if designationId and designationName are provided
        if (designationId && designationName) {
          // Check if the designationName is "Member"
          if (designationName === "member") {
            // Directly update without checking remaining positions
           const updatedSocietyMember = await prisma.societyMember.update({
              where:{
                userId_societyId:{
                  userId:contextUserId,
                  societyId:societyId
               }
              },
             
              // where: { userId: contextUserId,societyId:societyId }, // Match with userId in societyMember table
              data: { roleId: designationId }, // Update the roleId with designationId received
            });

            console.log("updatedSocietyMemberrr",updatedSocietyMember);
  
            console.log("Designation 'Member' successfully updated for userId:", contextUserId);

        
          } else {
            // Existing logic for other designations
            const roleDetails = await prisma.committeeRoleMaster.findUnique({
              where: { designationId,societyId:societyId }, // Match the designationId (PK)
            });
  

            // If role details are not found, return a 404 error
            if (!roleDetails) {
              return res.status(404).json({ message: 'Role not found in committeeRoleMaster table' });
            }
  
            // Log the fetched designationName and numberOfPositions
            console.log(
              "Fetched Role Details:",
              "Designation Name:", roleDetails.designationName,
              "Number of Positions:", roleDetails.numberOfPositions
            );
  
            const societyMembers = await prisma.societyMember.findMany({
              where: { roleId: designationId }, // Match the roleId (non-primary key)
            });
  
            // Log the count of matched records
            const matchedCount = societyMembers.length;
            console.log(`Total matched records: ${matchedCount}`);
  
            const remainingPositions = roleDetails.numberOfPositions - matchedCount;
            console.log(`Remaining positions: ${remainingPositions}`);
  
            // Check if remaining positions are less than 1, if so, return an error and don't update
            if (remainingPositions < 1) {
              console.log("No positions available for this designation. Cannot proceed with update.");
              return res.status(400).json({ message: 'You cannot proceed with updating the designation because no positions are available.' });
            }
  
            // Proceed with updating the roleId in the societyMember table
            await prisma.societyMember.update({
              where:{
                userId_societyId:{
                  userId:contextUserId,
                  societyId:societyId
               }
              },
             
              // where: { userId: contextUserId }, // Match with userId in societyMember table
              data: { roleId: designationId }, // Update the roleId with designationId received
            });
  
            console.log("Designation successfully updated for userId:", contextUserId);
          }
        } else {
          console.log("User has not changed the designation.");
        }
  
        // Handle admin privilege update if adminPrivilege is provided
        if (adminPrivilege) {
          // Convert adminPrivilege to boolean
          const isAdmin = adminPrivilege === 'Yes'; // Assuming 'Yes' means true and anything else means false
  
          // Update the user's isAdmin field in the user table
          await prisma.user.update({
            where: { userId: contextUserId },
            data: { isAdmin },
          });

          await prisma.societyMember.update({
            where: {
              userId_societyId: {
                userId: contextUserId, // Replace with the correct identifier
                societyId: societyId, // Ensure societyId is available in your logic
              },
            },
            data: { isAdmin },
          });
  
          console.log("Admin privilege successfully updated for userId:", contextUserId);
        } else {
          console.log("User has not changed the admin privilege.");
        }
  
        // Create a response object
        const responseUser = {
          ...existingUser,
          userId: existingUser.userId.toString(), // Convert BigInt to string if necessary
        };
  
        // Use safeJsonStringify to serialize the response
        return res.status(200).json(JSON.parse(safeJsonStringify(responseUser)));
      } catch (error) {
        console.error("Error updating user data:", error);
        return res.status(500).json({ message: 'Error updating member data', error });
      }
    }
  );





addMemberRouter.get(
  '/fetchMaintenanceDetails',
  authenticateToken,
  authenticateRole,
  async (req: AuthenticatedRequest, res: Response) => {
    const contextUserId = req.query.contextUserId as string;
    console.log("contextUserId in maint", contextUserId);
    const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit
    const offset = parseInt(req.query.offset as string, 10) || 0; // Default offset
    if (req.isAdmin !== 'admin') {
      return res.status(702).send( 'You are not authorized to access event details.' );
    }
    try {
      // Step 1: Fetch all eventIds from the payment table
      const paymentRecords = await prisma.subscriptionPayments.findMany({
        where: {
          userId: contextUserId,
        },
        skip: offset,
        take: limit,
        select: {
          eventId: true,
          amount: true,
          status: true
        },
      });
      console.log("payment records", paymentRecords);

      // const totalRecords = await prisma.subscriptionPayments.count({
      //   where: {
      //     userId: contextUserId,
      //   },
      // });

      if (paymentRecords.length === 0) {
        console.log("No payment records found for this user.");
        return res.status(203).json({ message: "No events found." });
      }

      // Step 2: Extract eventIds from the payment records and filter out null values
      const eventIds = paymentRecords.map(record => record.eventId).filter((id): id is string => id !== null);
      console.log("eventIds for main", eventIds);

      // Step 3: Fetch event details from the Event table based on the fetched eventIds (filtering on feeTypeId)
      const eventDetails = await prisma.event.findMany({
        where: {
          eventId: { in: eventIds },
          feeTypeId: { not: null }, // Only fetch events with a non-null feeTypeId
          isDeleted: 'NOT_DELETED',
        },
        select: {
          eventId: true,
          eventName: true,
          eventRegistrationDate: true,
        },
      });

      if (eventDetails.length === 0) {
        console.log("No events found with non-null feeTypeId.");
        return res.status(203).json({ message: "No events found with feeTypeId." });
      }

      // Log the filtered event details
      console.log("Filtered Event Details:", eventDetails);

      // Step 4: Now take the filtered eventIds from eventDetails and match them with the payment table to fetch corresponding status and amount
      const filteredEventIds = eventDetails.map(event => event.eventId);

      // Step 5: Fetch corresponding payment details for the filtered eventIds
      const filteredPaymentRecords = paymentRecords.filter(payment => 
        payment.eventId && filteredEventIds.includes(payment.eventId)
      );
      
      console.log("Filtered Payment Records:", filteredPaymentRecords);

      // Step 6: Combine filtered event details with their corresponding payment details
      const combinedDetails = eventDetails.map(event => {
        const paymentRecord = filteredPaymentRecords.find(record => record.eventId === event.eventId);
        return {
          eventId: event.eventId,
          eventName: event.eventName,
          eventRegistrationDate: event.eventRegistrationDate,
          amount: paymentRecord ? paymentRecord.amount : null,
          status: paymentRecord ? (paymentRecord.status === 'Completed' ? 'Paid' : 'Unpaid') : 'Unpaid', // Check status and set 'Paid'/'Unpaid'
          totalRecords:eventDetails.length
        };
      });

      // Log the combined details
      console.log("Combined Event and Payment Details:", combinedDetails);

      // Step 7: Check if any combined data is found, send appropriate status
      if (combinedDetails.length === 0) {
        console.log("No combined event and payment details found.");
        return res.status(203).json({ message: "No combined data found." });
      }

      return res.status(200).json(combinedDetails); // Send the combined details as a response
    } catch (error) {
      console.error("Error fetching event and payment details:", error);
      res.status(500).json({ error: 'Error fetching event and payment details' });
    }
  }
);

  
  
  export default addMemberRouter;
  
  

  