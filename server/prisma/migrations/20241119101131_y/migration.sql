/*
  Warnings:

  - You are about to alter the column `couponCode` on the `Coupons` table. The data in that column could be lost. The data in that column will be cast from `VarChar(60)` to `VarChar(8)`.

*/
-- AlterTable
ALTER TABLE "Coupons" ALTER COLUMN "couponCode" SET DATA TYPE VARCHAR(8);
