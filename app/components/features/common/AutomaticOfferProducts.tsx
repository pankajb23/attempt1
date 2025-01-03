import { TextField, Text, BlockStack } from "@shopify/polaris"
import { Controller, useFormContext } from "react-hook-form"

const OfferProductLiteral = "offerProducts.maxProducts"
export default function AutomaticOfferProducts() {
    const { watch, control } = useFormContext();

    const offerDefaultValue = watch(OfferProductLiteral) ?? 2;

    const label =
        <Text as="p" fontWeight="bold" variant="bodySm">
            Maximum number of offer products shown
        </Text>
    return (
        <>
            <div style={{ marginTop: '10px' }}>
                <BlockStack gap='500'>
                    <Controller
                        control={control}
                        defaultValue={offerDefaultValue}
                        name={OfferProductLiteral}
                        rules={{
                            required: "Please enter the maximum number of offer products",
                            max: {
                                value: 5,
                                message: "You can show a maximum of 5 offer products."
                            },
                            min: {
                                value: 2,
                                message: "You must show at least 2 offer product."
                            },
                            validate: {
                                isNumber: (value) =>
                                    !isNaN(Number(value)) || 'Must be a valid number',
                                isInteger: (value) =>
                                    Number.isInteger(Number(value)) || 'Must be a whole number'
                            }
                        }}
                        render={({ field: { value, onChange } }) => (
                            <TextField
                                label={label}
                                type="number"
                                value={value}
                                min={2}
                                step={1}
                                max={5}
                                autoComplete="off"
                                helpText="You can show a maximum of 5 offer products."
                            />
                        )} />
                    <Text as="p" fontWeight="semibold" variant="bodySm">
                        Note - We will use Shopify’s automatic product recommendations. If you are a new store, automatic recommendations might not be available.
                    </Text>
                </BlockStack>
            </div>
        </>
    )
}