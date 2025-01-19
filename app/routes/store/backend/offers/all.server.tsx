import type { LoaderFunctionArgs } from '@remix-run/node';
import { prismaClient, authenticate } from 'app/shopify.server';
import { json } from '@remix-run/node';
import { TagsData } from '../../rest/api/tags';
import {
  GlobalShopToCurrencyCodes,
  GlobalCurrencyCodes,
} from 'app/components/common/states';
import getSymbolFromCurrency from 'currency-symbol-map';
import {
  FETCH_PRODUCTS_FOR_OFFER,
  SHOP_DETAILS,
} from 'app/routes/store/graphql/queries';

async function FetchProductListForDisplay(admin) {
  const response = await admin.graphql(FETCH_PRODUCTS_FOR_OFFER);

  const responseJson = await response.json();
  console.log('response', JSON.stringify(responseJson.data.products));

  return responseJson.data.products;
}

export const loader = async (request) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(SHOP_DETAILS);

  const data = await response.json();
  const shopId = data.data.shop.id;
  const currencyCode = data.data.shop.currencyCode;
  console.log('ShopId - currencyCode', shopId, currencyCode);

  const currencyFormatsResponse = await prismaClient.currencyFormat.findUnique({
    where: {
      currencyCode: currencyCode,
    },
    select: {
      id: true,
      currencyFormat: true,
    },
  });

  let currencyFormatId = currencyFormatsResponse?.id;
  let currencyFormat = currencyFormatsResponse?.currencyFormat;

  if (GlobalShopToCurrencyCodes[shopId] !== currencyCode) {
    GlobalShopToCurrencyCodes[shopId] = currencyCode;
    GlobalCurrencyCodes[currencyCode] = getSymbolFromCurrency(currencyCode);

    if (currencyFormatId === null || currencyFormatId === undefined) {
      // only upsert if it's not present.
      const k = await prismaClient.currencyFormat.create({
        data: {
          currencyCode: currencyCode,
          currencySymbol: GlobalCurrencyCodes[currencyCode],
          currencyFormat: data.data.shop.currencyFormats.moneyFormat,
        },
        select: {
          id: true,
        },
      });
      currencyFormatId = k.id;
      currencyFormat = data.data.shop.currencyFormats.moneyFormat;
    }
  }

  const tagsData = await TagsData(admin);

  const storeData = await FetchProductListForDisplay(admin);
  const store = await prismaClient.store.upsert({
    where: { shopId: shopId },
    update: {},
    create: {
      shopId: shopId,
      contactEmail: data.data.shop.contactEmail,
      name: data.data.shop.name,
      createdAt: new Date(data.data.shop.createdAt),
      currencyFormatId: currencyFormatId,
      sample: JSON.stringify(storeData),
    },
  });

  // await setMetaObjects(admin, store);

  const helpModals = await prismaClient.helpModals.upsert({
    where: { storeId: store.id },
    update: {},
    create: {
      storeId: store.id,
    },
  });

  const allOffers = await prismaClient.offer.findMany({
    where: {
      storeId: store.id,
    },
  });

  const customPages = await prismaClient.widget.findMany({
    where: {
      storeId: store.id,
    },
    select: {
      type: true,
      content: true,
    },
  });

  return json({
    success: true,
    data: {
      storeId: store.id,
      helpModal: helpModals,
      tagsData: [...tagsData],
      currencyformats: data.data.currencyCode,
      offers: allOffers,
      customPages: customPages,
      currencySymbol: currencyCode,
      currencyFormat: currencyFormat,
      sampleData: storeData,
    },
  });
};
