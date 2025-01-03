import { Card, Text, TextField, InlineError } from "@shopify/polaris";
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from "react-i18next";

export default function OfferNameModal({ placeholder }) {
    const { control, watch,getValues, formState: { errors } } = useFormContext();
    const { t } = useTranslation();
    const property = "offerName";
    const propertyValue = watch(property);
    console.log("propertyValue", propertyValue, "p ", getValues());

    return (
        <Card>
            <Text as="h4" variant="headingMd" fontWeight="bold">
                {t("pages.frequently_bought_together.offer_name.heading")}
            </Text>
            <Controller
                name="offerName"
                control={control}
                defaultValue={propertyValue}
                rules={{ required: "Store name is required" }}
                render={({ field: { value, onChange } }) => (
                    <div>
                        <TextField
                            label=""
                            value={value}
                            id="offerName"
                            onChange={onChange}
                            placeholder={placeholder}
                            error={Boolean(errors.offerName)}
                            autoComplete="off"
                        />
                        {
                            errors.offerName && (
                                <InlineError
                                    message={errors.offerName.message}
                                    fieldID="offerName"
                                />
                            )
                        }
                    </div>
                )}
            />
        </Card>
    );
}