import {
    Layout,
    Text,
    Button,
    InlineGrid,
  } from "@shopify/polaris";
import { OfferType } from "../offer_tab/offer_types_util";

  
export default function OfferHeader({onShowOfferPage}) {
    return (
      <>
        <Layout.Section >
          <InlineGrid columns="1fr auto">
            <Text as="h3" variant="headingLg">
              Offers
            </Text>
            <Button
              onClick={() => { onShowOfferPage(OfferType.BaseOfferPage)}}
              accessibilityLabel="Export variants"
              variant="primary"> Add Offer </Button>
          </InlineGrid>
        </Layout.Section>
      </>
    )
  }
  