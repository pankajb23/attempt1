-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "isMetaObjectsInitialized" BOOLEAN NOT NULL DEFAULT false,
    "isUninstalled" BOOLEAN NOT NULL DEFAULT false,
    "currencyFormatId" INTEGER NOT NULL,
    "sample" TEXT NOT NULL,
    CONSTRAINT "Store_currencyFormatId_fkey" FOREIGN KEY ("currencyFormatId") REFERENCES "CurrencyFormat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Store" ("contactEmail", "createdAt", "currencyFormatId", "id", "isMetaObjectsInitialized", "isUninstalled", "name", "sample", "shopId") SELECT "contactEmail", "createdAt", "currencyFormatId", "id", "isMetaObjectsInitialized", "isUninstalled", "name", "sample", "shopId" FROM "Store";
DROP TABLE "Store";
ALTER TABLE "new_Store" RENAME TO "Store";
CREATE UNIQUE INDEX "Store_shopId_key" ON "Store"("shopId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
