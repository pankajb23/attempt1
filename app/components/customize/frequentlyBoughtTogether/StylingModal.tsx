import {
  BlockStack,
  Card,
  Text,
  Select,
  TextField,
  InlineGrid,
  Checkbox,
} from '@shopify/polaris';
import ButtonWithColorAndPopup from '../common/ButtonWithColorAndPopup';
import NumberTextField from '../common/NumberTextFieldModal';
import { useFormContext, Controller } from 'react-hook-form';

export function TitleFontWeight({ property, options }) {
  const { watch, control } = useFormContext();
  const titleFontWeight =
    watch('stylingModal.titleFontWeight') ?? 'Auto-detect';
  return (
    <Controller
      control={control}
      name="stylingModal.titleFontWeight"
      defaultValue={titleFontWeight}
      render={({ field: { value, onChange } }) => (
        <Select
          label={
            <Text as="p" variant="bodySm" fontWeight="bold">
              Title font weight
            </Text>
          }
          value={value}
          onChange={onChange}
          options={options}
        />
      )}
    />
  );
}

export function NumberField({ property, heading }) {
  const { control, watch } = useFormContext();
  const propertyValue = watch(property);
  return (
    <Controller
      control={control}
      name={property}
      defaultValue={propertyValue}
      render={({ field: { value, onChange } }) => (
        <TextField
          type="number"
          value={value}
          placeholder="Auto-detect"
          onChange={onChange}
          label={
            <Text as="p" variant="bodySm">
              {' '}
              {heading}
            </Text>
          }
          autoComplete="off"
        />
      )}
    />
  );
}

export function Padding({ heading, property }) {
  return (
    <BlockStack>
      <Text as="p" variant="bodySm" fontWeight="bold">
        {' '}
        {heading}
      </Text>
      <InlineGrid columns="4" gap="200">
        <NumberField property={`stylingModal.${property}.top`} heading="Top" />
        <NumberField
          property={`stylingModal.${property}.bottom`}
          heading="Bottom"
        />
        <NumberField
          property={`stylingModal.${property}.left`}
          heading="Left"
        />
        <NumberField
          property={`stylingModal.${property}.right`}
          heading="Right"
        />
      </InlineGrid>
    </BlockStack>
  );
}

function FullWidthWidgetCheckbox() {
  const { control, watch } = useFormContext();
  const fullWidthWidget =
    watch('stylingModal.isEnabledFullWidthWidget') ?? false;
  return (
    <Controller
      control={control}
      name="stylingModal.isEnabledFullWidthWidget"
      defaultValue={fullWidthWidget}
      render={({ field: { value, onChange } }) => (
        <Checkbox
          label={
            <Text as="p" variant="bodySm" fontWeight="bold">
              Make widget full width
            </Text>
          }
          checked={value}
          onChange={onChange}
        />
      )}
    />
  );
}
export default function StylingModal() {
  const titleFontWeightOptions = [
    { label: 'Auto-detect', value: 'Auto-detect' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Bold', value: 'Bold' },
    { label: 'Bolder', value: 'Bolder' },
    { label: 'Lighter', value: 'Lighter' },
    { label: '100', value: '100' },
    { label: '200', value: '200' },
    { label: '300', value: '300' },
    { label: '400', value: '400' },
    { label: '500', value: '500' },
    { label: '600', value: '600' },
    { label: '700', value: '700' },
    { label: '800', value: '800' },
    { label: '900', value: '900' },
  ];
  return (
    <Card roundedAbove="sm">
      <BlockStack gap="200">
        <Text as="p" variant="bodySm" fontWeight="bold">
          {' '}
          Styling
        </Text>
        <ButtonWithColorAndPopup
          header={'Background color'}
          property={'stylingModal.bgcolor'}
        />
        <NumberTextField
          property={'stylingModal.titleFontSize'}
          placeholder={'Auto-detect'}
          heading={'Title font size'}
        />
        <TitleFontWeight
          property={'stylingModal.titleFontWeight'}
          options={titleFontWeightOptions}
        />
        <Padding heading="Padding" property="padding" />
        <Padding heading="Margin" property="margin" />
        <FullWidthWidgetCheckbox />
      </BlockStack>
    </Card>
  );
}
