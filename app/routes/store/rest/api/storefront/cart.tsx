import type { LoaderFunctionArgs } from "@remix-run/node";
import { unauthenticated} from "app/shopify.server";
import { authenticateExternal } from "~/helpers/authenticate"
import shopify from "../../shopify.server";
     

export const loader = async ({ request }: LoaderFunctionArgs) => {
    

    // const {admin} = await shopify.unauthenticated.admin(shop);
    
}