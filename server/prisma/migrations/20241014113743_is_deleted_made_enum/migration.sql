/*
  Warnings:

  - The `isDeleted` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DeletionStatus" AS ENUM ('0', '1', '2');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "isDeleted",
ADD COLUMN     "isDeleted" "DeletionStatus" NOT NULL DEFAULT '0';
