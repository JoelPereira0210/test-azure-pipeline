/*
  Warnings:

  - You are about to drop the column `numberOfUses` on the `Coupons` table. All the data in the column will be lost.
  - Added the required column `Uses` to the `Coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxUses` to the `Coupons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupons" DROP COLUMN "numberOfUses",
ADD COLUMN     "Uses" TEXT NOT NULL,
ADD COLUMN     "maxUses" TEXT NOT NULL;
