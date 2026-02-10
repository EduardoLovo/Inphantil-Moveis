/*
  Warnings:

  - The values [BERÇO] on the enum `ItemSize` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ItemSize_new" AS ENUM ('BERCO', 'JUNIOR', 'SOLTEIRO', 'SOLTEIRAO', 'VIUVA', 'CASAL', 'QUEEN', 'KING');
ALTER TABLE "Product" ALTER COLUMN "size" TYPE "ItemSize_new" USING ("size"::text::"ItemSize_new");
ALTER TABLE "VisualItem" ALTER COLUMN "size" TYPE "ItemSize_new" USING ("size"::text::"ItemSize_new");
ALTER TYPE "ItemSize" RENAME TO "ItemSize_old";
ALTER TYPE "ItemSize_new" RENAME TO "ItemSize";
DROP TYPE "public"."ItemSize_old";
COMMIT;
