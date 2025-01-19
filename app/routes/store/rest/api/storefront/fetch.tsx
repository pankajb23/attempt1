import type { LoaderFunctionArgs } from '@remix-run/node';
import { prismaClient, unauthenticated } from 'app/shopify.server';
import { json } from '@remix-run/node';
import {
  FETCH_STOREFRONT_PRODUCTS_AND_VARIANTS,
  FETCH_STOREFRONT_CART_DETAILS,
  FETCH_ADMIN_PRODUCT_URL,
  FETCH_STOREFRONT_SHOP_NAME
} from 'app/routes/store/graphql/queries';
/**
 * storefront request where we get the products related information
 */

const GetProductUrl = async (admin, productId) => {
  const response = await admin.graphql(
    FETCH_ADMIN_PRODUCT_URL,
    {
      variables: {
        productId: productId
      }
    }
  );
  const data = await response.json();
  return data.data.product.onlineStorePreviewUrl
    ? data.data.product.onlineStorePreviewUrl
    : data.data.product.onlineStoreUrl;
};

const GetProductDetails = async (pids, productId, shop) => {
  const { storefront } = await unauthenticated.storefront(shop);

  const { admin } = await unauthenticated.admin(shop);

  const updatedPids = [productId, ...pids.filter((pid) => pid !== productId)];

  const productsResponse = await Promise.all(
    updatedPids.map(async (pid) => {
      console.log('pid', pid);
      try {
        const response = await storefront.graphql(
          FETCH_STOREFRONT_PRODUCTS_AND_VARIANTS,
          {
            variables: {
              id: pid
            }
          }
        );
        const data = await response.json();
        if (response.ok) {
          // console.log("data", JSON.stringify(data), data);
          const productData = data.data.product;
          if (productData.onlineStoreUrl == null) {
            const productUrl = await GetProductUrl(admin, pid);
            productData.onlineStoreUrl = productUrl;
            console.log('productData with image', productData);
          }

          return productData;
        } else {
          console.error('GraphQL Error:', data.errors);
          return null; // Return null on API errors
        }
        return response.json();
      } catch (error) {
        // console.log("error ---> ", error.errors.graphQLErrors);
        console.log('error1 ---> ', error.body.errors.graphQLErrors);
      }
    })
  );
  console.log('ProductsResponse', JSON.stringify(productsResponse));
  return productsResponse;
};

const CartLevelDetails = async (cartToken, storefront) => {
  const cartId = `gid://shopify/Cart/${cartToken}`;
  const response = await storefront.graphql(
    FETCH_STOREFRONT_CART_DETAILS,
    {
      variables: {
        cartId: cartId
      }
    }
  );
  const cartData = await response.json();
  console.log('cartData', JSON.stringify(cartData));
  return cartData;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // console.log("Adming", admin);

  console.log('Request', JSON.stringify(request));
  console.log('Headers  --> ', JSON.stringify(request.headers));
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams);
  console.log('Query params:', queryParams);

  const shop = url.searchParams.get('shop');
  const productId = url.searchParams.get('pid');
  const pid = 'gid://shopify/Product/'.concat(productId);
  const cartToken = url.searchParams.get('cartToken');
  const { storefront } = await unauthenticated.storefront(shop);

  const [shopQueryPromise, cartDataJsonResponse] = await Promise.all([
    storefront.graphql(
      FETCH_STOREFRONT_SHOP_NAME
    ),
    CartLevelDetails(cartToken, storefront),
  ]);

  const response = await shopQueryPromise.json();
  console.log('response', response);
  // const cartDataJsonResponse = await CartLevelDetails(cartToken, storefront);
  // const cart = cartDataJsonResponse.data?.cart;
  const shopId = response.data?.shop?.id;
  // console.log("shopId", shopId);
  const currencyFormat = await prismaClient.currencyFormat.findFirst({
    where: {
      stores: {
        some: {
          shopId: shopId,
        },
      },
    },
  });

  console.log('currencyFormat', currencyFormat.currencyFormat);
  const storedOffers = await prismaClient.offer.findMany({
    where: {
      store: {
        shopId: shopId,
      },
    },
  });

  const layout = await prismaClient.widget.findFirst({
    where: {
      store: {
        shopId: shopId,
      },
    },
  });

  const highestValueOffer = storedOffers
    .filter((offer) => offer.status === 'active')
    .filter((offer) => {
      const offerContent = JSON.parse(offer.offerContent);
      console.log('offerContent', offerContent.trigger);
      const pids: string[] = offerContent.trigger.products?.map(
        (product) => product.pid
      );
      console.log('pids', pids);
      // let fbtProducts;
      if (pids?.includes(pid) || offerContent.trigger.type === 'all_products') {
        // fbtProducts = GetProductDetails(offerContent.assets.products.map(product => product.pid), shop);
        return true;
      } else {
        return false;
      }
    })
    .reduce((a, b) => {
      const Priority = (content) => {
        const a = JSON.parse(content);
        const v = a.otherPriorities?.offerPriority;
        return v === undefined || v === null ? 0 : Number(v);
      };
      return a == null
        ? b
        : b == null
          ? a
          : Priority(a.offerContent) > Priority(b.offerContent)
            ? a
            : b;
    }, null); // Initialize with `null` in case no offers match

  let variantsList = null;
  let defaultWidgetTitle = null;
  let discountText = null;
  let discountAmount = null;
  let discountMode = null;
  let discountTitle = null;
  if (highestValueOffer !== null) {
    const offerContent = JSON.parse(highestValueOffer.offerContent);
    const productList = offerContent.offerProducts?.assets?.products.map(
      (product) => product.pid
    );
    variantsList = await GetProductDetails(productList, pid, shop);
    defaultWidgetTitle = offerContent.otherPriorities?.defaultWidgetTitle;
    const discountState = offerContent?.discountState;

    console.log('discountState', discountState, offerContent);

    discountText = discountState?.isEnabled
      ? discountState?.discountText
      : null;
    if (discountState?.isEnabled) {
      if (discountState?.selectedType === 'percentOrFixed') {
        discountAmount = discountState?.discountValue;
        discountMode = discountState?.discountUnit;
        discountTitle = 'percentOrFixed';
      } else if (discountState?.selectedType === 'cheapestItemFree') {
        discountTitle = 'cheapestItemFree';
      }
    }
  }

  return json({
    status: 200,
    data: {
      message: 'Offers fetched successfully!',
      layout: layout?.content ? JSON.parse(layout.content) : null,
      variants: variantsList,
      offerId: highestValueOffer?.offerId,
      currencyFormat: currencyFormat.currencyFormat,
      defaultWidgetTitle: defaultWidgetTitle,
      discountText: discountText,
      discountAmount: discountAmount,
      discountMode: discountMode,
      discountTitle: discountTitle,
    },
  });
};
