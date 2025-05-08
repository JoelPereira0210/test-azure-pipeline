-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "paymentItemId" TEXT NOT NULL,
    "paymentItemName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentAmountPerItem" INTEGER,
    "paymentItemTotalAmount" INTEGER NOT NULL,
    "noOfItems" INTEGER,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);
