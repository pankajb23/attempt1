import { BlockStack, Card, Text } from '@shopify/polaris';
import ButtonWithColorAndPopup from '../common/ButtonWithColorAndPopup';
import {
  NumberField,
  TitleFontWeight,
  Padding,
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
          Styling{' '}
        </Text>
        <ButtonWithColorAndPopup
          header={'Widget background color'}
          property={'stylingModal.bgcolor'}
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
          property={'stylingModal.continueButtonbgColor'}
        />
        <ButtonWithColorAndPopup
          header={'Continue button text color'}
          property={'stylingModal.continueButtonTextColor'}
        />
        <ButtonWithColorAndPopup
          header={'Continue button border color'}
          property={'stylingModal.continueButtonBorderColor'}
        />
        <NumberField
          property={'stylingModal.buttonBorderWidth'}
          heading="Continue button border width"
        />
        <Padding heading="Padding" property="padding" />
        <Padding heading="Margin" property="margin" />
      </BlockStack>
    </Card>
  );
}
