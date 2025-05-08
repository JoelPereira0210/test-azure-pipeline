/*
  Warnings:

  - You are about to drop the `LandingCards` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[landingCardId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "landingCardId" TEXT;

-- DropTable
DROP TABLE "LandingCards";

-- CreateTable
CREATE TABLE "LandingCard" (
    "landingCardId" TEXT NOT NULL,
    "cardTitle" VARCHAR(255),
    "cardSubTitle" VARCHAR(255),
    "cardDescription" VARCHAR(1000),
    "highlightText" TEXT,
    "type" "CardType" NOT NULL DEFAULT 'GENERIC',

    CONSTRAINT "LandingCard_pkey" PRIMARY KEY ("landingCardId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_landingCardId_key" ON "Media"("landingCardId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_landingCardId_fkey" FOREIGN KEY ("landingCardId") REFERENCES "LandingCard"("landingCardId") ON DELETE SET NULL ON UPDATE CASCADE;
