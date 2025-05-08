/*
  Warnings:

  - Added the required column `societyId` to the `CommitteeRoleMaster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommitteeRoleMaster" ADD COLUMN     "societyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CommitteeRoleMaster" ADD CONSTRAINT "CommitteeRoleMaster_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("societyId") ON DELETE RESTRICT ON UPDATE CASCADE;
