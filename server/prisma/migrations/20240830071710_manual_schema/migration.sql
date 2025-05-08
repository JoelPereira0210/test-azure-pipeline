/*
  Warnings:

  - Made the column `state` on table `Society` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Society` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Society" ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL;
