import { BlockStack, Card, Text, Select, Checkbox } from '@shopify/polaris';
import { useFormContext, Controller } from 'react-hook-form';

function LayoutOutStyleSelect() {
  const { watch, control } = useFormContext();

  const defaultValue = watch('layoutOutStyleSelect') ?? 'default';
  const layoutStyleOptions = [
    { label: 'Card list layout', value: 'cardListLayout' },
    { label: 'Card slider layout', value: 'cardSliderLayout' },
    { label: 'Grid layout', value: 'gridLayout' },
    { label: 'Card slider layout', value: 'cardSliderLayout' },
  ];
  return (
    <Controller
      control={control}
      name="layoutOutStyleSelect"
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => (
        <Select
          label={
            <Text as="p" variant="bodySm" fontWeight="bold">
              Layout style
            </Text>
          }
          options={layoutStyleOptions}
          value={value}
          onChange={onChange}
        />
      )}
    />
  );
}

function WidgetButtonType() {
  const { watch, control } = useFormContext();

  const defaultValue = watch('layoutOutStyleSelect') ?? 'default';
  const layoutStyleOptions = [
    { label: 'Add checkbox', value: 'addCheckbox' },
    { label: 'Add checkbox (left side)', value: 'addCheckboxLeft' },
    { label: 'Add button', value: 'addButton' },
    { label: 'Add immediately button', value: 'addImmediatelyButton' },
    { label: 'View button', value: 'viewButton' },
  ];

  return (
    <Controller
      control={control}
      name="layoutOutStyleSelect"
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => (
        <Select
          label={
            <Text as="p" variant="bodySm" fontWeight="bold">
              Widget button type
            </Text>
          }
          options={layoutStyleOptions}
          value={value}
          onChange={onChange}
          helpText={(() => {
            switch (defaultValue) {
              case 'addCheckbox':
                return 'The add-ons will be added when the trigger product is added to cart';
              case 'addButton':
                return 'The add-ons will be added when the add button is clicked';
              case 'addImmediatelyButton':
                return 'The add-ons will be added to cart immediately. Cart refresh will work only for supported themes. Please contact us if you need help with this';
              case 'viewButton':
                return 'The add-ons product page will be opened in a new tab.';
              default:
                return '';
            }
          })()}
        />
      )}
    />
  );
}

function OfferProductClickAction() {
  const { watch, control } = useFormContext();

  const widgetButtonType = watch('widgetButtonType');
  const defaultValue = watch('offerProductClickAction') ?? 'default';

  const layoutStyleOptions = [
    { label: 'Default Pop-up product preview', value: 'popupProductPreview' },
    { label: 'Custom Open product page', value: 'openProductPage' },
    {
      label: 'Custom Open product page in new tab',
      value: 'openProductPageNewTab',
    },
  ];

  const buttonTypes = [
    'addCheckbox',
    'addCheckboxLeft',
    'addButton',
    'addImmediatelyButton',
  ];
  const shouldShowOffProductclickAction =
    buttonTypes.includes(widgetButtonType);

  return (
    <>
      {shouldShowOffProductclickAction && (
        <Controller
          control={control}
          name="offerProductClickAction"
          defaultValue={defaultValue}
          render={({ field: { value, onChange } }) => (
            <Select
              label={
                <Text as="p" variant="bodySm" fontWeight="bold">
                  Offer product click action
                </Text>
              }
              options={layoutStyleOptions}
              value={value}
              onChange={onChange}
              helpText={(() => {
                switch (defaultValue) {
                  case 'addToCart':
                    return 'The add-ons will be added when the trigger product is added to cart';
                  case 'viewProductPage':
                    return 'The add-ons will be added when the add button is clicked';
                  default:
                    return '';
                }
              })()}
            />
          )}
        />
      )}
    </>
  );
}

function ApplyDiscountWhenTriggerProductIsBought() {
  const { watch, control } = useFormContext();

  const defaultValue =
    watch('applyDiscountWhenTriggerProductIsBought') ?? false;
  const widgetButtonType = watch('widgetButtonType');

  const buttonTypes = [
    'addCheckbox',
    'addCheckboxLeft',
    'addButton',
    'addImmediatelyButton',
  ];
  const shouldShowOffProductclickAction =
    buttonTypes.includes(widgetButtonType);

  return (
    <>
      {shouldShowOffProductclickAction && (
        <Controller
          control={control}
          name="applyDiscountWhenTriggerProductIsBought"
          defaultValue={defaultValue}
          render={({ field: { value, onChange } }) => (
            <Checkbox
              label={
                <Text as="p" variant="bodySm" fontWeight="bold">
                  Apply discount when trigger product is also bought
                </Text>
              }
              checked={value}
              onChange={onChange}
            />
          )}
        />
      )}
    </>
  );
}
function DisableWidgetAddOns() {
  const { watch, control } = useFormContext();

  const defaultValue = watch('disableWidgetAddOns') ?? false;

  return (
    <Controller
      control={control}
      name="disableWidgetAddOns"
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => (
        <Checkbox
          label={
            <Text as="p" variant="bodySm" fontWeight="bold">
              Disable widget add-ons
            </Text>
          }
          checked={value}
          onChange={onChange}
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
          Settings
        </Text>
        <LayoutOutStyleSelect />
        <WidgetButtonType />
        <DisableWidgetAddOns />
        <ApplyDiscountWhenTriggerProductIsBought />
      </BlockStack>
    </Card>
  );
}
