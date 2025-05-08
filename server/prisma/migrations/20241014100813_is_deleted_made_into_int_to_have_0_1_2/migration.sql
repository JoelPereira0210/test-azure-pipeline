/*
  Warnings:

  - The `isDeleted` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "isDeleted",
ADD COLUMN     "isDeleted" INTEGER NOT NULL DEFAULT 0;
