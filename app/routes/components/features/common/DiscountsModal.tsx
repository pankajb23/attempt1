import { BlockStack, Text, Checkbox, ChoiceList, TextField, Select, Card } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { selectDraftContent, updateDiscountState } from "app/lib/reducers/offers/FrequentlyBoughtTogetherReducer";
import { useCallback } from "react";
// let go of saving data in this iteration
// it's already getting complex to manage states at this point. 
// atm this moment looking to manage UI. 

function AllCheckbox(mapp: Map<string, boolean> = new Map(), skip: Set<string> = new Set()) {
    const { t } = useTranslation();
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
                        <Checkbox
                            label="Other product discounts"
                            id="other-product-discounts"
                            checked={mapp?.get("other-product-discounts") ?? false}
                            onChange={() => { }}
                        />
                    )}
                    {!skip.has("shipping-discounts") && (
                        <Checkbox label="Shipping discounts"
                            id="shipping-discounts"
                            checked={mapp ? mapp.get("other-product-discounts") : false}
                            onChange={() => { }} />
                    )}
                    {!skip.has("order-discounts") && (
                        <Checkbox label="Order discounts"
                            id="order-discounts"
                            checked={mapp ? mapp.get("other-product-discounts") : false}
                            onChange={() => { }} />
                    )}
                </BlockStack>
            </div>
        </div>
    );
}


export default function DiscountModal() {
    const { t } = useTranslation();
    const label = (
        <>
            <Text variant="bodyMd" fontWeight="bold" as="h3">
                {t("pages.discount.enable.heading")}
            </Text>
            <Text variant="bodySm" as="p"> {t("pages.discount.enable.bundle")}</Text>
        </>
    );

    const discountTypeHeading = (
        <>
            <Text variant="bodyMd" fontWeight="bold" as="h3">
                {t("pages.discount.enable.discount.heading")}
            </Text>
        </>
    )

    const value = "5";
    const discountedText = (
        <Text as="p" variant="bodySm" fontWeight="bold">{t("pages.discount.enable.discount.text")}</Text>
    )

    const selectWidgetData = createSelector(
        [selectDraftContent],
        (draft) => ({
            discountedChoice: draft?.discountState?.selectedType,
            isCheckSelected: draft?.discountState?.isEnabled,
        })
    );

    // Use in component
    const { discountedChoice, isCheckSelected } = useSelector(selectWidgetData);

    const discountDetails = (() => {
        switch (discountedChoice) {
            case 'percentOrFixed':
                const discountedValueLabel = (
                    <Text as="p" variant="bodySm" fontWeight="bold">
                        {t("pages.frequently_bought_together.checkbox.percentOrFixed.label")}
                    </Text>
                )
                return (
                    <>
                        <BlockStack gap="600">
                            <TextField
                                label={discountedValueLabel}
                                type="number"
                                value={value}
                                onChange={() => { }}
                                autoComplete="off"
                                placeholder={t("pages.frequently_bought_together.checkbox.percentOrFixed.placeholder")}
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
                            <TextField
                                label={discountedText}
                                value={value}
                                onChange={() => { }}
                                autoComplete="off"
                            />
                            {AllCheckbox()}
                        </BlockStack>
                    </>);
            case "cheapestItemFree":
                return (
                    <>
                        <BlockStack gap="600">
                            <TextField
                                label={discountedText}
                                value={value}
                                onChange={() => { }}
                                autoComplete="off"
                                placeholder={t("pages.frequently_bought_together.checkbox.cheapestItemFree.placeholder")}
                            />

                            {AllCheckbox()}
                        </BlockStack>
                    </>
                );
            case "freeShipping":
                (
                    <>
                        <BlockStack gap="600">
                            <TextField
                                label={discountedText}
                                value={value}
                                onChange={() => { }}
                                autoComplete="off"
                                placeholder={t("pages.frequently_bought_together.checkbox.freeShipping.placeholder")}
                            />
                            {AllCheckbox()}
                        </BlockStack>
                    </>
                );
        }
    });
    const dispatch = useDispatch();
    const changeInSelectedHandler = useCallback((flag: boolean) => {
        dispatch(updateDiscountState({ field: "isEnabled", value: flag }));
    }, []);

    const changeInSelectedChoiceHandler = useCallback((choice: string[]) => {
        dispatch(updateDiscountState({ field: "selectedType", value: choice[0] }));
    }, []);

    return (
        <div>
            <Card>
                <BlockStack gap='400'>
                    <Text as='p' variant="bodySm" fontWeight="bold"> {t("pages.frequently_bought_together.discount.label")}</Text>
                    <Checkbox
                        label={label}
                        checked={isCheckSelected}
                        onChange={changeInSelectedHandler}
                    />
                    {
                        isCheckSelected ? (
                            <ChoiceList
                                title={discountTypeHeading}
                                choices={[
                                    { label: t("pages.frequently_bought_together.checkbox.percentOrFixed.heading"), value: 'percentOrFixed' },
                                    { label: t("pages.frequently_bought_together.checkbox.cheapestItemFree.heading"), value: 'cheapestItemFree' },
                                    { label: t("pages.frequently_bought_together.checkbox.freeShipping.heading"), value: 'freeShipping' },
                                ]}
                                selected={[discountedChoice]}
                                onChange={changeInSelectedChoiceHandler}
                            />) : null
                    }
                    {discountDetails()}
                </BlockStack>
            </Card>
        </div>
    );
}