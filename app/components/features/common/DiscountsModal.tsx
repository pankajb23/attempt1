import { BlockStack, Text, Checkbox, ChoiceList, TextField, Select, Card } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { useStoreContext } from 'app/lib/context/StoreContext';

const AllCheckbox = ({ mapp = new Map(), skip = new Set() }) => {
  const { t } = useTranslation();
  const { control, watch } = useFormContext();

  const productDiscountValue = watch('config.discountCombination.productDiscounts') ?? false;
  const shippingDiscountValue = watch('config.discountCombination.shippingDiscounts') ?? false;
  const orderDiscountValue = watch('config.discountCombination.orderDiscounts') ?? false;

  return (
    <div>
      <Text variant="bodyMd" fontWeight="bold" as="h3">
        {t('pages.frequently_bought_together.discount.combination')}
      </Text>
      <Text variant="bodyMd" as="p">
        {t('pages.frequently_bought_together.discount.combined')}
      </Text>
      <div style={{ marginTop: '10px' }}>
        <BlockStack>
          {!skip.has('other-product-discounts') && (
            <Controller
              name="discountState.discountCombination.productDiscounts"
              control={control}
              defaultValue={productDiscountValue}
              render={({ field: { onChange, value } }) => <Checkbox label="Other product discounts" checked={value} onChange={onChange} />}
            />
          )}
          {!skip.has('shipping-discounts') && (
            <Controller
              name="discountState.discountCombination.shippingDiscounts"
              control={control}
              defaultValue={shippingDiscountValue}
              render={({ field: { onChange, value } }) => <Checkbox label="Shipping discounts" checked={value} onChange={onChange} />}
            />
          )}
          {!skip.has('order-discounts') && (
            <Controller
              name="discountState.discountCombination.orderDiscounts"
              control={control}
              defaultValue={orderDiscountValue}
              render={({ field: { onChange, value } }) => <Checkbox label="Order discounts" checked={value} onChange={onChange} />}
            />
          )}
        </BlockStack>
      </div>
    </div>
  );
};

const DiscountDetails = ({ discountedChoice, discountTextPlaceHolder, shouldHaveMinimumCartValueTextField }) => {
  const { t } = useTranslation();
  const { control, watch } = useFormContext();

  const { modalsAndStoreId } = useStoreContext();
  const discountOptions = ['%', modalsAndStoreId.currencySymbol];

  const discountedText = (
    <Text as="p" variant="bodySm" fontWeight="bold">
      {t('pages.discount.enable.discount.text')}
    </Text>
  );

  const { isEnabled, name } = (() => {
    switch (discountedChoice) {
      case 'percentOrFixed':
        return {
          isEnabled: true,
          name: 'discountState.discountText',
        };
      case 'cheapestItemFree':
        return {
          isEnabled: false,
          name: 'discountState.discountText',
        };
      case 'freeShipping':
        return {
          isEnabled: false,
          name: 'discountState.discountText',
        };
      default:
        return null;
    }
  })();

  const discountedTextvalue = watch(name);
  const discountedUnit = watch('discountState.discountUnit') ?? '%';

  return (
    <>
      <BlockStack gap="600">
        {isEnabled && (
          <Controller
            control={control}
            name="discountState.discountValue"
            render={({ field: { onChange, value } }) => (
              <TextField
                label={
                  <Text as="p" variant="bodySm" fontWeight="bold">
                    {t('pages.frequently_bought_together.checkbox.percentOrFixed.label')}
                  </Text>
                }
                type="number"
                value={value}
                onChange={onChange}
                autoComplete="off"
                placeholder="Discount value"
                connectedRight={
                  <Controller
                    control={control}
                    name="discountState.discountUnit"
                    defaultValue={discountedUnit}
                    render={({ field: { onChange, value } }) => <Select value={value} label="Weight unit" onChange={onChange} labelHidden options={discountOptions} />}
                  />
                }
              />
            )}
          />
        )}
        {shouldHaveMinimumCartValueTextField && (
          <Controller
            control={control}
            name="discountState.minCartValue"
            render={({ field: { onChange, value } }) => (
              <TextField
                label={
                  <Text as="h1" variant="bodySm" fontWeight="bold">
                    Minimum cart value for discount to apply
                  </Text>
                }
                type="number"
                value={value}
                onChange={onChange}
                autoComplete="off"
                placeholder="0"
                suffix="Rs."
              />
            )}
          />
        )}
        {!shouldHaveMinimumCartValueTextField && (
          <Controller
            name={name}
            control={control}
            defaultValue={discountedTextvalue}
            render={({ field: { onChange, value } }) => (
              <TextField label={discountedText} value={value || ''} placeholder={discountTextPlaceHolder} onChange={onChange} autoComplete="off" />
            )}
          />
        )}
        <AllCheckbox />
      </BlockStack>
    </>
  );
};

export default function DiscountModal({ checkboxHelpText, choices, discountTextPlaceholder, shouldHaveMinimumCartValueTextField = false }) {
  const { t } = useTranslation();
  const { control, watch } = useFormContext();

  const isEnableDiscountSelected = watch('discountState.isEnabled') ?? false;
  const discountedChoice = watch('discountState.selectedType') ?? 'percentOrFixed';

  return (
    <div>
      <Card>
        <BlockStack gap="400">
          <Controller
            name="discountState.isEnabled"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Checkbox
                label={
                  <Text variant="bodyMd" fontWeight="bold" as="h3">
                    {t('pages.discount.enable.heading')}
                  </Text>
                }
                checked={value}
                onChange={onChange}
                ref={ref}
                helpText={
                  <Text variant="bodySm" as="p">
                    {checkboxHelpText}
                  </Text>
                }
              />
            )}
          />
          {isEnableDiscountSelected && (
            <Controller
              name="discountState.selectedType"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ChoiceList
                  title={
                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                      {t('pages.discount.enable.discount.heading')}
                    </Text>
                  }
                  choices={choices}
                  selected={[value]}
                  onChange={(selected) => onChange(selected[0])}
                />
              )}
            />
          )}
          {isEnableDiscountSelected && (
            <DiscountDetails
              discountedChoice={discountedChoice}
              discountTextPlaceHolder={discountTextPlaceholder}
              shouldHaveMinimumCartValueTextField={shouldHaveMinimumCartValueTextField}
            />
          )}
        </BlockStack>
      </Card>
    </div>
  );
}
