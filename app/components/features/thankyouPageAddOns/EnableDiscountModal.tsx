import { Controller, useFormContext } from "react-hook-form";
import { BlockStack, Card, Checkbox, Text, TextField, Select } from "@shopify/polaris";


export default function EnableDiscountModal() {
    const { watch, control } = useFormContext();

    const shouldEnableDiscount = watch('enableDiscount') ?? false;

    const discountedUnit = watch('discountState.discountUnit') ?? "%";
    const discountValue = watch('discountState.discountValue');

    return (
        <Card roundedAbove="sm">
            <BlockStack gap="400">
                <Controller
                    control={control}
                    name="enableDiscount"
                    defaultValue={shouldEnableDiscount}
                    render={({ field: { onChange, value } }) => (
                        <Checkbox
                            label={<Text as="h4" variant="headingSm"> Enable discount </Text>}
                            checked={value}
                            onChange={onChange}
                            helpText="Discount for thank you page upsell"
                        />
                    )}
                />
                {
                    shouldEnableDiscount && (
                        <>
                            <Text as="p" variant="headingSm">Discount type : Percentage or Fixed value</Text>
                            <Controller
                                control={control}
                                name="discountType"
                                defaultValue={discountValue}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label={<Text as="p" variant="bodySm" fontWeight="bold">Discount value</Text>}
                                        value={value}
                                        type="number"
                                        onChange={onChange}
                                        autoComplete="off"
                                        placeholder="0"
                                        connectedRight={
                                            <Controller
                                                control={control}
                                                name="discountState.discountUnit"
                                                defaultValue={discountedUnit}
                                                render={({ field: { onChange, value } }) =>
                                                (<Select
                                                    value={value}
                                                    label="Weight unit"
                                                    onChange={onChange}
                                                    labelHidden
                                                    options={["%", "Inr"]}
                                                />
                                                )}
                                            />
                                        }
                                    />)}
                            />
                        </>
                    )
                }
            </BlockStack>
        </Card>
    );
}