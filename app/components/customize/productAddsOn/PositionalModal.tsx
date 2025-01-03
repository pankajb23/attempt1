import { BlockStack, Card, Text, Select, Divider } from "@shopify/polaris"
import { useFormContext, Controller } from "react-hook-form";

enum DesktopPoistion {
    AboveProductFormCartButton = "AboveProductFormCartButton",
    BeforeHtml = "BeforeHtml",
    StartOfHtmlElement = "StartOfHtmlElement",
    EndOfHtmlElement = "EndOfHtmlElement",
    AfterHtml = "AfterHtml",
}

export default function PositionModal() {
    const { watch, control } = useFormContext();

    const desktopPosition = watch("position.desktop") ?? DesktopPoistion.AboveProductFormCartButton;
    const mobilePosition = watch("position.mobile") ?? DesktopPoistion.AboveProductFormCartButton;

    const desktopPositionOptions = [
        { label: "Above product form add to cart button", value: DesktopPoistion.AboveProductFormCartButton },
        { label: "Before HTML", value: DesktopPoistion.BeforeHtml },
        { label: "Start of HTML element", value: DesktopPoistion.StartOfHtmlElement },
        { label: "End of HTML element", value: DesktopPoistion.EndOfHtmlElement },
        { label: "After HTML", value: DesktopPoistion.AfterHtml },
    ];

    return (
        <Card>
            <BlockStack gap="400">
                <Text as="h6" variant="bodySm" fontWeight="bold">Position</Text>
                <Controller
                    control={control}
                    name="position.desktop"
                    defaultValue={desktopPosition}
                    render={({ field: { value, onChange } }) => (
                        <Select
                            label={<Text as="p" variant="bodySm" fontWeight="bold">Desktop position</Text>}
                            options={desktopPositionOptions}
                            onChange={onChange}
                            value={value}
                        />
                    )}
                />
                <Divider />
                <Controller
                    control={control}
                    name="position.mobile"
                    defaultValue={mobilePosition}
                    render={({ field: { value, onChange } }) => (
                        <Select
                            label={<Text as="p" variant="bodySm" fontWeight="bold">Mobile position</Text>}
                            options={desktopPositionOptions}
                            onChange={onChange}
                            value={value}
                        />
                    )}
                />
            </BlockStack>
        </Card>
    )
}