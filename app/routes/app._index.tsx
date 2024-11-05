import {
  Page,
  Layout,
  BlockStack,
} from "@shopify/polaris";
import IndexFiltersDefaultExample from './components/offer/offer_tab';
import SetupAssistance from "./components/offer/setup_assistance";
import HelpBottonModal from "./components/common/HelpBottomModal";
import MainPageOfferHeader from "./components/features/mainpage/MainPageOfferHeader";
import { useCallback } from "react";
import OfferOnPage from "./components/offer_tab/OfferPageDashboard";
import FrequentlyBoughtTogether from "./components/offer_tab/offers/frequently_bought_together";
import { useDispatch, useSelector } from "react-redux";
import { selectShowAssistanceOnMainPage, updateAssistanceOnMainPage, UserGuidePreferencesInitializer, selectIsLoading } from "app/lib/reducers/UserGuidePreferencesReducer";
import { selectUserCurrentPage, navigateTo } from "app/lib/reducers/NavigationPageReducer";
import { NavigationPage } from "app/lib/enums/NavigationPage";

export default function Index() {
  const isLoadingDone = useSelector(state => selectIsLoading(state));

  const showAssistanceSelector = useSelector(state => selectShowAssistanceOnMainPage(state));
  const dispatch = useDispatch();

  const setupShowAssistanceCallback = useCallback((flag: boolean) => {
    dispatch(updateAssistanceOnMainPage(false));
  }, [dispatch]);

  const navigateToSelector = useSelector(state => selectUserCurrentPage(state));
  const navigateToCallback = useCallback((navigateToPage: NavigationPage) => {
    dispatch(navigateTo(navigateToPage));
  }, [dispatch]);

  UserGuidePreferencesInitializer({userId:"alpha-beta-gamma"})

  if (isLoadingDone) {
    console.log("Loading user preferences for the first time");
  } else {
    console.log("User loading is done navigateToSelector "+ navigateToSelector + " loading done " + isLoadingDone);
    const renderOfferPage = () => {
      switch (navigateToSelector) {
        case NavigationPage.MAIN_PAGE:

          return (
            <>
              < MainPageOfferHeader navigateToPage={navigateToCallback} />
              {showAssistanceSelector ? < SetupAssistance showSetupAssistance={setupShowAssistanceCallback} /> : null}
              <IndexFiltersDefaultExample onShowOfferPage={navigateToCallback} />
              <HelpBottonModal />
            </>
          );

        case NavigationPage.OFFER_PAGE_DASHBOARD:
          return <OfferOnPage onShowOfferPage={navigateToCallback} />

        case NavigationPage.FREQUENTLY_BOUGHT_TOGETHER:
          return <FrequentlyBoughtTogether onShowOfferPage={navigateToCallback} />
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
