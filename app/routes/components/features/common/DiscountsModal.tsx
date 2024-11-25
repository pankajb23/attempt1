import { BlockStack, Text, Checkbox, ChoiceList, TextField, Select, Card } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { Controller, set, useFormContext } from "react-hook-form";

const AllCheckbox = ({ mapp = new Map(), skip = new Set }) => {
    const { t } = useTranslation();
    const { control, setValue, watch } = useFormContext();

    const productDiscountValue = watch("config.discountCombination.productDiscounts") ?? false;
    const shippingDiscountValue = watch("config.discountCombination.shippingDiscounts") ?? false;
    const orderDiscountValue = watch("config.discountCombination.orderDiscounts") ?? false;

    // setValue("config.discountCombination.productDiscounts", productDiscountValue);
    // setValue("config.discountCombination.shippingDiscounts", shippingDiscountValue);
    // setValue("config.discountCombination.orderDiscounts", orderDiscountValue);

    return (
        <div>
            <Text variant="bodyMd" fontWeight="bold" as="h3">
                {t("pages.frequently_bought_together.discount.combination")}
            </Text>
            <Text variant="bodyMd" as="p">
                {t("pages.frequently_bought_together.discount.combined")}
            </Text>
            <div style={{ marginTop: '10px' }}>
                <BlockStack>
                    {!skip.has("other-product-discounts") && (
                        <Controller
                            name="config.discountCombination.productDiscounts"
                            control={control}
                            defaultValue={productDiscountValue}
                            render={({ field: { onChange, value } }) => (
                                <Checkbox
                                    label="Other product discounts"
                                    checked={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                    )}
                    {!skip.has("shipping-discounts") && (
                        <Controller
                            name="config.discountCombination.shippingDiscounts"
                            control={control}
                            defaultValue={shippingDiscountValue}
                            render={({ field: { onChange, value } }) => (
                                <Checkbox
                                    label="Shipping discounts"
                                    checked={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                    )}
                    {!skip.has("order-discounts") && (
                        <Controller
                            name="config.discountCombination.orderDiscounts"
                            control={control}
                            defaultValue={orderDiscountValue}
                            render={({ field: { onChange, value } }) => (
                                <Checkbox
                                    label="Order discounts"
                                    checked={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                    )}
                </BlockStack>
            </div>
        </div>
    );
};

const DiscountDetails = ({ discountedChoice }) => {
    const { t } = useTranslation();
    const value = "5";
    const { control, watch } = useFormContext();

    const discountedText = (
        <Text as="p" variant="bodySm" fontWeight="bold">
            {t("pages.discount.enable.discount.text")}
        </Text>
    );

    const { isEnabled, selectedType, name } = (() => {
        switch (discountedChoice) {
            case 'percentOrFixed':
                return {
                    isEnabled: true,
                    selectedType: 'percentOrFixed',
                    name: 'config.discountText',
                }
            case 'cheapestItemFree':
                return {
                    isEnabled: false,
                    selectedType: 'cheapestItemFree',
                    name: 'config.discountText',
                }
            case 'freeShipping':
                return {
                    isEnabled: false,
                    selectedType: 'freeShipping',
                    name: 'config.discountText',
                }
            default:
                return null;
        }
    }
    )();
    const discountedTextvalue = watch(name) ?? value;
    return (
        <>
            <BlockStack gap="600">
                {isEnabled && <Controller
                    control={control}
                    name="config.discountText"
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label={<Text as="p" variant="bodySm" fontWeight="bold">
                                {t("pages.frequently_bought_together.checkbox.percentOrFixed.label")}
                            </Text>}
                            type="number"
                            value={value}
                            onChange={() => { }}
                            autoComplete="off"
                            
                            connectedRight={
                                <Select
                                    value={"%"}
                                    label="Weight unit"
                                    onChange={() => { }}
                                    labelHidden
                                    options={["%", "Inr"]}
                                />
                            }

                        />
                    )}
                />
                }
                <Controller
                    name={name}
                    control={control}
                    defaultValue={discountedTextvalue}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label={discountedText}
                            value={value}
                            placeholder={t("pages.frequently_bought_together.checkbox.percentOrFixed.placeholder")}
                            onChange={onChange}
                            autoComplete="off"
                        />
                    )}
                />
                <AllCheckbox />
            </BlockStack>
        </>
    );

};

export default function DiscountModal({ allProducts, allTags }) {
    const { t } = useTranslation();
    const { control, watch } = useFormContext();

    const isEnableDiscountSelected = watch("discountState.isEnabled") ?? false;
    const discountedChoice = watch("discountState.selectedType") ?? "percentOrFixed";

    return (
        <div>
            <Card>
                <BlockStack gap='400'>
                    <Text as='p' variant="bodySm" fontWeight="bold">
                        {t("pages.frequently_bought_together.discount.label")}
                    </Text>
                    <Controller
                        name="discountState.isEnabled"
                        control={control}
                        render={({ field: { onChange, value, ref } }) => (
                            <Checkbox
                                label={<>
                                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                                        {t("pages.discount.enable.heading")}
                                    </Text>
                                    <Text variant="bodySm" as="p">
                                        {t("pages.discount.enable.bundle")}
                                    </Text>
                                </>}
                                checked={value}
                                onChange={onChange}
                                ref={ref}
                            />
                        )}
                    />
                    {isEnableDiscountSelected && (
                        <Controller
                            name="discountState.selectedType"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ChoiceList
                                    title={<Text variant="bodyMd" fontWeight="bold" as="h3">
                                        {t("pages.discount.enable.discount.heading")}
                                    </Text>}
                                    choices={[
                                        { label: t("pages.frequently_bought_together.checkbox.percentOrFixed.heading"), value: 'percentOrFixed' },
                                        { label: t("pages.frequently_bought_together.checkbox.cheapestItemFree.heading"), value: 'cheapestItemFree' },
                                        { label: t("pages.frequently_bought_together.checkbox.freeShipping.heading"), value: 'freeShipping' }
                                    ]}
                                    selected={[value]}
                                    onChange={(selected) => onChange(selected[0])}
                                />
                            )}
                        />
                    )}
                    {isEnableDiscountSelected && (
                        <DiscountDetails discountedChoice={discountedChoice} />
                    )}
                </BlockStack>
            </Card>
        </div>
    );
}