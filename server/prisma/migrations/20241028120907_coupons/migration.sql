-- CreateTable
CREATE TABLE "Coupons" (
    "id" TEXT NOT NULL,
    "couponName" VARCHAR(60) NOT NULL,
    "couponCode" VARCHAR(60) NOT NULL,
    "couponDescription" VARCHAR(255) NOT NULL,
    "numberOfUses" TEXT NOT NULL,
    "societyID" TEXT,
    "discountPercentage" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "modifiedById" TEXT NOT NULL,

    CONSTRAINT "Coupons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Coupons" ADD CONSTRAINT "Coupons_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupons" ADD CONSTRAINT "Coupons_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPayments" ADD CONSTRAINT "SubscriptionPayments_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
