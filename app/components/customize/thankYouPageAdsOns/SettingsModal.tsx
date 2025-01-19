import { BlockStack, Card, Text, Select, Checkbox } from '@shopify/polaris';
import { Controller, useFormContext } from 'react-hook-form';

function SelectModal({ property, heading, options }) {
  const { control, watch } = useFormContext();
  console.log('Options ', options);
  const propertyValue = watch(property) ?? options[0].value;

  return (
    <Controller
      control={control}
      name={property}
      defaultValue={propertyValue}
      render={({ field: { value, onChange } }) => (
        <Select
          label={
            <Text as="p" variant="bodySm" fontWeight="bold">
              {heading}
            </Text>
          }
          options={options}
          value={value}
          onChange={onChange}
        />
      )}
    />
  );
}

function CheckboxModal({ property, heading, helpText, dependsOn }) {
  const { control, watch } = useFormContext();

  const propertyValue = watch(property) ?? false;
  const dependsOnValue =
    dependsOn !== null ? (watch(dependsOn) ?? false) : false;

  return (
    <Controller
      control={control}
      name={property}
      defaultValue={propertyValue}
      render={({ field: { value, onChange } }) => (
        <Checkbox
          label={
            <Text as="p" variant="bodySm" fontWeight="bold">
              {heading}
            </Text>
          }
          checked={value}
          disabled={dependsOnValue}
          onChange={onChange}
          helpText={helpText}
        />
      )}
    />
  );
}

export default function SettingsModal() {
  return (
    <Card roundedAbove="sm">
      <BlockStack gap="300">
        <Text as="p" variant="bodySm" fontWeight="bold">
          {' '}
          Settings
        </Text>
        <SelectModal
          property={'offerProductClickAction'}
          heading={'Offer product click action'}
          options={[
            { label: 'Pop-up product preview', value: 'productPreviewPopup' },
            {
              label: 'Open product page in new tab',
              value: 'productPageNewTab',
            },
          ]}
        />
        <SelectModal
          property={'offerProductClickAction'}
          heading={'Buy button click action'}
          options={[
            {
              label: 'Create a new order in same tab',
              value: 'productPageSameTab',
            },
            {
              label: 'Create a new order in new tab',
              value: 'productPageNewTab',
            },
          ]}
        />
        <CheckboxModal
          property={'addingMultipleVariants'}
          heading={'Allow adding multiple variants'}
          helpText={
            'If enabled multiple variants of the same product can be added to cart.'
          }
          dependsOn={null}
        />
        <CheckboxModal
          property={'hideQuantityPicker'}
          heading={'Hide quantity picker'}
          helpText={'If enabled quantity picker will not be shown.'}
          dependsOn={'addingMultipleVariants'}
        />
        <CheckboxModal
          property={'applyFreeShipping'}
          heading={'Apply free shipping for orders'}
          helpText={'Set free shipping for thank you page add-ons order.'}
          dependsOn={null}
        />
        <CheckboxModal
          property={'disableThankYouPageAddOnsWidget'}
          heading={'Disable Thank you page add-ons widget'}
          helpText={null}
          dependsOn={null}
        />
      </BlockStack>
    </Card>
  );
}
