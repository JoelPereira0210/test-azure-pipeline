import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  AuthenticatedRequest,
  authenticateMembership,
  authenticateRole,
  authenticateToken,
} from '../../middlewares/authorizeUser';
import CryptoJS from 'crypto-js';
import { CONFIG } from '../../utils/config';
import { safeJsonStringify } from '../../utils/helperFunction';

const prisma = new PrismaClient();
const designationRouter = express.Router();
const env = process.env.NODE_ENV || 'development';
const secretKey = CONFIG.SECRET_KEY;

designationRouter.post(
  '/create-designation',
  authenticateToken,
  authenticateRole,authenticateMembership,
  async (req: AuthenticatedRequest, res: Response) => {
    let { designationName, numberOfPositions, adminPrivileges } = req.body;

    const societyId = req.role?.societyId;
    if (req.isAdmin !== 'admin') {
      return res.status(702).send('You are not authorized to create a designation.');
    }
    try {
      // Trim the designationName to remove extra spaces
      // designationName = designationName.trim();
      designationName = designationName.trim().toLowerCase();

      // Validate the request body
      if (!designationName || !numberOfPositions) {
        return res.status(400).send('Missing required fields');
      }

      // Check if the designation already exists in a case-insensitive and trimmed manner
      const existingDesignation = await prisma.committeeRoleMaster.findFirst({
        where: {
          societyId,
          designationName: {
            equals: designationName, // Designation is already trimmed
            mode: 'insensitive', // Case-insensitive match
          },
          isDeleted: false, // Only check active records
        },
      });

      if (existingDesignation) {
        console.log('This designation already exists.');
        return res.status(409).send('This designation already exists.');
      }

      // If the designation does not exist, create a new designation
      const newDesignation = await prisma.committeeRoleMaster.create({
        data: {
          designationName: designationName, // Store trimmed name
          numberOfPositions,
          adminPrivileges,
          createdDate: new Date(),
          createdById: req.role.userId,
          societyId,
          modifiedDate: new Date(),
          modifiedById: req.role.userId,
          isDeleted: false,
        },
      });

      res.status(201).json(newDesignation);
    } catch (error) {
      console.error('Error creating designation:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);


designationRouter.patch(
  '/update-designation/:designationId',
  authenticateToken,
  authenticateRole,authenticateMembership,
  async (req:  AuthenticatedRequest, res: Response) => {
console.log("admin",req.isAdmin)
   
    const { designationName, numberOfPositions, adminPrivileges } = req.body;

    const designationId = req.params.designationId; // Get designationId from URL parameters
    const societyId = req.role?.societyId;
    
    console.log('New update data:', req.body);
    if (req.isAdmin !== 'admin') {
      return res.status(704).send('You are not authorized to create a designation.');
    }
    try {
      // Validate the request body
      if (!designationId || numberOfPositions === undefined) {
        return res.status(400).send('Missing required fields');
      }

      // Check if the designation exists
      const existingDesignation = await prisma.committeeRoleMaster.findFirst({
        where: {
          designationId,
          societyId,
          isDeleted: false, // Ensure you're only looking at active records
        },
      });

      if (!existingDesignation) {
        return res.status(404).send('Designation not found');
      }


      const assignedUsers = await prisma.societyMember.findMany({
        where: {
          roleId: designationId,
        },
        select: {
          userId: true,
        },
      });

      // Log the user IDs assigned to this designation
      if (assignedUsers.length > 0) {
        const userIds = assignedUsers.map(user => user.userId);
        console.log(
          `Users currently assigned to this designation (ID: ${designationId}): ${userIds.join(', ')}`
        );
      } else {
        console.log(`No users are currently assigned to this designation (ID: ${designationId}).`);
      }
      const matchedCount = assignedUsers.length;
      console.log("counttt",matchedCount)

      if (numberOfPositions < matchedCount) {
        return res.status(809).send(`Update failed. Number of positions (${numberOfPositions}) cannot be less than the count of assigned users (${matchedCount}).`);
      }
      

      // Normalize the designation name
      const normalizedDesignationName = designationName?.trim().toLowerCase();

      // Check for duplicates, including the current designation
      const duplicateDesignation = await prisma.committeeRoleMaster.findFirst({
        where: {
          societyId,
          designationName: {
            equals: normalizedDesignationName,
            mode: 'insensitive',
          },
          isDeleted: false,
          NOT: {
            designationId: existingDesignation.designationId, // Exclude the current designation
          },
        },
      });

      // If a duplicate is found, retain the existing name and don't update
      if (duplicateDesignation) {
        return res
          .status(409)
          .send(
            'This designation already exists. Update failed. The designation name will remain unchanged.'
          );
      }

      // Prepare the update data
      const updateData: any = {
        numberOfPositions,
        adminPrivileges,
        modifiedDate: new Date(),
        modifiedById: req.role.userId,
      };

      // Update the designation name only if it’s not a duplicate
      if (normalizedDesignationName) {
        updateData.designationName = normalizedDesignationName; // Only update the name if it’s valid
      }

      // Proceed with the update
      const updatedDesignation = await prisma.committeeRoleMaster.update({
        where: {
          designationId,
        },
        data: updateData,
      });

      return res.status(200).json(updatedDesignation);
    } catch (error) {
      console.error('Error updating designation:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

designationRouter.delete(
  '/delete-designation/:designationId',
  authenticateToken,
  authenticateRole,authenticateMembership,
  async (req:  AuthenticatedRequest, res: Response) => {
    const { designationId } = req.params;
    const societyId = req.role?.societyId;
    console.log("admin",req.isAdmin)
    if (req.isAdmin !== 'admin') {
      return res.status(403).send('Unauthorized: Only admin can delete designations');
    }
    try {
      // Step 1: Check if designation exists in committeeRoleMaster table
      const existingDesignation = await prisma.committeeRoleMaster.findFirst({
        where: {
          designationId: String(designationId),
          societyId,
          isDeleted: false,
        },
      });

      if (!existingDesignation) {
        return res.status(404).send('Designation not found');
      }

      // Step 2: Check if the designationId exists in societyMember table by matching roleId
      const referencedMembers = await prisma.societyMember.findMany({
        where: {
          roleId: String(designationId), // Assuming roleId in societyMember corresponds to designationId
        },
        select: {
          userId: true, // Selecting only userId
        },
      });

      // If references are found, log their userIds and block deletion
      if (referencedMembers.length > 0) {
        const userIds = referencedMembers.map((member) => member.userId);
        console.log(
          'Cannot delete this designation. It is referenced by the following userIds:',
          userIds
        );
        return res
          .status(207)
          .send(
            `Cannot delete this designation because it is being used by users with IDs: ${userIds.join(
              ', '
            )}`
          );
      }

      // Step 3: Proceed with the deletion if not referenced
      await prisma.committeeRoleMaster.update({
        where: {
          designationId: String(designationId),
        },
        data: {
          isDeleted: true,
          modifiedDate: new Date(),
          modifiedById: req.role.userId,
        },
      });

      res.status(200).send('Designation deleted successfully');
    } catch (error) {
      console.error('Error deleting designation:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);
















designationRouter.get(
  '/display-designation',
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
        throw new Error('Failed to decrypt society ID');
      }

      console.log('Decrypted Society ID:', societyId);

      const designations = await prisma.committeeRoleMaster.findMany({
        where: {
          societyId: societyId, // Filter by decrypted societyId
          isDeleted: false, // Only include records where isDeleted is false
          designationName: {
            not: {
              in: ['societySuperAdmin', 'member'], // Exclude undesired designations
            },
          },
        },
        select: {
          designationId: true,
          designationName: true, // Select designationName
          numberOfPositions: true, // Select numberOfPositions
          adminPrivileges: true, // Select adminPrivileges
        },
      });

      // Log the fetched designation names
      console.log('Designations:', designations);

      // Send the fetched data as a response
      res.status(200).json(designations);
    } catch (error) {
      console.error('Error fetching designations:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);


designationRouter.get(
  '/display-members',
  authenticateToken,
  authenticateRole,
  async (req: Request, res: Response) => {
    try {

      console.log("display-members called");
      const encryptedSocietyId = req.query.societyId as string;

      if (!encryptedSocietyId) {
        console.log('No encryptedSocietyId received from client.');
        return res.status(400).json({ error: 'societyId is required' });
      }

      if (!encryptedSocietyId || !secretKey) {
        throw new Error('Society ID or secret key is missing');
      }

      console.log(
        'Encrypted Society ID received from client for mrm:',
        encryptedSocietyId
      );

      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      const limit = parseInt(req.query.limit as string) || 10; // Default limit = 10
      const offset = parseInt(req.query.offset as string) || 0; // Default offset = 0



      if (!societyId) {
        console.log('Decryption failed: Unable to retrieve society ID.');
        return res.status(400).json({ error: 'Failed to decrypt society ID' });
      }

      console.log('Decrypted Society ID in:', societyId);

      
   // Get total record count for pagination
   const totalRecords = await prisma.societyMember.count({
    where: { societyId: societyId }
  });

      // Query the Prisma model for all SocietyMembers with the matching societyId
      const matchingSocietyMembers = await prisma.societyMember.findMany({
        where: { societyId: societyId },
        // take: limit,  // Pagination: Take `limit` records
        // skip: offset, // Pagination: Skip `offset` records
        select: {
          userId: true,
          roleId: true,
        },
      });

      if (matchingSocietyMembers.length > 0) {
        console.log(
          'Matching societyId found in SocietyMember table:',
          matchingSocietyMembers
        );

        // Now fetch the users from the User table using the userIds from the matchingSocietyMembers
        const userIds = matchingSocietyMembers.map((member) => member.userId);
        const matchingUsers = await prisma.user.findMany({
          where: { userId: { in: userIds }, isDeleted: false,membershipStatusId: 1, },
          select: {
            userId: true, // Include userId
            firstName: true, // Include firstName
            lastName: true, // Include lastName
            phoneNumber: true, // Include phoneNumber
            membershipStatusId: true, // Include membershipStatusId to fetch status
          },
        });

        const userDetailsArray: Array<{
          userId: string;
          firstName: string;
          lastName: string;
          phoneNumber: string;
          designationName: string | null;
          membershipStatus: any; profilePicture: string | null; 
        }> = [];

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

            // Push user details into the userDetailsArray if designationName is not 'societySuperAdmin'
            if (designationName !== 'societySuperAdmin') {
              userDetailsArray.push({
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                designationName: designationName,
                membershipStatus: membershipStatus,
                profilePicture: profilePicBase64, // Add profilePicture to user details// Store only membership status
              });
            } else {
              console.log(
                `Skipping userId ${user.userId} with designationName 'societySuperAdmin'`
              );
            }
          }

          // Console log the array with user details
          console.log(
            'User Details Array for designation add :',
            userDetailsArray
          );
        } else {
          console.log(
            'No matching users found in User table for the provided userIds:',
            userIds
          );
        }

        // Respond back with the result, including membership statuses and excluding societySuperAdmin
        const finalResponse = {
          // decryptedSocietyId: societyId,
          // matchingSocietyMembers: matchingSocietyMembers,
          // matchingUsers: matchingUsers,
          userDetails: userDetailsArray, // Filtered user details excluding 'societySuperAdmin'
          totalRecords, // Include total count for pagination
        };
        return res
          .status(200)
          .json(JSON.parse(safeJsonStringify(finalResponse)));
      }
    } catch (error) {
      console.error('Error processing request:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
);



designationRouter.post('/updateDesignationCount',authenticateToken,
  authenticateRole,
  async (req: AuthenticatedRequest, res: Response) => {
    const { totalCheckedCount, selectedDesignation } = req.body;
    console.log("body",req.role)
    if (req.isAdmin !== 'admin') {
     
      return res.status(702).send('You are not authorized to update a designation.');
    }
  try {
    // Log the received designation count
    console.log(
      'Received Designation Count:',
      totalCheckedCount,
      selectedDesignation
    );

    // Fetch all matching records from the committeeRoleMaster table
    const designationRecords = await prisma.committeeRoleMaster.findMany({
      where: {
        designationName: selectedDesignation,
        societyId:req.role.societyId
      },
      select: {
        designationId: true,
        numberOfPositions: true,
      },
    });
console.log("desiRecor",designationRecords)
    if (designationRecords.length === 0) {
      return res.status(404).json({ message: 'Designation not found' });
    }

    const designationIds = designationRecords.map(
      (record) => record.designationId
    );
    const numberOfPositions = designationRecords.map(
      (record) => record.numberOfPositions
    );

    // Log the fetched Designation IDs and number of positions
    console.log('Fetched Designation IDs:', designationIds);
    console.log('Fetched Number of Positions:', numberOfPositions);

    // Fetch corresponding userIds from the societyMember table based on roleId
    const societyMembers = await prisma.societyMember.findMany({
      where: {
        roleId: {
          in: designationIds, // Match roleId with fetched designationIds
        },
      },
      select: {
        userId: true,
      },
    });

    // Check if any society members were found
    let CSMCount = 0; // Default to 0 if no members are found
    if (societyMembers.length > 0) {
      // Extract user IDs from the fetched society members
      const userIds = societyMembers.map((member) => member.userId);
      // Count of matching user IDs
      CSMCount = userIds.length;
    }

    // Log the count of matching user IDs
    console.log('CSMCount:', CSMCount);

    // Calculate the remaining positions
    const remainingPositions = numberOfPositions.map(
      (position) => position - CSMCount
    );

    // Log the remaining positions
    console.log('Remaining Positions:', remainingPositions);

    if (selectedDesignation.toLowerCase() !== "member") {
      const isValid = remainingPositions.every(
        (position) => totalCheckedCount <= position
      );

      if (isValid) {
        console.log('Total checked count is within limits. CSMCount:', CSMCount);
      } else {
        console.log(
          'You cannot add new members, total checked count exceeds allowed limit.'
        );
        return res.status(201).json({
          message:
            'You cannot add new members, total checked count exceeds the allowed limit.',
        });
      }
    }

    // Further logic can be implemented here

    return res.status(200).json({
      message: 'Designation count updated successfully',
      CSMCount,
      remainingPositions,
    });
  } catch (error) {
    console.error(
      `Error fetching designation for ${selectedDesignation}:`,
      error
    );
    return res
    .status(500)
    .json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error occurred' });
  } finally {
    await prisma.$disconnect(); // Ensure you disconnect Prisma client
  }
});

designationRouter.post(
  '/addmemberdesignation',
  authenticateToken,
  authenticateRole,
  async (req: AuthenticatedRequest, res: Response) => {
    
    try {
      const { designation, count, selectedUserIds,societyId } = req.body;
      if (!req.isAdmin) {
        
        return res.status(702).send('You are not authorized to add members to  designation.');
      }

      const encryptedSocietyId = societyId as string;

      if (!encryptedSocietyId) {
        console.log('No encryptedSocietyId received from client.');
        return res.status(400).json({ error: 'societyId is required' });
      }

      if (!encryptedSocietyId || !secretKey) {
        throw new Error('Society ID or secret key is missing');
    }

      console.log(
        'Encrypted Society ID received from client for mrm:',
        encryptedSocietyId
      );

      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);


      const decyptedSocietyId = bytes.toString(CryptoJS.enc.Utf8);


      if (!decyptedSocietyId) {
        console.log('Decryption failed: Unable to retrieve society ID.');
        return res.status(400).json({ error: 'Failed to decrypt society ID' });
      }


      // Log the designation, count, and selectedUserIds for debugging
      console.log('Received designation:', designation);
      console.log('Received count:', count);
      console.log('Received selectedUserIds:', selectedUserIds);

      // Check if designation and count are provided
      if (!designation || !count) {
        console.log('Designation and count are required.');
        return res
          .status(400)
          .json({ error: 'Designation and count are required' });
      }

      // Log the received data without processing
      console.log('Data received without processing:', {
        designation,
        count,
      });

      const committeeRole = await prisma.committeeRoleMaster.findFirst({
        where: {
          designationName: designation, // Use designationName as a filter
          // societyId:req.role.societyId
          societyId:decyptedSocietyId
        },
        select: {
          designationId: true,
          numberOfPositions: true,adminPrivileges:true
        },
      });

      if (committeeRole) {
        // Log the designationId and numberOfPositions
        console.log(`Designation ID: ${committeeRole.designationId}`);
        console.log(`Number of Positions: ${committeeRole.numberOfPositions}`);

        // Compare count with numberOfPositions
        if (count.member > committeeRole.numberOfPositions) {
          console.log(
            `Count (${count.member}) is greater than Number of Positions (${committeeRole.numberOfPositions}).`
          );
          return res
            .status(400)
            .json({ error: 'Cannot update data because of lack of positions' });
        }

        console.log(
          `Count (${count.member}) is less than or equal to Number of Positions (${committeeRole.numberOfPositions}).`
        );

        // Fetch the corresponding roleId for selectedUserIds from the societyMember table
        const membersRoles = await prisma.societyMember.findMany({
          // where: {
          //   userId: { in: selectedUserIds },
          // },
          where: {
            userId: {
              in: selectedUserIds, // Use 'in' for scalar fields like userId
            },
            // societyId: societyId, // Add other conditions at the top level
          },
          select: {
            roleId: true,
            userId: true, // Include userId if you want to log which user has which role
          },
        });

        console.log("memberROles",membersRoles)
        // Log the corresponding roleIds and update them
        for (const member of membersRoles) {
          console.log(
            `User ID: ${member.userId}, Current Role ID: ${member.roleId}`
          );

          // Update all entries for the userId with the designationId
          await prisma.societyMember.updateMany({
            where: { userId: member.userId, societyId: decyptedSocietyId }, // Update all records for this user
            data: { roleId: committeeRole.designationId },
          });
          await prisma.user.update({
            where: { userId: member.userId }, // Find the user by userId
            data: { isAdmin: committeeRole.adminPrivileges }, // Set isAdmin based on the adminPrivileges value
          });

          console.log(
            `Updated all entries for User ID: ${member.userId} with New Role ID: ${committeeRole.designationId}`
          );
        }
      } else {
        console.log(`No matching designation found for: ${designation}`);
        return res.status(404).json({ error: 'Designation not found' });
      }

      // Respond back with a success message
      return res
        .status(200)
        .json({ message: 'Designation data received successfully' });
    } catch (error) {
      console.error('Error processing designation submission:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
);


designationRouter.get(
  '/fetchSelectedDesignationMember',
  authenticateToken,
  authenticateRole,
  async (req: AuthenticatedRequest, res: Response) => {
   
    try {
      const encryptedSocietyId = req.query.societyId as string;

      if (!encryptedSocietyId) {
        console.log('No encryptedSocietyId received from client.');
        return res.status(400).json({ error: 'societyId is required' });
      }

      if (!encryptedSocietyId || !secretKey) {
        throw new Error('Society ID or secret key is missing');
    }

      console.log('Encrypted Society ID received from client in selcted desi:', encryptedSocietyId);

      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      if (!societyId) {
        console.log('Decryption failed: Unable to retrieve society ID.');
        return res.status(400).json({ error: 'Failed to decrypt society ID' });
      }

      console.log('Decrypted Society ID in selcted deisgnation:', societyId);
      
      const designName = req.query.designation as string;
      const sortOption = req.query.sortOption as string | undefined; // Extract sortOption
      const searchTerm = (req.query.searchTerm as string) || '';
      // Log the received sort option for debugging
      console.log('Received sort option in backend:', sortOption);

      const limit = parseInt(req.query.limit as string) || 10; // Default limit: 10
      const offset = parseInt(req.query.offset as string) || 0; // Default offset: 0

      if (!designName) {
        return res.status(400).json({ message: 'Designation not received' });
      } else {
        console.log('Received designation in backend:', designName);
      }

    // Fetch all corresponding designationIds from committeeRoleMaster
const designationRecords = await prisma.committeeRoleMaster.findMany({
  where: {
      designationName: designName,
      societyId: societyId, // Match with decrypted societyId
  },
  select: {
      designationId: true,
  },
});
console.log("recorde",designationRecords)
if (designationRecords.length === 0) {
  return res.status(404).json({ message: 'No designations found for the given society' });
}


      const designationIds = designationRecords.map(
        (record) => record.designationId
      );
      console.log('Corresponding designationIds:', designationIds);

 

      // Fetch userIds from societyMember table matching the roleId
      const userRecords = await prisma.societyMember.findMany({
        where: {
          roleId: {
            in: designationIds, // Use the array of designationIds
          },
        },
        select: {
          userId: true, // Select only the userId field
        },
      });
console.log("userre",userRecords)
      if (userRecords.length === 0) {
        return res
          .status(404)
          .json({ message: 'No users found for the given designations' });
      }

      const userIds = userRecords.map((record) => record.userId);
      console.log('Corresponding userIds:', userIds);

      const totalRecords = await prisma.user.count({
        where: {
          userId: { in: userIds },
          isDeleted: false,
        },
      });

      // Fetch user details from the user table based on userIds
      let userDetails = await prisma.user.findMany({
        where: {
          userId: {
            in: userIds, // Use the array of userIds
          },
          isDeleted: false,
          
        },
        // skip: offset, // Pagination: Skip offset
        // take: limit,  // Pagination: Fetch limit records
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          isAdmin: true,
        },
      });

      if (userDetails.length === 0) {
        return res
          .status(404)
          .json({ message: 'No user details found for the given userIds' });
      }

      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        userDetails = userDetails.filter(
          (user) =>
            user.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
            user.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
            user.phoneNumber?.toString().includes(lowerCaseSearchTerm)
        );
      }
      if (sortOption) {
        if (sortOption === 'A-Z') {
          userDetails.sort((a, b) => a.firstName.localeCompare(b.firstName));
        } else if (sortOption === 'Z-A') {
          userDetails.sort((a, b) => b.firstName.localeCompare(a.firstName));
        }
      }

      console.log('Sorted user details:', userDetails);

      console.log('Fetched user details:', userDetails);
      return res.status(200).json({ users: userDetails,totalRecords });
    } catch (error) {
      console.error('Error fetching user details:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);



// designationRouter.put(
//   '/updateDesignationDataofmember',
//   authenticateToken,
//   authenticateRole,
//   async (req: AuthenticatedRequest, res: Response) => {
//     console.log("RESPPP",res)
//     const designationname = req.body.designation; // Get 'designation' from request body
//     const isAdmin = req.body.isAdmin; // Get 'isAdmin' from request body
//     const userId = req.body.userId; // Get 'userId' from request body

//     console.log('Received designation in backend:', designationname);
//     console.log('Received isAdmin value in backend:', isAdmin);
//     console.log('Received userId in backend:', userId);
//     if (req.isAdmin !== 'admin') {
//       return res.status(702).send('You are not authorized to update designation.');
//     }
//     if (!userId) {
//       return res.status(400).json({ message: 'User ID not received' });
//     }

//     try {
//       // Find the user by userId
//       const user = await prisma.user.findUnique({
//         where: { userId: userId }, // Assuming 'userId' is the primary key for the user table
//       });

//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       // Update the isAdmin field regardless of position
//       const updatedUser = await prisma.user.update({
//         where: { userId: userId },
//         data: { isAdmin: isAdmin }, // Update isAdmin field
//       });

//       if (designationname) {
//         const designationIdData = await prisma.committeeRoleMaster.findFirst({
//           where: {
//             designationName: designationname, // Match for the designation
//           },
//           select: {
//             designationId: true,
//             numberOfPositions: true,
//           },
//         });

//         if (!designationIdData) {
//           return res.status(404).json({ message: 'Member designation not found' });
//         }

//         console.log('Fetched designationId:', designationIdData.designationId, designationIdData.numberOfPositions);

//         // If designation name is "member", skip the remaining positions check
//         if (designationname.toLowerCase() === 'member') {
//           const userRoleData = await prisma.societyMember.findFirst({
//             where: {
//               userId: userId,
//             },
//             select: {
//               roleId: true,
//             },
//           });

//           if (userRoleData) {
//             // Update the roleId for the user
//             await prisma.societyMember.updateMany({
//               where: {
//                 userId: userId,
//               },
//               data: {
//                 roleId: designationIdData.designationId, // Use the designationId from earlier
//               },
//             });
//             return res.status(200).json(JSON.parse(safeJsonStringify({ message: 'User designation updated successfully', updatedUser })));
//           }
//         } else {
//           // For other designation names, check for remaining positions
//           const matchingMembersCount = await prisma.societyMember.count({
//             where: {
//               roleId: designationIdData.designationId, // Match roleId with designationId
//             },
//           });

//           console.log('Count of matched records in societyMember:', matchingMembersCount);
//           const remainingPositions = designationIdData.numberOfPositions - matchingMembersCount;
//           console.log('Remaining positions:', remainingPositions);

//           if (remainingPositions === 0) {
//             console.log('No positions available for this designation');
//             return res.status(203).json(JSON.parse(safeJsonStringify({ message: 'No remaining positions available for this designation' })));
//           }

//           if (remainingPositions > 0) {
//             const userRoleData = await prisma.societyMember.findFirst({
//               where: {
//                 userId: userId,
//               },
//               select: {
//                 roleId: true,
//               },
//             });

//             if (userRoleData) {
//               // Update the roleId for the user
//               await prisma.societyMember.updateMany({
//                 where: {
//                   userId: userId,
//                 },
//                 data: {
//                   roleId: designationIdData.designationId, // Use the designationId from earlier
//                 },
//               });
//               return res.status(200).json(JSON.parse(safeJsonStringify({ message: 'User designation updated successfully', updatedUser })));
//             }
//           }
//         }
//       } else {
//         return res.status(400).json(JSON.parse(safeJsonStringify({ message: 'Designation not provided for update' })));
//       }
//     } catch (error) {
//       console.error('Error updating designation:', error);
//       return res.status(500).json(JSON.parse(safeJsonStringify({ message: 'Internal server error' })));
//     } finally {
//       await prisma.$disconnect(); // Ensure Prisma Client is disconnected after operations
//     }
//   }
// );
designationRouter.put(
  '/updateDesignation',
  authenticateToken,
  authenticateRole,
  async (req: AuthenticatedRequest, res: Response) => {
    const designationname = req.body.designation; // Get 'designation' from request body
    const userId = req.body.userId; // Get 'userId' from request body

    if (req.isAdmin !== 'admin') {
      return res.status(702).send('You are not authorized to update designation.');
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID not received' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { userId: userId },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (designationname) {
        const designationIdData = await prisma.committeeRoleMaster.findFirst({
          where: { designationName: designationname },
          select: { designationId: true, numberOfPositions: true },
        });

        if (!designationIdData) {
          return res.status(404).json({ message: 'Member designation not found' });
        }

        if (designationname.toLowerCase() === 'member') {
          const userRoleData = await prisma.societyMember.findFirst({
            where: { userId: userId },
            select: { roleId: true },
          });

          if (userRoleData) {
            await prisma.societyMember.updateMany({
              where: { userId: userId },
              data: { roleId: designationIdData.designationId },
            });
            return res.status(200).json({ message: 'User designation updated successfully' });
          }
        } else {
          const matchingMembersCount = await prisma.societyMember.count({
            where: { roleId: designationIdData.designationId },
          });

          const remainingPositions = designationIdData.numberOfPositions - matchingMembersCount;

          if (remainingPositions === 0) {
            return res.status(203).json({ message: 'No remaining positions available for this designation' });
          }

          const userRoleData = await prisma.societyMember.findFirst({
            where: { userId: userId },
            select: { roleId: true },
          });

          if (userRoleData) {
            await prisma.societyMember.updateMany({
              where: { userId: userId },
              data: { roleId: designationIdData.designationId },
            });
            return res.status(200).json({ message: 'User designation updated successfully' });
          }
        }
      } else {
        return res.status(400).json({ message: 'Designation not provided for update' });
      }
    } catch (error) {
      console.error('Error updating designation:', error);
      return res.status(500).json({ message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  }
);
designationRouter.put(
  '/updateAdminStatus',
  authenticateToken,
  authenticateRole,
  async (req: AuthenticatedRequest, res: Response) => {
    const isAdmin = req.body.isAdmin; // Get 'isAdmin' from request body
    const userId = req.body.userId; // Get 'userId' from request body

    if (req.isAdmin !== 'admin') {
      return res.status(702).send('You are not authorized to update admin status.');
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID not received' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { userId: userId },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const updatedUser = await prisma.user.update({
        where: { userId: userId },
        data: { isAdmin: isAdmin }, // Update admin status
      });

      return res.status(200).json(safeJsonStringify({ message: 'Admin status updated successfully', updatedUser }));
    } catch (error) {
      console.error('Error updating admin status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  }
);

designationRouter.get(
  '/display-active-members',
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
        'Encrypted Society ID received from client for mrm:',
        encryptedSocietyId
      );

      // Decrypt the societyId
      const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
      const societyId = bytes.toString(CryptoJS.enc.Utf8);

      if (!societyId) {
        console.log('Decryption failed: Unable to retrieve society ID.');
        return res.status(400).json({ error: 'Failed to decrypt society ID' });
      }

      console.log('Decrypted Society ID in:', societyId);

      const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10
      const offset = parseInt(req.query.offset as string, 10) || 0; // Default offset to 0


      // Query the Prisma model for all SocietyMembers with the matching societyId
      const matchingSocietyMembers = await prisma.societyMember.findMany({
        where: { societyId: societyId },
        select: {
          userId: true,
          roleId: true,
        },
      });

      if (matchingSocietyMembers.length > 0) {
        console.log(
          'Matching societyId found in SocietyMember table:',
          matchingSocietyMembers
        );

        // Now fetch the users from the User table using the userIds from the matchingSocietyMembers
        const userIds = matchingSocietyMembers.map((member) => member.userId);
        const matchingUsers = await prisma.user.findMany({
          where: { userId: { in: userIds }, isDeleted: false,membershipStatusId: 1, },
          skip: offset, // Apply offset
          take: limit,  // Apply limit
          select: {
            userId: true, // Include userId
            firstName: true, // Include firstName
            lastName: true, // Include lastName
            phoneNumber: true, // Include phoneNumber
            membershipStatusId: true, // Include membershipStatusId to fetch status
          },
        });

        const userDetailsArray: Array<{
          userId: string;
          firstName: string;
          lastName: string;
          phoneNumber: string;
          designationName: string | null;
          membershipStatus: any;
        }> = [];

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

            // Push user details into the userDetailsArray if designationName is not 'societySuperAdmin'
            if (designationName !== 'societySuperAdmin') {
              userDetailsArray.push({
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                designationName: designationName,
                membershipStatus: membershipStatus, // Store only membership status
              });
            } else {
              console.log(
                `Skipping userId ${user.userId} with designationName 'societySuperAdmin'`
              );
            }
          }

          // Console log the array with user details
          console.log(
            'User Details Array for designation add :',
            userDetailsArray
          );
        } else {
          console.log(
            'No matching users found in User table for the provided userIds:',
            userIds
          );
        }

        const totalRecords = await prisma.user.count({
          where: { userId: { in: userIds }, isDeleted: false, membershipStatusId: 1 },
        });

        
        // Respond back with the result, including membership statuses and excluding societySuperAdmin
        const finalResponse = {
          // decryptedSocietyId: societyId,
          // matchingSocietyMembers: matchingSocietyMembers,
          // matchingUsers: matchingUsers,
          userDetails: userDetailsArray, // Filtered user details excluding 'societySuperAdmin'
          totalRecords
        };
        return res
          .status(200)
          .json(JSON.parse(safeJsonStringify(finalResponse)));
      }
    } catch (error) {
      console.error('Error processing request:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
);

export default designationRouter;




