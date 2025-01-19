import {
  BlockStack,
  Card,
  Text,
  Checkbox,
  ChoiceList,
  TextField,
  Select,
} from '@shopify/polaris';
import { useFormContext, Controller } from 'react-hook-form';

export default function UpsellFunnelDiscount() {
  const { watch, control } = useFormContext();
  const isEnabled = watch('upsellFunnelDiscount.isEnabled') ?? false;
  const discountType =
    watch('upsellFunnelDiscount.discountType') ?? 'percentageOrFixedValue';
  const discountValue = watch('upsellFunnelDiscount.discountValue');
  const discountUnit = watch('upsellFunnelDiscount.discountUnit') ?? '%';
  const minCartValue = watch('upsellFunnelDiscount.minCartValue');
  const isSelectedOtherProductDiscount =
    watch('upsellFunnelDiscount.discountCombinations.otherProductDiscount') ??
    false;
  const isSelectedShippingDiscount =
    watch('upsellFunnelDiscount.discountCombinations.shippingDiscount') ??
    false;
  const isSelectedOtherDiscount =
    watch('upsellFunnelDiscount.discountCombinations.otherDiscount') ?? false;

  // console.log("discountType", discountType)
  return (
    <Card roundedAbove="sm">
      <BlockStack gap="400">
        <Text as="h4" variant="headingSm">
          Upsell funnel discount
        </Text>
        <Controller
          control={control}
          name="upsellFunnelDiscount.isEnabled"
          defaultValue={isEnabled}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              label={
                <Text as="h4" variant="headingSm">
                  Enable discount
                </Text>
              }
              checked={value}
              onChange={onChange}
            />
          )}
        />
        {isEnabled && (
          <Controller
            control={control}
            name="upsellFunnelDiscount.discountType"
            defaultValue={discountType}
            render={({ field: { onChange, value } }) => (
              <ChoiceList
                title={
                  <Text as="h4" variant="headingSm">
                    Discount type
                  </Text>
                }
                choices={[
                  {
                    label: 'Percentage of Fixed value',
                    value: 'percentageOrFixedValue',
                  },
                  { label: 'Fixed shipping', value: 'freeShipping' },
                ]}
                selected={[value]}
                onChange={(selected) => onChange(selected[0])}
              />
            )}
          />
        )}

        {isEnabled && discountType === 'percentageOrFixedValue' && (
          <Controller
            name="upsellFunnelDiscount.discountValue"
            control={control}
            defaultValue={discountValue}
            render={({ field: { onChange, value } }) => (
              <TextField
                label={
                  <Text as="p" variant="bodySm" fontWeight="bold">
                    Discount value
                  </Text>
                }
                value={value}
                type="number"
                onChange={onChange}
                autoComplete="off"
                placeholder="0"
                helpText="This discount will be applied across all upsells added."
                connectedRight={
                  <Controller
                    name="upsellFunnelDiscount.discountUnit"
                    control={control}
                    defaultValue={discountUnit}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value}
                        label="Weight unit"
                        onChange={onChange}
                        labelHidden
                        options={['%', 'Inr']}
                      />
                    )}
                  />
                }
              />
            )}
          />
        )}
        {isEnabled && (
          <Controller
            name="upsellFunnelDiscount.minCartValue"
            control={control}
            defaultValue={minCartValue}
            render={({ field: { onChange, value } }) => (
              <TextField
                label={
                  <Text as="p" variant="bodySm" fontWeight="bold">
                    Minimum cart value for discount to apply
                  </Text>
                }
                value={value}
                type="number"
                onChange={onChange}
                autoComplete="off"
                placeholder="0"
                suffix="Rs."
              />
            )}
          />
        )}
        {isEnabled && (
          <BlockStack gap="200">
            <Text as="h4" variant="headingSm">
              Discount combinations
            </Text>
            {discountType === 'percentageOrFixedValue' && (
              <Text as="p" variant="bodySm">
                This product discount can be combined with
              </Text>
            )}
            {discountType === 'freeShipping' && (
              <Text as="p" variant="bodySm">
                This shipping discount can be combined with
              </Text>
            )}
          </BlockStack>
        )}
        <BlockStack>
          {isEnabled && (
            <>
              {
                <Controller
                  name="upsellFunnelDiscount.discountCombinations.otherProductDiscount"
                  control={control}
                  defaultValue={isSelectedOtherProductDiscount}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      label="Other product discount"
                      checked={value}
                      onChange={onChange}
                    />
                  )}
                />
              }
              {discountType === 'percentageOrFixedValue' && (
                <Controller
                  name="upsellFunnelDiscount.discountCombinations.shippingDiscount"
                  control={control}
                  defaultValue={isSelectedShippingDiscount}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      label="Shipping discount"
                      checked={value}
                      onChange={onChange}
                    />
                  )}
                />
              )}
              {
                <Controller
                  name="upsellFunnelDiscount.discountCombinations.otherDiscount"
                  control={control}
                  defaultValue={isSelectedOtherDiscount}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      label="Other discount"
                      checked={value}
                      onChange={onChange}
                    />
                  )}
                />
              }
            </>
          )}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
