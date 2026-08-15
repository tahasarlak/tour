/*
  Warnings:

  - The `discountedPrice` column on the `tours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tours` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `price` on the `tours` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('TOUR', 'TRAIN', 'FLIGHT', 'ACCOMMODATION', 'VISA');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('TOUR', 'TRAIN', 'FLIGHT', 'ACCOMMODATION', 'VISA');

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "price",
ADD COLUMN     "price" DECIMAL(12,2) NOT NULL,
DROP COLUMN "discountedPrice",
ADD COLUMN     "discountedPrice" DECIMAL(12,2);

-- CreateTable
CREATE TABLE "train_tickets" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT '₽',
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
    "originStation" TEXT,
    "destinationStation" TEXT,
    "originCode" TEXT,
    "destinationCode" TEXT,
    "trainCompany" TEXT,
    "trainName" TEXT,
    "trainNumber" TEXT,
    "trainType" TEXT,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3),
    "departureTime" TEXT,
    "arrivalTime" TEXT,
    "duration" TEXT,
    "carriageType" TEXT,
    "seatType" TEXT,
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

    CONSTRAINT "train_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_tickets" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT '₽',
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
    "originAirport" TEXT,
    "destinationAirport" TEXT,
    "originAirportCode" TEXT,
    "destinationAirportCode" TEXT,
    "airline" TEXT,
    "airlineCode" TEXT,
    "flightNumber" TEXT,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3),
    "departureTime" TEXT,
    "arrivalTime" TEXT,
    "duration" TEXT,
    "cabinClass" TEXT,
    "baggage" TEXT,
    "handBaggage" TEXT,
    "stops" INTEGER NOT NULL DEFAULT 0,
    "refundable" BOOLEAN NOT NULL DEFAULT false,
    "refundPolicy" TEXT,
    "cancellationPolicy" TEXT,
    "facilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "capacity" INTEGER,
    "remainingCapacity" INTEGER,
    "isSpecial" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flight_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodations" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT '₽',
    "discountedPrice" DECIMAL(12,2),
    "discountPercentage" INTEGER NOT NULL DEFAULT 0,
    "shortDescription" TEXT,
    "description" TEXT,
    "country" TEXT,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "mapUrl" TEXT,
    "image" TEXT,
    "thumbImage" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "accommodationType" TEXT,
    "starRating" INTEGER,
    "roomType" TEXT,
    "capacity" INTEGER,
    "remainingCapacity" INTEGER,
    "rooms" INTEGER,
    "checkInTime" TEXT,
    "checkOutTime" TEXT,
    "minimumNights" INTEGER,
    "mealPlan" TEXT,
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cancellationPolicy" TEXT,
    "houseRules" TEXT,
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isSpecial" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tourist_visas" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT '₽',
    "discountedPrice" DECIMAL(12,2),
    "discountPercentage" INTEGER NOT NULL DEFAULT 0,
    "shortDescription" TEXT,
    "description" TEXT,
    "image" TEXT,
    "thumbImage" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "country" TEXT NOT NULL,
    "countryCode" TEXT,
    "destination" TEXT,
    "visaType" TEXT,
    "entryType" TEXT,
    "validityPeriod" TEXT,
    "stayDuration" TEXT,
    "processingTime" TEXT,
    "urgentProcessing" BOOLEAN NOT NULL DEFAULT false,
    "urgentProcessingTime" TEXT,
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requiredDocuments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "additionalDocuments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "included" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "excluded" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interviewRequired" BOOLEAN NOT NULL DEFAULT false,
    "biometricsRequired" BOOLEAN NOT NULL DEFAULT false,
    "cancellationPolicy" TEXT,
    "notes" TEXT,
    "isSpecial" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tourist_visas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "bookingNumber" TEXT NOT NULL,
    "type" "BookingType" NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "nationality" TEXT,
    "passportNumber" TEXT,
    "passportExpiry" TIMESTAMP(3),
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "totalPrice" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT '₽',
    "tourId" INTEGER,
    "trainTicketId" INTEGER,
    "flightTicketId" INTEGER,
    "accommodationId" INTEGER,
    "touristVisaId" INTEGER,
    "customerNote" TEXT,
    "adminNote" TEXT,
    "passengerData" JSONB,
    "paymentId" TEXT,
    "paymentReference" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "train_tickets_slug_key" ON "train_tickets"("slug");

-- CreateIndex
CREATE INDEX "train_tickets_isPublished_idx" ON "train_tickets"("isPublished");

-- CreateIndex
CREATE INDEX "train_tickets_origin_idx" ON "train_tickets"("origin");

-- CreateIndex
CREATE INDEX "train_tickets_destination_idx" ON "train_tickets"("destination");

-- CreateIndex
CREATE INDEX "train_tickets_departureDate_idx" ON "train_tickets"("departureDate");

-- CreateIndex
CREATE INDEX "train_tickets_trainCompany_idx" ON "train_tickets"("trainCompany");

-- CreateIndex
CREATE UNIQUE INDEX "flight_tickets_slug_key" ON "flight_tickets"("slug");

-- CreateIndex
CREATE INDEX "flight_tickets_isPublished_idx" ON "flight_tickets"("isPublished");

-- CreateIndex
CREATE INDEX "flight_tickets_origin_idx" ON "flight_tickets"("origin");

-- CreateIndex
CREATE INDEX "flight_tickets_destination_idx" ON "flight_tickets"("destination");

-- CreateIndex
CREATE INDEX "flight_tickets_departureDate_idx" ON "flight_tickets"("departureDate");

-- CreateIndex
CREATE INDEX "flight_tickets_airline_idx" ON "flight_tickets"("airline");

-- CreateIndex
CREATE UNIQUE INDEX "accommodations_slug_key" ON "accommodations"("slug");

-- CreateIndex
CREATE INDEX "accommodations_isPublished_idx" ON "accommodations"("isPublished");

-- CreateIndex
CREATE INDEX "accommodations_country_idx" ON "accommodations"("country");

-- CreateIndex
CREATE INDEX "accommodations_city_idx" ON "accommodations"("city");

-- CreateIndex
CREATE INDEX "accommodations_starRating_idx" ON "accommodations"("starRating");

-- CreateIndex
CREATE UNIQUE INDEX "tourist_visas_slug_key" ON "tourist_visas"("slug");

-- CreateIndex
CREATE INDEX "tourist_visas_isPublished_idx" ON "tourist_visas"("isPublished");

-- CreateIndex
CREATE INDEX "tourist_visas_country_idx" ON "tourist_visas"("country");

-- CreateIndex
CREATE INDEX "tourist_visas_countryCode_idx" ON "tourist_visas"("countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingNumber_key" ON "bookings"("bookingNumber");

-- CreateIndex
CREATE INDEX "bookings_type_idx" ON "bookings"("type");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_paymentStatus_idx" ON "bookings"("paymentStatus");

-- CreateIndex
CREATE INDEX "bookings_phone_idx" ON "bookings"("phone");

-- CreateIndex
CREATE INDEX "bookings_email_idx" ON "bookings"("email");

-- CreateIndex
CREATE INDEX "bookings_createdAt_idx" ON "bookings"("createdAt");

-- CreateIndex
CREATE INDEX "tours_departureDate_idx" ON "tours"("departureDate");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_trainTicketId_fkey" FOREIGN KEY ("trainTicketId") REFERENCES "train_tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_flightTicketId_fkey" FOREIGN KEY ("flightTicketId") REFERENCES "flight_tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_touristVisaId_fkey" FOREIGN KEY ("touristVisaId") REFERENCES "tourist_visas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
