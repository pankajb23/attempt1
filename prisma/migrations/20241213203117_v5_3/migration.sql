-- CreateTable
CREATE TABLE "Widget" (
    "storeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Widget_storeId_type_key" ON "Widget"("storeId", "type");
