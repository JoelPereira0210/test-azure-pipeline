/*
  Warnings:

  - A unique constraint covering the columns `[tableId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Media_tableId_key" ON "Media"("tableId");
