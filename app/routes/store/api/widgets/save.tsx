import { type ActionFunction, json } from "@remix-run/node";
import { prismaClient, authenticate } from "app/shopify.server";

async function upsertMetadataDefination(admin, body) {
    const response = await admin.graphql(
        `#graphql
        mutation UpsertMetaobject($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
            metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
            metaobject {
                handle
                pageType: field(key: "pageType") {
                    value
                }
                content: field(key: "content") {
                    value
                }
            }
            userErrors {
                field
                message
                code
            }
            }
        }`,
        {
            variables: {
                "handle": {
                    "type": "$app:sell_cross01",
                    "handle": `${body.type}`
                },
                "metaobject": {
                    "fields": [
                        {
                            "key": "pageType",
                            "value": `${body.type}`
                        },
                        {
                            "key": "content",
                            "value": `${JSON.stringify(body.content)}`
                        }
                    ]
                }
            },
        },
    );
    console.log("Upserted metaobject", response);
}

export const action: ActionFunction = async ({ params, request }) => {
    const body = await request.json(); // Parse the body from the incoming request
    const { admin } = await authenticate.admin(request);
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    console.log("Query params:", queryParams);

    // In this specific example, you'd access the query param like this:
    const storeId = url.searchParams.get('storeId');
    // console.log("specificQueryParam", specificQueryParam);
    console.log("incoming body ---> ", JSON.stringify(body));
    console.log("offer name ---> ", body.offerName);
    console.log("offer type ---> ", body.type);

    let response;
    try {
        await upsertMetadataDefination(admin, body);

        response = await prismaClient.widget.upsert({
            where: {
                storeId_type: {
                    storeId: storeId,
                    type: body.type,
                }
            },
            update: {
                type: body.type,
                content: JSON.stringify(body.content)
            },
            create: {
                type: body.type,
                storeId: storeId,
                content: JSON.stringify(body.content)
            }
        })
        console.log("offer upsert id ->  ", response);

        return json({ status: 200, data: { message: "Offer widget saved successfully!", response: response } });
    } catch (error) {
        console.error(error);
        return json({ status: 500, message: "Failed to save/update offer widget!", error: error });
    }
}