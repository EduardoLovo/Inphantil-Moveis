/*
  Warnings:

  - The `bedSize` column on the `ShippingQuote` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ShippingQuote" DROP COLUMN "bedSize",
ADD COLUMN     "bedSize" VARCHAR(100);
