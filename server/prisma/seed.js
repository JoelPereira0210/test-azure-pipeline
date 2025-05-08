"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield bcryptjs_1.default.hash('superAdmin@101', 12);
        // Create the superAdmin user
        const superAdminUser = yield prisma.user.upsert({
            where: { phoneNumber: '+919130681854' },
            update: {
                firstName: 'Super',
                lastName: 'Admin',
                isAdmin: true, // SuperAdmin will have admin privileges
            },
            create: {
                phoneNumber: '+919130681854',
                firstName: 'Super',
                lastName: 'Admin',
                isAdmin: true, // SuperAdmin will have admin privileges
                password: hashedPassword,
            },
        });
        // Create the superAdmin role in CommitteeRoleMaster
        const superAdminRole = yield prisma.committeeRoleMaster.upsert({
            where: {
                designationId: 'super-admin-role-uuid'
            },
            update: {
                // Update any fields if needed
                modifiedById: superAdminUser.userId, // Assign the superAdmin user as the editor
            },
            create: {
                designationId: "super-admin-role-uuid", // Fixed UUID or auto-generated
                designationName: "superAdmin",
                numberOfPositions: 1,
                adminPrivileges: true,
                createdById: superAdminUser.userId, // Link to the superAdmin user
                modifiedById: superAdminUser.userId,
                societyId: null, // Since superAdmin is not part of a specific society
                createdDate: new Date(),
                modifiedDate: new Date(),
                isDeleted: false
            },
        });
        const superAdminBankDetails = yield prisma.bankDetails.upsert({
            where: {
                id: "super-admin-bank-id",
            },
            update: {
                modifiedById: superAdminUser.userId,
                isDeleted: false,
            },
            create: {
                id: "super-admin-bank-id",
                societyId: null,
                bank: 'SuperAdmin Bank',
                accountNumber: '1234567890',
                IFSCCode: 'IFSC12345',
                accountName: 'Super Admin',
                branchName: 'SuperAdmin Address',
                createdById: superAdminUser.userId,
                modifiedById: superAdminUser.userId,
                createdDate: new Date(),
                modifiedDate: new Date(),
                isDeleted: false,
            },
        });
        console.log('SuperAdmin user, role, and bank details created');
        // Define default event types
        const defaultEventTypes = [
            { eventType: 'free' },
            { eventType: 'paid' },
        ];
        const defaultDeleteTypes = [
            { deleteType: 'NOT_DELETED' },
            { deleteType: 'SOFT_DELETED' },
            { deleteType: 'HARD_DELETED' },
        ];
        // Define default membership statuses
        const defaultStatuses = [
            { status: 'Active' },
            { status: 'Invited' },
            { status: 'Invitation Pending' },
            { status: 'Accepted' },
        ];
        // Upsert default event types
        for (const type of defaultEventTypes) {
            yield prisma.eventTypeMaster.upsert({
                where: { eventType: type.eventType },
                update: {}, // Do nothing if it exists
                create: type, // Create if it does not exist
            });
        }
        console.log('Default event types have been seeded.');
        // Upsert default membership statuses
        for (const status of defaultStatuses) {
            yield prisma.membershipStatus.upsert({
                where: { status: status.status },
                update: {}, // Do nothing if it exists
                create: status, // Create if it does not exist
            });
        }
        // Upsert default delete statuses
        for (const type of defaultDeleteTypes) {
            yield prisma.deleteTypeMaster.upsert({
                where: { deleteType: type.deleteType }, // Ensure 'deleteType' is unique
                update: {}, // Do nothing if it exists
                create: {
                    deleteType: type.deleteType,
                    // Add other fields if required by your model, e.g.:
                    // createdAt: new Date(),
                    // updatedAt: new Date(),
                }
            });
        }
        console.log('Default membership statuses have been seeded.');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
