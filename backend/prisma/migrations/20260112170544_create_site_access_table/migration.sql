-- CreateTable
CREATE TABLE "SiteAccess" (
    "id" SERIAL NOT NULL,
    "path" VARCHAR(200) NOT NULL,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteAccess_pkey" PRIMARY KEY ("id")
);
