import { type ActionFunction, json } from "@remix-run/node";
import { unauthenticated, authenticate, prismaClient } from "app/shopify.server";
import cookie from "cookie";


const ADD = async (storefront, cartId, cartDetails, payloadProducts) => {
    let products = [];
    payloadProducts.map((product) => {
        let productDetails = cartDetails.filter((cartProduct) => cartProduct.merchandise.id === product.id);
        // couldnot find in the cartDetails.
        if (productDetails.length === 0 && product.isChecked) {
            console.log("product", product);
            products.push({
                // pid: product.productId,
                merchandiseId: product.variantId,
                quantity: 1
            });
        }
    });

    const toAddGraphQl = await storefront.graphql(
        `#graphql
            mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
        checkoutUrl
                    id
                    totalQuantity   
                    createdAt
                    lines(first:250){
                        nodes{
                            id
                            quantity
                            merchandise{
                               ... on ProductVariant{
                                id
                                
                                price{
                                    amount
                                    currencyCode
                                }
                                title
                                product{
                                id
                                title
                                handle
                               }   
                               selectedOptions{
                                 name
                                 value
                               }
                            }  
                            }
                        }
                    }
    }
    userErrors {
      field
      message
    }
  }
}`,
        {
            variables: {
                cartId,
                lines: products
            }
        }
    )
    const toAddGraphQlResponse = await toAddGraphQl.json();
    console.log("toAddGraphQlResponse", JSON.stringify(toAddGraphQlResponse));

    return toAddGraphQlResponse;
}

const UPDATE = async (storefront, cartId, cartDetails, payloadProducts) => {
    let products = [];
    payloadProducts.map((product) => {
        let productDetails = cartDetails.filter((cartProduct) => cartProduct.merchandise.id === product.id);
        // couldnot find in the cartDetails.
        if (productDetails.length > 0) {
            products.push({
                pid: product.id,
                merchandiseId: productDetails[0].merchandise.id,
                quantity: product.quantity
            });
        }
    });

    const toUpdateGraphQl = await storefront.graphql(
        `#graphql
        mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
            checkoutUrl
                        id
                        totalQuantity   
                        createdAt
                        lines(first:250){
                            nodes{
                                id
                                quantity
                                merchandise{
                                 ... on ProductVariant{
                                    id       
                                    price{
                                        amount
                                        currencyCode
                                    }
                                    title
                                    product{
                                    id
                                    title
                                    handle
                                 }   
                                 selectedOptions{
                                     name
                                     value
                                 }
                                }  
                                }
                            }
                        }
        }
        userErrors {
        field
        message
        }
    }
}`,
        {
            variables: {
                cartId,
                lines: products
            }
        }
    );

    const toUpdateGraphQlResponse = await toUpdateGraphQl.json();
    console.log("toUpdateGraphQlResponse", JSON.stringify(toUpdateGraphQlResponse));

    return toUpdateGraphQlResponse;
}

const CREATE_DISCOUNT = async (shop, offerId) => {
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

const ADD_OFFER = async (shop, offerId, cartId, discountCodes) => {
    const { admin } = await unauthenticated.admin(shop);
    const { storefront } = await unauthenticated.storefront(shop);
    const minutesLater = new Date(Date.now() + 10 * 60 * 1000); // Current time + 10 minutes

    const discounts = await prisma.discounts.findMany({
        where: {
            offerId: offerId,
            endDate: {
                gt: minutesLater
            },
        },
    });

    let code = null;
    if (discounts.length === 0) {
        code = await CREATE_DISCOUNT(shop, offerId);
    } else {
        console.log("discounts", JSON.stringify(discounts));
        code = discounts[0].discountCode;
    }
    console.log("code", code);
    const discountCodeUpdates = await storefront.graphql(
        `#graphql
        mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
  cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
    cart {
      id
      discountCodes{
        applicable
        code
      }
    }
    userErrors {
      field
      message
    }
  }
}`,
        {
            variables: {
                cartId,
                discountCodes: discountCodes?.length ? [...discountCodes, code] : [code]
            }
        }
    );

    const discountCodeUpdatesResponse = await discountCodeUpdates.json();
    console.log("discountCodeUpdatesResponse", JSON.stringify(discountCodeUpdatesResponse));
    return discountCodeUpdatesResponse;
}

export const action: ActionFunction = async ({ params, request }) => {
    console.log("Reached here in order-create");
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    console.log("Query params:", queryParams);
    const payload = await request.json();
    const shop = url.searchParams.get('shop');

    const { storefront } = await unauthenticated.storefront(shop);
    console.log("payload", payload);
    const cartId = `gid://shopify/Cart/${payload.cartToken}`;

    const response = await storefront.graphql(
        `#graphql
            query {
                cart(id: "${cartId}") {
                    checkoutUrl
                    id
                    totalQuantity   
                    createdAt
                    discountCodes{
                        applicable
                        code
                    }
                    lines(first:250){
                        nodes{
                            id
                            quantity
                            merchandise{
                               ... on ProductVariant{
                                id
                                price{
                                    amount
                                    currencyCode
                                }
                                title
                                product{
                                id
                                title
                                handle
                               }   
                               selectedOptions{
                                 name
                                 value
                               }
                            }  
                            }
                        }
                    }
                }   
            }
        `
    );

    const data = await response.json();
    const cartDetails = data.data.cart.lines.nodes;
    console.log("data", JSON.stringify(cartDetails));
    const offerId = payload.offerId;

    const toAdd = await ADD(storefront, cartId, cartDetails, payload.products);
    const toUpdate = await UPDATE(storefront, cartId, cartDetails, payload.products);

    const discountCodes = data.data.cart.discountCodes.code;
    console.log("discountCodes", discountCodes);
    await ADD_OFFER(shop, offerId, cartId, discountCodes);
    return json({ status: 200, data: { message: "Order created successfully!", redirectUrl: `https://${shop}/cart` } });
}