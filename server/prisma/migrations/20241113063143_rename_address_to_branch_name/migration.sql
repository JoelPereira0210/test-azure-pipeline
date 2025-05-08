/*
  Warnings:

  - You are about to drop the column `address` on the `BankDetails` table. All the data in the column will be lost.
  - Added the required column `branchName` to the `BankDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankDetails" DROP COLUMN "address",
ADD COLUMN     "branchName" TEXT NOT NULL;
