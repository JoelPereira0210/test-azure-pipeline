/*
  Warnings:

  - You are about to drop the `SliderCards` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sliderCardId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "sliderCardId" TEXT;

-- DropTable
DROP TABLE "SliderCards";

-- CreateTable
CREATE TABLE "SliderCard" (
    "sliderCardId" TEXT NOT NULL,
    "cardTitle" VARCHAR(255),
    "cardSubTitle" VARCHAR(255),
    "cardDescription" VARCHAR(1000),
    "highlightText" TEXT,
    "source" TEXT,

    CONSTRAINT "SliderCard_pkey" PRIMARY KEY ("sliderCardId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_sliderCardId_key" ON "Media"("sliderCardId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_sliderCardId_fkey" FOREIGN KEY ("sliderCardId") REFERENCES "SliderCard"("sliderCardId") ON DELETE SET NULL ON UPDATE CASCADE;
