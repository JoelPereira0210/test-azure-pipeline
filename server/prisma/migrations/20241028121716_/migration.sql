/*
  Warnings:

  - You are about to drop the column `societyID` on the `Coupons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coupons" DROP COLUMN "societyID",
ADD COLUMN     "societyId" TEXT;
