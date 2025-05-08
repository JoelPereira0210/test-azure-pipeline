-- DropForeignKey
ALTER TABLE "CommitteeRoleMaster" DROP CONSTRAINT "CommitteeRoleMaster_societyId_fkey";

-- AlterTable
ALTER TABLE "CommitteeRoleMaster" ALTER COLUMN "societyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CommitteeRoleMaster" ADD CONSTRAINT "CommitteeRoleMaster_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("societyId") ON DELETE SET NULL ON UPDATE CASCADE;
