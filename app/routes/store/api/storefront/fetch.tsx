import type { LoaderFunctionArgs } from "@remix-run/node";
import { prismaClient, authenticate, unauthenticated } from "app/shopify.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // console.log("Adming", admin);

    console.log("Request", JSON.stringify(request));
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    console.log("Query params:", queryParams);

    const shop = url.searchParams.get('shop');
    const { storefront } = await unauthenticated.storefront(
        shop
      );
    
    const response = await storefront.graphql(
        `
            #graphql
            query getShop{
                shop{
                    id
                    name
                    description
                }
            }
        `
    );  
    const data = await response.json();
    console.log("response", data);
    console.log("Logged in using shopId", shop);
    return json({ status: 200, data: { message: "Offers fetched successfully!" } });
}