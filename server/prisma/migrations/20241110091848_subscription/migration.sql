-- CreateIndex
CREATE INDEX "societySubscription_subscriptionId_idx" ON "societySubscription"("subscriptionId");

-- AddForeignKey
ALTER TABLE "societySubscription" ADD CONSTRAINT "societySubscription_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "SubscriptionMaster"("subscriptionId") ON DELETE RESTRICT ON UPDATE CASCADE;
