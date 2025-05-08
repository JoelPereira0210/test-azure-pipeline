/*
  Warnings:

  - Made the column `message` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "message" SET NOT NULL,
ALTER COLUMN "message" SET DATA TYPE TEXT,
ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
