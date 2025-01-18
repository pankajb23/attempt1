import { Prisma } from "@prisma/client";
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


const ADD_OFFER = async (shop, offerId, cartId, discountCodes) => {
    const { admin } = await unauthenticated.admin(shop);
    const { storefront } = await unauthenticated.storefront(shop);
    const minutesLater = new Date(Date.now() + 10 * 60 * 1000); // Current time + 10 minutes

    const time06 = new Date().getTime();
    console.log("Time06", time06);
    const discounts = await prisma.discounts.findMany({
        where: {
            offerId: offerId,
            endDate: {
                lte: minutesLater
            },
            offer:{
                lastUpdated: {
                    lte: Prisma.sql`discounts.startDate`
                },
            },
        },
        include:{
            offer: true,
        }
    });

    let code = null;
    if (discounts.length === 0) {
        code = await CREATE_DISCOUNT(shop, offerId);
    } else {
        console.log("discounts", JSON.stringify(discounts));
        code = discounts[0].discountCode;
    }
    const time07 = new Date().getTime();
    console.log("Time07", time07, time07 - time06);
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
    const time08 = new Date().getTime();
    console.log("Time08", time08, time08 - time07);
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

    const time01 = new Date().getTime();
    console.log("Time01", time01);
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
    console.log("data", JSON.stringify(data));
    const time02 = new Date().getTime();
    console.log("Time02", time02, time02 - time01);
    const cartDetails = data.data.cart.lines.nodes;
    console.log("data", JSON.stringify(cartDetails));
    const offerId = payload.offerId;

    const toAddFuture = ADD(storefront, cartId, cartDetails, payload.products);
    const toUpdateFuture = UPDATE(storefront, cartId, cartDetails, payload.products);

    const [toAdd, toUpdate] = await Promise.all([toAddFuture, toUpdateFuture]);

    // const toAdd = await ADD(storefront, cartId, cartDetails, payload.products);
    const time03 = new Date().getTime();
    console.log("Time03", time03, time03 - time02);
    // const toUpdate = await UPDATE(storefront, cartId, cartDetails, payload.products);
    const time04 = new Date().getTime();
    console.log("Time04", time04, time04 - time03);

    const discountCodes = data.data.cart.discountCodes.code;
    console.log("discountCodes", discountCodes);

    // do it async. 
    void ADD_OFFER(shop, offerId, cartId, discountCodes);
    const time05 = new Date().getTime();
    console.log("Time05", time05, time05 - time04);
    return json({ status: 200, data: { message: "Order created successfully!", redirectUrl: `https://${shop}/cart` } });
}