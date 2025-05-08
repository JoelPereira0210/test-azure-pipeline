-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('HEADER', 'DISCOVER', 'ABOUT_US', 'PLANS', 'GENERIC');

-- CreateTable
CREATE TABLE "LandingCards" (
    "landingCardId" TEXT NOT NULL,
    "cardTitle" VARCHAR(255),
    "cardSubTitle" VARCHAR(255),
    "cardDescription" VARCHAR(1000),
    "highlightText" TEXT,
    "type" "CardType" NOT NULL DEFAULT 'GENERIC',

    CONSTRAINT "LandingCards_pkey" PRIMARY KEY ("landingCardId")
);

-- CreateTable
CREATE TABLE "SliderCards" (
    "sliderCardId" TEXT NOT NULL,
    "cardTitle" VARCHAR(255),
    "cardSubTitle" VARCHAR(255),
    "cardDescription" VARCHAR(1000),
    "highlightText" TEXT,
    "source" TEXT,

    CONSTRAINT "SliderCards_pkey" PRIMARY KEY ("sliderCardId")
);
