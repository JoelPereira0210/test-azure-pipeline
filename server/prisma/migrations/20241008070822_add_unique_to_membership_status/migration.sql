/*
  Warnings:

  - A unique constraint covering the columns `[status]` on the table `MembershipStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MembershipStatus_status_key" ON "MembershipStatus"("status");
