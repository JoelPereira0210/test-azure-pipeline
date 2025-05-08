/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_createdById_fkey";

-- DropTable
DROP TABLE "Payment";

-- CreateTable
CREATE TABLE "SubscriptionPayments" (
    "id" TEXT NOT NULL,
    "subscriptionPaymentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT,
    "amount" INTEGER NOT NULL,
    "subscriptionPaymentDate" TIMESTAMP(3) NOT NULL,
    "societyBankDetailId" TEXT NOT NULL,
    "couponId" TEXT,
    "subscriptionId" TEXT,
    "status" TEXT NOT NULL,
    "gatewayResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "numberOfRegistrations" INTEGER NOT NULL,

    CONSTRAINT "SubscriptionPayments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPayments_subscriptionPaymentId_key" ON "SubscriptionPayments"("subscriptionPaymentId");

-- AddForeignKey
ALTER TABLE "SubscriptionPayments" ADD CONSTRAINT "SubscriptionPayments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
