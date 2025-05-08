/*
  Warnings:

  - You are about to drop the `_UserMemberships` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserMemberships" DROP CONSTRAINT "_UserMemberships_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserMemberships" DROP CONSTRAINT "_UserMemberships_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "membershipStatusId" TEXT;

-- DropTable
DROP TABLE "_UserMemberships";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_membershipStatusId_fkey" FOREIGN KEY ("membershipStatusId") REFERENCES "MembershipStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
