import { TextField, Text, BlockStack } from "@shopify/polaris"

export default function AutomaticOfferProducts({ value, handleChange }) {
    const label =
        <Text as="p" fontWeight="bold" variant="bodySm">
            Maximum number of offer products shown
        </Text>
    return (
        <>
            <div style={{marginTop:'10px'}}>
                <BlockStack gap='500'>
                    <TextField
                        label={label}
                        type="number"
                        value={value}
                        max={5}
                        onChange={handleChange}
                        autoComplete="off"
                        helpText="You can show a maximum of 5 offer products."
                    />
                    <Text as="p" fontWeight="semibold" variant="bodySm">
                        Note - We will use Shopify’s automatic product recommendations. If you are a new store, automatic recommendations might not be available.
                    </Text>
                </BlockStack>
            </div>
        </>
    )
}