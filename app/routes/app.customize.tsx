import { Page, BlockStack, SkeletonDisplayText } from "@shopify/polaris"
import { CustomizePageType } from "../components/types/CustomizeTypes";
import { useState, useCallback } from "react";
import LandingPageModal from "../components/customize/LandingPage";
import CommonSettingsModal from "../components/customize/commonSettings/CommonSettings";
import FrequentlyBoughtTogetherWidgetPage from "../components/customize/frequentlyBoughtTogether/FrequentlyBoughtTogetherWidgetPage";
import ProductsAddOnWidget from "../components/customize/productAddsOn/ProductsAddOnWidget";
import CartAddOnsPage from "../components/customize/cartAddOns/CartAddOnsPage";
import UpsellFunnelPage from "../components/customize/upsellFunnel/UpsellFunnelPage";
import ThankYouPageAddOns from "../components/customize/thankYouPageAdsOns/ThankYouPageAddOns";
import { useStoreContext } from "app/lib/context/StoreContext";

export default function CustomizeMainPage() {
  const [page, setPage] = useState(CustomizePageType.LandingPage);

  const navigateToCallback = useCallback((navigateToPage: CustomizePageType) => {
    setPage(navigateToPage);
  }, []);

  const { modalsAndStoreId } = useStoreContext();
  const isLoading = modalsAndStoreId.isLoading;

  function customPage(content, isNarrow, isFullWidth = false) {
    return (
      <Page narrowWidth={isNarrow} fullWidth={true}>
        <BlockStack key={page}>
          {content}
        </BlockStack>
      </Page>
    );
  }

  if (isLoading) {
    <SkeletonDisplayText size="extraLarge" />;
  } else {
    const showPage = (page: CustomizePageType) => {
      switch (page) {
        case CustomizePageType.LandingPage:
          return customPage(<LandingPageModal key={'landing-page'} navigateToPage={navigateToCallback} />, true);

        case CustomizePageType.CommonSettings:
          return customPage(<CommonSettingsModal key={'common-setting'} navigateToPage={navigateToCallback} />, false, true);

        case CustomizePageType.FrequentlyBoughtTogether:
          return customPage(<FrequentlyBoughtTogetherWidgetPage key={'fbt'} navigateToPage={navigateToCallback} />, true);

        case CustomizePageType.ProductAddOns:
          return customPage(<ProductsAddOnWidget key={'pao'} navigateToPage={navigateToCallback} />, false);

        case CustomizePageType.CartAddOns:
          return customPage(<CartAddOnsPage key={'cao'} navigateToPage={navigateToCallback} />, false);

        case CustomizePageType.UpsellFunnel:
          return customPage(<UpsellFunnelPage key={'upsellf'} navigateToPage={navigateToCallback} />, false);

        case CustomizePageType.ThankYouPageAddOns:
          return customPage(<ThankYouPageAddOns key={'typao'} navigateToPage={navigateToCallback} />, false);

        default:
          throw new Error("Invalid page");
      }
    };

    return (
      showPage(page)
    );
  }
}