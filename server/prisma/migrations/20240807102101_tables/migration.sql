-- CreateEnum
CREATE TYPE "TableTypes" AS ENUM ('user', 'society', 'event');

-- CreateTable
CREATE TABLE "BankDetails" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "IFSCCode" TEXT NOT NULL,
    "accountHolder" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "modifiedDate" TIMESTAMP(3) NOT NULL,
    "modifiedById" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommitteeRoleMaster" (
    "designationId" TEXT NOT NULL,
    "designationName" TEXT NOT NULL,
    "numberOfPositions" INTEGER NOT NULL,
    "adminPrivileges" BOOLEAN NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "modifiedDate" TIMESTAMP(3) NOT NULL,
    "modifiedById" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,

    CONSTRAINT "CommitteeRoleMaster_pkey" PRIMARY KEY ("designationId")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "tableId" TEXT NOT NULL,
    "tableType" "TableTypes" NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipStatus" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "MembershipStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTP" (
    "id" TEXT NOT NULL,
    "phoneNumber" VARCHAR(10) NOT NULL,
    "otpCode" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Society" (
    "societyId" TEXT NOT NULL,
    "societySubscriptionId" VARCHAR(255) NOT NULL,
    "societyName" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "subscriptionStartDate" TIMESTAMP(3) NOT NULL,
    "subscriptionEndDate" TIMESTAMP(3) NOT NULL,
    "buildingDoorNo" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "pincode" VARCHAR(6) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Society_pkey" PRIMARY KEY ("societyId")
);

-- CreateTable
CREATE TABLE "SocietyMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "SocietyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "phoneNumber" VARCHAR(10) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "flatNo" VARCHAR(255) NOT NULL,
    "buildingDoorNo" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "pincode" VARCHAR(6) NOT NULL,
    "gender" VARCHAR(255) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "_UserMembershipStatus" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SocietyMember_userId_societyId_key" ON "SocietyMember"("userId", "societyId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_UserMembershipStatus_AB_unique" ON "_UserMembershipStatus"("A", "B");

-- CreateIndex
CREATE INDEX "_UserMembershipStatus_B_index" ON "_UserMembershipStatus"("B");

-- AddForeignKey
ALTER TABLE "BankDetails" ADD CONSTRAINT "BankDetails_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDetails" ADD CONSTRAINT "BankDetails_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitteeRoleMaster" ADD CONSTRAINT "CommitteeRoleMaster_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitteeRoleMaster" ADD CONSTRAINT "CommitteeRoleMaster_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "UserMedia_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "SocietyMedia_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Society"("societyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Society" ADD CONSTRAINT "Society_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocietyMember" ADD CONSTRAINT "SocietyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocietyMember" ADD CONSTRAINT "SocietyMember_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("societyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocietyMember" ADD CONSTRAINT "SocietyMember_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "CommitteeRoleMaster"("designationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserMembershipStatus" ADD CONSTRAINT "_UserMembershipStatus_A_fkey" FOREIGN KEY ("A") REFERENCES "MembershipStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserMembershipStatus" ADD CONSTRAINT "_UserMembershipStatus_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
