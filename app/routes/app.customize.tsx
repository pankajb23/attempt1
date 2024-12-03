import { Page, BlockStack } from "@shopify/polaris"
import { CustomizePageType } from "./components/types/CustomizeTypes";
import { useState, useCallback } from "react";
import LandingPageModal from "./components/customize/LandingPage";
import CommonSettingsModal from "./components/customize/commonSettings/CommonSettings";
import FrequentlyBoughtTogetherWidgetPage from "./components/customize/frequentlyBoughtTogether/FrequentlyBoughtTogetherWidgetPage";
import ProductsAddOnWidget from "./components/customize/productAddsOn/ProductsAddOnWidget";
import CartAddOnsPage from "./components/customize/cartAddOns/CartAddOnsPage";
import UpsellFunnelPage from "./components/customize/upsellFunnel/UpsellFunnelPage";
import ThankYouPageAddOns from "./components/customize/thankYouPageAdsOns/ThankYouPageAddOns";

export default function CustomizeMainPage() {
  const [page, setPage] = useState(CustomizePageType.LandingPage);

  const navigateToCallback = useCallback((navigateToPage: CustomizePageType) => {
    setPage(navigateToPage);
  }, []);

  function customPage(content, isNarrow) {
    return (
      <Page narrowWidth={isNarrow}>
        <BlockStack>
          {content}
        </BlockStack>
      </Page>
    );
  }

  console.log("page"  ,page);
  const showPage = (page: CustomizePageType) => {
    switch (page) {
      case CustomizePageType.LandingPage:
        return customPage(<LandingPageModal navigateToPage={navigateToCallback} />, true);

      case CustomizePageType.CommonSettings:
        return customPage(<CommonSettingsModal navigateToPage={navigateToCallback} />, false);

      case CustomizePageType.FrequentlyBoughtTogether:
        return customPage(<FrequentlyBoughtTogetherWidgetPage navigateToPage={navigateToCallback} />, false);

      case CustomizePageType.ProductAddOns:
        return customPage(<ProductsAddOnWidget navigateToPage={navigateToCallback} />, false);

      case CustomizePageType.CartAddOns:
        return customPage(<CartAddOnsPage navigateToPage={navigateToCallback} />, false);
      
      case CustomizePageType.UpsellFunnel:
        return customPage(<UpsellFunnelPage navigateToPage={navigateToCallback} />, false);  
      
      case CustomizePageType.ThankYouPageAddOns:
        return customPage(<ThankYouPageAddOns navigateToPage={navigateToCallback} />, false);

      default:
        throw new Error("Invalid page");  
    }
  };

  return (
    showPage(page)
  );
}