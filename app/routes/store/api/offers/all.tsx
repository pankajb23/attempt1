import type { LoaderFunctionArgs } from "@remix-run/node";
import { prismaClient, authenticate } from "app/shopify.server";
import { json } from "@remix-run/node";
import { TagsData } from "../tags";



export async function updateMetaObject(admin, storeId, body) {
    console.log("updateing body", JSON.stringify(body));
    const response = await admin.graphql(
        `#graphql
        mutation UpsertMetaobject($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
            metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
            metaobject {
                handle
                type: field(key: "pageType") {
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
                    "handle": "offers"
                },
                "metaobject": {
                    "fields": [
                        {
                            "key": "pageType",
                            "value": "offers"
                        },
                        {
                            "key": "content",
                            "value": body
                        }
                    ]
                }
            },
        },
    );

    const data = await response.json();
    console.log("Metaobject updated ---> ", JSON.stringify(data));
    // console.log("All error", response.data.metaobjectUpsert.userErrors);

}

async function setMetaObjects(admin, store) {
    if (store.isMetaObjectsInitialized) {
        console.log("Metaobjects already initialized for store ", store.id);
        return;
    } else {
        try {
            const shopifyResp = await admin.graphql(
                `#graphql
            mutation {
            metaobjectDefinitionCreate(definition: {
                type: "$app:sell_cross01",
                access: {
                  admin: MERCHANT_READ_WRITE,
                    storefront: PUBLIC_READ
                },
                capabilities: {
                    publishable: {
                        enabled: true
                    }
                },
                fieldDefinitions: [
                { key: "pageType", name: "Page type", type: "single_line_text_field" },
                { key: "content", name: "Page type", type: "json" }
                ]
            }) {
                metaobjectDefinition {
                id
                type
                fieldDefinitions {
                    key
                    name
                    type {
                         name
                    }
                }
                }
            }
            }`
            );
            console.log("Shopify response ---> ", shopifyResp);
            await prismaClient.store.update({
                where: { id: store.id },
                data: {
                    isMetaObjectsInitialized: true
                }
            });
        } catch (e) {
            console.log("Error in setting metaobjects", e);
        }
    }

}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(
        `#graphql
        query Show{
            shop {
                id
                name
                contactEmail
                createdAt
                plan{
                    displayName
                    partnerDevelopment
                    shopifyPlus
                }
                setupRequired
                # currencyFormats{
                #     moneyFormat # this is what we need. 
                #     moneyInEmailsFormat
                #     moneyWithCurrencyFormat
                #     moneyWithCurrencyInEmailsFormat
                # }
                currencyCode
            }
        }`
    );


    const data = await response.json();
    const shopId = data.data.shop.id;
    const tagsData = await TagsData(admin);
    
    const store = await prismaClient.store.upsert({
        where: { shopId: shopId },
        update: {},
        create: {
            shopId: shopId,
            contactEmail: data.data.shop.contactEmail,
            name: data.data.shop.name,
            createdAt: new Date(data.data.shop.createdAt)
        }
    });

    // await setMetaObjects(admin, store);

    const helpModals = await prismaClient.helpModals.upsert({
        where: { storeId: store.id },
        update: {},
        create: {
            storeId: store.id,
        }
    });


    const allOffers = await prismaClient.offer.findMany({
        where: {
            storeId: store.id,
        }
    });

    const customPages = await prismaClient.widget.findMany({
        where: {
            storeId: store.id,
        },
        select: {
            type: true,
            content: true
        }
    });

    // await getWidget(admin, "CommonSettings");
    return json({ success: true, data: { storeId: store.id, helpModal: helpModals, tagsData: [...tagsData], currencyformats: data.data.currencyCode, offers: allOffers, customPages: customPages } });
};
