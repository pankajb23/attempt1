import { BlockStack, Text, Checkbox, ChoiceList, InlineStack, TextField, Select, Card } from "@shopify/polaris";

// let go of saving data in this iteration
// it's already getting complex to manage states at this point. 
// atm this moment looking to manage UI. 
export default function DiscountModal({ isEnabledDiscountTicked, handleCheckedBoxChange, selectedChoice, handleSelectedChoice }) {
    const label = (
        <>
            <Text variant="bodyMd" fontWeight="bold" as="h3">
                Enable discount
            </Text>
            <Text variant="bodySm" as="p"> Bundle discount for product page upsell.</Text>
        </>
    );

    const discountTypeHeading = (
        <>
            <Text variant="bodyMd" fontWeight="bold" as="h3">
                Discount type
            </Text>
        </>
    )

    const value = "5";
    const discountedText = (
        <Text as="p" variant="bodySm" fontWeight="bold">Discount text</Text>
    )
    const discountDetails = (() => {
        switch (selectedChoice[0]) {
            case 'percent_or_fixed_value':
                const discountedValueLabel = (
                    <Text as="p" variant="bodySm" fontWeight="bold">
                        Discount value
                    </Text>
                )
                return (
                    <>
                        <BlockStack gap="600">
                            <TextField
                                label={discountedValueLabel}
                                type="number"
                                value={value}
                                onChange={() => { }}
                                autoComplete="off"
                                placeholder="Optional, Eg. Buy this bundle and get {{discount}} off."
                                connectedRight={
                                    <Select
                                        value={"%"}
                                        label="Weight unit"
                                        onChange={() => { }}
                                        labelHidden
                                        options={["%", "Inr"]}
                                    />
                                }
                            />
                            <TextField
                                label={discountedText}
                                value={value}
                                onChange={() => { }}
                                autoComplete="off"
                            />
                            <div>
                                <Text variant="bodyMd" fontWeight="bold" as="h3">
                                    Discount combinations
                                </Text>
                                <Text variant="bodyMd" as="p">
                                    This product discount can be combined with
                                </Text>
                                <div style={{marginTop:'10px'}}>
                                    <BlockStack>
                                        <Checkbox label="Other product discounts"
                                            checked={true}
                                            onChange={() => { }} />
                                        <Checkbox label="Shipping discounts"
                                            checked={true}
                                            onChange={() => { }} />
                                        <Checkbox label="Order discounts"
                                            checked={true}
                                            onChange={() => { }} />
                                    </BlockStack>
                                </div>
                            </div>
                        </BlockStack>
                    </>);
            case "cheapest_item_free":
                return (
                    <>
                        <BlockStack gap="600">
                            <TextField
                                label={discountedText}
                                value={value}
                                onChange={() => { }}
                                autoComplete="off"
                                placeholder="Optional, Eg. Buy this bundle and get {{free_product}} for free."
                            />
                            <div>
                                <Text variant="bodyMd" fontWeight="bold" as="h3">
                                    Discount combinations
                                </Text>
                                <Text variant="bodyMd" as="p">
                                    This product discount can be combined with
                                </Text>
                                <div style={{marginTop:'10px'}}>
                                    <BlockStack>
                                        <Checkbox label="Other product discounts"
                                            checked={true}
                                            onChange={() => { }} />
                                        <Checkbox label="Shipping discounts"
                                            checked={true}
                                            onChange={() => { }} />
                                        <Checkbox label="Order discounts"
                                            checked={true}
                                            onChange={() => { }} />
                                    </BlockStack>
                                </div>
                            </div>
                        </BlockStack>
                    </>
                );
            case "free_shipping":
                (
                    <>
                        <BlockStack gap="600">
                            <TextField
                                label={discountedText}
                                value={value}
                                onChange={() => { }}
                                autoComplete="off"
                                placeholder="Get free shipping for your order"
                            />
                            <div>
                                <Text variant="bodyMd" fontWeight="bold" as="h3">
                                    Discount combinations
                                </Text>
                                <Text variant="bodyMd" as="p">
                                    This product discount can be combined with
                                </Text>
                                <div style={{marginTop:'10px'}}>
                                    <BlockStack>
                                        <Checkbox label="Other product discounts"
                                            checked={true}
                                            onChange={() => { }} />
                                        <Checkbox label="Shipping discounts"
                                            checked={true}
                                            onChange={() => { }} />
                                        <Checkbox label="Order discounts"
                                            checked={true}
                                            onChange={() => { }} />
                                    </BlockStack>
                                </div>
                            </div>
                        </BlockStack>
                    </>
                );
        }
    }

    )
    return (
        <div>
            <Card>
                <BlockStack gap='400'>
                    <Text as='p' variant="bodySm" fontWeight="bold"> Discounts</Text>
                    <Checkbox
                        label={label}
                        checked={isEnabledDiscountTicked}
                        onChange={handleCheckedBoxChange}
                    />
                    {
                        isEnabledDiscountTicked ? (
                            <ChoiceList
                                title={discountTypeHeading}
                                choices={[
                                    { label: 'Percentage or Fixed value', value: 'percent_or_fixed_value' },
                                    { label: 'Cheapest item free', value: 'cheapest_item_free' },
                                    { label: 'Free shipping', value: 'free_shipping' },
                                ]}
                                selected={selectedChoice}
                                onChange={handleSelectedChoice}
                            />) : null
                    }
                    {discountDetails()}
                </BlockStack>
            </Card>
        </div>
    );
}