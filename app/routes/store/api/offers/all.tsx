import type { LoaderFunctionArgs } from "@remix-run/node";
import { loader as backendLoader } from "../../backend/offers/all";


export const loader = async ({ request }: LoaderFunctionArgs) => {
    return backendLoader(request);
};
