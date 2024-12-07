import { useForm, FormProvider } from "react-hook-form";
import { Layout, BlockStack } from "@shopify/polaris";
import TopHeadingBanner from "../../common/TopHeaderBanner";
import HelpBottonModal from "../../common/HelpBottomModal";
import { CustomizePageType } from "../../types/CustomizeTypes";
import PositionModal from "./PositionModal";
import TranslationComponents from "./TranslationComponents";
import StylingModal from "./StylingModal";
import SettingsModal from "./SettingsModal";

export default function ThankYouPageAddOns({ navigateToPage }) {
    const methods = useForm({});
    return (
        <Layout>
            <Layout.Section>
                <BlockStack gap="300">
                    <FormProvider {...methods}>
                        <TopHeadingBanner
                            navigateTo={navigateToPage}
                            heading={"Thank you page add-ons"}
                            saveOfferButton={true}
                            saveButtonContent="Save"
                            onSave={() => { console.log("Not implemented") }}
                            mainPage={CustomizePageType.LandingPage}
                        />
                        <PositionModal />
                        <SettingsModal />
                        <TranslationComponents />
                        <StylingModal />
                    </FormProvider>
                </BlockStack>
            </Layout.Section>
            <Layout.Section variant="oneThird"> </Layout.Section>
            <HelpBottonModal />
        </Layout>
    );
}