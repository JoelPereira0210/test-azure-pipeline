/*
  Warnings:

  - You are about to drop the column `Uses` on the `Coupons` table. All the data in the column will be lost.
  - Added the required column `uses` to the `Coupons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupons" DROP COLUMN "Uses",
ADD COLUMN     "uses" TEXT NOT NULL;
