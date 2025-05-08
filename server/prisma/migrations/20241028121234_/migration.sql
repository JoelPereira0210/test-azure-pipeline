/*
  Warnings:

  - The primary key for the `Coupons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Coupons` table. All the data in the column will be lost.
  - The required column `couponId` was added to the `Coupons` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "SubscriptionPayments" DROP CONSTRAINT "SubscriptionPayments_couponId_fkey";

-- AlterTable
ALTER TABLE "Coupons" DROP CONSTRAINT "Coupons_pkey",
DROP COLUMN "id",
ADD COLUMN     "couponId" TEXT NOT NULL,
ADD CONSTRAINT "Coupons_pkey" PRIMARY KEY ("couponId");

-- AddForeignKey
ALTER TABLE "SubscriptionPayments" ADD CONSTRAINT "SubscriptionPayments_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupons"("couponId") ON DELETE SET NULL ON UPDATE CASCADE;
