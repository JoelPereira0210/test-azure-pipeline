/*
  Warnings:

  - A unique constraint covering the columns `[societyId]` on the table `BankDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_societyId_key" ON "BankDetails"("societyId");
