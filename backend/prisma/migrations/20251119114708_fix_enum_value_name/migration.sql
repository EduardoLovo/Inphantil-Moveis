/*
  Warnings:

  - The values [LNEÇOL] on the enum `VisualItemType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VisualItemType_new" AS ENUM ('APLIQUE', 'TECIDO', 'PANTONE', 'LENÇOL', 'SINTETICO');
ALTER TABLE "VisualItem" ALTER COLUMN "type" TYPE "VisualItemType_new" USING ("type"::text::"VisualItemType_new");
ALTER TYPE "VisualItemType" RENAME TO "VisualItemType_old";
ALTER TYPE "VisualItemType_new" RENAME TO "VisualItemType";
DROP TYPE "public"."VisualItemType_old";
COMMIT;
