import { type ActionFunction, json } from "@remix-run/node";
import { prismaClient } from "app/shopify.server";

export const action: ActionFunction = async ({ params, request }) => {
    const body = await request.json(); // Parse the body from the incoming request

    await prismaClient.offer.deleteMany({
        where: {
            offerId : {
                in: body
            }
        }
    });
    return json({ status: 200, data: { message: "Offer deleted successfully!" } });
}