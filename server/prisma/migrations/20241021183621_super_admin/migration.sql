/*
  Warnings:

  - A unique constraint covering the columns `[societyId,designationName]` on the table `CommitteeRoleMaster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CommitteeRoleMaster_societyId_designationName_key" ON "CommitteeRoleMaster"("societyId", "designationName");
