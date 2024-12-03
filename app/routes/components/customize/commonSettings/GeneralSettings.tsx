import { BlockStack, Card, Checkbox, Text, Divider, Select, TextField } from "@shopify/polaris";
import { useFormContext, Controller } from "react-hook-form";

enum PlacingCartPageDiscount {
    DisplayPopupOnCartPage = "DisplayPopupOnCartPage",
    BeforeHtmlElement = "BeforeHtmlElement",
    StartHtmlElement = "StartHtmlElement",
    EndHtmlElement = "EndHtmlElement",
    AfterHtmlElement = "AfterHtmlElement",
}

export default function GeneralSettings() {
    const { watch, control } = useFormContext();
    const isTagOrderChecked = watch("generalSettings.tagOrder.isChecked") ?? false;
    const isMultiLanguageSetupChecked = watch("generalSettings.multilanguage.isChecked") ?? false;
    const cartPageDiscountType = (watch("generalSettings.placingCartPageDiscount") ?? "DisplayPopupOnCartPage");
    const htmlContent = watch("generalSettings.placingCartPageDiscountHtmlElement") ?? ".product-form";

    return (
        <>
            <Card roundedAbove="sm">
                <BlockStack gap="400">
                    <Text as="h5" variant="headingMd">General settings</Text>
                    <Controller
                        control={control}
                        name="generalSettings.tagOrder.isChecked"
                        defaultValue={isTagOrderChecked}
                        render={({ field: { value, onChange } }) => (
                            <Checkbox
                                label={<Text as="p" variant="bodySm" fontWeight="bold">Tag orders when offer is converted</Text>}
                                checked={value}
                                onChange={onChange}
                                helpText="Order will be tagged with 'lb-upsell' tag when an offer is converted."
                            />
                        )}
                    />
                    <Divider />
                    <Controller
                        control={control}
                        name="generalSettings.multilanguage.isChecked"
                        defaultValue={isMultiLanguageSetupChecked}
                        render={({ field: { value, onChange } }) => (
                            <Checkbox
                                label={<Text as="p" variant="bodySm" fontWeight="bold">I use multi-language product handles</Text>}
                                checked={value}
                                onChange={onChange}
                                helpText="Enable this only if you have set up and use product handles in multiple languages."
                            />
                        )}
                    />
                    <Divider />
                    <Controller
                        control={control}
                        name="generalSettings.placingCartPageDiscount"
                        defaultValue={cartPageDiscountType}
                        render={({ field: { value, onChange } }) => (
                            <Select
                                label={<Text as="p" variant="bodySm" fontWeight="bold">Where do you want to place the cart page discount message?</Text>}
                                options={[
                                    { label: "Display popup on cart page", value: PlacingCartPageDiscount.DisplayPopupOnCartPage },
                                    { label: "Before HTML element", value: PlacingCartPageDiscount.BeforeHtmlElement },
                                    { label: "Start HTML element", value: PlacingCartPageDiscount.StartHtmlElement },
                                    { label: "End HTML element", value: PlacingCartPageDiscount.EndHtmlElement },
                                    { label: "After HTML element", value: PlacingCartPageDiscount.AfterHtmlElement },
                                ]}
                                onChange={onChange}
                                value={value}
                            />
                        )}
                    />
                    {
                        cartPageDiscountType !== PlacingCartPageDiscount.DisplayPopupOnCartPage && (
                            <Controller
                                control={control}
                                name="generalSettings.placingCartPageDiscountHtmlElement"
                                defaultValue={htmlContent}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        label={<Text as="p" variant="bodySm"> CSS selector of the HTML element.</Text>}
                                        value={value}
                                        onChange={onChange}
                                        autoComplete="off"
                                    />
                                )}
                            />
                        )
                    }
                </BlockStack>
            </Card>
        </>
    );
}