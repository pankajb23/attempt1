import { BlockStack, Card, TextField, Text } from "@shopify/polaris";

export default function OtherDetailsModal() {
    const overrideTextFieldLabel = (
        <Text as="p" variant="bodySm" fontWeight="bold">
            Override default widget title that appears in online store
        </Text>
    )

    const offerPriorityLabel = (
        <Text as="p" variant="bodySm" fontWeight="bold">
            Offer priority
        </Text>
    )

    return (
        <>
            <Card>
                <BlockStack gap="600">
                    <TextField
                        label={overrideTextFieldLabel}
                        value={null}
                        onChange={() => { }}
                        autoComplete="off"
                        placeholder="Optional, Eg. Accessories for {{trigger}}"
                    />
                    <TextField
                        label={offerPriorityLabel}
                        value={null}
                        type="number"
                        onChange={() => { }}
                        autoComplete="off"
                        placeholder="Optional, Eg: 10"
                    />
                    <Text as="p" variant="bodySm"> If more than one offer exists for a trigger product, the highest priority offer will be chosen.</Text>
                </BlockStack>
            </Card>
        </>
    )
}