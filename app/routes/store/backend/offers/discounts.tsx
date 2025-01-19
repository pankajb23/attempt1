import {
  unauthenticated,
  authenticate,
  prismaClient,
} from 'app/shopify.server';
import { useMutation } from '@apollo/client';
import {
  CREATE_BASIC_DISCOUNT_CODE,
  CREATE_DISCOUNTCODE_FOR_BX_GY_OFFER,
  CREATE_DISCOUNT_CODE_FOR_FREE_SHIPPING,
} from 'app/routes/store/graphql/mutations';

export const CREATE_FREE_SHIPPING_DISCOUNT = async (
  shop,
  offerId,
  quantityToBuy,
  minimumSubtotal,
  combinesWith
) => {
  const { admin } = await unauthenticated.admin(shop);

  const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 5 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  };

  const now = new Date();
  const startDate = new Date(now.getTime() + 20 * 1000); // Now + 20 seconds
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // Start + 30 minutes

  console.log('offerID 01', offerId);
  const offerContent = await prismaClient.offer.findFirst({
    where: {
      offerId: offerId,
    },
    select: {
      offerContent: true,
    },
  });
  const discountCode = `DSCNT-${generateCode()}`; // Random code
  console.log('offerContent', JSON.stringify(offerContent));
  let data = null;
  try {
    const response = await admin.graphql(
      CREATE_DISCOUNT_CODE_FOR_FREE_SHIPPING,
      {
        variables: {
          freeShippingCodeDiscount: {
            title: `A Generous Discount with Fres shipping ${discountCode}`, // Updated title
            code: `${discountCode}`, // Random code
            startsAt: startDate.toISOString(), // Start time in ISO format
            endsAt: endDate.toISOString(),
            combinesWith: combinesWith,
            appliesOncePerCustomer: false,
            minimumRequirement: {
              subtotal: {
                greaterThanOrEqualToSubtotal: minimumSubtotal,
              },
              quantity: {
                greaterThanOrEqualToQuantity: quantityToBuy,
              },
            },
            customerSelection: {
              all: true,
            },
            destination: {
              all: true,
            },
          },
        },
      }
    );

    const data = await response.json();
  } catch (e) {
    console.log('error', e);
  }

  // Check and print GraphQL errors if any
  if (data.errors) {
    console.error('GraphQL Errors:', data.errors);
  } else {
    // console.log("GraphQL Response Data:", data);
  }

  // console.log("data", JSON.stringify(data));
  const id = data.data?.discountCodeBasicCreate?.codeDiscountNode?.id;
  const code = discountCode;
  const startsAt =
    data.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount.startsAt;
  const endsAt =
    data.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount.endsAt;

  console.log('offerId', offerId);
  await prismaClient.discounts.create({
    data: {
      offerId: offerId,
      discountCode: code,
      discountId: id,
      startDate: startsAt,
      endDate: endsAt,
    },
  });

  return code;
};
export const CREATE_CHEAPEST_ITEM_FREE_DISCOUNT = async (
  shop,
  offerId,
  productIdsToAdd,
  amountOfProductToGiveAway,
  productIdToGiveAway,
  combinesWith
) => {
  const { admin } = await unauthenticated.admin(shop);

  const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 5 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  };

  const now = new Date();
  const startDate = new Date(now.getTime() + 20 * 1000); // Now + 20 seconds
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // Start + 30 minutes

  console.log('offerID 01', offerId);
  const offerContent = await prismaClient.offer.findFirst({
    where: {
      offerId: offerId,
    },
    select: {
      offerContent: true,
    },
  });
  const discountCode = `DSCNT-${generateCode()}`; // Random code
  console.log('offerContent', JSON.stringify(offerContent));
  let data = null;
  try {
    const graphQlResponse = await admin.graphql(
      CREATE_DISCOUNTCODE_FOR_BX_GY_OFFER,
      {
        variables: {
          bxgyCodeDiscount: {
            title: `A Generous Discount for You! ${discountCode}`, // Updated title
            code: `${discountCode}`, // Random code
            startsAt: startDate.toISOString(), // Start time in ISO format
            endsAt: endDate.toISOString(), // End time in ISO format
            combinesWith: combinesWith,
            customerBuys: {
              items: {
                products: {
                  productsToAdd: productIdsToAdd,
                },
              },
              value: {
                amount: amountOfProductToGiveAway,
                quantity: 1,
              },
            },
            customerGets: {
              items: {
                products: {
                  productsToAdd: productIdToGiveAway,
                  // productsVariantsToAdd: productVariantsToAdd
                },
              },
            },
            customerSelection: {
              all: true,
            },
            appliesOncePerCustomer: true,
          },
        },
      }
    );
    data = await graphQlResponse.json();
  } catch (e) {
    console.log('error', e);
  }

  // Check and print GraphQL errors if any
  if (data.errors) {
    console.error('GraphQL Errors:', data.errors);
  } else {
    // console.log("GraphQL Response Data:", data);
  }

  // console.log("data", JSON.stringify(data));
  const id = data.data?.discountCodeBasicCreate?.codeDiscountNode?.id;
  const code = discountCode;
  const startsAt =
    data.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount.startsAt;
  const endsAt =
    data.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount.endsAt;

  console.log('offerId', offerId);
  await prismaClient.discounts.create({
    data: {
      offerId: offerId,
      discountCode: code,
      discountId: id,
      startDate: startsAt,
      endDate: endsAt,
    },
  });

  return code;
};

export const CREATE_BASIC_DISCOUNT = async (shop, offerId, combinesWith) => {
  const { admin } = await unauthenticated.admin(shop);

  const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 5 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  };

  const now = new Date();
  const startDate = new Date(now.getTime() + 20 * 1000); // Now + 20 seconds
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // Start + 30 minutes

  console.log('offerID 01', offerId);
  const offerContent = await prismaClient.offer.findFirst({
    where: {
      offerId: offerId,
    },
    select: {
      offerContent: true,
    },
  });
  const discountCode = `DSCNT-${generateCode()}`; // Random code
  console.log('offerContent', JSON.stringify(offerContent));
  let data = null;
  try {
    const graphQlResponse = await admin.graphql(CREATE_BASIC_DISCOUNT_CODE, {
      variables: {
        basicCodeDiscount: {
          title: `A Generous Discount for You! ${discountCode}`, // Updated title
          code: `${discountCode}`, // Random code
          startsAt: startDate.toISOString(), // Start time in ISO format
          endsAt: endDate.toISOString(), // End time in ISO format
          combinesWith: combinesWith,
          customerSelection: {
            all: true,
          },
          customerGets: {
            value: {
              percentage: 0.2,
            },
            items: {
              all: true,
            },
          },
          appliesOncePerCustomer: true,
        },
      },
    });
    data = await graphQlResponse.json();
  } catch (e) {
    console.log('error', e);
  }

  // Check and print GraphQL errors if any
  if (data.errors) {
    console.error('GraphQL Errors:', data.errors);
  } else {
    // console.log("GraphQL Response Data:", data);
  }

  // console.log("data", JSON.stringify(data));
  const id = data.data?.discountCodeBasicCreate?.codeDiscountNode?.id;
  const code = discountCode;
  const startsAt =
    data.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount.startsAt;
  const endsAt =
    data.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount.endsAt;

  console.log('offerId', offerId);
  await prismaClient.discounts.create({
    data: {
      offerId: offerId,
      discountCode: code,
      discountId: id,
      startDate: startsAt,
      endDate: endsAt,
    },
  });

  return code;
};

export const CREATE_DISCOUNT_FOR_OFFER = async (
  shop,
  offerId,
  productsInTheCart,
  cheapestItemId,
  aggregatedAmountCart,
  cheapestItemPrice
) => {
  const { admin } = await unauthenticated.admin(shop);
  const { storefront } = await unauthenticated.storefront(shop);
  const minutesLater = new Date(Date.now() + 10 * 60 * 1000); // Current time + 10 minutes

  const offer = await prismaClient.offer.findFirst({
    where: {
      offerId: offerId,
    },
  });

  const offerContent = offer.offerContent
    ? JSON.parse(offer.offerContent)
    : null;
  const discountState = offerContent?.discountState;

  const combinesWith = {
    productDiscounts: discountState?.productDiscounts,
    shippingDiscounts: discountState?.shippingDiscounts,
    orderDiscounts: discountState?.orderDiscounts,
  };

  if (discountState?.isEnabled) {
    if (discountState?.selectedType === 'percentOrFixed') {
      const discountCode = await CREATE_BASIC_DISCOUNT(
        shop,
        offerId,
        combinesWith
      );
      return discountCode;
    } else if (discountState?.selectedType === 'cheapestItemFree') {
      const discountCode = await CREATE_CHEAPEST_ITEM_FREE_DISCOUNT(
        shop,
        offerId,
        productsInTheCart.filter((product) => product.id !== cheapestItemId),
        aggregatedAmountCart - cheapestItemPrice,
        cheapestItemId,
        combinesWith
      );
      return discountCode;
    } else if (discountState?.selectedType === 'freeShipping') {
      const discountCode = await CREATE_FREE_SHIPPING_DISCOUNT(
        shop,
        offerId,
        productsInTheCart.length,
        aggregatedAmountCart,
        combinesWith
      );
      return discountCode;
    }
  }
};
