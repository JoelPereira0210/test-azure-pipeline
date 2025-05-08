/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `SocietyMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SocietyMember_inviteCode_key" ON "SocietyMember"("inviteCode");
