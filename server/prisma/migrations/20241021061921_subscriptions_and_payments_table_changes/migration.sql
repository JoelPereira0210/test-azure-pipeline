-- CreateTable
CREATE TABLE "societySubscription" (
    "societySubscriptionId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "subscriptionPaymentID" TEXT NOT NULL,
    "subscriptionStartDate" TIMESTAMP(3) NOT NULL,
    "subscriptionEndDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdById" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SubscriptionMaster" (
    "subscriptionId" BIGINT NOT NULL,
    "planName" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "Duration" TIMESTAMP(3) NOT NULL,
    "maxUsers" BIGINT NOT NULL,
    "isDeleted" "DeletionStatus" NOT NULL DEFAULT 'NOT_DELETED',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "modifiedById" TEXT NOT NULL,

    CONSTRAINT "SubscriptionMaster_pkey" PRIMARY KEY ("subscriptionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "societySubscription_societySubscriptionId_key" ON "societySubscription"("societySubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionMaster_subscriptionId_key" ON "SubscriptionMaster"("subscriptionId");

-- AddForeignKey
ALTER TABLE "societySubscription" ADD CONSTRAINT "societySubscription_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionMaster" ADD CONSTRAINT "SubscriptionMaster_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionMaster" ADD CONSTRAINT "SubscriptionMaster_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
