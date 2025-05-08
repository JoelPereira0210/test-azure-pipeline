/*
  Warnings:

  - The `isDeleted` column on the `Coupons` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Coupons" DROP COLUMN "isDeleted",
ADD COLUMN     "isDeleted" "DeletionStatus" NOT NULL DEFAULT 'NOT_DELETED';
