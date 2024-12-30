import { authenticate, prismaClient, shopify } from "../shopify.server";


export const handleAfterAuth = async ({ session }) => {
    
    await shopify.registerWebhooks({ session });
}