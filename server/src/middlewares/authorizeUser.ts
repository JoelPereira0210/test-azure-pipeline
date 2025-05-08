import jwt, { JwtPayload } from 'jsonwebtoken';
import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { CONFIG } from '../utils/config'
import CryptoJS from 'crypto-js';

dotenv.config();
type User = {
    id: string;
    phoneNumber: string;
    iat: number;
    isAdmin?: any;
}

const secretKey = CONFIG.SECRET_KEY || '';
console.log("SECRET KEY IN SERVER",secretKey);

export interface AuthenticatedRequest extends Request {
    user?: User; // Extend with optional user property
    role?: any;
    isAdmin?: 'admin' | 'normaluser';
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    // console.log('aurh', authHeader)
    if (!authHeader) return res.sendStatus(401);


    // Split the Authorization header to separate the Bearer prefix and token
    const [bearer, token] = authHeader.split(' ');
    if (!token || bearer !== 'Bearer') return res.sendStatus(401);
    // console.log("tpken", token)
    // Verify the token (without the Bearer prefix)
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user: string | jwt.JwtPayload | undefined) => {
        if (err) return res.sendStatus(403); // Invalid token or expired token
        req.user = user as User; // Attach the decoded user information to the request
        next();
    });
};

export const authenticateRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        console.log("req.user", req.user)
        // Retrieve societyId from the custom header
        const encryptedSocietyId = req.headers['x-society-id'] as string;

        if (!encryptedSocietyId) {
            return res.status(400).json({ error: 'Society ID is required in the request headers' });
        }

        console.log('Encrypted Society ID from headers: ',encryptedSocietyId);

        // Decrypt the societyId
        const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, secretKey);
        const societyId = bytes.toString(CryptoJS.enc.Utf8);
        console.log("socieyId", societyId)

        if (!societyId) {
            return res.status(400).json({ error: 'Failed to decrypt society ID' });
        }

        console.log('authenticateRole Decrypted Society ID:', societyId);



        // console.log("user is here",req.user);
        // const authUser = await prisma.user.findUnique({
        //     where: { userId: req.user.id }
        // })

        const authUser = await prisma.societyMember.findUnique({
            where: {
                userId_societyId: {
                    userId: req.user.id,
                    societyId: societyId
                }
            }
        })
        console.log("authUser", authUser);
        const userId = req.user.id;
        // console.log('user authenticateRole', userId)
        // console.log('societyId authenticateRole', societyId)
        const roles = await prisma.societyMember.findMany({
            where: {
                userId: userId,
                societyId: societyId
            },
        })
        // console.log("roles", roles)
        const designations = await prisma.committeeRoleMaster.findMany({
            where: {
                societyMembers: {
                    some: {
                        roleId: roles[0].roleId, societyId: societyId
                    }
                }
            }
        })


        if ((designations[0]?.adminPrivileges === true || authUser?.isAdmin === true)) {

            req.isAdmin = 'admin'; // Set isAdmin to true if the user has admin privileges
            console.log("req.isAdmin1", req.isAdmin);
            req.role = roles[0];
            next();
        }
        // else if ((designations[0]?.adminPrivileges === true || authUser?.isAdmin === true) && membershipStatusId?.toString() !== '1') {

        //     req.isAdmin = 'normaluser'; // Set isAdmin to true if the user has admin privileges
        //     console.log("req.isAdmin2", req.isAdmin);
        //     req.role = roles[0];
        //     next();
        // }

        else if (designations[0]?.adminPrivileges || authUser?.isAdmin) {

            req.isAdmin = 'normaluser'; // Set isAdmin to true if the user has admin privileges
            console.log("req.isAdmin2", req.isAdmin);
            req.role = roles[0];
            next();
        }
        else if ((designations[0]?.adminPrivileges === false && authUser?.isAdmin === false)) {
            req.isAdmin = 'normaluser';
            // throw ('authorized user')
            next();
        }
    } catch (error) {
        console.log("error", error)
        return res.json(error)
    }
};


export const authenticateMembership = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Check if the user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Fetch the user details from the database
        const authUser = await prisma.user.findUnique({
            where: { userId: req.user.id },
        });

        if (!authUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log("authUser Status", authUser)
        const membershipStatusId = authUser?.membershipStatusId;

        // Check membership status
        if (membershipStatusId?.toString() !== '1') {
            console.log("memebrship is not active")

            return res.status(403).json({ error: 'Membership is inactive' });

        }

        console.log('Membership is active for user:', req.user.id);
        next(); // Membership is active; proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error in authenticateMembership:', error);
        return res.status(500).json({ error: 'An internal server error occurred' });
    }
};
export const authenticateSuperAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const userId = req.user.id;
        next();
        // const superAdmin=

    } catch (error) {
        console.log("error", error)
        return res.status(500).json(error)
    }
}
