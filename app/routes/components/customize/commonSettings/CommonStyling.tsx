import { Card, Text, BlockStack, Divider, InlineGrid} from "@shopify/polaris";
import ButtonWithColorAndPopup from "../common/ButtonWithColorAndPopup";
import NumberTextField from "../common/NumberTextFieldModal";

export default function CommonStylingModal() {

    return (
        <Card roundedAbove="sm">
            <BlockStack gap="200">
                <Text as="h5" variant="bodyLg" fontWeight="bold">Common styling</Text>
                <Text as="p" variant="bodySm" tone="subdued">This preview section is used to apply styling or CSS to all widgets. To customize the style specific to a widget, click "Edit widget" of the respective widget in the Customize page.</Text>
                <Divider />
                <InlineGrid columns="2" gap="200">
                    <ButtonWithColorAndPopup header="Background color" property="commonStyling.backgroundColor" />
                    <ButtonWithColorAndPopup header="Button text color" property="commonStyling.buttonTextColor" />
                </InlineGrid>
                <InlineGrid columns="2" gap="200">
                    <ButtonWithColorAndPopup header="Button border color" property="commonStyling.borderColor" />
                    <NumberTextField property={"commonStyling.borderWidth"} placeholder={"Auto-detect"} heading={"Button border width"}/>
                </InlineGrid>
                <InlineGrid columns="2" gap="200">
                    <ButtonWithColorAndPopup header="Text color" property="commonStyling.textColor" />
                    <ButtonWithColorAndPopup header="Price color" property="commonStyling.priceColor" />
                </InlineGrid>
                <InlineGrid columns="2" gap="200">
                    <ButtonWithColorAndPopup header="Sale price color" property="commonStyling.salePriceColor" />
                    <ButtonWithColorAndPopup header="Compare-at price color" property="commonStyling.priceColor" />
                </InlineGrid>
                <InlineGrid columns="2" gap="200">
                    <ButtonWithColorAndPopup header="Timer text color" property="commonStyling.textColor" />
                    <NumberTextField property={"commonStyling.borderradius"} placeholder={"Auto-detect"} heading={"Button radius"}/>
                </InlineGrid>
            </BlockStack>
        </Card>
    );
}