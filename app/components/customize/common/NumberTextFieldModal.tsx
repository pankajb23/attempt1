import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Text } from '@shopify/polaris';

export default function NumberTextField({
  property,
  placeholder,
  heading,
  defaultValue = null,
  min = 0,
}) {
  const { control, watch } = useFormContext();
  const propertyValue = watch(property) ?? defaultValue;
  return (
    <Controller
      control={control}
      name={property}
      defaultValue={propertyValue}
      render={({ field: { value, onChange } }) => (
        <TextField
          type="number"
          value={value}
          min={min}
          onChange={onChange}
          placeholder={placeholder}
          label={
            <Text as="p" variant="bodySm" fontWeight="bold">
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
