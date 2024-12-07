import { Layout, BlockStack } from "@shopify/polaris"
import TopHeadingBanner from "../../common/TopHeaderBanner";
import { CustomizePageType } from "../../types/CustomizeTypes";
import GeneralSettings from "./GeneralSettings";
import { FormProvider, useForm } from 'react-hook-form';
import CommonStylingModal from "./CommonStyling";
import CustomCssModal from "./CustomCssModal";
import HelpBottonModal from "../../common/HelpBottomModal";

export default function CommonSettingsModal({ navigateToPage }) {
  const methods = useForm({});

  return (
    <Layout>
        <Layout.Section>
        <BlockStack gap="300">
          <FormProvider {...methods}>
            <TopHeadingBanner
              navigateTo={navigateToPage}
              heading={"Common settings and customizations"}
              saveOfferButton={true}
              saveButtonContent="Save"
              onSave={() => { console.log("Not implemented") }}
              mainPage={CustomizePageType.LandingPage}
            />
            <GeneralSettings />
            <CommonStylingModal />
            <CustomCssModal />
          </FormProvider>
        </BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird"> </Layout.Section>
        <HelpBottonModal />
    </Layout>
  );
}