/*
  Warnings:

  - Added the required column `contactId` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fundAccount` to the `BankDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankDetails" ADD COLUMN     "contactId" TEXT NOT NULL,
ADD COLUMN     "fundAccount" TEXT NOT NULL;
