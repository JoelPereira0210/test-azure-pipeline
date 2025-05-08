/*
  Warnings:

  - Added the required column `societyId` to the `societySubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "societySubscription" ADD COLUMN     "societyId" TEXT NOT NULL;
