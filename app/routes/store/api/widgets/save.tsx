import { type ActionFunction, json } from "@remix-run/node";
import { prismaClient } from "app/shopify.server";

export const action: ActionFunction = async ({ params, request }) => {
    const body = await request.json(); // Parse the body from the incoming request

    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    console.log("Query params:", queryParams);

    // In this specific example, you'd access the query param like this:
    const storeId = url.searchParams.get('storeId');
    // console.log("specificQueryParam", specificQueryParam);
    console.log("incoming body ---> ", JSON.stringify(body));
    console.log("offer name ---> ", body.offerName);
    console.log("offer type ---> ", body.offer.type);

    let response;
    try {
        response = await prismaClient.widget.upsert({
            where: {
                storeId_type: {
                    storeId: body.storeId,
                    type: body.type
                }
            },
            update: {
                type: body.type,
                content: body.content
            },
            create: {
                type: body.type,
                storeId: storeId,
                content: body.content
            }
        })
        console.log("offer upsert id ->  ", response);
        return json({ status: 200, data: { message: "Offer widget saved successfully!", response: response } });
    } catch (error) {
        console.error(error);
        return json({ status: 500, message: "Failed to save/update offer widget!", error: error });
    }
}