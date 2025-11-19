-- CreateEnum
CREATE TYPE "VisualItemType" AS ENUM ('APLIQUE', 'TECIDO', 'PANTONE', 'LNEÇOL', 'SINTETICO');

-- CreateEnum
CREATE TYPE "ItemColor" AS ENUM ('AMARELO', 'AZUL', 'BEGE', 'BRANCO', 'CINZA', 'LARANJA', 'LILAS', 'MOSTARDA', 'ROSA', 'TIFFANY', 'VERDE', 'VERMELHO');

-- CreateEnum
CREATE TYPE "ItemSize" AS ENUM ('BERÇO', 'JUNIOR', 'SOLTEIRO', 'SOLTEIRÃO', 'VIUVA', 'CASAL', 'QUEEN', 'KING');

-- CreateTable
CREATE TABLE "VisualItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "imageUrl" TEXT,
    "type" "VisualItemType" NOT NULL,
    "color" "ItemColor",
    "size" "ItemSize",
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "sequence" INTEGER,
    "quantity" INTEGER,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VisualItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisualItem_code_key" ON "VisualItem"("code");
