import { Layout, BlockStack } from "@shopify/polaris"
import TopHeadingBanner from "../../common/TopHeaderBanner";
import { CustomizePageType } from "../../types/CustomizeTypes";
import GeneralSettings from "./GeneralSettings";
import { FormProvider, useForm } from 'react-hook-form';
import CommonStylingModal from "./CommonStyling";
import CustomCssModal from "./CustomCssModal";
import { useStoreContext } from "../../../lib/context/StoreContext";
import CommonSideModal from "./CommonSideModal";

export default function CommonSettingsModal({ navigateToPage }) {

  const { modalsAndStoreId } = useStoreContext();

  const methods = useForm({
    defaultValues: modalsAndStoreId.customPages.find((page) => page.type === CustomizePageType.CommonSettings)
  });

  console.log("custom pages", modalsAndStoreId.customPages);

  return (
    <>
      <Layout.Section>
        <FormProvider {...methods}>
          <BlockStack >
            <TopHeadingBanner
              navigateTo={navigateToPage}
              heading={"Common settings and customizations"}
              saveOfferButton={true}
              saveButtonContent="Save"
              onSave={() => { console.log("Not implemented") }}
              mainPage={CustomizePageType.LandingPage}
            />
          </BlockStack>
          <div style={{ marginTop: "16px" }}>
            <BlockStack gap='200'>
              <Layout>
                <Layout.Section>
                  <BlockStack gap='300' >
                    <GeneralSettings />
                    <CommonStylingModal />
                    <CustomCssModal />
                  </BlockStack>
                </Layout.Section>
                <Layout.Section variant="oneThird">
                <CommonSideModal />
                </Layout.Section>
              </Layout>
            </BlockStack>
          </div>
        </FormProvider>
      </Layout.Section>
    </>
  )
}