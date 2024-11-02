import {
    InlineStack,
    Button,
    Text,
    BlockStack,
    Card
} from "@shopify/polaris";

export default function OfferWidget({ header, message, img, onShowOfferPage, offerType }) {
    return (
        <div style={{ width: "320px" }}>
            <Card>
                <BlockStack gap="200">
                    <InlineStack align="start" blockAlign="start"  >
                        <img
                            alt=""
                            width="100%"
                            height="1000%"
                            style={{
                                objectFit: "cover",
                                objectPosition: 'center',
                            }}
                            src={img}
                        />
                    </InlineStack>
                    <BlockStack gap="200">
                        <Text as="h5" fontWeight="bold" variant="headingMd">{header}</Text>
                        <Text as="p" variant="bodySm">{message}</Text>
                    </BlockStack>
                    <InlineStack align="end" blockAlign="end" gap="1000">
                        <Button textAlign="end" variant="primary" onClick={() => onShowOfferPage(offerType)}>
                            Create
                        </Button>
                    </InlineStack>
                </BlockStack>
            </Card>
        </div>
    );
}