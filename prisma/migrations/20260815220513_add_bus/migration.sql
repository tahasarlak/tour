-- AlterEnum
ALTER TYPE "BookingType" ADD VALUE 'BUS';

-- AlterEnum
ALTER TYPE "ProductType" ADD VALUE 'BUS';

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "busTicketId" INTEGER;

-- CreateTable
CREATE TABLE "bus_tickets" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'تومان',
    "discountedPrice" DECIMAL(12,2),
    "discountPercentage" INTEGER NOT NULL DEFAULT 0,
    "shortDescription" TEXT,
    "description" TEXT,
    "image" TEXT,
    "thumbImage" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "originCity" TEXT,
    "destinationCity" TEXT,
    "originTerminal" TEXT,
    "destinationTerminal" TEXT,
    "originCode" TEXT,
    "destinationCode" TEXT,
    "busCompany" TEXT,
    "busName" TEXT,
    "busNumber" TEXT,
    "busType" TEXT,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3),
    "departureTime" TEXT,
    "arrivalTime" TEXT,
    "duration" TEXT,
    "seatType" TEXT,
    "seatClass" TEXT,
    "capacity" INTEGER,
    "remainingCapacity" INTEGER,
    "baggage" TEXT,
    "refundPolicy" TEXT,
    "cancellationPolicy" TEXT,
    "facilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isSpecial" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bus_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bus_tickets_slug_key" ON "bus_tickets"("slug");

-- CreateIndex
CREATE INDEX "bus_tickets_isPublished_idx" ON "bus_tickets"("isPublished");

-- CreateIndex
CREATE INDEX "bus_tickets_origin_idx" ON "bus_tickets"("origin");

-- CreateIndex
CREATE INDEX "bus_tickets_destination_idx" ON "bus_tickets"("destination");

-- CreateIndex
CREATE INDEX "bus_tickets_departureDate_idx" ON "bus_tickets"("departureDate");

-- CreateIndex
CREATE INDEX "bus_tickets_busCompany_idx" ON "bus_tickets"("busCompany");

-- CreateIndex
CREATE INDEX "bookings_busTicketId_idx" ON "bookings"("busTicketId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_busTicketId_fkey" FOREIGN KEY ("busTicketId") REFERENCES "bus_tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
