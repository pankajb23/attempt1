import type { LoaderFunctionArgs } from "@remix-run/node";
import { prismaClient, unauthenticated } from "app/shopify.server";
import { json } from "@remix-run/node";

/**
 * storefront request where we get the products related information
 */
const GetProductDetails = async (pids, shop) => {
    const { storefront } = await unauthenticated.storefront(
        shop
    );

    const productsResponse = await Promise.all(pids.map(async (pid) => {
        try {
            const response = await storefront.graphql(
                `#graphql
                query {
                  product(id: "${pid}") {
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
                }`
            );
            const data = await response.json();
            if (response.ok) {
                // console.log("data", JSON.stringify(data), data);
                return data.data;
            } else {
                console.error("GraphQL Error:", data.errors);
                return null; // Return null on API errors
            }
            return response.json();
        } catch (error) {
            // console.log("error ---> ", error.errors.graphQLErrors);
            console.log("error1 ---> ", error.body.errors.graphQLErrors);
        }
    }));
    console.log("ProductsResponse", JSON.stringify(productsResponse));
    return productsResponse;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // console.log("Adming", admin);

    console.log("Request", JSON.stringify(request));
    console.log("Headers  --> ", JSON.stringify(request.headers));
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    console.log("Query params:", queryParams);

    const shop = url.searchParams.get('shop');
    const pid = "gid://shopify/Product/".concat(url.searchParams.get('pid'));

    const { storefront } = await unauthenticated.storefront(
        shop
    );
    const shopQueryPromise = await storefront.graphql(
        `#graphql
         query {
            shop{
                id
                name
            }
         }
        `
    );

    const response = await shopQueryPromise.json();
    const shopId = response.data?.shop?.id;
    // console.log("shopId", shopId);
    const currencyFormat = await prisma.currencyFormat.findFirst({
        where: {
          stores: {
            some: {
              shopId: shopId
            },
          },
        }
      });
    console.log("currencyFormat", currencyFormat.currencyFormat);
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
                shopId: shopId
            }
        }
    });

    const highestValueOffer = storedOffers.filter(offer => offer.status === "active").filter(offer => {
        const offerContent = JSON.parse(offer.offerContent)
        const pids: string[] = offerContent.trigger.products?.map((product) => (product.pid));
        // let fbtProducts;
        if (pids.includes(pid) || offerContent.trigger.type === "all_products") {
            // fbtProducts = GetProductDetails(offerContent.assets.products.map(product => product.pid), shop);
            return true;
        } else {
            return false;
        }
    }).reduce((a, b) => {
        const Priority = (content) => {
            const a = JSON.parse(content);
            const v = a.otherPriorities?.offerPriority
            return v === undefined || v === null ? 0 : Number(v);
        }
        return a == null ? b : b == null ? a : Priority(a.offerContent) > Priority(b.offerContent) ? a : b;
    }, null); // Initialize with `null` in case no offers match

    let variantsList = null;
    let defaultWidgetTitle = null;
    let discountText = null;
    if (highestValueOffer !== null) {
        const offerContent = JSON.parse(highestValueOffer.offerContent);
        const productList = offerContent.offerProducts?.assets?.products.map(product => (product.pid));
        variantsList = await GetProductDetails(productList, shop);
        defaultWidgetTitle = offerContent.otherPriorities?.defaultWidgetTitle;
        discountText = offerContent.discountState?.isEnabled ? offerContent.discountState?.discountText : null;
    }


    return json({
        status: 200, data: {
            message: "Offers fetched successfully!",
            layout: JSON.parse(layout.content),
            variants: variantsList,
            offerId: highestValueOffer?.offerId,
            currencyFormat: currencyFormat.currencyFormat,
            defaultWidgetTitle: defaultWidgetTitle,
            discountText: discountText
        }
    });
}