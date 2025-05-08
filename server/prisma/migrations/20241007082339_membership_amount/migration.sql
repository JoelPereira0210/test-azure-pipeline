-- AlterTable
ALTER TABLE "Society" ADD COLUMN     "chargeMembershipFees" BOOLEAN DEFAULT false,
ADD COLUMN     "membershipFeeAmount" VARCHAR(255);
