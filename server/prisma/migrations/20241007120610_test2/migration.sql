/*
  Warnings:

  - You are about to drop the column `allowFamilyAndFriends` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `chargePerPerson` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `EventRecurrenceTypeMaster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventTypeMaster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventMediaRelation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tableId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `allowFamilyandFriends` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Recurrency" DROP CONSTRAINT "Recurrency_recurrencyFrequencyId_fkey";

-- DropForeignKey
ALTER TABLE "_EventMediaRelation" DROP CONSTRAINT "_EventMediaRelation_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventMediaRelation" DROP CONSTRAINT "_EventMediaRelation_B_fkey";

-- DropIndex
DROP INDEX "Media_tableId_tableType_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "allowFamilyAndFriends",
DROP COLUMN "chargePerPerson",
ADD COLUMN     "ChargePerPerson" BOOLEAN,
ADD COLUMN     "allowFamilyandFriends" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "tableId" DROP NOT NULL;

-- DropTable
DROP TABLE "EventRecurrenceTypeMaster";

-- DropTable
DROP TABLE "EventTypeMaster";

-- DropTable
DROP TABLE "_EventMediaRelation";

-- CreateTable
CREATE TABLE "eventRecurrenceTypeMaster" (
    "eventRecurrenceTypeId" TEXT NOT NULL,
    "frequency" VARCHAR(255) NOT NULL,

    CONSTRAINT "eventRecurrenceTypeMaster_pkey" PRIMARY KEY ("eventRecurrenceTypeId")
);

-- CreateTable
CREATE TABLE "eventTypeMaster" (
    "id" TEXT NOT NULL,
    "eventType" VARCHAR(255) NOT NULL,

    CONSTRAINT "eventTypeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_tableId_key" ON "Media"("tableId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "eventTypeMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Event"("eventId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurrency" ADD CONSTRAINT "Recurrency_recurrencyFrequencyId_fkey" FOREIGN KEY ("recurrencyFrequencyId") REFERENCES "eventRecurrenceTypeMaster"("eventRecurrenceTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Society" ADD CONSTRAINT "Society_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
