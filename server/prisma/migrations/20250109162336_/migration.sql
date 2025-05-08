/*
  Warnings:

  - You are about to drop the column `gmail` on the `LandingCard` table. All the data in the column will be lost.
  - You are about to drop the column `highlightText` on the `SliderCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LandingCard" DROP COLUMN "gmail",
ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "SliderCard" DROP COLUMN "highlightText";
