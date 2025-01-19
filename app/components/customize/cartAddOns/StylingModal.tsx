import { BlockStack, Card, Text } from '@shopify/polaris';
import ButtonWithColorAndPopup from '../common/ButtonWithColorAndPopup';
import {
  NumberField,
  TitleFontWeight,
} from '../frequentlyBoughtTogether/StylingModal';

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
      <BlockStack gap="300">
        <Text as="h5" variant="bodyMd" fontWeight="bold">
          {' '}
          Styling
        </Text>
        <ButtonWithColorAndPopup
          header={'Background color'}
          property={'stylingModal.bgcolor'}
        />
        <ButtonWithColorAndPopup
          header={'Border color'}
          property={'stylingModal.borderColor'}
        />
        <NumberField
          property={'stylingModal.titleFontSize'}
          heading="Title font size"
        />
        <TitleFontWeight
          property={'stylingModal.titleFontWeight'}
          options={titleFontWeightOptions}
        />
        <ButtonWithColorAndPopup
          header={'Continue button background color'}
          property={'stylingModal.buttonBgColor'}
        />
        <ButtonWithColorAndPopup
          header={'Continue button text color'}
          property={'stylingModal.buttonTextColor'}
        />
        <ButtonWithColorAndPopup
          header={'Continue button border color'}
          property={'stylingModal.buttonBorderColor'}
        />
        <NumberField
          heading="Continue button border width"
          property={'stylingModal.buttonBorderWidth'}
        />
      </BlockStack>
    </Card>
  );
}
