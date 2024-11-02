import { Layout, BlockStack } from "@shopify/polaris";
import TopHeadingBanner from "./top_heading_banner";

export default function FrequentlyBoughtTogether({ onShowOfferPage }) {
    return (
        <>
            <Layout.Section>
                <BlockStack>
                    <TopHeadingBanner onShowOfferPage={onShowOfferPage} heading={"Frequently Bought Together"} />
                </BlockStack>
            </Layout.Section>
        </>
    );
}