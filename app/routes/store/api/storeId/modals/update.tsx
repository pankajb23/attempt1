import { ActionFunction, json } from "@remix-run/node";
import { prismaClient } from "app/shopify.server";

export const action: ActionFunction = async ({ params, request }) => {
    const body = await request.json(); // Parse the body from the incoming request

    const {storeId, ...updatedData} = body;
    await prismaClient.helpModals.update({
        where: { storeId: storeId },
        data: { ...updatedData }
    });
    // Simulate updating modals for the store
    const result = { success: true, message: "Modals updated successfully!" };

    return json(result, { status: 200 });
}