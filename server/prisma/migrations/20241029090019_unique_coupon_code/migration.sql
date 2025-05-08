/*
  Warnings:

  - A unique constraint covering the columns `[couponCode]` on the table `Coupons` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Coupons_couponCode_key" ON "Coupons"("couponCode");
