-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Discounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offerId" TEXT NOT NULL,
    "discountCode" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    CONSTRAINT "Discounts_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer" ("offerId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Discounts" ("discountCode", "discountId", "endDate", "id", "offerId", "startDate") SELECT "discountCode", "discountId", "endDate", "id", "offerId", "startDate" FROM "Discounts";
DROP TABLE "Discounts";
ALTER TABLE "new_Discounts" RENAME TO "Discounts";
CREATE TABLE "new_HelpModals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "mainPageModalState" BOOLEAN NOT NULL DEFAULT true,
    "offerPageModalState" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "HelpModals_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_HelpModals" ("id", "mainPageModalState", "offerPageModalState", "storeId") SELECT "id", "mainPageModalState", "offerPageModalState", "storeId" FROM "HelpModals";
DROP TABLE "HelpModals";
ALTER TABLE "new_HelpModals" RENAME TO "HelpModals";
CREATE UNIQUE INDEX "HelpModals_storeId_key" ON "HelpModals"("storeId");
CREATE TABLE "new_Offer" (
    "offerId" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "offerName" TEXT NOT NULL,
    "offerType" TEXT NOT NULL,
    "offerContent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Offer_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("createdAt", "offerContent", "offerId", "offerName", "offerType", "status", "storeId") SELECT "createdAt", "offerContent", "offerId", "offerName", "offerType", "status", "storeId" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
CREATE UNIQUE INDEX "Offer_storeId_offerName_key" ON "Offer"("storeId", "offerName");
CREATE TABLE "new_Widget" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storeId" TEXT NOT NULL,
    "handle" TEXT,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "Widget_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Widget" ("content", "handle", "id", "storeId", "type") SELECT "content", "handle", "id", "storeId", "type" FROM "Widget";
DROP TABLE "Widget";
ALTER TABLE "new_Widget" RENAME TO "Widget";
CREATE UNIQUE INDEX "Widget_storeId_type_key" ON "Widget"("storeId", "type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;