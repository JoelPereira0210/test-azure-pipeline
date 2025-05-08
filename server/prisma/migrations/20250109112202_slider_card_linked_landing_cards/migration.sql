-- AlterTable
ALTER TABLE "SliderCard" ADD COLUMN     "landingCardId" TEXT;

-- AddForeignKey
ALTER TABLE "SliderCard" ADD CONSTRAINT "SliderCard_landingCardId_fkey" FOREIGN KEY ("landingCardId") REFERENCES "LandingCard"("landingCardId") ON DELETE SET NULL ON UPDATE CASCADE;
