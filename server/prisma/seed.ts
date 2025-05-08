import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('superAdmin@101', 12);

    // Create the superAdmin user
    const superAdminUser = await prisma.user.upsert({
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
    const superAdminRole = await prisma.committeeRoleMaster.upsert({
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
    const superAdminBankDetails = await prisma.bankDetails.upsert({
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
    ]
    // Define default membership statuses
    const defaultStatuses = [
        { status: 'Active' },
        { status: 'Invited' },
        { status: 'Invitation Pending' },
        { status: 'Accepted' },
    ];

    // Upsert default event types
    for (const type of defaultEventTypes) {
        await prisma.eventTypeMaster.upsert({
            where: { eventType: type.eventType },
            update: {}, // Do nothing if it exists
            create: type, // Create if it does not exist
        });
    }

    console.log('Default event types have been seeded.');

    // Upsert default membership statuses
    for (const status of defaultStatuses) {
        await prisma.membershipStatus.upsert({
            where: { status: status.status },
            update: {}, // Do nothing if it exists
            create: status, // Create if it does not exist
        });
    }
    // Upsert default delete statuses
    for (const type of defaultDeleteTypes) {
        await prisma.deleteTypeMaster.upsert({
            where: { deleteType: type.deleteType },  // Ensure 'deleteType' is unique
            update: {},  // Do nothing if it exists
            create: {
                deleteType: type.deleteType,
                // Add other fields if required by your model, e.g.:
                // createdAt: new Date(),
                // updatedAt: new Date(),
            }
        });
    }

    console.log('Default membership statuses have been seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
