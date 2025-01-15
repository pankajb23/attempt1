import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "app/shopify.server";

//TODO may have to cache in future
const LoadData = async (first: number, cursor: string, admin) => {
    const fetchProductRequest = await admin.graphql(
        `#graphql
        query FetchProducts($first: Int!, $cursor: String){
            products(first: $first, after: $cursor) {
                edges{
                    node{
                        id
                        tags
                    }
                    cursor
                }
                pageInfo{
                    hasNextPage
                }
            }
        }`,
        {
            variables: {
                first: first,
                cursor: cursor
            }
        }
    ).then((response) => {
        const resp = response.json();
        console.log("Resp ", resp);
        return resp;
    });
    return await fetchProductRequest;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    return await TagsData(admin);
};

export const TagsData = async (admin) => {
    let cursor = null;
    let hasNextPage = true;
    let data = new Set();

    while (hasNextPage) {


        const response = await LoadData(250, cursor, admin);
        // const jsonResponse = JSON.stringify(response, null, 2);
        // console.log("Running counter with data with cursor", counter, cursor, jsonResponse, response);
        const products = response.data?.products.edges;
        cursor = products[products.length - 1].cursor;
        hasNextPage = response.data.products.pageInfo.hasNextPage;
        // console.log("Cursor", cursor, "Has Next Page", hasNextPage, "products", products);
        products.forEach((product) => {
            product.node.tags.forEach((tag) => {
                data.add(tag);
            });
        });
    }
    // console.log("Data", data);
    return data;
}