export const FETCH_PRODUCTS_FOR_OFFER = `#graphql
    query {
  products(first:8){
    nodes{
      id
      title
      onlineStoreUrl
      onlineStorePreviewUrl
      featuredMedia{
        id
        preview{
          image{
            url
            height
            width
            
          }
        }
      }
      variants(first:6){
        nodes{
          id
          displayName
          price
        }
      }
    }
  }
}`;

export const SHOP_DETAILS = `#graphql
        query Show{
            shop {
                id
                name
                contactEmail
                createdAt
                plan{
                    displayName
                    partnerDevelopment
                    shopifyPlus
                }
                setupRequired
                currencyFormats{
                    moneyFormat 
                }
                currencyCode
            }
        }`;

export const FETCH_STOREFRONT_PRODUCTS_AND_VARIANTS = `#graphql
                query GetProduct($id: ID!) {
  product(id: $id) {
    id
    title
    onlineStoreUrl
    featuredImage {
      url
      width
      height
    }
    isGiftCard
    variants(first: 20) {
      nodes {
        id
        title
        price {
          amount
        }
      }
    }
  }
}`;

export const FETCH_STOREFRONT_CART_DETAILS = `#graphql
        query GetCartDetails($cartId: ID!){
            cart(id: $cartId) {
                id
                discountAllocations{
                    targetType
                    discountedAmount{
                        amount
                        currencyCode
                    }
                }
                lines(first:250){
                        nodes{
                            id
                            quantity
                            discountAllocations{
                                targetType
                                discountedAmount{
                                    amount
                                    currencyCode
                                }
                                
                            }   
                            }
                        }
                    }
            }`;

export const FETCH_ADMIN_PRODUCT_URL = `#graphql
        query GetProductUrl($productId: ID!){
            product(id: $productId) {
                onlineStoreUrl
                onlineStorePreviewUrl
            }
        }`;

export const FETCH_STOREFRONT_SHOP_NAME = `#graphql
        query GetShopName{
            shop {
                name
                id
            }
        }`;

export const CART_DETAILS = `#graphql
            query GetCartDetails($cartId: ID!){
                cart(id: $cartId) {
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
        `;
