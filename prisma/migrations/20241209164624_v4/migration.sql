/*
  Warnings:

  - You are about to drop the column `mainPageModalClose` on the `HelpModals` table. All the data in the column will be lost.
  - You are about to drop the column `offerPageModalClose` on the `HelpModals` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HelpModals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "mainPageModalState" BOOLEAN NOT NULL DEFAULT true,
    "offerPageModalState" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "HelpModals_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HelpModals" ("id", "storeId") SELECT "id", "storeId" FROM "HelpModals";
DROP TABLE "HelpModals";
ALTER TABLE "new_HelpModals" RENAME TO "HelpModals";
CREATE UNIQUE INDEX "HelpModals_storeId_key" ON "HelpModals"("storeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
