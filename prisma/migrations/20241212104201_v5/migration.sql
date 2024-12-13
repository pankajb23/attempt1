/*
  Warnings:

  - A unique constraint covering the columns `[storeId,offerName]` on the table `Offer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Offer_storeId_offerName_key" ON "Offer"("storeId", "offerName");
