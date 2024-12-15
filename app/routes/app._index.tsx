import {
  Page,
  Layout,
  BlockStack,
  SkeletonPage,
  LegacyCard,
  SkeletonBodyText,
  TextContainer,
  SkeletonDisplayText,
} from "@shopify/polaris";
import OfferTabModal from '../components/offer/OfferTabModal';
import SetupAssistance from "../components/offer/SetupAssistance";
import HelpBottonModal from "../components/common/HelpBottomModal";
import MainPageOfferHeader from "../components/features/mainpage/MainPageOfferHeader";
import OfferOnPageDashboard from "../components/features/offerdashboard/OfferPageDashboard";
import FrequentlyBoughtTogether from "../components/features/frequentlyboughttogether/FrequentlyBoughtTogether";
import { NavigationPage } from "app/lib/enums/NavigationPage";
import ProductsAddOnPage from "../components/features/productsAddOn/ProductsAddOnPage";
import CartsAddOnPage from "../components/features/cartAddsOn/CartsAddOnPage";
import PostPurchaseUpsellPage from "../components/postPurchaseUpsell/PostPurchaseUpsellPage";
import ThankyouAddOnPage from "../components/features/thankyouPageAddOns/ThankyouAddOnPage";
import CartUpsellDownsellPage from "../components/features/cartUpsellDownsell/CartUpsellDownsellPage";
import { useStoreContext } from "app/lib/context/StoreContext";
import { useCallback, useState } from "react";
import type { Offer } from "app/types";

export default function Index() {

  const { modalsAndStoreId, updateModalsAndStoreId } = useStoreContext();
  const isLoading = modalsAndStoreId.isLoading;
  const mainPageModalState = modalsAndStoreId.mainPageModalState;
  const [navigateTo, setNavigateTo] = useState(NavigationPage.MAIN_PAGE);
  const [offer, setOffer] = useState<Offer>(null);

  const setupShowAssistanceCallback = useCallback((flag: boolean) => {
    updateModalsAndStoreId((prevState) => ({
      mainPageModalState: flag
    }));
  }, [updateModalsAndStoreId]);

  const navigateToCallback = useCallback((navigateToPage: NavigationPage) => {
    setNavigateTo(navigateToPage);
  }, []);

  const openPage = useCallback((navigateTo:NavigationPage, offer: Offer) => {
    setNavigateTo(navigateTo);
    setOffer(offer);
  }, []);

  const wrapBottom = (content) => {
    return (
      <>
        {content}
        <HelpBottonModal />
      </>
    );
  }

  if (isLoading) {
    console.log("Loading user preferences for the first time");
  } else {
    // console.log("nvigateToSelector " + mainPageModalState, isLoading);
    const renderOfferPage = () => {
      switch (navigateTo) {
        case NavigationPage.MAIN_PAGE:
          return (
            <>
              < MainPageOfferHeader navigateToPage={navigateToCallback} />
              {
                mainPageModalState === undefined ? (
                  <SkeletonPage>
                    <Layout>
                      <Layout.Section>
                        <LegacyCard sectioned>
                          <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText />
                          </TextContainer>
                        </LegacyCard>
                      </Layout.Section>
                    </Layout>
                  </SkeletonPage>
                ) : (
                  mainPageModalState ?
                    (<>
                      < SetupAssistance setupShowAssistanceCb={setupShowAssistanceCallback} />
                      <OfferTabModal onShowOfferPage={navigateToCallback} openPage={openPage}/>
                    </>) :
                    (<OfferTabModal onShowOfferPage={navigateToCallback} openPage={openPage}/>)
                )
              }
              <HelpBottonModal />
            </>
          );

        case NavigationPage.OFFER_PAGE_DASHBOARD:
          return wrapBottom(<OfferOnPageDashboard navigateTo={navigateToCallback}/>);

        case NavigationPage.FREQUENTLY_BOUGHT_TOGETHER:
          return wrapBottom(<FrequentlyBoughtTogether navigateTo={navigateToCallback} offer={offer}/>);

        case NavigationPage.PRODUCTS_ADDON:
          return wrapBottom(<ProductsAddOnPage navigateTo={navigateToCallback}/>);

        case NavigationPage.CART_UPSELL_DOWNSELL:
          return wrapBottom(<CartUpsellDownsellPage navigateTo={navigateToCallback}/>);

        case NavigationPage.CART_ADDON:
          return wrapBottom(<CartsAddOnPage navigateTo={navigateToCallback}/>);

        case NavigationPage.POST_PURCHASE_UPSELL:
          return wrapBottom(<PostPurchaseUpsellPage navigateTo={navigateToCallback}/>);

        case NavigationPage.THANK_YOU_ADD_ON:
          return wrapBottom(<ThankyouAddOnPage navigateTo={navigateToCallback}/>);
      }
    }

    return (
      <Page>

        <BlockStack>
          <Layout>
            {renderOfferPage()}
          </Layout>
        </BlockStack>
      </Page>
    );
  }
}
