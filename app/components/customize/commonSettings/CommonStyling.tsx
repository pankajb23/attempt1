import { Card, Text, BlockStack, InlineGrid, Divider, Button, Collapsible, Tooltip } from "@shopify/polaris";
import ButtonWithColorAndPopup from "../common/ButtonWithColorAndPopup";
import NumberTextField from "../common/NumberTextFieldModal";
import { useState, useCallback } from "react";
import * as CommonConfigsName from "./CommonConfigsName";
import FontFamilySelect from "./FontFamilySelect";
import { Divider as DividerMui, Chip } from '@mui/material';
// import Divider  from "@mui/material/Divider";
function ButtonStyling({ open, handleOpen }) {
    return (
        <Card roundedAbove="sm">
            <BlockStack gap="200">
                <Button
                    fullWidth
                    disabled={open === "button"}
                    onClick={() => handleOpen("button")}
                    ariaExpanded={open}
                    ariaControls="basic-collapsible">
                    Button styling
                </Button>
                <Collapsible
                    open={open === "button"}
                    id="basic-collapsible"
                    transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
                    expandOnPrint
                >
                    <BlockStack gap="300">
                        <Divider />
                        <InlineGrid columns="2" gap="200">
                            <ButtonWithColorAndPopup header="Text ('Add to Cart')" property={CommonConfigsName.ButtonTextColor} defaultValue="#ffffff" />
                            <FontFamilySelect heading="Text family" property={CommonConfigsName.ButtonTextFamily} />
                        </InlineGrid>

                        <Divider />
                        <InlineGrid columns="2" gap="200">
                            <NumberTextField placeholder={"Auto-detect"} heading={"Border radius"} property={CommonConfigsName.ButtonBorderRadius} defaultValue={10} />
                            <NumberTextField placeholder={"Auto-detect"} heading={"Border width"} property={CommonConfigsName.ButtonBorderWidth} defaultValue={4} />
                        </InlineGrid>

                        <Divider />
                        <InlineGrid columns="2" gap="200">
                            <ButtonWithColorAndPopup header="Border color" property={CommonConfigsName.ButtonBorderColor} defaultValue="#d37594ff" />
                            <ButtonWithColorAndPopup header="Background color" property={CommonConfigsName.ButtonBackgroundColor} defaultValue="#0b8498ff" />
                        </InlineGrid>
                    </BlockStack>
                </Collapsible>
            </BlockStack>
        </Card>
    );
}

function CanvasStyling({ open, handleOpen }) {
    const componentName = "canvas";
    return (
        <Card roundedAbove="sm">
            <BlockStack gap="400">
                <Button
                    fullWidth
                    disabled={open === componentName}
                    onClick={() => handleOpen(componentName)}
                    ariaExpanded={open}
                    ariaControls="basic-collapsible">Canvas styling</Button>
                <Collapsible
                    open={open === componentName}
                    id="basic-collapsible"
                    transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
                    expandOnPrint
                >
                    <BlockStack gap="300">
                        <Divider />
                        <InlineGrid columns="4" gap="200">
                            <NumberTextField placeholder={"Auto"} heading={"Left margin"} property={CommonConfigsName.CanvasLeftMargin} defaultValue={0} />
                            <NumberTextField placeholder={"Auto"} heading={"Right margin"} property={CommonConfigsName.CanvasRightMargin} defaultValue={0} />
                            <NumberTextField placeholder={"Auto"} heading={"Top margin"} property={CommonConfigsName.CanvasTopMargin} defaultValue={0} />
                            <NumberTextField placeholder={"Auto"} heading={"Bottom margin"} property={CommonConfigsName.CanvasBottomMargin} defaultValue={0} />
                        </InlineGrid>
                        <Divider />
                        <InlineGrid columns="4" gap="200">
                            <NumberTextField placeholder={"Auto"} heading={"Left padding"} property={CommonConfigsName.CanvasLeftPadding} defaultValue={10} />
                            <NumberTextField placeholder={"Auto"} heading={"Right padding"} property={CommonConfigsName.CanvasRightPadding} />
                            <NumberTextField placeholder={"Auto"} heading={"Top padding"} property={CommonConfigsName.CanvasTopPadding} defaultValue={10} />
                            <NumberTextField placeholder={"Auto"} heading={"Bottom padding"} property={CommonConfigsName.CanvasBottomPadding} defaultValue={10} />
                        </InlineGrid>
                        <Divider />
                        <InlineGrid columns="4" gap="200">
                            <ButtonWithColorAndPopup header="Background color" property={CommonConfigsName.CanvasBackgroundColor} defaultValue="#ffffff" />
                            <ButtonWithColorAndPopup header="Border color" property={CommonConfigsName.CanvasBorderColor} defaultValue="#333333" />
                            <NumberTextField placeholder={"Auto"} heading={"Border radius"} property={CommonConfigsName.CanvasBorderRadius} defaultValue={10} />
                            <NumberTextField placeholder={"Auto"} heading={"Border width"} property={CommonConfigsName.CanvasBorderWidth} defaultValue={4} />
                        </InlineGrid>
                        <Divider />
                        <InlineGrid columns="4" gap="200">
                            <NumberTextField placeholder={"Auto"} heading={"Text size"} property={CommonConfigsName.CanvasTextSize} defaultValue={18} />
                            <ButtonWithColorAndPopup header="Text color" property={CommonConfigsName.CanvasTextColor} defaultValue="#000000" />
                            {/* <ButtonWithColorAndPopup header="Text weight" property={CommonConfigsName.CanvasTextWeight} defaultValue="#333" /> */}
                            <FontFamilySelect heading="Text family" property={CommonConfigsName.CanvasTextFamily} />
                        </InlineGrid>
                    </BlockStack>
                </Collapsible>
            </BlockStack>
        </Card>
    );
}

function TotalPriceStyling({ open, handleOpen }) {
    const componentName = "totalPrice";
    return (
        <Card roundedAbove="sm">
            <BlockStack gap="400">
                <Button
                    fullWidth
                    disabled={open === componentName}
                    onClick={() => handleOpen(componentName)}
                    ariaExpanded={open}
                    ariaControls="basic-collapsible">Price - styling</Button>
                <Collapsible
                    open={open === componentName}
                    id="basic-collapsible"
                    transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
                    expandOnPrint
                >
                    <BlockStack gap="200">
                        <InlineGrid columns="3" gap="200" >
                            <ButtonWithColorAndPopup header="Total price text color" property={CommonConfigsName.TotalPriceTextColor} defaultValue="#fb0101ff" />
                            <ButtonWithColorAndPopup header="Crossed out price text color" property={CommonConfigsName.TotalPriceCrossedOutTextColor} defaultValue="#333" />
                            <ButtonWithColorAndPopup header="Component price text color" property={CommonConfigsName.TotalPriceComponentTextColor} defaultValue="#333" />
                        </InlineGrid>
                    </BlockStack>
                </Collapsible>
            </BlockStack>
        </Card>
    );
}

export default function CommonStylingModal() {
    const [open, setOpen] = useState("canvas");

    const handleToggle = useCallback((component: string) => {
        console.log("component", component);
        setOpen(component)
    }, []);

    return (
        <BlockStack gap="400">
            <CanvasStyling open={open} handleOpen={handleToggle} />
            <ButtonStyling open={open} handleOpen={handleToggle} />
            <TotalPriceStyling open={open} handleOpen={handleToggle} />
        </BlockStack>
    );

}