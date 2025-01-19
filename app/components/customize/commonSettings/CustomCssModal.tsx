import { BlockStack, Card, Text, TextField } from '@shopify/polaris';
import { useFormContext, Controller } from 'react-hook-form';

export default function CustomCssModal() {
  const { watch, control } = useFormContext();

  const textFieldValue = watch('customCss');

  const placeholder = `Eg:
.ppcse-tot-btn {
   border: 1px solid #006eff;
   color: #006eff;
   background-color: #fff;
}`;

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="200">
        <Text as="p" variant="bodyLg" fontWeight="bold">
          Custom CSS
        </Text>
        <Text
          as="p"
          variant="bodySm"
          fontWeight="medium"
        >{`Use this section only if you are a developer and know CSS. Enter CSS only, you need not specify '<style></style>' tags. You can also contact our support to customize the styling.`}</Text>
        <Controller
          control={control}
          defaultValue={textFieldValue}
          name="customCss"
          render={({ field: { value, onChange } }) => <TextField label="" value={value} multiline={15} onChange={onChange} autoComplete="off" placeholder={placeholder} />}
        />
      </BlockStack>
    </Card>
  );
}
