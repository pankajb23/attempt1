import { Card, Text, BlockStack, Divider, InlineGrid, Button, Collapsible } from "@shopify/polaris";
import ButtonWithColorAndPopup from "../common/ButtonWithColorAndPopup";
import NumberTextField from "../common/NumberTextFieldModal";
import { useState, useCallback } from "react";

function ButtonStyling({ open, handleOpen }) {
    return (
        <Card roundedAbove="sm">
            <BlockStack gap="200">
                <Button
                    fullWidth
                    disabled={open === "button"}
                    onClick={() =>
                        handleOpen("button")
                    }
                    ariaExpanded={open}
                    ariaControls="basic-collapsible">
                        Button styling
                        </Button>
                <Collapsible
                    // open={open === "button"}
                    open={true}
                    id="basic-collapsible"
                    transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
                    expandOnPrint
                >
                    <BlockStack gap="300">
                        <Divider />
                        <InlineGrid columns="2" gap="200">
                            <ButtonWithColorAndPopup header="Text ('Add to Cart')" property="component.button.text.color" defaultValue="#000000" />
                            <ButtonWithColorAndPopup header="Background color" property="component.button.background.color" defaultValue="#000000" />
                        </InlineGrid>
                        <InlineGrid columns="2" gap="200">
                            <NumberTextField heading="Length" property="component.button.size.length" placeholder={"Auto-detect"} />
                            <NumberTextField heading="Width" property="component.button.size.width" placeholder={"Auto-detect"} />
                        </InlineGrid>
                        <InlineGrid columns="2" gap="200">
                            <NumberTextField placeholder={"Auto-detect"} heading={"Border radius"} property="component.button.border.radius" />
                            <NumberTextField placeholder={"Auto-detect"} heading={"Border width"} property={"component.button.border.wdth"} />
                        </InlineGrid>
                        <InlineGrid columns="2" gap="200">
                            <ButtonWithColorAndPopup header="Border color" property="component.button.border.color" defaultValue="#000000" />
                        </InlineGrid>
                    </BlockStack>
                </Collapsible>
            </BlockStack>
        </Card>
    );
}

function TextStyling({ open, handleOpen }) {
    console.log("open", open);
    return (
        <Card roundedAbove="sm">
            <BlockStack gap="400">
                <Button
                    fullWidth
                    disabled={open === "text"}
                    onClick={() => handleOpen("text")}
                    ariaExpanded={open}
                    ariaControls="basic-collapsible">Text styling</Button>
                <Collapsible
                    //open={open === "text"}
                    open={true}
                    id="basic-collapsible"
                    transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
                    expandOnPrint
                >
                    <BlockStack gap="300">
                        <Divider borderWidth="100" />
                        <InlineGrid columns="2" gap="200">
                            <ButtonWithColorAndPopup header="Text color" property="component.text.color" defaultValue="#333" />
                            <ButtonWithColorAndPopup header="Price color" property="price.color" defaultValue="#444" />
                        </InlineGrid>
                        <InlineGrid columns="2" gap="200">
                            <ButtonWithColorAndPopup header="Sale price color" property="price.sale.color" defaultValue="#720707ff" />
                            <ButtonWithColorAndPopup header="Compare-at price color" property="price.compare.color" defaultValue="#777" />
                        </InlineGrid>
                    </BlockStack>
                </Collapsible>
            </BlockStack>
        </Card>
    );
}
export default function CommonStylingModal() {
    const [open, setOpen] = useState("button");

    const handleToggle = useCallback((component: string) => {
        console.log("component", component);
        setOpen(component)
    }, []);

    return (
        <BlockStack gap="400">
            <ButtonStyling open={open} handleOpen={handleToggle} />
            <TextStyling open={open} handleOpen={handleToggle} />
        </BlockStack>
    );

}