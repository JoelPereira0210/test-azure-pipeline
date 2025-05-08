// import express, { Request, Response } from 'express';
// import http from 'http';
// import { PrismaClient } from '@prisma/client';
// import cors from 'cors';
// import { CONFIG } from './src/utils/config';
// import authRouter from './src/routes/auth/auth';
// import paymentRouter from './src/routes/payment/payment';
// import societyRouter from './src/routes/society/society';
// import userRouter from './src/routes/user/user';
// import designationRouter from './src/routes/designation/designation';
// import eventRouter from './src/routes/event/Events';

// import chatRouter, { setupSocket } from './src/routes/chat/Chats';
// import profileRouter from './src/routes/profile/profile';

// import chargeRouter from './src/routes/charges/Charges';
// import superAdminRouter from './src/routes/superAdmin/superAdmin';
// import addMemberRouter from './src/routes/addmember/addmember';
// const app = express();
// const prisma = new PrismaClient();

// // Setup CORS
// app.use(cors({
//   origin: 'http://localhost:3000',  // Adjust with your frontend domain
//   methods: 'GET,POST,PUT,DELETE,PATCH',
//   allowedHeaders: 'Content-Type,Authorization',
//   credentials: true,
// }));

// // Middleware to parse JSON
// app.use(express.json({ limit: '10mb' }));

// // API routes
// app.use('/api/auth', authRouter);
// app.use('/api/payments', paymentRouter);
// app.use('/api/society', societyRouter);
// app.use('/api/designations', designationRouter);
// app.use('/api/user', userRouter);
// app.use('/api/addMember', addMemberRouter);
// app.use('/api/events', eventRouter);
// app.use('/api/chats', chatRouter);
// app.use('/api/charges', chargeRouter);
// app.use('/api/super-admin', superAdminRouter)
// app.use('/api/profile', profileRouter);

// // Create an HTTP server
// const server = http.createServer(app);

// // Setup Socket.IO
// setupSocket(server);

// // Start the server on the same port for both HTTP and WebSocket connections
// server.listen(CONFIG.PORT || 9000, () => {
//   console.log(`Server is running on port ${CONFIG.PORT || 9000}`);
// });

import express, { Request, Response } from 'express';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { CONFIG } from './src/utils/config';
import authRouter from './src/routes/auth/auth';
import paymentRouter from './src/routes/payment/payment';
import societyRouter from './src/routes/society/society';
import userRouter from './src/routes/user/user';
import designationRouter from './src/routes/designation/designation';
import eventRouter from './src/routes/event/Events';

import chatRouter, { setupSocket } from './src/routes/chat/Chats';
import profileRouter from './src/routes/profile/profile';
import landingRouter from './src/routes/landingpage/landingpage';
import chargeRouter from './src/routes/charges/Charges';
import superAdminRouter from './src/routes/superAdmin/superAdmin';
import addMemberRouter from './src/routes/addmember/addmember';

const app = express();
const prisma = new PrismaClient();

// Primary domain configuration
// const MAIN_DOMAIN = 'localhost:3000';
const MAIN_DOMAIN = `${process.env.MAIN_DOMAIN}`;

// Setup dynamic CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      // Allow requests with no origin (like mobile apps or curl)
      return callback(null, true);
    }

    // Validate if the origin is part of the allowed domain or its subdomains
    const allowedDomain = new RegExp(`^https?:\\/\\/[a-zA-Z0-9-]+\\.${MAIN_DOMAIN}$`);
    if (allowedDomain.test(origin) || origin === `https://${MAIN_DOMAIN}`) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,POST,PUT,DELETE,PATCH',
  allowedHeaders: 'Content-Type,Authorization,x-society-id',
}));

// Middleware to parse JSON
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api/auth', authRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/society', societyRouter);
app.use('/api/designations', designationRouter);
app.use('/api/user', userRouter);
app.use('/api/addMember', addMemberRouter);
app.use('/api/events', eventRouter);
app.use('/api/chats', chatRouter);
app.use('/api/charges', chargeRouter);
app.use('/api/super-admin', superAdminRouter);
app.use('/api/profile', profileRouter);
app.use('/api/landingpage', landingRouter);

// Create an HTTP server
const server = http.createServer(app);

// Setup Socket.IO
setupSocket(server);

// Start the server on the same port for both HTTP and WebSocket connections
server.listen(CONFIG.PORT || 9000, () => {
  console.log(`Server is running on port ${CONFIG.PORT || 9000}`);
});

