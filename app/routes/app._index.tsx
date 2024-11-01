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

export default function Index() {
  const [offerPage, setOfferPage] = useState(true);
  const [showAssistance, setupShowAssistance] = useState(true);

  const showOfferPage = (flag: boolean) => {
    console.log("Changing offer page" + flag + " from value " + offerPage);
    setOfferPage(flag);
  }

  const setupShowAssistanceDef = (flag: boolean) => {
    setupShowAssistance(false);
  }

  return (
    <Page>
      <BlockStack>
        <Layout>
          {offerPage ?
            <>
              <OfferHeader onShowOfferPage={showOfferPage} />
              {showAssistance ?
                <>
                  <SetupAssistance showSetupAssistance={setupShowAssistanceDef} />
                </>
                : null
              }
              <IndexFiltersDefaultExample onShowOfferPage={showOfferPage} />
              <HelpBotton />
            </>
            :
            <>
              <OfferOnPage onShowOfferPage={showOfferPage} />
            </>
          }
        </Layout>
      </BlockStack>
    </Page>
  );
}
