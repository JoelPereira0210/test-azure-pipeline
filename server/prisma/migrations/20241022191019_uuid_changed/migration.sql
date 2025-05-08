/*
  Warnings:

  - The primary key for the `SubscriptionMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "SubscriptionMaster_subscriptionId_key";

-- AlterTable
ALTER TABLE "SubscriptionMaster" DROP CONSTRAINT "SubscriptionMaster_pkey",
ALTER COLUMN "subscriptionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "SubscriptionMaster_pkey" PRIMARY KEY ("subscriptionId");
