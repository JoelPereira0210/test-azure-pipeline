-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_societyId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_userId_fkey";

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "tableId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_societyId_fkey" FOREIGN KEY ("tableId") REFERENCES "Society"("societyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("tableId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_eventId_fkey" FOREIGN KEY ("tableId") REFERENCES "Event"("eventId") ON DELETE SET NULL ON UPDATE CASCADE;
