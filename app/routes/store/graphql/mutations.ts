import { gql } from '@apollo/client';

export const CREATE_DISCOUNT_CODE_FOR_FREE_SHIPPING = `#graphql
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
    }`;

export const CREATE_DISCOUNTCODE_FOR_BX_GY_OFFER = `#graphql
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
  }}`;

export const CREATE_BASIC_DISCOUNT_CODE = `#graphql
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
  }`;

export const CART_LINES_ADD = `#graphql
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
}`;

export const CART_LINES_UPDATE = `#graphql
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
}`;

export const CART_DISCOUNT_CODES_UPDATE = `#graphql
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
}`;

export const VARIANT_PRICES = `#graphql
                query GetVariantPrices($pid: ID!){
                  product(id: $pid) {
                    id
                    variants(first: 20) {
                      nodes {
                        id
                        price {
                          amount
                        }
                      }
                    }
                  }
                }`;
