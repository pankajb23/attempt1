import { Layout, BlockStack } from "@shopify/polaris"
import HelpBottonModal from "../../common/HelpBottomModal"
import TopHeadingBanner from "../../common/TopHeaderBanner"
import { FormProvider, useForm } from 'react-hook-form';
import { CustomizePageType, type TranslationComponent } from "../../types/CustomizeTypes";
import PositionModal from "./PositionModal";
import TextAndTranslations from "./TextAndTranslations";
import StylingModal from "./StylingModal";
import SettingsModal from "./SettingsModal";

export default function FrequentlyBoughtTogetherWidgetPage({ navigateToPage }) {
    const methods = useForm({});

    const translationComponents: TranslationComponent[] = [
        {
            property: "fbt.textAndTranslations.widgetTitle",
            heading: "Widget title",
            defaultValue: "Frequently Bought Together"
        },
        {
            property: "fbt.textAndTranslations.totalPriceLabel",
            heading: "Total price label",
            defaultValue: "Total price"
        },
        {
            property: "fbt.textAndTranslations.addToCartLabel",
            heading: "Add to cart button label",
            defaultValue: "Add to cart"
        },
        {
            property: "fbt.textAndTranslations.thisItemLabel",
            heading: "This item label",
            defaultValue: "This item"
        },
        {
            property: "fbt.textAndTranslations.discountLabel",
            heading: "Discount label",
            defaultValue: "({{discount}} bundle offer on checkout"
        },
        {
            property: "fbt.textAndTranslations.cartPageDiscount",
            heading: "Cart page discount message",
            defaultValue: "Your discount will be applied at checkout"
        }
    ]
    return (
        <Layout>
            <Layout.Section>
                <BlockStack gap="300">
                    <FormProvider {...methods}>
                        <TopHeadingBanner
                            navigateTo={navigateToPage}
                            heading={"Frequently bought together"}
                            saveOfferButton={true}
                            saveButtonContent="Save"
                            onSave={() => { console.log("Not implemented") }}
                            mainPage={CustomizePageType.LandingPage}
                        />
                        <PositionModal />
                        <SettingsModal />
                        <TextAndTranslations translationComponents={translationComponents} />
                        <StylingModal />
                    </FormProvider>
                </BlockStack>
            </Layout.Section>
            <Layout.Section variant="oneThird"> </Layout.Section>
            <HelpBottonModal />
        </Layout>
    )
}