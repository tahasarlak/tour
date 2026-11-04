-- Make user-entered product fields optional without deleting existing data.
-- Internal identifiers (id/slug), publication flags (with defaults), and timestamps remain required.

ALTER TABLE "tours"
  ALTER COLUMN "name" DROP NOT NULL,
  ALTER COLUMN "price" DROP NOT NULL,
  ALTER COLUMN "currency" DROP NOT NULL,
  ALTER COLUMN "discountPercentage" DROP NOT NULL,
  ALTER COLUMN "destination" DROP NOT NULL;

ALTER TABLE "train_tickets"
  ALTER COLUMN "name" DROP NOT NULL,
  ALTER COLUMN "price" DROP NOT NULL,
  ALTER COLUMN "currency" DROP NOT NULL,
  ALTER COLUMN "discountPercentage" DROP NOT NULL,
  ALTER COLUMN "origin" DROP NOT NULL,
  ALTER COLUMN "destination" DROP NOT NULL,
  ALTER COLUMN "departureDate" DROP NOT NULL;

ALTER TABLE "flight_tickets"
  ALTER COLUMN "name" DROP NOT NULL,
  ALTER COLUMN "price" DROP NOT NULL,
  ALTER COLUMN "currency" DROP NOT NULL,
  ALTER COLUMN "discountPercentage" DROP NOT NULL,
  ALTER COLUMN "origin" DROP NOT NULL,
  ALTER COLUMN "destination" DROP NOT NULL,
  ALTER COLUMN "departureDate" DROP NOT NULL,
  ALTER COLUMN "stops" DROP NOT NULL,
  ALTER COLUMN "refundable" DROP NOT NULL,
  ALTER COLUMN "refundable" DROP DEFAULT;

ALTER TABLE "bus_tickets"
  ALTER COLUMN "name" DROP NOT NULL,
  ALTER COLUMN "price" DROP NOT NULL,
  ALTER COLUMN "currency" DROP NOT NULL,
  ALTER COLUMN "discountPercentage" DROP NOT NULL,
  ALTER COLUMN "origin" DROP NOT NULL,
  ALTER COLUMN "destination" DROP NOT NULL,
  ALTER COLUMN "departureDate" DROP NOT NULL;

ALTER TABLE "accommodations"
  ALTER COLUMN "name" DROP NOT NULL,
  ALTER COLUMN "price" DROP NOT NULL,
  ALTER COLUMN "currency" DROP NOT NULL,
  ALTER COLUMN "discountPercentage" DROP NOT NULL,
  ALTER COLUMN "city" DROP NOT NULL;

ALTER TABLE "tourist_visas"
  ALTER COLUMN "name" DROP NOT NULL,
  ALTER COLUMN "price" DROP NOT NULL,
  ALTER COLUMN "currency" DROP NOT NULL,
  ALTER COLUMN "discountPercentage" DROP NOT NULL,
  ALTER COLUMN "country" DROP NOT NULL,
  ALTER COLUMN "urgentProcessing" DROP NOT NULL,
  ALTER COLUMN "urgentProcessing" DROP DEFAULT,
  ALTER COLUMN "interviewRequired" DROP NOT NULL,
  ALTER COLUMN "interviewRequired" DROP DEFAULT,
  ALTER COLUMN "biometricsRequired" DROP NOT NULL,
  ALTER COLUMN "biometricsRequired" DROP DEFAULT;
