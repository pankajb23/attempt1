import { BlockStack, Card, TextField, Text } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { useFormContext, Controller } from "react-hook-form";

export default function OtherDetailsModal({widgetTitleArg=undefined, widgetPlaceHolder=undefined}) {


    const { t } = useTranslation();

    const { control, watch } = useFormContext();

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

    const widgetTitle = watch("otherPriorities.defaultWidgetTitle") ?? widgetTitleArg;
    const offerPriority = watch("otherPriorities.offerPriority");

    return (
        <>
            <Card>
                <BlockStack gap="400">
                    {otherPriorityLabel}
                    <Controller
                        name="otherPriorities.defaultWidgetTitle"
                        control={control}
                        defaultValue={widgetTitle}
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label={overrideTextFieldLabel}
                                value={value}
                                onChange={onChange}
                                autoComplete="off"
                                placeholder={widgetPlaceHolder || t("pages.other.override.placeholder")}
                            />
                        )}
                    />

                    <Controller
                        name="otherPriorities.offerPriority"
                        control={control}
                        defaultValue={offerPriority}
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label={offerPriorityLabel}
                                value={value}
                                type="number"
                                onChange={onChange}
                                autoComplete="off"
                                placeholder={t("pages.other.offer_priority.placeholder")}
                            />
                        )}
                    />
                    <Text as="p" variant="bodySm"> {t("pages.other.caution.content")}</Text>
                </BlockStack>
            </Card>
        </>
    )
}