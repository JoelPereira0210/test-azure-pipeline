/*
  Warnings:

  - A unique constraint covering the columns `[feeType]` on the table `feeTypeMaster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "feeTypeMaster_feeType_key" ON "feeTypeMaster"("feeType");
