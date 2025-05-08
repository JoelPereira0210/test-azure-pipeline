/*
  Warnings:

  - The values [0,1,2] on the enum `DeletionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeletionStatus_new" AS ENUM ('NOT_DELETED', 'SOFT_DELETED', 'HARD_DELETED');
ALTER TABLE "Event" ALTER COLUMN "isDeleted" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "isDeleted" TYPE "DeletionStatus_new" USING ("isDeleted"::text::"DeletionStatus_new");
ALTER TYPE "DeletionStatus" RENAME TO "DeletionStatus_old";
ALTER TYPE "DeletionStatus_new" RENAME TO "DeletionStatus";
DROP TYPE "DeletionStatus_old";
ALTER TABLE "Event" ALTER COLUMN "isDeleted" SET DEFAULT 'NOT_DELETED';
COMMIT;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "isDeleted" SET DEFAULT 'NOT_DELETED';
