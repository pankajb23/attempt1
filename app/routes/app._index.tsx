import {
  Page,
  Layout,
  BlockStack,
} from "@shopify/polaris";
import OfferTabModal from './components/offer/OfferTabModal';
import SetupAssistance from "./components/offer/SetupAssistance";
import HelpBottonModal from "./components/common/HelpBottomModal";
import MainPageOfferHeader from "./components/features/mainpage/MainPageOfferHeader";
import { useCallback } from "react";
import OfferOnPageDashboard from "./components/features/offerdashboard/OfferPageDashboard";
import FrequentlyBoughtTogether from "./components/features/frequentlyboughttogether/FrequentlyBoughtTogether";
import { useDispatch, useSelector } from "react-redux";
import { selectShowAssistanceOnMainPage,updateAssistanceOnMainPageThunk, UserGuidePreferencesInitializer, selectIsLoading } from "app/lib/reducers/UserGuidePreferencesReducer";
import { selectUserCurrentPage, navigateTo } from "app/lib/reducers/NavigationPageReducer";
import { NavigationPage } from "app/lib/enums/NavigationPage";
import ProductsAddOnPage from "./components/features/productsAddOn/ProductsAddOnPage";
import CartsAddOnPage from "./components/features/cartAddsOn/CartsAddOnPage";


export default function Index() {
  const isLoadingDone = useSelector(state => selectIsLoading(state));

  const showAssistanceSelector = useSelector(state => selectShowAssistanceOnMainPage(state));
  const dispatch = useDispatch();

  const setupShowAssistanceCallback = useCallback((flag: boolean) => {
    const value:any = updateAssistanceOnMainPageThunk(false)
    dispatch(value);
  }, [dispatch]);

  const navigateToSelector = useSelector(state => selectUserCurrentPage(state));

  const navigateToCallback = useCallback((navigateToPage: NavigationPage) => {
    dispatch(navigateTo(navigateToPage));
  }, [dispatch]);

  UserGuidePreferencesInitializer({userId:"alpha-beta-gamma"})

  if (isLoadingDone) {
    console.log("Loading user preferences for the first time");
  } else {
    console.log("nvigateToSelector "+ navigateToSelector);
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
          return <OfferOnPageDashboard navigateTo={navigateToCallback} />

        case NavigationPage.FREQUENTLY_BOUGHT_TOGETHER:
          return <FrequentlyBoughtTogether navigateTo={navigateToCallback} />
        
        case NavigationPage.PRODUCTS_ADDON:
          return <ProductsAddOnPage navigateTo={navigateToCallback} />
        
        case NavigationPage.CART_ADDON:
          return <CartsAddOnPage navigateTo={navigateToCallback} />
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
