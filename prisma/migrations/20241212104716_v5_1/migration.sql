/*
  Warnings:

  - You are about to drop the `OfferContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" ADD COLUMN "offerContent" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OfferContent";
PRAGMA foreign_keys=on;
