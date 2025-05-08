-- DropForeignKey
ALTER TABLE "Society" DROP CONSTRAINT "Society_logoId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profilePictureId_fkey";

-- CreateIndex
CREATE INDEX "Media_tableId_idx" ON "Media"("tableId");

-- RenameForeignKey
ALTER TABLE "Media" RENAME CONSTRAINT "Media_tableId_fkey" TO "EventMedia_tableId_fkey";

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "SocietyMedia_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Society"("societyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "UserMedia_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
