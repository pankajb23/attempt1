import { Layout, BlockStack, Card, Text, InlineGrid, TextField } from "@shopify/polaris";
import { FormProvider, useForm, useFormContext, Controller } from "react-hook-form";
import TopHeadingBanner from "../../common/TopHeaderBanner";
import HelpBottonModal from "../../common/HelpBottomModal";
import { CustomizePageType, type TranslationComponent } from "../../types/CustomizeTypes";
import { Component } from "../frequentlyBoughtTogether/TextAndTranslations";
import StylingModal from "./StylingModal";
import SettingsModal from "./SettingsModal";

export function TimerBlock({ property, heading, defaultValue, suffix }) {
    const { watch, control } = useFormContext();

    const propertyValue = watch(property) ?? defaultValue;
    return (
        <Controller
            control={control}
            name={property}
            defaultValue={propertyValue}
            render={({ field: { value, onChange } }) => (
                <TextField
                    label={<div style={{opacity: heading ? 1 : 0}}><Text as="legend" variant="bodySm" fontWeight="bold" >{heading?heading: ' - '}</Text></div>}
                    value={value}
                    type="number"
                    min="0"
                    onChange={onChange}
                    autoComplete="off"
                    suffix={suffix}
                />
            )}
        />
    );
}

function TranslationCard() {
    const translationComponents: TranslationComponent[] = [
        {
            property: "cao.textAndTranslations.widgetTitle",
            heading: "Widget title",
            defaultValue: "You might also like these"
        },
        {
            property: "cao.textAndTranslations.widgetDiscountLabel",
            heading: "Widget discount label",
            defaultValue: "Limited time offer! Expires in {{timer}}"
        },
        {
            property: "cao.textAndTranslations.addToCartLabel",
            heading: "Add to cart button label",
            defaultValue: "Add"
        },
        {
            property: "cao.textAndTranslations.removeButtonLabel",
            heading: "Remove button label",
            defaultValue: "Remove"
        },
        {
            property: "cao.textAndTranslations.continueButtonLabel",
            heading: "Continue button label",
            defaultValue: "Continue"
        },
        {
            property: "cao.textAndTranslations.totalLabel",
            heading: "Total label",
            defaultValue: "Total"
        },
        {
            property: "cao.textAndTranslations.cartPageDiscount",
            heading: "Cart page discount message",
            defaultValue: "Your discount will be applied at checkout"
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
                    <TimerBlock property={"cao.translations.timer.minutes"} heading={"Countdown timer"} defaultValue={5} suffix={"minutes"} />
                    <TimerBlock property={"cao.translations.timer.seconds"} heading={null} defaultValue={0} suffix={"seconds"} />
                </InlineGrid>
                <Text as="p" variant="bodySm">The countdown time will be displayed only when there is a discount.</Text>
            </BlockStack>
        </Card>
    )
}

export default function CartAddOnsPage({ navigateToPage }) {
    const methods = useForm({});

    return (
        <Layout>
            <Layout.Section>
                <BlockStack gap="300">
                    <FormProvider {...methods}>
                        <TopHeadingBanner
                            navigateTo={navigateToPage}
                            heading={"Cart add-ons"}
                            saveOfferButton={true}
                            saveButtonContent="Save"
                            onSave={() => { console.log("Not implemented") }}
                            mainPage={CustomizePageType.LandingPage}
                        />
                        <SettingsModal />
                        <TranslationCard />
                        <StylingModal />
                    </FormProvider>
                </BlockStack>
            </Layout.Section>
            <Layout.Section variant="oneThird"> </Layout.Section>
            <HelpBottonModal />
        </Layout>
    );
}