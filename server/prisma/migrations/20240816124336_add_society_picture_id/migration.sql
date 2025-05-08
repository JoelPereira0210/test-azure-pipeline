/*
  Warnings:

  - A unique constraint covering the columns `[logoId]` on the table `Society` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profilePictureId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "SocietyMedia_tableId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "UserMedia_tableId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profilePictureId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Society_logoId_key" ON "Society"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_profilePictureId_key" ON "User"("profilePictureId");

-- AddForeignKey
ALTER TABLE "Society" ADD CONSTRAINT "Society_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
