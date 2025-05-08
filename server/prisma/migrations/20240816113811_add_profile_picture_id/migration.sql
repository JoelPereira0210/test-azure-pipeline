/*
  Warnings:

  - Added the required column `buildingName` to the `Society` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Society" ADD COLUMN     "buildingName" VARCHAR(255) NOT NULL;
