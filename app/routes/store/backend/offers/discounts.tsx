import { unauthenticated, authenticate, prismaClient } from "app/shopify.server";

export const CREATE_FREE_SHIPPING_DISCOUNT = async (shop, offerId, quantityToBuy, minimumSubtotal, combinesWith) => {
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

    console.log("offerID 01", offerId);
    const offerContent = await prismaClient.offer.findFirst({
        where: {
            offerId: offerId
        },
        select: {
            offerContent: true
        }
    });
    const discountCode = `DSCNT-${generateCode()}`; // Random code
    console.log("offerContent", JSON.stringify(offerContent));
    let data = null;
    try {
        const response = await admin.graphql(
            `#graphql
  mutation discountCodeFreeShippingCreate($freeShippingCodeDiscount: DiscountCodeFreeShippingInput!) {
    discountCodeFreeShippingCreate(freeShippingCodeDiscount: $freeShippingCodeDiscount) {
      codeDiscountNode {
        id
        codeDiscount {
          ... on DiscountCodeFreeShipping {
            title
            startsAt
            endsAt
            maximumShippingPrice {
              amount
            }
            customerSelection {
              ... on DiscountCustomerAll {
                allCustomers
              }
            }
            destinationSelection {
              ... on DiscountCountryAll {
                allCountries
              }
            }
            minimumRequirement {
              ... on DiscountMinimumSubtotal {
                greaterThanOrEqualToSubtotal {
                  amount
                }
              }
            }
            codes(first: 2) {
              nodes {
                code
              }
            }
          }
        }
      }
      userErrors {
        field
        code
        message
      }
    }
  }`,
            {
                variables: {
                    "freeShippingCodeDiscount": {
                        title: `A Generous Discount with Fres shipping ${discountCode}`, // Updated title
                        code: `${discountCode}`, // Random code
                        startsAt: startDate.toISOString(), // Start time in ISO format
                        endsAt: endDate.toISOString(),
                        combinesWith: combinesWith,
                        "appliesOncePerCustomer": false,
                        "minimumRequirement": {
                            "subtotal": {
                                "greaterThanOrEqualToSubtotal": minimumSubtotal
                            },
                            "quantity": {
                                "greaterThanOrEqualToQuantity": quantityToBuy
                            }
                        },
                        "customerSelection": {
                            "all": true
                        },
                        "destination": {
                            "all": true
                        }
                    }
                },
            },
        );

        const data = await response.json();

    } catch (e) {
        console.log("error", e);
    }

    // Check and print GraphQL errors if any
    if (data.errors) {
        console.error("GraphQL Errors:", data.errors);
    } else {
        // console.log("GraphQL Response Data:", data);
    }

    // console.log("data", JSON.stringify(data));
    const id = data.data?.discountCodeBasicCreate?.codeDiscountNode?.id;
    const code = discountCode;
    const startsAt = data.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount.startsAt;
    const endsAt = data.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount.endsAt;

    console.log("offerId", offerId);
    await prismaClient.discounts.create({
        data: {
            offerId: offerId,
            discountCode: code,
            discountId: id,
            startDate: startsAt,
            endDate: endsAt
        }
    });

    return code;

}
export const CREATE_BUYX_GETY_DISCOUNT = async (shop, offerId, productIdsToAdd, amountOfProductToGiveAway, combinesWith) => {
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

    console.log("offerID 01", offerId);
    const offerContent = await prismaClient.offer.findFirst({
        where: {
            offerId: offerId
        },
        select: {
            offerContent: true
        }
    });
    const discountCode = `DSCNT-${generateCode()}`; // Random code
    console.log("offerContent", JSON.stringify(offerContent));
    let data = null;
    try {
        const graphQlResponse = await admin.graphql(
            `#graphql
  mutation discountCodeBxgyCreate($bxgyCodeDiscount: DiscountCodeBxgyInput!) {
    discountCodeBxgyCreate(bxgyCodeDiscount: $bxgyCodeDiscount) {
      codeDiscountNode {
        id
        codeDiscount {
          ... on DiscountCodeBxgy {
            title
            codes(first: 10) {
              nodes {
                code
              }
            }
            startsAt
            endsAt
            customerBuys{
                items {
                    value {
                        ... on DiscountOnQuantity {
                            quantity 
                    }
                }
            }
            customerGets {
              appliesOnOneTimePurchase
              appliesOnSubscription
              value {
                ... on DiscountOnQuantity {
                  effect {
                    ... on DiscountPercentage {
                      percentage
                    }
                  }
                  quantity {
                    quantity
                  }
                }
              }
            }
            appliesOncePerCustomer
          }
        }
      }
      userErrors {
        field
        code
        message
      }
    }
  }}`,
            {
                variables: {
                    "bxgyCodeDiscount": {
                        title: `A Generous Discount for You! ${discountCode}`, // Updated title
                        code: `${discountCode}`, // Random code
                        startsAt: startDate.toISOString(), // Start time in ISO format
                        endsAt: endDate.toISOString(), // End time in ISO format
                        combinesWith: combinesWith,
                        "customerBuys": {
                            "items": {
                                "products": {
                                    "productsToAdd": productIdsToAdd
                                }
                            },
                            "value": {
                                "amount": amountOfProductToGiveAway,
                                "quantity": 1
                            }
                        },
                        "appliesOncePerCustomer": true
                    }
                }
            }
        );
        data = await graphQlResponse.json();
    } catch (e) {
        console.log("error", e);
    }

    // Check and print GraphQL errors if any
    if (data.errors) {
        console.error("GraphQL Errors:", data.errors);
    } else {
        // console.log("GraphQL Response Data:", data);
    }

    // console.log("data", JSON.stringify(data));
    const id = data.data?.discountCodeBasicCreate?.codeDiscountNode?.id;
    const code = discountCode;
    const startsAt = data.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount.startsAt;
    const endsAt = data.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount.endsAt;

    console.log("offerId", offerId);
    await prismaClient.discounts.create({
        data: {
            offerId: offerId,
            discountCode: code,
            discountId: id,
            startDate: startsAt,
            endDate: endsAt
        }
    });

    return code;
}

export const CREATE_DISCOUNT = async (shop, offerId, combinesWith) => {
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

    console.log("offerID 01", offerId);
    const offerContent = await prismaClient.offer.findFirst({
        where: {
            offerId: offerId
        },
        select: {
            offerContent: true
        }
    });
    const discountCode = `DSCNT-${generateCode()}`; // Random code
    console.log("offerContent", JSON.stringify(offerContent));
    let data = null;
    try {
        const graphQlResponse = await admin.graphql(
            `#graphql
  mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            codes(first: 10) {
              nodes {
                code
              }
            }
            startsAt
            endsAt
            customerSelection {
              ... on DiscountCustomerAll {
                allCustomers
              }
            }
            customerGets {
              value {
                ... on DiscountPercentage {
                  percentage
                }
              }
              items {
                ... on AllDiscountItems {
                  allItems
                }
              }
            }
            appliesOncePerCustomer
          }
        }
      }
      userErrors {
        field
        code
        message
      }
    }
  }`,
            {
                variables: {
                    "basicCodeDiscount": {
                        title: `A Generous Discount for You! ${discountCode}`, // Updated title
                        code: `${discountCode}`, // Random code
                        startsAt: startDate.toISOString(), // Start time in ISO format
                        endsAt: endDate.toISOString(), // End time in ISO format
                        combinesWith: combinesWith,
                        "customerSelection": {
                            "all": true
                        },
                        "customerGets": {
                            "value": {
                                "percentage": 0.2
                            },
                            "items": {
                                "all": true
                            }
                        },
                        "appliesOncePerCustomer": true
                    }
                }
            }
        );
        data = await graphQlResponse.json();
    } catch (e) {
        console.log("error", e);
    }

    // Check and print GraphQL errors if any
    if (data.errors) {
        console.error("GraphQL Errors:", data.errors);
    } else {
        // console.log("GraphQL Response Data:", data);
    }

    // console.log("data", JSON.stringify(data));
    const id = data.data?.discountCodeBasicCreate?.codeDiscountNode?.id;
    const code = discountCode;
    const startsAt = data.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount.startsAt;
    const endsAt = data.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount.endsAt;

    console.log("offerId", offerId);
    await prismaClient.discounts.create({
        data: {
            offerId: offerId,
            discountCode: code,
            discountId: id,
            startDate: startsAt,
            endDate: endsAt
        }
    });

    return code;
}
