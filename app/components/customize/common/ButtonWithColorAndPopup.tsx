import { useFormContext, Controller } from "react-hook-form";
import { useState, useCallback } from "react";
import ButtonPopup from "../common/ButtonPopup";
import { Button, TextField, Text } from "@shopify/polaris";

export default function ButtonWithColorAndPopup({ header, property, defaultValue }) {
    const { watch, control } = useFormContext();
    const [popoverActive, setPopoverActive] = useState(false);
    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );
    const backgroundColor = watch(property) ?? defaultValue;
    console.log("property,  ", header, property, defaultValue, watch(property));
    const autoDetectColor = backgroundColor 
    const activator = (
        <div style={{
            backgroundColor: backgroundColor, // Add opacity
            opacity: 0.8,
            border: '1px solid #ddd',
            fontWeight: 'bold',
            width: '70px',
            overflow: 'hidden',
        }}>
            <Button variant="tertiary" onClick={() => setPopoverActive(true)} fullWidth={true} >
                {autoDetectColor}
            </Button>
        </div>
    )

    const textHeader = <Text as="p" variant="bodySm" fontWeight="bold">{header}</Text>

    return (
        <Controller
            control={control}
            name={property}
            defaultValue={backgroundColor}
            render={({ field: { value, onChange } }) => (
                <TextField
                    label={textHeader}
                    value={value}
                    autoSize={false}
                    onChange={onChange}
                    autoComplete="off"
                    placeholder="Auto-detect"
                    connectedRight={
                        <ButtonPopup
                            popoverActive={popoverActive}
                            setPopoverActive={setPopoverActive}
                            togglePopoverActive={togglePopoverActive}
                            activator={activator}
                            property={property}
                        />
                    }
                />
            )}
        />);
}