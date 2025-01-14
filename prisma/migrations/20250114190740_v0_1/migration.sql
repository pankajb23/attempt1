-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "isMetaObjectsInitialized" BOOLEAN NOT NULL DEFAULT false,
    "isUninstalled" BOOLEAN NOT NULL DEFAULT false,
    "currencyFormatId" INTEGER NOT NULL,
    "sample" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpModals" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "mainPageModalState" BOOLEAN NOT NULL DEFAULT true,
    "offerPageModalState" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HelpModals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "offerId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "offerName" TEXT NOT NULL,
    "offerType" TEXT NOT NULL,
    "offerContent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("offerId")
);

-- CreateTable
CREATE TABLE "Discounts" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "discountCode" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" SERIAL NOT NULL,
    "storeId" TEXT NOT NULL,
    "handle" TEXT,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrencyFormat" (
    "id" SERIAL NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,
    "currencyFormat" TEXT NOT NULL,

    CONSTRAINT "CurrencyFormat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_shopId_key" ON "Store"("shopId");

-- CreateIndex
CREATE UNIQUE INDEX "HelpModals_storeId_key" ON "HelpModals"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_storeId_offerName_key" ON "Offer"("storeId", "offerName");

-- CreateIndex
CREATE UNIQUE INDEX "Widget_storeId_type_key" ON "Widget"("storeId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyFormat_currencyCode_key" ON "CurrencyFormat"("currencyCode");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_currencyFormatId_fkey" FOREIGN KEY ("currencyFormatId") REFERENCES "CurrencyFormat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpModals" ADD CONSTRAINT "HelpModals_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discounts" ADD CONSTRAINT "Discounts_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("offerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
