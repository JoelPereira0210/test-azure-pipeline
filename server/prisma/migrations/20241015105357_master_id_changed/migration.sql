/*
  Warnings:

  - The primary key for the `MembershipStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MembershipStatus` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `membershipStatusId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `eventRecurrenceTypeMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `eventRecurrenceTypeId` column on the `eventRecurrenceTypeMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `eventTypeMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `eventTypeMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `eventTypeId` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `recurrencyFrequencyId` on the `Recurrency` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Recurrency" DROP CONSTRAINT "Recurrency_recurrencyFrequencyId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_membershipStatusId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "eventTypeId",
ADD COLUMN     "eventTypeId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "MembershipStatus" DROP CONSTRAINT "MembershipStatus_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "MembershipStatus_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Recurrency" DROP COLUMN "recurrencyFrequencyId",
ADD COLUMN     "recurrencyFrequencyId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" VARCHAR(255),
DROP COLUMN "membershipStatusId",
ADD COLUMN     "membershipStatusId" BIGINT;

-- AlterTable
ALTER TABLE "eventRecurrenceTypeMaster" DROP CONSTRAINT "eventRecurrenceTypeMaster_pkey",
DROP COLUMN "eventRecurrenceTypeId",
ADD COLUMN     "eventRecurrenceTypeId" BIGSERIAL NOT NULL,
ADD CONSTRAINT "eventRecurrenceTypeMaster_pkey" PRIMARY KEY ("eventRecurrenceTypeId");

-- AlterTable
ALTER TABLE "eventTypeMaster" DROP CONSTRAINT "eventTypeMaster_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "eventTypeMaster_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Event_eventTypeId_idx" ON "Event"("eventTypeId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "eventTypeMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurrency" ADD CONSTRAINT "Recurrency_recurrencyFrequencyId_fkey" FOREIGN KEY ("recurrencyFrequencyId") REFERENCES "eventRecurrenceTypeMaster"("eventRecurrenceTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_membershipStatusId_fkey" FOREIGN KEY ("membershipStatusId") REFERENCES "MembershipStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
