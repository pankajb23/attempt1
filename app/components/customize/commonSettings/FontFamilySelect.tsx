import { useFormContext, Controller } from "react-hook-form";
import { Select } from "@shopify/polaris";
import { Text } from "@shopify/polaris";

const fontFamilyOptions = [
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
    { label: "Roboto", value: "Roboto, sans-serif" },
    { label: "Open Sans", value: "'Open Sans', sans-serif" },
    { label: "System UI", value: "system-ui, -apple-system, sans-serif" }
  ];

  
export default function FontFamilySelect({property, heading = "Font family"}) {
    const { control, watch } = useFormContext();
    const propertyValue = watch(property);
    return (
        <Controller
            control={control}
            name={property}
            defaultValue={propertyValue}
            render={({ field: { value, onChange } }) => (
                <Select
                    label={<Text as="p" variant="bodySm" fontWeight="bold"> {heading}</Text>}
                    options={fontFamilyOptions}
                    onChange={onChange}
                    value={value}
                />
            )}
        />
    )
}