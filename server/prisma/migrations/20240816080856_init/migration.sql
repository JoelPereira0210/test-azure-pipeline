/*
  Warnings:

  - You are about to drop the column `buildingDoorNo` on the `Society` table. All the data in the column will be lost.
  - You are about to drop the column `buildingDoorNo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `flatNo` on the `User` table. All the data in the column will be lost.
  - Added the required column `buildingDoorNumber` to the `Society` table without a default value. This is not possible if the table is not empty.
  - Added the required column `steetName` to the `Society` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildingDoorNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flatNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Society" DROP COLUMN "buildingDoorNo",
ADD COLUMN     "buildingDoorNumber" VARCHAR(255) NOT NULL,
ADD COLUMN     "steetName" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "buildingDoorNo",
DROP COLUMN "flatNo",
ADD COLUMN     "buildingDoorNumber" VARCHAR(255) NOT NULL,
ADD COLUMN     "flatNumber" VARCHAR(255) NOT NULL,
ADD COLUMN     "streetName" VARCHAR(255) NOT NULL;
