/*
  Warnings:

  - You are about to drop the column `isTapeteria` on the `VisualItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VisualItem" DROP COLUMN "isTapeteria",
ADD COLUMN     "isTapete" BOOLEAN NOT NULL DEFAULT false;
