import { BlockStack, Card, Text, Checkbox } from "@shopify/polaris"
import { Controller, useFormContext } from "react-hook-form"

function CheckBoxModal({ property, heading, helpText }) {
    const { watch, control } = useFormContext();
    const propertyValue = watch(property) ?? false;
    return (
        <Controller
            control={control}
            name={property}
            defaultValue={propertyValue}
            render={({ field: { value, onChange } }) => (
                <Checkbox
                    label={<Text as="p" variant="bodySm" fontWeight="bold">{heading}</Text>}
                    checked={value}
                    onChange={onChange}
                    helpText={helpText}
                />
            )}
        />
    )

}
export default function SettingsModal() {
    return (
        <Card roundedAbove="sm">
            <BlockStack gap="300">
                <Text as="h5" variant="bodyMd" fontWeight="bold"> Settings</Text>
                <CheckBoxModal property="hideQuantityPicker"
                    heading="Hide quantity picker"
                    helpText="If enabled multiple variants of the same product can be added to cart." />
                <CheckBoxModal property="disableUpsellFunnelWidget"
                    heading="Disable Upsell funnel widget"
                    helpText={null} />
            </BlockStack>
        </Card>
    );
}