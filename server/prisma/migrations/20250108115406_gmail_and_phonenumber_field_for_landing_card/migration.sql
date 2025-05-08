/*
  Warnings:

  - You are about to drop the column `highlightText` on the `LandingCard` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "CardType" ADD VALUE 'CONTACT';

-- AlterTable
ALTER TABLE "LandingCard" DROP COLUMN "highlightText",
ADD COLUMN     "gmail" TEXT,
ADD COLUMN     "phoneNumber" TEXT;
