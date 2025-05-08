/*
  Warnings:

  - You are about to drop the column `steetName` on the `Society` table. All the data in the column will be lost.
  - Added the required column `streetName` to the `Society` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Society" DROP COLUMN "steetName",
ADD COLUMN     "streetName" VARCHAR(255) NOT NULL;
