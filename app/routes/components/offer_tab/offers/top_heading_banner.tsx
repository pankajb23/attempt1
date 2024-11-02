import { InlineStack, Button, Text } from "@shopify/polaris";
import { ChevronLeftIcon } from "@shopify/polaris-icons";

export default function TopHeadingBanner({ onShowOfferPage, heading }) {
    return (
        <>
            <InlineStack blockAlign="baseline" gap="300">
                <div style={{ marginTop: "1px", padding: "0" }}>
                    <Button icon={ChevronLeftIcon} variant="tertiary" size="medium" onClick={() => onShowOfferPage(null)} />
                </div>
                <Text as="h5" variant="headingLg"> {heading}
                </Text>
            </InlineStack>
        </>
    );
}