import { type ActionFunction, json } from "@remix-run/node";
import { prismaClient } from "app/shopify.server";

export const action: ActionFunction = async ({ params, request }) => {
    const body = await request.json(); // Parse the body from the incoming request

    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    console.log("Query params:", queryParams);

    const status = url.searchParams.get('status');    
    
    await prismaClient.offer.updateMany({
        where: {
            offerId : {
                in: body
            }
        },
        data: {
            status: status
        }
    });
    return json({ status: 200, data: { message: "Offer toggled successfully!" } });
}