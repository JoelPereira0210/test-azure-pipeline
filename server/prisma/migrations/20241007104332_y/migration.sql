-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_societyId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_userId_fkey";

-- RenameForeignKey
ALTER TABLE "Media" RENAME CONSTRAINT "Media_eventId_fkey" TO "Media_tableId_fkey";

-- AddForeignKey
ALTER TABLE "Society" ADD CONSTRAINT "Society_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
