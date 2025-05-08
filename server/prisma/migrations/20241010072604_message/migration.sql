-- CreateTable
CREATE TABLE "Message" (
    "messageId" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" VARCHAR(1000),
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "mediaId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("messageId")
);
