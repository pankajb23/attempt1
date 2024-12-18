import { Card, Text, BlockStack, Divider, InlineGrid } from "@shopify/polaris";
import ButtonWithColorAndPopup from "../common/ButtonWithColorAndPopup";
import NumberTextField from "../common/NumberTextFieldModal";

export default function CommonStylingModal() {
    return (
        <Card roundedAbove="sm">
            <BlockStack gap="200">
                <Text as="h5" variant="bodyLg" fontWeight="bold">Common styling</Text>
                <Text as="p" variant="bodySm" tone="subdued">This preview section is used to apply styling and how this looks like in web/mobile. </Text>
                <Divider />
                <InlineGrid columns="2" gap="200">
                    <ButtonWithColorAndPopup header="Button Background color" property="btn.bg.color" defaultValue="#000000"/>
                    <ButtonWithColorAndPopup header="Button text color" property="btn.txt.color" defaultValue="#ffffff"/>
                </InlineGrid>
                <InlineGrid columns="2" gap="200">
                    <ButtonWithColorAndPopup header="Button border color" property="btn.brdr.color" defaultValue="#000000"/>
                    <NumberTextField placeholder={"Auto-detect"} heading={"Button border width"} property={"btn.brdr.wdth"} />
                </InlineGrid>
                <InlineGrid columns="2" gap="200">
                    <ButtonWithColorAndPopup header="Text color" property="text.color" defaultValue="#333"/>
                    <ButtonWithColorAndPopup header="Price color" property="price.color" defaultValue="#444"/>
                </InlineGrid>
                <InlineGrid columns="2" gap="200">
                    <ButtonWithColorAndPopup header="Sale price color" property="price.sale.color" defaultValue="#720707ff"/>
                    <ButtonWithColorAndPopup header="Compare-at price color" property="price.compare.color" defaultValue="#777"/>
                </InlineGrid>
                <InlineGrid columns="2" gap="200">
                    <ButtonWithColorAndPopup header="Timer text color" property="text.timer.color" defaultValue="#888"/>
                    <NumberTextField placeholder={"Auto-detect"} heading={"Button radius"} property="btn.radius" />
                </InlineGrid>
            </BlockStack>
        </Card>
    );
}