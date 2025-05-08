/*
  Warnings:

  - You are about to drop the column `status` on the `deleteTypeMaster` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[deleteType]` on the table `deleteTypeMaster` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deleteType` to the `deleteTypeMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `deleteTypeMaster` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "deleteTypeMaster_id_key";

-- DropIndex
DROP INDEX "deleteTypeMaster_status_key";

-- AlterTable
ALTER TABLE "deleteTypeMaster" DROP COLUMN "status",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleteType" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "deleteTypeMaster_deleteType_key" ON "deleteTypeMaster"("deleteType");
