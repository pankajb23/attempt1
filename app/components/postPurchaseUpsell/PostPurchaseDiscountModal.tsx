import { BlockStack, Card, Checkbox, Text } from '@shopify/polaris';
import { Controller, useFormContext } from 'react-hook-form';

export default function PostPurchaseDiscountModal() {
  const { control, watch } = useFormContext();

  const postPurchaseDiscount = watch('postPurchaseDiscount.isEnabled') ?? false;
  return (
    <Card roundedAbove="sm">
      <BlockStack gap="400">
        <Text as="h4" variant="headingSm">
          {' '}
          Post-purchase discount{' '}
        </Text>
        <Controller
          control={control}
          name="postPurchaseDiscount.isEnabled"
          defaultValue={postPurchaseDiscount}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              label="Enable discount"
              checked={value}
              onChange={onChange}
              helpText={
                <Text as="p" variant="bodySm">
                  {' '}
                  Item level discount for checkout page upsell.{' '}
                </Text>
              }
            />
          )}
        />
      </BlockStack>
    </Card>
  );
}
