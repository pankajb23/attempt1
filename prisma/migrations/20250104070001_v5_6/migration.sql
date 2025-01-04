-- CreateTable
CREATE TABLE "Discounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offerId" TEXT NOT NULL,
    "discountCode" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    CONSTRAINT "Discounts_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer" ("offerId") ON DELETE RESTRICT ON UPDATE CASCADE
);
