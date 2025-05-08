
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
    authenticateRole,
    authenticateToken,
    AuthenticatedRequest,
    authenticateMembership
} from '../../middlewares/authorizeUser';


import CryptoJS from 'crypto-js';
import { CONFIG } from '../../utils/config';
import { log } from 'console';


const eventRouter = express.Router();
const prisma = new PrismaClient();

const secretKey = CONFIG.SECRET_KEY;

function safeJsonStringify(obj: any) {
    return JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value // Convert BigInt to String
    );
}


eventRouter.post(
    '/create-event',
    authenticateToken,
    authenticateRole,
    authenticateMembership,
    async (req: AuthenticatedRequest, res: Response) => {
        const {
            eventName,
            eventDescription,
            registrationDueDate,
            eventStartDate,
            eventEndDate,
            eventStartTime,
            eventEndTime,
            uploadedFiles,
            eventType,
            maxAttendees,
            amountPerPerson,
            allowFamilyAndFriends,
            acceptDonation,
            ChargePerPerson,
            shouldPublish,
            isDeleted,
            encryptedSocietyId,
        } = req.body;

        if (req.isAdmin !== 'admin') {
            return res.status(702).send('You are not authorized to create a designation.');
        }

        if (!encryptedSocietyId || !secretKey) {
            throw new Error('Society ID or secret key is missing');
        }

        try {

            let eventTypeId;

            console.log("encryptedSocietyId", encryptedSocietyId)
            console.log(secretKey);

            // Decrypt the societyId
            const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
            const societyId = bytes.toString(CryptoJS.enc.Utf8);

            if (!societyId) {
                throw new Error('Failed to decrypt society ID');
            }

            console.log("Decrypted Society ID:", societyId);

            console.log("societyId:", req.role);

            // Check if the event type (paid or free) already exists
            const existingEventType = await prisma.eventTypeMaster.findFirst({
                where: { eventType },
            });

            if (existingEventType) {
                // If the event type exists, use its ID
                eventTypeId = existingEventType.id;
                // console.log(`Using existing event type ID: ${eventTypeId}`);
            } else {
                // If the event type doesn't exist, create a new entry and use its ID
                const newEventType = await prisma.eventTypeMaster.create({
                    data: { eventType },
                });
                eventTypeId = newEventType.id;
                // console.log(`Created new event type ID: ${eventTypeId}`);
            }

            // Create a new event entry in the db
            if (!req.user?.id) {
                throw new Error('User ID is required');
            }

            const newEvent = await prisma.event.create({
                data: {
                    eventName: eventName,
                    eventDescription: eventDescription,
                    eventRegistrationDate: new Date(registrationDueDate),
                    eventStartDate: new Date(eventStartDate),
                    eventEndDate: new Date(eventEndDate),
                    eventStartTime: eventStartTime,
                    eventEndTime: eventEndTime,
                    eventTypeId: eventTypeId, // Use the ID of the event type
                    maxPeopleAllowed: maxAttendees.toString(), //throws error as not optional
                    amount: amountPerPerson ? amountPerPerson.toString() : null,
                    acceptDonation: acceptDonation, //acceptDonation,
                    ChargePerPerson: ChargePerPerson,
                    allowFamilyandFriends: allowFamilyAndFriends,
                    societyId: societyId, // Ensure society ID is included
                    createdById: req.user.id,
                    modifiedById: req.user.id,
                    isDeleted: isDeleted ?? 'NOT_DELETED',
                    shouldPublish: shouldPublish,
                },
            });

            if (shouldPublish) {
                console.log('Event created and published:', newEvent);
            } else {
                console.log('Event saved as a draft:', newEvent);
            }

            // Handle media uploads (assuming uploadedFiles contains file data)

            if (uploadedFiles && uploadedFiles.length > 0) {
                try {
                    // Convert and upload all files concurrently using Promise.all
                    const uploadPromises = uploadedFiles.map(async (file:any) => {
                        // Ensure you're accessing the file's base64 data string
                        const base64Data = file.data; // Assuming `file.data` contains the base64-encoded data

                        if (!base64Data || typeof base64Data !== 'string') {
                            throw new Error('File data is missing or not a valid base64 string.');
                        }

                        // Extract media type from the base64 string
                        const [mediaTypePart] = base64Data.split(';'); // Media type and encoding are separated by a semicolon
                        let mediaType = 'unknown';
                        if (mediaTypePart.includes('image')) {
                            mediaType = 'image';
                        } else if (mediaTypePart.includes('video')) {
                            mediaType = 'video';
                        } else if (mediaTypePart.includes('audio')) {
                            mediaType = 'audio';
                        }

                        // Remove the "data:<mediaType>;base64," prefix to get only the base64 content
                        const base64Content = base64Data.split(',')[1]; // Extract base64 content part
                        const bufferEventFile = Buffer.from(base64Content, 'base64'); // Convert base64 content to buffer

                        // Create a media record for each file
                        const media = await prisma.media.create({
                            data: {
                                type: mediaType,
                                data: bufferEventFile, // Save the file as binary data in the database
                                tableId: newEvent.eventId, // Link to the created event
                                tableType: 'event', // Specifying that this media is linked to an event
                                // mediaId: file.mediaId, // Store the mediaId from the uploaded file if available
                                // id: file.mediaId, // Store the mediaId as the id in the media table
                            },
                        });

                        return media; // Return the created media object
                    });

                    // Wait for all files to be processed
                    const uploadedMedia = await Promise.all(uploadPromises);

                    // Log the result of media uploads
                    console.log('All media uploaded successfully:', uploadedMedia);
                } catch (error) {
                    console.error('Error uploading media files:', error);
                }
            }

            // Return the newly created event
            return res.status(200).json({
                message: shouldPublish
                    ? 'Event created and published successfully'
                    : 'Event saved as a draft successfully',
                eventId: newEvent.eventId,
                eventName: newEvent.eventName,
            });

        } catch (error) {
            console.error('Error creating event:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            await prisma.$disconnect();
        }
    }
);



eventRouter.get('/display-events', authenticateToken, authenticateRole, async (req: AuthenticatedRequest, res: Response) => {

    //    console.log("dispEvents authRole",authenticateRole);
    //    console.log("dispEvents authToken",authenticateToken);

         // Create a new event entry in the db
         if (!req.user?.id) {
            throw new Error('User ID is required');
        }

    try {

        const encryptedSocietyId = req.query.societyId as string;
        const eventType = req.query.eventType as string; // Add eventType to the query
        const userId = req.user.id as string;

        
        const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 events
        const offset = parseInt(req.query.offset as string, 10) || 0;


        const checkIsAdmin = req.query.checkIsAdmin === 'true';
        console.log("encryptedSocietyId", encryptedSocietyId);
        console.log(secretKey);
        console.log("Event Type:", eventType);

        // console.log("HHHHHHHHHHHH",userId);


        if (!encryptedSocietyId) {
            return res.status(400).json({ error: 'societyId is required' });
        }
        if (!encryptedSocietyId || !secretKey) {
            throw new Error('Society ID or secret key is missing');
        }

        // Decrypt the societyId
        const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
        console.log("bytes is ", bytes);
        const societyId = bytes.toString(CryptoJS.enc.Utf8);
        console.log("societyId is ", societyId);

        if (!societyId) {
            throw new Error('Failed to decrypt society ID');
        }

        console.log("Decrypted Society ID:", societyId);
        console.log("Event Type:", eventType);



        // Define the default where clause (to filter by societyId and not-deleted events)
        let whereClause: any = {
            societyId: societyId,
            isDeleted: 'NOT_DELETED',  // Ensure you're only fetching non-deleted events unless fetching deleted
            eventTypeId: {
                not: null
            }
        };

        let orderByClause: any = {};

        if (eventType === 'upcoming') {
            whereClause.eventStartDate = { gte: new Date().toISOString() }; // Future events
            whereClause.shouldPublish = true; // Ensure only published events are fetched
            orderByClause = { eventStartDate: 'asc' };
        } else if (eventType === 'past') {
            whereClause.eventEndDate = { lt: new Date().toISOString() }; // Past events
            console.log("here is LT ", whereClause.eventEndDate = { lt: new Date().toISOString() })
            orderByClause = { eventEndDate: 'desc' };
        }
        else if (eventType === 'draft') {
            whereClause.shouldPublish = false; // Drafts (not published)
            orderByClause = { eventStartDate: 'desc' };
        }
        else if (eventType === 'deleted') {
            whereClause.isDeleted = 'SOFT_DELETED'; // Deleted events
            orderByClause = { eventStartDate: 'desc' };
        }

        // Additional filtering for non-admin users on past events
        if (!checkIsAdmin && eventType === 'past') {
            const registeredEvents = await prisma.subscriptionPayments.findMany({
                where: {
                    userId: userId,
                    status: 'Completed'
                },
                select: {
                    eventId: true
                }
            });

            const registeredEventIds = registeredEvents.map(event => event.eventId);
            whereClause.eventId = { in: registeredEventIds };
        }

        // Fetch events from the Event table where the conditions match
        const events = await prisma.event.findMany({
            where: whereClause,
            orderBy: orderByClause,
            take: limit, // Fetch `limit` number of records
             skip: offset, // Skip `offset` number of records
            select: {
                eventId: true,
                eventName: true,
                eventDescription: true,
                eventStartDate: true,
                eventStartTime: true,
                maxPeopleAllowed: true,
                eventType: true,
                shouldPublish: true,
                amount: true,
                acceptDonation: true,
                allowFamilyandFriends: true,
                ChargePerPerson: true
            },
        });

        // Fetch the registered members count for each event by querying the subscriptionPaymentss table
        const eventsWithMembers = await Promise.all(
            events.map(async (event) => {
                const registeredMembersCount = await prisma.subscriptionPayments.aggregate({
                    _sum: {
                        numberOfRegistrations: true,  // Direct sum of numberOfRegistrations
                    },
                    where: {
                        eventId: event.eventId,
                        status: 'Completed', // Assuming only completed payments count
                    },
                });

                // Check if the user has paid for this event
                const userRegistration = await prisma.subscriptionPayments.findFirst({
                    where: {
                        eventId: event.eventId,
                        userId: userId,
                        status: 'Completed',
                        numberOfRegistrations: { gt: 0 }, // Ensures this is a registration
                    },
                });

                const userDonation = event.acceptDonation
                    ? await prisma.subscriptionPayments.findFirst({
                        where: {
                            eventId: event.eventId,
                            userId: userId,
                            status: 'Completed',
                            numberOfRegistrations: 0, // Donations only, not registrations
                            amount: { gt: 0 },
                        },
                    })
                    : null;


                return {
                    ...event,
                    registeredMembersCount: registeredMembersCount._sum.numberOfRegistrations || 0, // Include the sum of registered members or default to 0
                    hasPaid: !!userRegistration, // Only true if registered
                    hasDonated: !!userDonation, // Separate flag for donations
                };
            })
        );
        // Log the fetched event data
        console.log("Fetched Events with Members Count:", eventsWithMembers);

        // Send the fetched event data as a response
        // res.status(200).json(events);
        res.status(200).json(JSON.parse(safeJsonStringify(eventsWithMembers)));

    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
});




eventRouter.get(
    '/individual-event',
    authenticateToken,
    authenticateRole,
    async (req: AuthenticatedRequest, res: Response) => {
        const eventId = req.query.eventId as string;
             // Create a new event entry in the db
             if (!req.user?.id) {
                throw new Error('User ID is required');
            }
        const userId = req.user.id as string;

        if (!eventId) {
            // 400 Bad Request - Missing eventId in the request
            return res.status(400).json({ message: 'Missing eventId in the request' });
        }

        try {
            console.log("Fetching event with ID:", eventId);

            // Fetch event and media data concurrently
            const [event, media, registeredMembersCount] = await Promise.all([
                prisma.event.findUnique({
                    where: {
                        eventId: String(eventId),

                    },
                    include: {
                        eventType: true, // Fetch related eventType data
                    },
                }),
                prisma.media.findMany({
                    where: {
                        tableType: 'event', // Media associated with event
                        tableId: String(eventId), // Matching eventId
                    },
                }),

                prisma.subscriptionPayments.aggregate({
                    _sum: {
                        numberOfRegistrations: true,  // Sum of numberOfRegistrations
                    },
                    where: {
                        eventId: eventId,
                        status: 'Completed', // Assuming only completed payments count
                    },
                }),

            ]);



            // Check if the event exists
            if (!event) {
                // 404 Not Found - Event not found
                return res.status(404).json({ message: 'Event not found' });
            }

            // Convert Buffer data in media to Base64, if any media exists
            const mediaWithBase64 = media.length
                ? media.map((mediaItem) => ({
                    ...mediaItem,
                    data: mediaItem.data.toString('base64'), // Convert Buffer to Base64 string
                }))
                : [];

            // Registered members count
            const membersCount = registeredMembersCount._sum.numberOfRegistrations || 0;

            // Check for user registration
            const userRegistration = await prisma.subscriptionPayments.findFirst({
                where: {
                    eventId: eventId,
                    userId: userId,
                    status: 'Completed',
                    numberOfRegistrations: { gt: 0 }, // Ensure it's a registration
                },
            });

            // Check for user donation
            const userDonation = event.acceptDonation
                ? await prisma.subscriptionPayments.findFirst({
                    where: {
                        eventId: eventId,
                        userId: userId,
                        status: 'Completed',
                        numberOfRegistrations: 0, // Donations only
                        amount: { gt: 0 },
                    },
                })
                : null;

            const hasPaid = !!userRegistration; // Only true if the user registered
            const hasDonated = !!userDonation; // True if the user donated but didn’t register

            console.log("User Registration:", userRegistration);
            console.log("User Donation:", userDonation);

            // 200 OK - Successfully return the event data and associated media
            return res.status(200).json(JSON.parse(safeJsonStringify({
                event,
                eventType: event.eventType, // Return event type
                media: mediaWithBase64, // Return Base64 media data
                registeredMembersCount: membersCount,
                hasDonated,
                hasPaid,
            })));
        } catch (error:any) {
            console.error(`Error fetching event with ID ${eventId}:`, error);
            // 500 Internal Server Error
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        } finally {
            await prisma.$disconnect();
        }
    }
);

//put server request

eventRouter.put(
    '/update-event/:eventId',
    authenticateToken,
    authenticateRole, authenticateMembership,
    async (req: AuthenticatedRequest, res: Response) => {
        const {
            eventName,
            eventDescription,
            registrationDueDate,
            eventStartDate,
            eventEndDate,
            eventStartTime,
            eventEndTime,
            uploadedFiles,
            eventType,
            maxAttendees,
            amountPerPerson,
            allowFamilyAndFriends,
            acceptDonation,
            ChargePerPerson,
            shouldPublish,
            isDeleted,
            encryptedSocietyId,
        } = req.body;

        if (req.isAdmin !== 'admin') {
            return res.status(702).send('You are not authorized to create a designation.');
        }

        const { eventId } = req.params;

        try {
            let eventTypeId;

            // Decrypt the societyId
            // const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
            // const societyId = bytes.toString(CryptoJS.enc.Utf8);

            // if (!societyId) {
            //     throw new Error('Failed to decrypt society ID');
            // }

            // Check if the event exists
            const existingEvent = await prisma.event.findUnique({
                where: { eventId: eventId },
            });

            if (!existingEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }

                 // Create a new event entry in the db
                 if (!req.user?.id) {
                    throw new Error('User ID is required');
                }

            // Check if the event type (paid or free) exists or create a new one
            const existingEventType = await prisma.eventTypeMaster.findFirst({
                where: { eventType },
            });

            if (existingEventType) {
                eventTypeId = existingEventType.id;
            } else {
                const newEventType = await prisma.eventTypeMaster.create({
                    data: { eventType },
                });
                eventTypeId = newEventType.id;
            }

            // Update the event
            const updatedEvent = await prisma.event.update({
                where: { eventId: eventId },
                data: {
                    eventName: eventName,
                    eventDescription: eventDescription,
                    eventRegistrationDate: new Date(registrationDueDate),
                    eventStartDate: new Date(eventStartDate),
                    eventEndDate: new Date(eventEndDate),
                    eventStartTime: eventStartTime,
                    eventEndTime: eventEndTime,
                    eventTypeId: eventTypeId, // Update with new or existing event type ID
                    maxPeopleAllowed: maxAttendees.toString(),
                    amount: amountPerPerson ? amountPerPerson.toString() : null,
                    acceptDonation: acceptDonation,
                    ChargePerPerson: ChargePerPerson,
                    allowFamilyandFriends: allowFamilyAndFriends,
                    modifiedById: req.user.id,
                    shouldPublish: shouldPublish,
                    isDeleted: isDeleted ?? 'NOT_DELETED'
                },
            });

            // Handle media updates if new files are uploaded
            if (uploadedFiles && uploadedFiles.length > 0) {
                try {
                    // Fetch existing media for the event
                    const existingMedia = await prisma.media.findMany({
                        where: {
                            tableId: updatedEvent.eventId,
                            tableType: 'event', // Ensure we're only checking media related to this event
                        },
                        select: { id: true }, // We only need the mediaId for comparison
                    });

                    // Create an array of existing media IDs
                    const existingMediaIds = existingMedia.map((media) => media.id);
                    console.log('Existing Media IDs:', existingMediaIds);

                    // Convert and upload only new files
                    const uploadPromises = uploadedFiles.map(async (file:any) => {
                        // Check if the mediaId already exists in the media table
                        if (existingMediaIds.includes(file.mediaId)) {
                            console.log(`Media with ID ${file.mediaId} already exists. Skipping.`);
                            return null; // Skip if the media already exists
                        }

                        console.log(`Processing new media with ID: ${file.mediaId}`);

                        // Ensure you're accessing the file's base64 data string
                        const base64Data = file.data; // Assuming `file.data` contains the base64-encoded data

                        if (!base64Data || typeof base64Data !== 'string') {
                            throw new Error('File data is missing or not a valid base64 string.');
                        }

                        // Extract media type from the base64 string
                        const [mediaTypePart] = base64Data.split(';'); // Media type and encoding are separated by a semicolon
                        let mediaType = 'unknown';
                        if (mediaTypePart.includes('image')) {
                            mediaType = 'image';
                        } else if (mediaTypePart.includes('video')) {
                            mediaType = 'video';
                        } else if (mediaTypePart.includes('audio')) {
                            mediaType = 'audio';
                        }

                        // Remove the "data:<mediaType>;base64," prefix to get only the base64 content
                        const base64Content = base64Data.split(',')[1]; // Extract base64 content part
                        const bufferEventFile = Buffer.from(base64Content, 'base64'); // Convert base64 content to buffer

                        // Create a new media record in the media table
                        const media = await prisma.media.create({
                            data: {
                                type: mediaType,
                                data: bufferEventFile, // Save the file as binary data in the database
                                tableId: updatedEvent.eventId, // Link to the event by eventId
                                tableType: 'event', // Specifying that this media is linked to an event
                                id: file.mediaId, // Store the mediaId from the uploaded file
                            },
                        });

                        console.log(`Media with ID ${file.mediaId} uploaded successfully.`);
                        return media;
                    });

                    // Wait for all new media files to be processed
                    const uploadedMedia = (await Promise.all(uploadPromises)).filter(Boolean); // Remove null entries
                    console.log('All new media uploaded successfully:', uploadedMedia);
                } catch (error) {
                    console.error('Error uploading media files:', error);
                }
            }


            // Return the updated event
            return res.status(200).json({
                message: shouldPublish
                    ? 'Event updated and published successfully'
                    : 'Event updated and saved as a draft successfully',
                eventId: updatedEvent.eventId,
                eventName: updatedEvent.eventName,
            });
        } catch (error) {
            console.error('Error updating event:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            await prisma.$disconnect();
        }
    }
);


//delete individual event by thier eventID (softDelete)
eventRouter.put(
    '/delete-event/:eventId',
    authenticateToken,
    authenticateRole, authenticateMembership,
    async (req: AuthenticatedRequest, res: Response) => {

        if (req.isAdmin !== 'admin') {
            return res.status(702).send('You are not authorized to create a designation.');
        }

        const { eventId } = req.params;

        try {
            // Check if the event exists
            const existingEvent = await prisma.event.findUnique({
                where: { eventId: eventId },
            });

            if (!existingEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }

                 // Create a new event entry in the db
                 if (!req.user?.id) {
                    throw new Error('User ID is required');
                }



            // Delete all media associated with the event
            const deletedMedias = await prisma.media.deleteMany({
                where: {
                    tableId: eventId, // Match the eventId
                    tableType: 'event', // Ensure it's media associated with the event
                },
            });

            console.log(`${deletedMedias.count} media files deleted successfully for eventId: ${eventId}`);

            // Update the event by setting isDeleted to 'SOFT_DELETED'
            const updatedEvent = await prisma.event.update({
                where: { eventId: eventId },
                data: {
                    isDeleted: 'SOFT_DELETED',
                    modifiedById: req.user.id, // Track who made the update
                },
            });

            // Return the updated event information
            return res.status(200).json({
                message: 'Event and associated media deleted successfully',
                eventId: updatedEvent.eventId,
                eventName: updatedEvent.eventName,
                isDeleted: updatedEvent.isDeleted,
                deletedMediaCount: deletedMedias.count,
            });
        } catch (error) {
            console.error('Error deleting event:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            await prisma.$disconnect();
        }
    }
);


//FOR DROPZONE ONLY
// DELETE route to delete media by mediaId for dropzone
eventRouter.delete(
    '/delete-media/:mediaId',
    authenticateToken,
    authenticateRole, authenticateMembership,
    async (req: AuthenticatedRequest, res: Response) => {

        if (req.isAdmin !== 'admin') {
            return res.status(702).send('You are not authorized to create a designation.');
        }

        const { mediaId } = req.params;

        try {
            // Check if the media exists
            const existingMedia = await prisma.media.findUnique({
                where: { id: mediaId },
            });

            if (!existingMedia) {
                return res.status(404).json({ message: 'Media not found' });
            }

            // Delete the media entry
            const deletedMedia = await prisma.media.delete({
                where: { id: mediaId },
            });

            // Return the deleted media information
            return res.status(200).json({
                message: 'Media deleted successfully',
                mediaId: deletedMedia.id,
                type: deletedMedia.type,
            });
        } catch (error) {
            console.error('Error deleting media:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            await prisma.$disconnect();
        }
    }
);

//hard delete event in delete tab
eventRouter.put(
    '/hard-delete-event/:eventId',
    authenticateToken,
    authenticateRole, authenticateMembership,
    async (req: AuthenticatedRequest, res: Response) => {

        if (req.isAdmin !== 'admin') {
            return res.status(702).send('You are not authorized to create a designation.');
        }

        const { eventId } = req.params;


        try {
            // Check if the event exists
            const existingEvent = await prisma.event.findUnique({
                where: { eventId: eventId },
            });

            if (!existingEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }

                 // Create a new event entry in the db
                 if (!req.user?.id) {
                    throw new Error('User ID is required');
                }



            // Check if the eventId exists in the Payment table
            const paymentExists = await prisma.subscriptionPayments.findFirst({
                where: { eventId: eventId },
            });

            if (paymentExists) {
                return res.status(400).json({
                    message: 'This event cannot be deleted as there are registered members with payments.',
                });
            }


            const updatedEvent = await prisma.event.update({
                where: { eventId: eventId },
                data: {
                    isDeleted: 'HARD_DELETED',
                    modifiedById: req.user.id, // Track who made the update
                },
            });

            // Return the updated event information
            return res.status(200).json({
                message: 'Event deleted permanently successfully',
                eventId: updatedEvent.eventId,
                eventName: updatedEvent.eventName,
                isDeleted: updatedEvent.isDeleted,
            });
        } catch (error) {
            console.error('Error permanently deleting the event:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            await prisma.$disconnect();
        }

    }
);




// Fetch registered members for a specific event
eventRouter.get('/display-event-member-registration', authenticateToken, authenticateRole, authenticateMembership, async (req: Request, res: Response) => {
    try {
        
        const eventID = req.query.eventID as string;
        const encryptedSocietyId = req.query.societyId as string;

          
        if (!encryptedSocietyId || !secretKey) {
            throw new Error('Society ID or secret key is missing');
        }
        

        console.log("display-event-member-registration encryptedSocietyId", encryptedSocietyId);

        const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10
        const offset = parseInt(req.query.offset as string, 10) || 0; // Default offset to 0
      
        // Decrypt the societyId
        const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
        console.log("bytes is ", bytes);
        const societyId = bytes.toString(CryptoJS.enc.Utf8);
        console.log("societyId in display-event-member-registration", societyId);

        if (!societyId) {
            throw new Error('Failed to decrypt society ID');
        }

        

        console.log("Decrypted Society ID:", societyId);

        if (!eventID) {
            return res.status(400).json({ error: 'eventID is required' });
        }

        console.log('Fetching registered members for eventID:', eventID);

           // Fetch total count of registered members (before applying limit & offset)
           const totalRecords = await prisma.subscriptionPayments.count({
            where: {
                eventId: eventID,
                status: 'Completed', // Only fetch completed payments
            }
        });

        // Fetch event details including acceptDonation
        const eventDetails = await prisma.event.findUnique({
            where: {
                eventId: eventID,
            },
            select: {
                acceptDonation: true,
                eventType: true,
                eventStartDate: true,
                eventStartTime: true,
                eventEndTime: true,
                eventEndDate: true
            }
        });

        if (!eventDetails) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Fetch registered members for the event based on completed payments
        const registeredMembers = await prisma.subscriptionPayments.findMany({
            where: {
                eventId: eventID,
                status: 'Completed', // Only fetch completed payments
            },
            take: limit, // Pagination limit
            skip: offset, // Pagination offset
            select: {
                amount: true,
                subscriptionPaymentDate: true,
                userId: true, // We only have userId in the payment table
                numberOfRegistrations: true
            }
        });

        if (registeredMembers.length === 0) {
            return res.status(404).json({ error: 'No registered members found for this event' });
        }

        // Fetch user details based on the userIds from the payments
        const userIds = registeredMembers.map((payment) => payment.userId);

        const users = await prisma.user.findMany({
            where: {
                userId: {
                    in: userIds
                }
            },
            select: {
                userId: true,
                firstName: true,
                lastName: true,
                phoneNumber: true
            }
        });

        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found for the registered members' });
        }

        // Fetch profile pictures for each user
        const userPictures = await prisma.media.findMany({
            where: {
                tableId: { in: userIds },
                tableType: 'user',
                type: 'image'
            },
            select: {
                tableId: true, // This is the userId for each picture
                data: true // This is the image data
            }
        });

        // Convert profile pictures to Base64 format and map them to userIds
        const userPicturesMap = userPictures.reduce((acc, picture) => {
            if (picture.tableId) { // Ensure tableId is not null
                acc[picture.tableId] = `data:image/png;base64,${picture.data.toString('base64')}`;
            }
            return acc;
        }, {} as { [key: string]: string | null });


        // Join payments with user data
        const formattedMembers = registeredMembers.map((payment) => {
            const user = users.find((u) => u.userId === payment.userId);
            const profilePicture = userPicturesMap[payment.userId] || null;
            return {
                name: `${user?.firstName} ${user?.lastName}`, // Combine firstName and lastName
                date: new Date(payment.subscriptionPaymentDate).toLocaleDateString('en-GB'),
                members: payment.numberOfRegistrations, // Assuming one payment corresponds to one member
                amount: payment.amount,
                mobile: user?.phoneNumber,
                profilePicture: profilePicture
            };
        });

        console.log('Fetched Registered Members:', formattedMembers);

        const societyDetails = await prisma.society.findUnique({
            where: {
                societyId: societyId,
            },
            select: {
                societyName: true,
                streetName: true,
                pincode: true,
                state: true

            }
        });


        
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


        console.log("societyDetails", societyDetails);

        res.status(200).json(JSON.parse(safeJsonStringify({
            members: formattedMembers,
            acceptDonation: eventDetails.acceptDonation,
            eventType: eventDetails.eventType,
            eventDate: eventDetails.eventStartDate,
            eventStartTime: eventDetails.eventStartTime,
            eventEndTime: eventDetails.eventEndTime,
            eventEndDate: eventDetails.eventEndDate,
            societyDetails: societyDetails,
            societyLogoBase64:societyLogoBase64,
            totalRecords
        })));
    } catch (error) {
        console.error('Error fetching registered members:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default eventRouter;