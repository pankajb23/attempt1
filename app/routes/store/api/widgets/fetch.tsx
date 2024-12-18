import type { LoaderFunctionArgs } from "@remix-run/node";
import { prismaClient, authenticate } from "app/shopify.server";
import { json } from "@remix-run/node";

async function getWidget(admin, type) {
    const response = await admin.graphql(
        `#graphql
        query {
        metaobjectByHandle(handle: {
            type: "$app:sell_cross01",
            handle: "${type}"
        }) {
            displayName
            pageType: field(key: "pageType") { value }
            content: field(key: "content") { value }
        }
        }`
    );
    console.log("Widget fetched ---> ", response);
}
export const loader = async ({ request }: LoaderFunctionArgs) => {
    const {admin} = await authenticate.admin(request);

    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    console.log("Query params:", queryParams);

    const storeId = url.searchParams.get('storeId');
    
    await getWidget(admin, "CommonSettings");

    const allOffers = await prismaClient.widget.findMany({
        where: {
            storeId: storeId,
        }
    });

    console.log("All offers fetched ---> ", allOffers);
    return json({ status: 200, data: { message: "Offers fetched successfully!", offers: allOffers } });
}