import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import express from 'express';
import { authenticateMembership, authenticateToken } from '../../middlewares/authorizeUser';
import { PrismaClient } from '@prisma/client';
// import { decryptValue } from '../../utils/encryptiondecryption';
type User = {
    id: string;
    phoneNumber: string;
    iat: number;
}
interface CustomSocket extends Socket {
    user?: User; // Add user property to the socket
}
const prisma = new PrismaClient();
const MAIN_DOMAIN = `${process.env.MAIN_DOMAIN}`;

// const allowedDomainRegex = /^http?:\/\/([a-z0-9-]+\.)?(${MAIN_DOMAIN}|10.0.2.2:9000|10.0.2.2:8081|10.0.2.16:8081|10.0.2.16:9000")$/
const allowedDomainRegex = new RegExp(`^https?:\\/\\/([a-z0-9-]+\\.)?(${MAIN_DOMAIN}|10.0.2.2:9000|10.0.2.2:8081|10.0.2.16:8081|10.0.2.16:9000|192.168.31.31:3000)$`);

export const setupSocket = (server: any) => {
   /*  const io = new Server(server, {
        path: '/api/chat/socket.io',  // The path for your socket connection
        cors: {
            origin: 'http://localhost:3000',  // Adjust for your frontend
            allowedHeaders: ['Authorization'],
            credentials: true
        }
    });
 */
    // const io = new Server(server, {
    //     path: '/api/chat/socket.io',  // The path for your socket connection
    //     cors: {
    //         origin: (origin: string | undefined, callback: Function) => {
    //             if (!origin) {
    //                 // Allow requests with no origin (like mobile apps or curl)
    //                 return callback(null, true);
    //             }

    //             // Validate if the origin is part of the allowed domain or its subdomains
    //             const allowedDomain = new RegExp(`^http?:\\/\\/[a-zA-Z0-9-]+\\.${MAIN_DOMAIN}$`);
    //             if (allowedDomain.test(origin) || origin === `http://${MAIN_DOMAIN}`) {
    //                 callback(null, true);
    //             } else {
    //                 callback(new Error('Not allowed by CORS'));
    //             }
    //         },
    //         allowedHeaders: ['Authorization'],
    //         credentials: true
    //     }
    // });
    const io = new Server(server, {
        path: '/api/chat/socket.io',  // The path for your socket connection
        cors: {
            origin: (origin: string | undefined, callback: Function) => {
                if (!origin) {
                    // Allow requests with no origin (like mobile apps or curl)
                    return callback(null, true);
                }

                // Validate if the origin is part of the allowed domain or its subdomains
                if (allowedDomainRegex.test(origin)) {
                    return callback(null, true);
                  } else {
                    console.error(`Blocked CORS origin: ${origin}`);
                    return callback(new Error('Not allowed by CORS'));
                  }
            },
            allowedHeaders: ['Authorization'],
            credentials: true
        }
    });
 
    // Middleware to verify token (if needed)
    io.use((socket: CustomSocket, next) => {
        const token = socket.handshake.headers['authorization'];
        // console.log("TPEKM", token)
        if (!token) {
            return next(new Error('Authentication error: Token not provided'));
        }
        jwt.verify(token.split(' ')[1], process.env.JWT_SECRET as string, (err, user) => {
            if (err) {
                return next(new Error('Authentication error: Invalid token'));
            }
            // console.log("SOCKET", socket)
            socket.user = user as User; // Attach user information to socket object\
            // console.log("SOCKET", socket.user)
            next();
        });
    });

    // Handle socket connection
    io.on('connection', (socket: CustomSocket) => {
        console.log('New client connected');
        socket.on('joinRoom', (societyId) => {
            if (societyId) {
                socket.join(societyId);
                console.log(`User joined room: ${societyId}`);
            } else {
                console.error('No societyId provided to join room');
            }
        });
        // Handle sending messages
        socket.on('sendMessage', async (data, callback) => {
            console.log("data", data)
            const userId = socket.user?.id;
            const user = await prisma.user.findUnique({
                where: { userId },
                include: {
                    societyMembers: {
                        include: {
                            role: {
                                select: {
                                    designationName: true, // Fetch the designation name from CommitteeRoleMaster
                                }
                            },
                            society: {
                                select: {
                                    societyName: true // You can also fetch society details if needed
                                }
                            }
                        }
                    }
                }
            });
            console.log("user", user?.societyMembers[0].role)
            if (!userId) {
                // return callback({ status: 'error', message: 'User not authenticated' });
            }

            try {
                if (!userId) {
                    throw new Error('User ID is required');
                }
                // Store the message in the database
                const savedMessage = await prisma.message.create({
                    data: {
                        userId,
                        societyId: data.societyId,
                        message: data.message,
                        timeStamp: new Date(),
                        mediaId: null,
                        isDeleted: false
                    }
                });

                // Emit the message to everyone in the society room
                io.to(data.societyId).emit('message', {
                    userId,
                    societyId: data.societyId,
                    message: data.message,
                    timeStamp: savedMessage.timeStamp,
                    mediaId: null,
                    designation: user?.societyMembers[0].role.designationName || 'Unknown',
                    fullName: `${user?.firstName ?? 'Unknown'} ${user?.lastName ?? ''}`,
                    isDeleted: false
                });
            } catch (error) {
                console.error('Error saving message:', error);
                // callback({ status: 'error', message: 'Message failed to send' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

// Chat router for API routes
const chatRouter = express.Router();
// chatRouter.get('/', authenticateToken, async (req, res) => {
//     const societyId = req.body.societyId;

//     try {
//         // Fetch messages along with user details (firstName, lastName, and designation)
//         // Fetch messages along with user details (firstName, lastName, and designation)
//         const chats = await prisma.message.findMany({
//             where: { societyId },
//             include: {
//                 // Fetch the user data via the userId field in the Message model
//                 user: {
//                     select: {
//                         userId: true,
//                         firstName: true,
//                         lastName: true,
//                         societyMembers: {
//                             where: {
//                                 societyId, // Match the current society
//                             },
//                             select: {
//                                 role: {
//                                     select: {
//                                         designationName: true,
//                                     },
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         });
//         console.log("chats", chats)

//         // Format response to include fullName and designation
//         const formattedChats = chats.map(chat => ({
//             messageId: chat.messageId,
//             societyId: chat.societyId,
//             userId: chat.userId,
//             message: chat.message,
//             timeStamp: chat.timeStamp,
//             mediaId: chat.mediaId,
//             isDeleted: chat.isDeleted,
//             fullName: `${chat.user.firstName} ${chat.user.lastName}`,
//             designation: chat.user.societyMembers[0]?.role?.designationName || 'Unknown',
//         }));
//         console.log("formattedChats", formattedChats)
//         res.json(formattedChats);
//     } catch (error) {
//         console.log("ERRPR", error)
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
chatRouter.get('/', authenticateToken,authenticateMembership, async (req, res) => {
    const societyId = req.query.societyId as string;
    const page = req.query.page ?? '1';
    const limit = req.query.limit ?? '10';

    const pageNumber = parseInt(page as string, 10); // Parse the page number
    const limitNumber = parseInt(limit as string, 10); // Parse the limit (optional, default to 10)

    const skip = (pageNumber - 1) * limitNumber; // Calculate how many records to skip for pagination

    try {
        // Fetch messages along with user details (firstName, lastName, and designation)
        const chats = await prisma.message.findMany({
            where: { societyId },
            orderBy: {
                timeStamp: 'desc', // Order by the latest messages
            },
            skip, // Skip messages for pagination
            take: limitNumber, // Limit the number of messages to fetch
            include: {
                user: {
                    select: {
                        userId: true,
                        firstName: true,
                        lastName: true,
                        societyMembers: {
                            where: {
                                societyId,
                            },
                            select: {
                                role: {
                                    select: {
                                        designationName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        // Format response to include fullName and designation
        const formattedChats = chats.map(chat => ({
            messageId: chat.messageId,
            societyId: chat.societyId,
            userId: chat.userId,
            message: chat.message,
            timeStamp: chat.timeStamp,
            mediaId: chat.mediaId,
            isDeleted: chat.isDeleted,
            fullName: `${chat.user.firstName} ${chat.user.lastName}`,
            designation: chat.user.societyMembers[0]?.role?.designationName || 'Unknown',
        }));

        res.json(formattedChats);
    } catch (error) {
        console.error("Error fetching chat messages", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



export default chatRouter;