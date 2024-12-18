-- AlterTable
ALTER TABLE "Widget" ADD COLUMN "handle" TEXT;

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
    "isUninstalled" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Store" ("contactEmail", "createdAt", "id", "name", "shopId") SELECT "contactEmail", "createdAt", "id", "name", "shopId" FROM "Store";
DROP TABLE "Store";
ALTER TABLE "new_Store" RENAME TO "Store";
CREATE UNIQUE INDEX "Store_shopId_key" ON "Store"("shopId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
