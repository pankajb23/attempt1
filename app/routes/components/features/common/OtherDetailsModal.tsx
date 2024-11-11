import { createSelector } from "@reduxjs/toolkit";
import { BlockStack, Card, TextField, Text } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import {selectDraftContent, updateOtherPriorities} from "app/lib/reducers/offers/FrequentlyBoughtTogetherReducer";
import { useSelector, useDispatch } from "react-redux";

export default function OtherDetailsModal() {
    const selectWidgetData = createSelector(
        [selectDraftContent],
        (draft) => ({
            widgetTitle: draft?.otherPriorities?.defaultWidgetTitle ?? "",
            offerPriority: draft?.otherPriorities?.offerPriority ?? ""
        })
    );

    // Use in component
    const { widgetTitle, offerPriority } = useSelector(selectWidgetData);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    
    const updateTitleCallback = (value: string) => {
        dispatch(updateOtherPriorities({field: "defaultWidgetTitle",value:value}));
    }

    const updateOfferPriorityCallback = (value: string) => {
        dispatch(updateOtherPriorities({field: "offerPriority", value:value}));
    }

    const overrideTextFieldLabel = (
        <Text as="p" variant="bodySm" fontWeight="bold">
            {t("pages.other.override.heading")}
        </Text>
    )

    const offerPriorityLabel = (
        <Text as="p" variant="bodySm" fontWeight="bold">
            {t("pages.other.offer_priority.heading")}
        </Text>
    )

    const otherPriorityLabel = (
        <Text as="p" variant="bodySm" fontWeight="bold">
            {t("pages.other.offer_priority.content")}
        </Text>
    )

    return (
        <>
            <Card>
                <BlockStack gap="400">
                    {otherPriorityLabel}
                    <TextField
                        label={overrideTextFieldLabel}
                        value={widgetTitle}
                        onChange={updateTitleCallback}
                        autoComplete="off"
                        placeholder={t("pages.other.override.content")}
                    />
                    <TextField
                        label={offerPriorityLabel}
                        value={offerPriority}
                        type="number"
                        onChange={updateOfferPriorityCallback}
                        autoComplete="off"
                        placeholder={t("pages.other.offer_priority.placeholder")}
                    />
                    <Text as="p" variant="bodySm"> {t("pages.other.caution.content")}</Text>
                </BlockStack>
            </Card>
        </>
    )
}