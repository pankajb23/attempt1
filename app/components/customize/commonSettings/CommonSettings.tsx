import { Layout, BlockStack } from "@shopify/polaris"
import TopHeadingBanner from "../../common/TopHeaderBanner";
import { CustomizePageType } from "../../types/CustomizeTypes";
import GeneralSettings from "./GeneralSettings";
import { FormProvider, useForm } from 'react-hook-form';
import CommonStylingModal from "./CommonStyling";
import { useStoreContext } from "../../../lib/context/StoreContext";
import CommonSideModal from "./CommonSideModal";

export default function CommonSettingsModal({ navigateToPage }) {

  const { modalsAndStoreId } = useStoreContext();

  const methods = useForm({
    defaultValues: modalsAndStoreId.customPages.find((page) => page.type === CustomizePageType.CommonSettings)
  });

  const onSubmit = async (data) => {
    fetch(`/api/widgets/save?storeId=${modalsAndStoreId.storeId}`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'CommonSettings',
        content: data
      })
    }).then((response) => {
      console.log(response);
      shopify.toast.show(`Successfully saved customization`, { duration: 500 });
    }).catch((error) => {
      console.error(error);
      shopify.toast.show(`Failed to saved customization`, { duration: 500, isError: true });
    });
  };

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
              onSave={methods.handleSubmit(onSubmit)}
              mainPage={CustomizePageType.LandingPage}
            />
          </BlockStack>
          <div style={{ marginTop: "16px" }}>
            <BlockStack gap='200'>
              <Layout>
                <Layout.Section variant="oneHalf">
                  <BlockStack gap='300' >
                    <GeneralSettings />
                    <CommonStylingModal />
                    {/* <CustomCssModal /> */}
                  </BlockStack>
                </Layout.Section>
                <Layout.Section variant="oneHalf">
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