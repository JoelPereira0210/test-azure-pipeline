-- CreateTable
CREATE TABLE "eventRecurrenceTypeMaster" (
    "eventRecurrenceTypeId" TEXT NOT NULL,
    "frequency" VARCHAR(255) NOT NULL,

    CONSTRAINT "eventRecurrenceTypeMaster_pkey" PRIMARY KEY ("eventRecurrenceTypeId")
);

-- CreateTable
CREATE TABLE "eventTypeMaster" (
    "id" TEXT NOT NULL,
    "eventType" VARCHAR(255) NOT NULL,

    CONSTRAINT "eventTypeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "eventId" TEXT NOT NULL,
    "eventName" VARCHAR(255) NOT NULL,
    "eventDescription" VARCHAR(1000) NOT NULL,
    "eventRegistrationDate" TIMESTAMP(3) NOT NULL,
    "eventStartDate" TIMESTAMP(3) NOT NULL,
    "eventEndDate" TIMESTAMP(3) NOT NULL,
    "eventStartTime" TIMESTAMP(3) NOT NULL,
    "eventEndTime" TIMESTAMP(3) NOT NULL,
    "eventTypeId" TEXT NOT NULL,
    "acceptDonation" BOOLEAN,
    "maxPeopleAllowed" TEXT NOT NULL,
    "amount" TEXT,
    "allowFamilyandFriends" BOOLEAN NOT NULL,
    "ChargePerPerson" BOOLEAN,
    "createdById" TEXT NOT NULL,
    "modifiedById" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,
    "recurrencyId" TEXT,
    "shouldPublish" BOOLEAN NOT NULL,
    "societyId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "Recurrency" (
    "recurrencyId" TEXT NOT NULL,
    "recurrencyFrequencyId" TEXT NOT NULL,
    "recurrencyDay" TIMESTAMP(3) NOT NULL,
    "recurrencyMonth" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recurrency_pkey" PRIMARY KEY ("recurrencyId")
);

-- CreateIndex
CREATE INDEX "Event_eventTypeId_idx" ON "Event"("eventTypeId");

-- CreateIndex
CREATE INDEX "Event_recurrencyId_idx" ON "Event"("recurrencyId");

-- CreateIndex
CREATE INDEX "Event_societyId_idx" ON "Event"("societyId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("societyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "eventTypeMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_recurrencyId_fkey" FOREIGN KEY ("recurrencyId") REFERENCES "Recurrency"("recurrencyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurrency" ADD CONSTRAINT "Recurrency_recurrencyFrequencyId_fkey" FOREIGN KEY ("recurrencyFrequencyId") REFERENCES "eventRecurrenceTypeMaster"("eventRecurrenceTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;
