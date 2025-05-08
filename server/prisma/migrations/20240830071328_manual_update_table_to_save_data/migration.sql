-- Step 1: Add temporary columns for state and country
ALTER TABLE "Society" ADD COLUMN "state_temp" JSONB;
ALTER TABLE "Society" ADD COLUMN "country_temp" JSONB;
ALTER TABLE "User" ADD COLUMN "state_temp" JSONB;
ALTER TABLE "User" ADD COLUMN "country_temp" JSONB;

-- Step 2: Migrate data from the old columns to the new JSON columns
UPDATE "Society" SET "state_temp" = jsonb_build_object('value', "state");
UPDATE "Society" SET "country_temp" = jsonb_build_object('value', "country");
UPDATE "User" SET "state_temp" = jsonb_build_object('value', "state");
UPDATE "User" SET "country_temp" = jsonb_build_object('value', "country");

-- Step 3: Drop the old columns
ALTER TABLE "Society" DROP COLUMN "state";
ALTER TABLE "Society" DROP COLUMN "country";
ALTER TABLE "User" DROP COLUMN "state";
ALTER TABLE "User" DROP COLUMN "country";

-- Step 4: Rename the new columns to the original names
ALTER TABLE "Society" RENAME COLUMN "state_temp" TO "state";
ALTER TABLE "Society" RENAME COLUMN "country_temp" TO "country";
ALTER TABLE "User" RENAME COLUMN "state_temp" TO "state";
ALTER TABLE "User" RENAME COLUMN "country_temp" TO "country";
