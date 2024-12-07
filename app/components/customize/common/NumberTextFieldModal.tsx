import { useFormContext, Controller } from "react-hook-form";
import { TextField, Text } from "@shopify/polaris";

export default function NumberTextField({property, placeholder, heading}) {
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
                    onChange={onChange}
                    label={<Text as="p" variant="bodySm" fontWeight="bold"> {heading}</Text>}
                    autoComplete="off"
                />
            )}
        />
    );
}
