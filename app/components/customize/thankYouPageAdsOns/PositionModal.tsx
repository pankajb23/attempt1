import { BlockStack, Card, Text, Select, Divider, TextField } from "@shopify/polaris";
import { useFormContext, Controller } from "react-hook-form";

function SelectModal({ heading, property, options, cssDefaultValue }) {
    const { watch, control } = useFormContext();
    
    console.log("Options", options);

    const defaultValue = watch(property) ?? options[0].value;
    const cssComponent = watch(`${property}.css`) ?? cssDefaultValue;

    const shouldShowCss = defaultValue !== cssDefaultValue;

    return (<>
        <BlockStack gap="300">
            <Controller
                control={control}
                name={property}
                defaultValue={defaultValue}
                render={({ field: { value, onChange } }) => (
                    <Select
                        label={<Text as="p" variant="bodySm" fontWeight="bold">{heading}</Text>}
                        options={options}
                        onChange={onChange}
                        value={value}
                    />
                )}
            />
            {
                shouldShowCss && (
                    <Controller
                        control={control}
                        name={`${property}.css`}
                        defaultValue={cssComponent}
                        render={({ field: { value, onChange } }) => (
                            <TextField
                                label={<Text as="legend" variant="bodySm">CSS selector of the HTML element.</Text>}
                                onChange={onChange}
                                value={value}
                                autoComplete="off"
                            />
                        )}
                    />
                )
            }
        </BlockStack>
    </>
    );
}

export default function PositionModal() {
    return (
        <Card roundedAbove="sm">
            <BlockStack gap="300">
                <SelectModal
                    heading={"Desktop position"}
                    property={"typ.desktopPosition"}
                    options={[
                        { label: "Below price summary", value: "priceSummary" },
                        { label: "Before a HTML element", value: "htmlElement" },
                        { label: "At the start of HTML element", value: "startHtmlElement" },
                        { label: "At the end of HTML element", value: "endHtmlElement" },
                        { label: "After a HTML element", value: "afterHtmlElement" }
                    ]}
                    cssDefaultValue={".order-summary__section--total-lines"}
                />
                <Divider />
                <SelectModal
                    heading={"Mobile position"}
                    property={"typ.mobilePosition"}
                    options={[
                        { label: "Below a thank you text", value: "belowThankYouText" },
                        { label: "Before a HTML element", value: "htmlElement" },
                        { label: "At the start of HTML element", value: "startHtmlElement" },
                        { label: "At the end of HTML element", value: "endHtmlElement" },
                        { label: "After a HTML element", value: "afterHtmlElement" }
                    ]}
                    cssDefaultValue={".section__content"}
                />
            </BlockStack>
        </Card>
    );
}