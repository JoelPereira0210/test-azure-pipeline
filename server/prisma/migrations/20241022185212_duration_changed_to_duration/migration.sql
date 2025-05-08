/*
  Warnings:

  - You are about to drop the column `Duration` on the `SubscriptionMaster` table. All the data in the column will be lost.
  - Added the required column `duration` to the `SubscriptionMaster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubscriptionMaster" DROP COLUMN "Duration",
ADD COLUMN     "duration" TIMESTAMP(3) NOT NULL;
