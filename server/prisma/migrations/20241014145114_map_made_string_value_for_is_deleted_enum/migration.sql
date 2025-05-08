/*
  Warnings:

  - The values [NOT_DELETED,SOFT_DELETED,HARD_DELETED] on the enum `DeletionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeletionStatus_new" AS ENUM ('0', '1', '2');
ALTER TABLE "Event" ALTER COLUMN "isDeleted" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "isDeleted" TYPE "DeletionStatus_new" USING ("isDeleted"::text::"DeletionStatus_new");
ALTER TYPE "DeletionStatus" RENAME TO "DeletionStatus_old";
ALTER TYPE "DeletionStatus_new" RENAME TO "DeletionStatus";
DROP TYPE "DeletionStatus_old";
ALTER TABLE "Event" ALTER COLUMN "isDeleted" SET DEFAULT '0';
COMMIT;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "isDeleted" SET DEFAULT '0';
