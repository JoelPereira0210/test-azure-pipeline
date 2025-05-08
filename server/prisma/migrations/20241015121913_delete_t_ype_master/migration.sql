-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_eventTypeId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "feeTypeId" BIGINT,
ALTER COLUMN "eventTypeId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "deleteTypeMaster" (
    "id" BIGSERIAL NOT NULL,
    "status" VARCHAR(255) NOT NULL,

    CONSTRAINT "deleteTypeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feeTypeMaster" (
    "id" BIGSERIAL NOT NULL,
    "feeType" VARCHAR(255) NOT NULL,

    CONSTRAINT "feeTypeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deleteTypeMaster_id_key" ON "deleteTypeMaster"("id");

-- CreateIndex
CREATE UNIQUE INDEX "deleteTypeMaster_status_key" ON "deleteTypeMaster"("status");

-- CreateIndex
CREATE UNIQUE INDEX "feeTypeMaster_id_key" ON "feeTypeMaster"("id");

-- CreateIndex
CREATE INDEX "Event_feeTypeId_idx" ON "Event"("feeTypeId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "eventTypeMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_feeTypeId_fkey" FOREIGN KEY ("feeTypeId") REFERENCES "feeTypeMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;
