/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `MembershipStatus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventRecurrenceTypeId]` on the table `eventRecurrenceTypeMaster` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[frequency]` on the table `eventRecurrenceTypeMaster` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `eventTypeMaster` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventType]` on the table `eventTypeMaster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MembershipStatus_id_key" ON "MembershipStatus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "eventRecurrenceTypeMaster_eventRecurrenceTypeId_key" ON "eventRecurrenceTypeMaster"("eventRecurrenceTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "eventRecurrenceTypeMaster_frequency_key" ON "eventRecurrenceTypeMaster"("frequency");

-- CreateIndex
CREATE UNIQUE INDEX "eventTypeMaster_id_key" ON "eventTypeMaster"("id");

-- CreateIndex
CREATE UNIQUE INDEX "eventTypeMaster_eventType_key" ON "eventTypeMaster"("eventType");
