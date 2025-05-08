/*
  Warnings:

  - You are about to drop the column `ChargePerPerson` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `allowFamilyandFriends` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `eventRecurrenceTypeMaster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eventTypeMaster` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `allowFamilyAndFriends` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `tableId` on table `Media` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_tableId_fkey";

-- DropForeignKey
ALTER TABLE "Recurrency" DROP CONSTRAINT "Recurrency_recurrencyFrequencyId_fkey";

-- DropForeignKey
ALTER TABLE "Society" DROP CONSTRAINT "Society_logoId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profilePictureId_fkey";

-- DropIndex
DROP INDEX "Media_tableId_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "ChargePerPerson",
DROP COLUMN "allowFamilyandFriends",
ADD COLUMN     "allowFamilyAndFriends" BOOLEAN NOT NULL,
ADD COLUMN     "chargePerPerson" BOOLEAN;

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "tableId" SET NOT NULL;

-- DropTable
DROP TABLE "eventRecurrenceTypeMaster";

-- DropTable
DROP TABLE "eventTypeMaster";

-- CreateTable
CREATE TABLE "EventRecurrenceTypeMaster" (
    "eventRecurrenceTypeId" TEXT NOT NULL,
    "frequency" VARCHAR(255) NOT NULL,

    CONSTRAINT "EventRecurrenceTypeMaster_pkey" PRIMARY KEY ("eventRecurrenceTypeId")
);

-- CreateTable
CREATE TABLE "EventTypeMaster" (
    "id" TEXT NOT NULL,
    "eventType" VARCHAR(255) NOT NULL,

    CONSTRAINT "EventTypeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventMediaRelation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EventMediaRelation_AB_unique" ON "_EventMediaRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_EventMediaRelation_B_index" ON "_EventMediaRelation"("B");

-- CreateIndex
CREATE INDEX "Media_tableId_tableType_idx" ON "Media"("tableId", "tableType");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventTypeMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurrency" ADD CONSTRAINT "Recurrency_recurrencyFrequencyId_fkey" FOREIGN KEY ("recurrencyFrequencyId") REFERENCES "EventRecurrenceTypeMaster"("eventRecurrenceTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventMediaRelation" ADD CONSTRAINT "_EventMediaRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventMediaRelation" ADD CONSTRAINT "_EventMediaRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
