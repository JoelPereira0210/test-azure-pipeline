/*
  Warnings:

  - You are about to alter the column `planName` on the `SubscriptionMaster` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to alter the column `price` on the `SubscriptionMaster` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(14)`.
  - You are about to alter the column `maxUsers` on the `SubscriptionMaster` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(14)`.
  - You are about to alter the column `duration` on the `SubscriptionMaster` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(14)`.

*/
-- AlterTable
ALTER TABLE "SubscriptionMaster" ADD COLUMN     "planDescription" VARCHAR(255) NOT NULL DEFAULT '',
ALTER COLUMN "planName" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "price" SET DATA TYPE VARCHAR(14),
ALTER COLUMN "maxUsers" SET DATA TYPE VARCHAR(14),
ALTER COLUMN "duration" SET DATA TYPE VARCHAR(14);
