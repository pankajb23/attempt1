import { InlineStack, Button, Text, InlineGrid } from "@shopify/polaris";
import { ChevronLeftIcon } from "@shopify/polaris-icons";

export default function TopHeadingBanner({ onShowOfferPage, heading, saveOfferButton }) {
    return (
        <>
            <InlineStack blockAlign="baseline" gap="300">
                <div style={{ marginTop: "1px", padding: "0" }}>
                    <Button icon={ChevronLeftIcon} variant="tertiary" size="medium" onClick={() => onShowOfferPage(null)} />
                </div>
                <div style={{ width: '96%' }}>
                    <InlineGrid columns="1fr auto">
                        <Text as="h5" variant="headingLg"> {heading}
                        </Text>
                        {saveOfferButton ? <Button variant="primary" >Save Offer</Button> : null}
                        
                    </InlineGrid>
                </div>
            </InlineStack>
        </>
    );
}