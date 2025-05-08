-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "SocietyMedia_tableId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "UserMedia_tableId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePictureId" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "UserMedia_tableId_fkey" FOREIGN KEY ("id") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "SocietyMedia_tableId_fkey" FOREIGN KEY ("id") REFERENCES "Society"("societyId") ON DELETE RESTRICT ON UPDATE CASCADE;
