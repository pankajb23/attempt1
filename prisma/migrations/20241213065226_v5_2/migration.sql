-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Offer" (
    "offerId" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "offerName" TEXT NOT NULL,
    "offerType" TEXT NOT NULL,
    "offerContent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Offer_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("offerContent", "offerId", "offerName", "offerType", "storeId") SELECT "offerContent", "offerId", "offerName", "offerType", "storeId" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
CREATE UNIQUE INDEX "Offer_storeId_offerName_key" ON "Offer"("storeId", "offerName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
