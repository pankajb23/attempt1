import { BlockStack, Card, Text, TextField } from '@shopify/polaris';
import { Controller, useFormContext } from 'react-hook-form';

export default function OtherDetails() {
  const { control, watch } = useFormContext();

  const postPurchaseDiscountOfferPriority = watch('postPurchaseDiscount.offerPriority') ?? undefined;

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="400">
        <Text as="h4" variant="headingSm">
          {' '}
          Other Details{' '}
        </Text>
        <Controller
          control={control}
          name="postPurchaseDiscount.offerPriority"
          defaultValue={postPurchaseDiscountOfferPriority}
          render={({ field: { onChange, value } }) => (
            <TextField
              label={
                <Text as="h4" variant="headingSm">
                  {' '}
                  Offer priority{' '}
                </Text>
              }
              value={value}
              type="number"
              onChange={onChange}
              autoComplete="off"
              placeholder="Optional, Eg: 10"
              helpText={
                <Text as="p" variant="bodySm">
                  {' '}
                  If more than one offer exists for a trigger product, the highest priority offer will be chosen.
                </Text>
              }
            />
          )}
        />
      </BlockStack>
    </Card>
  );
}
