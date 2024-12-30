import type { LoaderFunctionArgs } from "@remix-run/node";
import { unauthenticated} from "app/shopify.server";
import { authenticateExternal } from "~/helpers/authenticate"
import shopify from "../../shopify.server";
     

export const loader = async ({ request }: LoaderFunctionArgs) => {
    *   const shop = await authenticateExternal(request)
    *   const {admin} = await shopify.unauthenticated.admin(shop);
    *   const response = await admin.graphql("{ shop { name} }")
    
}