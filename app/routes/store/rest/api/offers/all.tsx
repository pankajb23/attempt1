import type { LoaderFunctionArgs } from "@remix-run/node";
import { loader as backendLoader } from "../../../backend/offers/all.server";


export const loader = async ({ request }: LoaderFunctionArgs) => {
    return backendLoader(request);
};
