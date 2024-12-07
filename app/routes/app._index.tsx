import {
  Page,
  Layout,
  BlockStack,
} from "@shopify/polaris";
import OfferTabModal from '../components/offer/OfferTabModal';
import SetupAssistance from "../components/offer/SetupAssistance";
import HelpBottonModal from "../components/common/HelpBottomModal";
import MainPageOfferHeader from "../components/features/mainpage/MainPageOfferHeader";
import { useCallback } from "react";
import OfferOnPageDashboard from "../components/features/offerdashboard/OfferPageDashboard";
import FrequentlyBoughtTogether from "../components/features/frequentlyboughttogether/FrequentlyBoughtTogether";
import { useDispatch, useSelector } from "react-redux";
import { selectShowAssistanceOnMainPage, updateAssistanceOnMainPageThunk, UserGuidePreferencesInitializer, selectIsLoading } from "app/lib/reducers/UserGuidePreferencesReducer";
import { selectUserCurrentPage, navigateTo } from "app/lib/reducers/NavigationPageReducer";
import { NavigationPage } from "app/lib/enums/NavigationPage";
import ProductsAddOnPage from "../components/features/productsAddOn/ProductsAddOnPage";
import CartsAddOnPage from "../components/features/cartAddsOn/CartsAddOnPage";
import PostPurchaseUpsellPage from "../components/postPurchaseUpsell/PostPurchaseUpsellPage";
import ThankyouAddOnPage from "../components/features/thankyouPageAddOns/ThankyouAddOnPage";
import CartUpsellDownsellPage from "../components/features/cartUpsellDownsell/CartUpsellDownsellPage";


export default function Index() {
  const isLoadingDone = useSelector(state => selectIsLoading(state));

  const showAssistanceSelector = useSelector(state => selectShowAssistanceOnMainPage(state));
  const dispatch = useDispatch();

  const setupShowAssistanceCallback = useCallback((flag: boolean) => {
    const value: any = updateAssistanceOnMainPageThunk(false)
    dispatch(value);
  }, [dispatch]);

  const navigateToSelector = useSelector(state => selectUserCurrentPage(state));

  const navigateToCallback = useCallback((navigateToPage: NavigationPage) => {
    dispatch(navigateTo(navigateToPage));
  }, [dispatch]);

  UserGuidePreferencesInitializer({ userId: "alpha-beta-gamma" })

  function wrapBottom(content) {
    return (
      <>
        {content}
        <HelpBottonModal />
      </>
    );
  }

  if (isLoadingDone) {
    console.log("Loading user preferences for the first time");
  } else {
    console.log("nvigateToSelector " + navigateToSelector);
    const renderOfferPage = () => {
      switch (navigateToSelector) {
        case NavigationPage.MAIN_PAGE:
          return (
            <>
              < MainPageOfferHeader navigateToPage={navigateToCallback} />
              {showAssistanceSelector ? < SetupAssistance setupShowAssistanceCb={setupShowAssistanceCallback} /> : null}
              <OfferTabModal onShowOfferPage={navigateToCallback} />
              <HelpBottonModal />
            </>
          );

        case NavigationPage.OFFER_PAGE_DASHBOARD:
          return wrapBottom(<OfferOnPageDashboard navigateTo={navigateToCallback} />);

        case NavigationPage.FREQUENTLY_BOUGHT_TOGETHER:
          return wrapBottom(<FrequentlyBoughtTogether navigateTo={navigateToCallback} />);

        case NavigationPage.PRODUCTS_ADDON:
          return wrapBottom(<ProductsAddOnPage navigateTo={navigateToCallback} />);

        case NavigationPage.CART_UPSELL_DOWNSELL:
          return wrapBottom(<CartUpsellDownsellPage navigateTo={navigateToCallback} />);

        case NavigationPage.CART_ADDON:
          return wrapBottom(<CartsAddOnPage navigateTo={navigateToCallback} />);

        case NavigationPage.POST_PURCHASE_UPSELL:
          return wrapBottom(<PostPurchaseUpsellPage navigateTo={navigateToCallback} />);

        case NavigationPage.THANK_YOU_ADD_ON:
          return wrapBottom(<ThankyouAddOnPage navigateTo={navigateToCallback} />);
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
