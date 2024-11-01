import {
    Layout,
    Text,
    Button,
    InlineGrid,
  } from "@shopify/polaris";

  
export default function OfferHeader({onShowOfferPage}) {
    return (
      <>
        <Layout.Section >
          <InlineGrid columns="1fr auto">
            <Text as="h3" variant="headingLg">
              Offers
            </Text>
            <Button
              onClick={() => { onShowOfferPage(false)}}
              accessibilityLabel="Export variants"
              variant="primary"> Add Offer </Button>
          </InlineGrid>
        </Layout.Section>
      </>
    )
  }
  