import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  Page,
  Layout,
  Card,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import IndexFiltersWithNoFiltersExample from './js/tabs';
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export default function Index() {
  
  return (
    <Page>
      <TitleBar title="Remix app template">
        <button variant="primary" >
          Generate a product
        </button>
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              {IndexFiltersWithNoFiltersExample()}
            </Card>
          </Layout.Section>
          
        </Layout>
      </BlockStack>
    </Page>
  );
}
