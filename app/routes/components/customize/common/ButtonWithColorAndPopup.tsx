import { useFormContext, Controller } from "react-hook-form";
import { useState, useCallback } from "react";
import ButtonPopup from "../common/ButtonPopup";
import { Button, TextField, Text } from "@shopify/polaris";

export default function ButtonWithColorAndPopup({ header, property }) {
    const { watch, control } = useFormContext();
    const [popoverActive, setPopoverActive] = useState(false);
    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );
    const backgroundColor = watch(property) ?? undefined;
    const autoDetectColor = backgroundColor ?? "#OOffOO";
    const activator = (
        <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Add opacity
            border: '1px solid #ddd',
        }}>
            <Button variant="tertiary" onClick={() => setPopoverActive(true)} fullWidth={true} >
                {autoDetectColor}
            </Button>
        </div>
    )

    return (
        <Controller
            control={control}
            name={property}
            defaultValue={backgroundColor}
            render={({ field: { value, onChange } }) => (
                <TextField
                    label={<Text as="p" variant="bodySm" fontWeight="bold">{header}</Text>}
                    value={value}
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