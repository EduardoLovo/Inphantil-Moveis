-- CreateTable
CREATE TABLE "ShippingQuote" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "quoteDetails" TEXT NOT NULL,
    "customerName" VARCHAR(150) NOT NULL,
    "customerCpf" VARCHAR(14) NOT NULL,
    "customerZipCode" VARCHAR(10) NOT NULL,
    "customerAddress" VARCHAR(255) NOT NULL,
    "customerCity" VARCHAR(100) NOT NULL,
    "customerState" VARCHAR(2) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "isConcluded" BOOLEAN NOT NULL DEFAULT false,
    "concludedAt" TIMESTAMP(3),
    "carrierName" VARCHAR(150),
    "volumeQuantity" INTEGER,
    "shippingValue" DECIMAL(10,2),
    "bedSize" "ItemSize",
    "hasWallProtector" BOOLEAN NOT NULL DEFAULT false,
    "wallProtectorSize" "ItemSize",
    "hasRug" BOOLEAN NOT NULL DEFAULT false,
    "rugSize" VARCHAR(100),
    "hasAccessories" BOOLEAN NOT NULL DEFAULT false,
    "accessoryQuantity" INTEGER,

    CONSTRAINT "ShippingQuote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShippingQuote" ADD CONSTRAINT "ShippingQuote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
