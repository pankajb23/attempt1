import { BlockStack, Card, Text, TextField } from '@shopify/polaris';
import { Controller, useFormContext } from 'react-hook-form';
import { type TranslationComponent } from '../../types/CustomizeTypes';

export function Component({ component }: { component: TranslationComponent }) {
  const { watch, control } = useFormContext();
  const propertyValue = watch(component.property) ?? component.defaultValue;

  return (
    <Controller
      control={control}
      name={component.property}
      defaultValue={propertyValue}
      render={({ field: { value, onChange } }) => (
        <TextField
          label={
            <Text as="legend" variant="bodySm" fontWeight="bold">
              {component.heading}
            </Text>
          }
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
      )}
    />
  );
}

export default function TextAndTranslations({
  translationComponents,
}: {
  translationComponents: TranslationComponent[];
}) {
  return (
    <Card roundedAbove="sm">
      <BlockStack gap="300">
        <Text as="p" variant="bodyMd" fontWeight="bold">
          Text and translations
        </Text>
        {translationComponents.map((component, index) => (
          <Component key={index} component={component} />
        ))}
      </BlockStack>
    </Card>
  );
}
