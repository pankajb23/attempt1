import { Layout, BlockStack, Card, Text, InlineGrid} from "@shopify/polaris";
import { FormProvider, useForm} from "react-hook-form";
import HelpBottonModal from "../../common/HelpBottomModal";
import TopHeadingBanner from "../../common/TopHeaderBanner";
import { CustomizePageType, type TranslationComponent } from "../../types/CustomizeTypes";
import SettingsModal from "./SettingsModal";
import { Component } from "../frequentlyBoughtTogether/TextAndTranslations";
import { TimerBlock } from "../cartAddOns/CartAddOnsPage";
import StylingModal from "./StylingModal";


function TranslationComponents(){
    const translationComponents:TranslationComponent[] = [
        {
            property: "upsell.textAndTranslations.quantityLabel",
            heading: "Quantity label",
            defaultValue: "Quantity"
        },
        {
            property: "upsell.textAndTranslations.stockQuantityErrorMessage",
            heading: "Available stock quantity error message",
            defaultValue: "Only {{available_quantity}} {{product}}s available"
        },
        {
            property: "upsell.textAndTranslations.addToCartLabel",
            heading: "Add to cart button label",
            defaultValue: "Add to cart"
        },
        {
            property: "upsell.textAndTranslations.SkipAndCheckoutButtonLabel",
            heading: "Skip & checkout button label",
            defaultValue: "Skip & Checkout"
        },
        {
            property: "upsell.textAndTranslations.downsellButtonLabel",
            heading: "Downsell button label",
            defaultValue: "I'll skip this offer"
        },
        {
            property: "upsell.textAndTranslations.countDownTimerText",
            heading: "Count down timer text",
            defaultValue: "Limited time offer! Expires in {{timer}}"
        }
    ]

    return (
        <Card roundedAbove="sm">
            <BlockStack gap="300">
                <Text as="p" variant="bodyMd" fontWeight="bold">Text and translations</Text>
                {
                    translationComponents.map((component, index) => (
                        <Component key={index} component={component} />
                    ))
                }
                <InlineGrid columns={2} gap="200">
                    <TimerBlock property={"upsell.translations.timer.minutes"} heading={"Countdown timer"} defaultValue={5} suffix={"minutes"} />
                    <TimerBlock property={"upsell.translations.timer.seconds"} heading={null} defaultValue={0} suffix={"seconds"} />
                </InlineGrid>
                <Text as="p" variant="bodySm">The countdown time will be displayed only when there is a discount.</Text>
            </BlockStack>
        </Card>
    );
}

export default function UpsellFunnelPage({ navigateToPage }) {
    const methods = useForm({});
    return (
        <Layout>
            <Layout.Section>
                <BlockStack gap="300">
                    <FormProvider {...methods}>
                        <TopHeadingBanner
                            navigateTo={navigateToPage}
                            heading={"Upsell funnel"}
                            saveOfferButton={true}
                            saveButtonContent="Save"
                            onSave={() => { console.log("Not implemented") }}
                            mainPage={CustomizePageType.LandingPage}
                        />
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