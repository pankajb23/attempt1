import {
  Page,
  Layout,
  Text,
  Button,
  BlockStack,
  InlineGrid,
} from "@shopify/polaris";
import IndexFiltersDefaultExample from './offer_components/offer_tab';
import SetupAssistance from "./offer_components/setup_assistance";

function OfferHeader() {
  console.log("Checkpoitn 3");
  return (
    <>
      <Layout.Section >
        <InlineGrid columns="1fr auto">
          <Text as="h3" variant="headingLg">
            Offers
          </Text>
          <Button
            onClick={() => { }}
            accessibilityLabel="Export variants"
            variant="primary"> Add Offer </Button>
        </InlineGrid>
      </Layout.Section>
    </>
  )
}


export default function Index() {
  console.log("Checkpoitn 1");
  console.log("Checkpoint 2");
  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          {OfferHeader()}
          {SetupAssistance()}
          {IndexFiltersDefaultExample()}
        </Layout>
      </BlockStack>
    </Page>
  );
}
