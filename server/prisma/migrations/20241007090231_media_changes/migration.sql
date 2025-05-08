/*
  Warnings:

  - A unique constraint covering the columns `[tableId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Society" DROP CONSTRAINT "Society_logoId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profilePictureId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Media_tableId_key" ON "Media"("tableId");

-- RenameForeignKey
ALTER TABLE "Media" RENAME CONSTRAINT "Media_tableId_fkey" TO "Media_eventId_fkey";

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_societyId_fkey" FOREIGN KEY ("tableId") REFERENCES "Society"("societyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("tableId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
