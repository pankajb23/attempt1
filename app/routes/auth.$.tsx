import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const {admin} = await authenticate.admin(request);

  console.log("logged in here for the first time for customer", admin);
  return null;
};
