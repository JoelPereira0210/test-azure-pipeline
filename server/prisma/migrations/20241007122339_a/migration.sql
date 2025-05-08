/*
  Warnings:

  - Made the column `tableId` on table `Media` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_tableId_fkey";

-- DropIndex
DROP INDEX "Media_tableId_key";

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "tableId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
