-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" DATETIME,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Offer" (
    "offerId" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "offerName" TEXT NOT NULL,
    "offerType" TEXT NOT NULL,
    CONSTRAINT "Offer_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OfferContent" (
    "offerId" TEXT NOT NULL PRIMARY KEY,
    "offerContent" TEXT,
    CONSTRAINT "OfferContent_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer" ("offerId") ON DELETE RESTRICT ON UPDATE CASCADE
);
