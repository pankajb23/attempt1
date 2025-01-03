import { type ActionFunction, json } from "@remix-run/node";
import { unauthenticated, authenticate } from "app/shopify.server";
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
    const toAdd = await ADD(storefront, cartId, cartDetails, payload.products);
    const toUpdate = await  UPDATE(storefront, cartId, cartDetails, payload.products);


    return json({ status: 200, data: { message: "Order created successfully!" } });
}