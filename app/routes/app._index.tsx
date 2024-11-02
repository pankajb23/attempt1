import {
  Page,
  Layout,
  BlockStack,
} from "@shopify/polaris";
import IndexFiltersDefaultExample from './components/offer/offer_tab';
import SetupAssistance from "./components/offer/setup_assistance";
import HelpBotton from "./components/offer/help_bottom";
import OfferHeader from "./components/offer/offer_header";
import { useState } from "react";
import OfferOnPage from "./components/offer_tab/offer_page";
import FrequentlyBoughtTogether from "./components/offer_tab/offers/frequently_bought_together";
import { OfferType } from "./components/offer_tab/offer_types_util";

export default function Index() {
  // const [offerPage, setOfferPage] = useState(true);
  const [showAssistance, setupShowAssistance] = useState(true);

  // move everything to enums 
  // both the offer page can be move to an enum base.
  const [offerType, setOfferType] = useState<OfferType | null>(null);

  const setOfferTypeDef = (flag: OfferType) => {
    console.log("Changing offer page " + flag + " from value " + offerType);
    setOfferType(flag);
  }

  const setupShowAssistanceDef = (flag: boolean) => {
    setupShowAssistance(false);
  }

  const render_offer_page = () => {
    switch (offerType) {
      case null:
        return (
          <>
            < OfferHeader onShowOfferPage={setOfferTypeDef} />
            {showAssistance ?
              < SetupAssistance showSetupAssistance={setupShowAssistanceDef} />
              : null
            }
            <IndexFiltersDefaultExample onShowOfferPage={setOfferTypeDef} />
            <HelpBotton />
          </>
        );

      case OfferType.BaseOfferPage:
        return <OfferOnPage onShowOfferPage={setOfferTypeDef} />

      case OfferType.FrequentlyBoughtTogether:
        return <FrequentlyBoughtTogether onShowOfferPage={setOfferTypeDef} />
    }
  }

  return (
    <Page>
      <BlockStack>
        <Layout>
          {render_offer_page()}
        </Layout>
      </BlockStack>
    </Page>
  );
}
