"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./src/utils/config");
const auth_1 = __importDefault(require("./src/routes/auth/auth"));
const payment_1 = __importDefault(require("./src/routes/payment/payment"));
const society_1 = __importDefault(require("./src/routes/society/society"));
const user_1 = __importDefault(require("./src/routes/user/user"));
const designation_1 = __importDefault(require("./src/routes/designation/designation"));
const Events_1 = __importDefault(require("./src/routes/event/Events"));
const Chats_1 = __importStar(require("./src/routes/chat/Chats"));
const profile_1 = __importDefault(require("./src/routes/profile/profile"));
const landingpage_1 = __importDefault(require("./src/routes/landingpage/landingpage"));
const Charges_1 = __importDefault(require("./src/routes/charges/Charges"));
const superAdmin_1 = __importDefault(require("./src/routes/superAdmin/superAdmin"));
const addmember_1 = __importDefault(require("./src/routes/addmember/addmember"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// Primary domain configuration
const MAIN_DOMAIN = 'localhost:3000';
// Setup dynamic CORS
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin) {
            // Allow requests with no origin (like mobile apps or curl)
            return callback(null, true);
        }
        // Validate if the origin is part of the allowed domain or its subdomains
        const allowedDomain = new RegExp(`^http?:\\/\\/[a-zA-Z0-9-]+\\.${MAIN_DOMAIN}$`);
        if (allowedDomain.test(origin) || origin === `http://${MAIN_DOMAIN}`) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization,x-society-id',
}));
// Middleware to parse JSON
app.use(express_1.default.json({ limit: '10mb' }));
// API routes
app.use('/api/auth', auth_1.default);
app.use('/api/payments', payment_1.default);
app.use('/api/society', society_1.default);
app.use('/api/designations', designation_1.default);
app.use('/api/user', user_1.default);
app.use('/api/addMember', addmember_1.default);
app.use('/api/events', Events_1.default);
app.use('/api/chats', Chats_1.default);
app.use('/api/charges', Charges_1.default);
app.use('/api/super-admin', superAdmin_1.default);
app.use('/api/profile', profile_1.default);
app.use('/api/landingpage', landingpage_1.default);
// Create an HTTP server
const server = http_1.default.createServer(app);
// Setup Socket.IO
(0, Chats_1.setupSocket)(server);
// Start the server on the same port for both HTTP and WebSocket connections
server.listen(config_1.CONFIG.PORT || 9000, () => {
    console.log(`Server is running on port ${config_1.CONFIG.PORT || 9000}`);
});
