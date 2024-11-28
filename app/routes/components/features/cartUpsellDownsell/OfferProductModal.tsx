import { BlockStack, Card, Text } from "@shopify/polaris"
export default function OfferProductModal() {
    return (
        <Card roundedAbove="sm">
            <BlockStack gap="400">
                <Text as="h4" variant="headingMd"> Offer products </Text>
                <Text as="h5" variant="bodySm"> Offer #1 </Text>
                <Text as="h5" variant="bodySm"> Offer product </Text>
                

            </BlockStack>
        </Card>
    );
}