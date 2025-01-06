import { TextField, Text, BlockStack } from "@shopify/polaris"
import { Controller, useFormContext } from "react-hook-form"

const OfferProductLiteral = "offerProducts.maxProducts"
export default function AutomaticOfferProducts() {
    const { watch, control } = useFormContext();

    const offerDefaultValue = watch(OfferProductLiteral) ?? 1;

    const label =
        <Text as="p" fontWeight="bold" variant="bodySm">
            Maximum number of offer products
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
                            required: "Please enter the maximum number of offer products" 
                        }}
                        render={({ field: { value, onChange } }) => (
                            <TextField
                                label={label}
                                type="number"
                                value={value}
                                onChange={onChange}
                                min={1}
                                step={1}
                                max={4}
                                autoComplete="off"
                                helpText="You can show a maximum of 4 offer products."
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