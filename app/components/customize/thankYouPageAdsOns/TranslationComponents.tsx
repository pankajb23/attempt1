import { Card, BlockStack, Text, InlineGrid } from '@shopify/polaris';
import { type TranslationComponent } from '../../types/CustomizeTypes';
import { Component } from '../frequentlyBoughtTogether/TextAndTranslations';
import { TimerBlock } from '../cartAddOns/CartAddOnsPage';

export default function TranslationComponents() {
  const translationComponents: TranslationComponent[] = [
    {
      property: 'upsell.textAndTranslations.widgetTitle',
      heading: 'Widget title',
      defaultValue: 'Select Products',
    },
    {
      property: 'upsell.textAndTranslations.widgetDiscountLabel',
      heading: 'Widget discount label',
      defaultValue: 'Limited time offer! Expires in {{timer}}',
    },
    {
      property: 'upsell.textAndTranslations.productDiscountLabel',
      heading: 'Product discount label',
      defaultValue: '{{discount}} off!',
    },
    {
      property: 'upsell.textAndTranslations.addButtonLabel',
      heading: 'Add button label',
      defaultValue: 'Add',
    },
    {
      property: 'upsell.textAndTranslations.removeButtonLabel',
      heading: 'Remove button label',
      defaultValue: 'Remove',
    },
    {
      property: 'upsell.textAndTranslations.totalLabel',
      heading: 'Total label',
      defaultValue: 'Total',
    },
    {
      property: 'upsell.textAndTranslations.buyNowButtonLabel',
      heading: 'Buy now button label',
      defaultValue: 'Confirm',
    },
  ];

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="300">
        <Text as="p" variant="bodyMd" fontWeight="bold">
          Text and translations
        </Text>
        {translationComponents.map((component, index) => (
          <Component key={index} component={component} />
        ))}
        <InlineGrid columns={2} gap="200">
          <TimerBlock
            property={'thankyoupage.translations.timer.minutes'}
            heading={'Countdown timer'}
            defaultValue={5}
            suffix={'minutes'}
          />
          <TimerBlock
            property={'thankyoupage.translations.timer.seconds'}
            heading={null}
            defaultValue={0}
            suffix={'seconds'}
          />
        </InlineGrid>
        <Text as="p" variant="bodySm">
          The countdown time will be displayed only when there is a discount.
        </Text>
      </BlockStack>
    </Card>
  );
}
