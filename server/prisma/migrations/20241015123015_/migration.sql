/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `deleteTypeMaster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "deleteTypeMaster_id_key" ON "deleteTypeMaster"("id");
