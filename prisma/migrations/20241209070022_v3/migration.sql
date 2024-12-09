-- CreateTable
CREATE TABLE "HelpModals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "mainPageModalClose" BOOLEAN NOT NULL DEFAULT false,
    "offerPageModalClose" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "HelpModals_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "HelpModals_storeId_key" ON "HelpModals"("storeId");
