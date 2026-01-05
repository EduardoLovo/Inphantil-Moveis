/*
  Warnings:

  - The values [SOLTEIRÃO] on the enum `ItemSize` will be removed. If these variants are still used in the database, this will fail.
  - The `size` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ItemSize_new" AS ENUM ('BERÇO', 'JUNIOR', 'SOLTEIRO', 'SOLTEIRAO', 'VIUVA', 'CASAL', 'QUEEN', 'KING');
ALTER TABLE "Product" ALTER COLUMN "size" TYPE "ItemSize_new" USING ("size"::text::"ItemSize_new");
ALTER TABLE "VisualItem" ALTER COLUMN "size" TYPE "ItemSize_new" USING ("size"::text::"ItemSize_new");
ALTER TYPE "ItemSize" RENAME TO "ItemSize_old";
ALTER TYPE "ItemSize_new" RENAME TO "ItemSize";
DROP TYPE "public"."ItemSize_old";
COMMIT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "size",
ADD COLUMN     "size" "ItemSize";
