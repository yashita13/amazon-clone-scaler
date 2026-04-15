-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discountPercentage" INTEGER,
ADD COLUMN     "isLimitedTimeDeal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "oldPrice" DOUBLE PRECISION;
