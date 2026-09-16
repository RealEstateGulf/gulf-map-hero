/*
  Warnings:

  - You are about to drop the column `avgRentalYield` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "avgRentalYield",
ADD COLUMN     "avgMonthlyRent" DOUBLE PRECISION;
