import { BlockStack, Card, Text, Checkbox } from "@shopify/polaris";
import { useFormContext, Controller } from "react-hook-form";

function CheckboxModal({ property, heading, helpText, dependsOn }) {
    const { control, watch } = useFormContext();

    const propertyValue = watch(property) ?? false;
    const dependsOnValue = dependsOn !== null ? (watch(dependsOn) ?? false) : false;

    return (
        <Controller
            control={control}
            name={property}
            defaultValue={propertyValue}
            render={({ field: { value, onChange } }) => (
                <Checkbox
                    label={<Text as="p" variant="bodySm" fontWeight="bold">{heading}</Text>}
                    checked={value}
                    disabled={dependsOnValue}
                    onChange={onChange}
                    helpText={helpText}
                />
            )}
        />
    );

}
export default function SettingsModal() {
    return (
        <Card roundedAbove="sm">
            <BlockStack gap="300">
                <Text as="h5" variant="bodyMd" fontWeight="bold"> Settings</Text>
                <CheckboxModal property="allowAddingMultiplevariants"
                    heading="Allow adding multiple variants"
                    helpText="If enabled multiple variants of the same product can be added to cart."
                    dependsOn={null} />
                <CheckboxModal property="hideQuantityPicker"
                    heading="Hide quantity picker"
                    helpText="If enabled quantity picker will not be shown."
                    dependsOn={"allowAddingMultiplevariants"} />
                <CheckboxModal property="disableCartAddOnsWidget"
                    heading="Disable Cart add-ons widget"
                    helpText={null}
                    dependsOn={null} />

            </BlockStack>
        </Card>
    )
}