import { type ActionFunction, json } from "@remix-run/node";
import { prismaClient } from "app/shopify.server";

export const action: ActionFunction = async ({ params, request }) => {
    const body = await request.json(); // Parse the body from the incoming request

    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    console.log("Query params:", queryParams);

    // In this specific example, you'd access the query param like this:
    const storeId = url.searchParams.get('storeId');
    const offerId = url.searchParams.get('offerId');
    // console.log("specificQueryParam", specificQueryParam);
    console.log("incoming body ---> ", JSON.stringify(body));
    console.log("offer name ---> ", body.offerName);
    console.log("offer type ---> ", body.offer.type);
    console.log("offerId ---> ", offerId);

    let response;
    try {
        if (offerId !== undefined && offerId !== null) {
            response = await prismaClient.offer.update({
                where: {
                    offerId: offerId
                },
                data: {
                    offerName: body.offerName,
                    offerContent: JSON.stringify(body)
                },
                select: {
                    offerId: true
                }
            });
        } else {
            response = await prismaClient.offer.create({
                data: {
                    offerName: body.offerName,
                    offerType: body.offer.type,
                    storeId: storeId,
                    offerContent: JSON.stringify(body)
                }
            });
        }
       
        console.log("offer upsert id ->  ", response);
        return json({ status: 200, data: { message: "Offer saved successfully!", response: response } });
    } catch (error) {
        console.error(error);
        return json({ status: 500, message: "Failed to save/update offer!", error: error });
    }
}