-- CreateTable
CREATE TABLE "Environment" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "cover" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Environment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT,
    "environmentId" INTEGER NOT NULL,

    CONSTRAINT "EnvironmentImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EnvironmentImage" ADD CONSTRAINT "EnvironmentImage_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
