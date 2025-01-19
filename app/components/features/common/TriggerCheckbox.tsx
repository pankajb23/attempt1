import { ChoiceList, Text, Card, InlineError } from '@shopify/polaris';
import { Controller, useFormContext } from 'react-hook-form';
import SelectTags from '../frequentlyboughttogether/SelectTags';
import SpecificProducts from '../frequentlyboughttogether/SpecificProductsModal';

export default function TriggerCheckbox({ offerType }) {
  const {
    control,
    setValue,
    watch,
    formState: { isSubmitted },
  } = useFormContext();

  setValue('offer.type', offerType);
  const title = (
    <Text as="h6" variant="headingSm" fontWeight="semibold">
      {' '}
      Trigger offers for products/tags{' '}
    </Text>
  );

  const triggerType = watch('trigger.type') ?? 'all_products';
  const selectedProducts = watch('trigger.products') || [];
  const selectedTags = watch('trigger.tags') || [];

  const choiceSuffix = () => {
    switch (triggerType) {
      case 'specific_products':
        return (
          <>
            <SpecificProducts
              selectedProducts={selectedProducts}
              property={'trigger.products'}
              showButton={true}
            />
            {isSubmitted &&
              triggerType === 'specific_products' &&
              selectedProducts.length === 0 && (
                <InlineError
                  message="Please select at least one product"
                  fieldID="trigger-type"
                />
              )}
          </>
        );
      case 'tags':
        return (
          <>
            <SelectTags tags={selectedTags} />
            {isSubmitted &&
              triggerType === 'tags' &&
              selectedTags.length === 0 && (
                <InlineError
                  message="Please select at least one tag"
                  fieldID="trigger-type"
                />
              )}
          </>
        );
      case 'all_products':
        return (
          <>
            {/* @ts-ignore */}
            <Text as="dd" variant="bodySm" tone="subdued">
              {' '}
              The offer will be displayed on product pages.
            </Text>
          </>
        );
    }
  };

  return (
    <>
      <Card>
        <div style={{ paddingBottom: '2px' }}>
          <Controller
            name="trigger.type"
            control={control}
            defaultValue={triggerType}
            render={({ field }) => (
              <ChoiceList
                title={title}
                selected={[field.value]}
                onChange={([selected]) => {
                  field.onChange(selected);
                  if (selected === 'specific_products') {
                    setValue('trigger.tags', []);
                  } else if (selected === 'tags') {
                    setValue('trigger.products', []);
                  }
                }}
                choices={[
                  {
                    label: 'Specific products',
                    value: 'specific_products',
                  },
                  // {
                  //     label: "Tags",
                  //     value: "tags",
                  // },
                  {
                    label: 'All products',
                    value: 'all_products',
                  },
                ]}
              />
            )}
          />
        </div>
        {choiceSuffix()}
      </Card>
    </>
  );
}
