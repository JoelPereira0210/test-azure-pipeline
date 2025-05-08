/*
  Warnings:

  - A unique constraint covering the columns `[societyId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "EventMedia_tableId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "SocietyMedia_tableId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "UserMedia_tableId_fkey";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "societyId" TEXT,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "tableId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Media_societyId_key" ON "Media"("societyId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_userId_key" ON "Media"("userId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("societyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
