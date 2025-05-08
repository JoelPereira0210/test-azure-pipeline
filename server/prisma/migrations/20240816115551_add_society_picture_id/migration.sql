-- AlterTable
ALTER TABLE "Society" ALTER COLUMN "societySubscriptionId" DROP NOT NULL,
ALTER COLUMN "subscriptionStartDate" DROP NOT NULL,
ALTER COLUMN "subscriptionEndDate" DROP NOT NULL;
