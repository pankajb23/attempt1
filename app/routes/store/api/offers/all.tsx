import type { LoaderFunctionArgs } from "@remix-run/node";
import { prismaClient, authenticate } from "app/shopify.server";
import { json } from "@remix-run/node";
import { TagsData } from "../tags";

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
            }
        }`
    );
    
    
    const data = await response.json();
    const tagsData = await TagsData(admin);
    const store = await prismaClient.store.upsert({
        where: { shopId: data.data.shop.id },
        update: {},
        create: {
            shopId: data.data.shop.id,
            contactEmail: data.data.shop.contactEmail,
            name: data.data.shop.name,
            createdAt: new Date(data.data.shop.createdAt)
        }
    });
    const helpModals = await prismaClient.helpModals.upsert({
        where: { storeId: store.id },
        update: {},
        create: {
            storeId: store.id,
        }
    });

    const offers = await prismaClient.offer.findFirst({
        where: { storeId: store.id }
    });

    return json({ success: true, data: { storeId: store.id, offers: offers, helpModal: helpModals, tagsData: [...tagsData] } });
};
