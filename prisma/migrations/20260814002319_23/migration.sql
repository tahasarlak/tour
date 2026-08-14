-- CreateTable
CREATE TABLE "tours" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT '₽',
    "discountedPrice" TEXT,
    "discountPercentage" INTEGER NOT NULL DEFAULT 0,
    "shortDescription" TEXT,
    "description" TEXT,
    "image" TEXT,
    "thumbImage" TEXT,
    "destination" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "duration" TEXT,
    "departureDate" TIMESTAMP(3),
    "returnDate" TIMESTAMP(3),
    "capacity" INTEGER,
    "remainingCapacity" INTEGER,
    "accommodation" TEXT,
    "transportation" TEXT,
    "meals" TEXT,
    "guide" TEXT,
    "meetingPoint" TEXT,
    "mapUrl" TEXT,
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "included" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "excluded" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "itinerary" JSONB NOT NULL DEFAULT '[]',
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isSpecial" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tours_slug_key" ON "tours"("slug");

-- CreateIndex
CREATE INDEX "tours_isPublished_idx" ON "tours"("isPublished");

-- CreateIndex
CREATE INDEX "tours_destination_idx" ON "tours"("destination");

-- CreateIndex
CREATE INDEX "tours_country_idx" ON "tours"("country");

-- CreateIndex
CREATE INDEX "tours_city_idx" ON "tours"("city");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
