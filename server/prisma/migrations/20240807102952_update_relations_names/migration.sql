/*
  Warnings:

  - You are about to alter the column `status` on the `MembershipStatus` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `_UserMembershipStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserMembershipStatus" DROP CONSTRAINT "_UserMembershipStatus_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserMembershipStatus" DROP CONSTRAINT "_UserMembershipStatus_B_fkey";

-- AlterTable
ALTER TABLE "MembershipStatus" ALTER COLUMN "status" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "_UserMembershipStatus";

-- CreateTable
CREATE TABLE "_UserMemberships" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserMemberships_AB_unique" ON "_UserMemberships"("A", "B");

-- CreateIndex
CREATE INDEX "_UserMemberships_B_index" ON "_UserMemberships"("B");

-- AddForeignKey
ALTER TABLE "_UserMemberships" ADD CONSTRAINT "_UserMemberships_A_fkey" FOREIGN KEY ("A") REFERENCES "MembershipStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserMemberships" ADD CONSTRAINT "_UserMemberships_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
