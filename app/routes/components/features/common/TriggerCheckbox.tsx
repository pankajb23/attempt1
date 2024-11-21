import { useEffect } from "react";
import { ChoiceList, Text, Card } from "@shopify/polaris";
import { Controller, useFormContext } from "react-hook-form";
import SelectTags from "../frequentlyboughttogether/SelectTags";
import SpecificProducts from "../frequentlyboughttogether/SpecificProductsModal";


export default function TriggerCheckbox({ allProducts, tags }) {
    const { control, setValue, watch } = useFormContext();

    const triggerType = watch('trigger.type');

    useEffect(() => {
        if (triggerType === 'none' || triggerType === undefined) {
            setValue('trigger.type', "specific_products");
        }
    }, []);

    const title = <Text as="h6" variant="headingSm" fontWeight="semibold"> Offer is triggered for </Text>
    const choiceSuffix = () => {
        switch (triggerType) {
            case "specific_products":
                return <SpecificProducts allProducts={allProducts} />;
            case "tags":
                return <SelectTags allTags={tags} />;
            case "all_products":
                return (<>
                    {/* @ts-ignore */}
                    <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
                </>);
        }
    }
    return (
        <>
            <Card>
                <Text as="h5" variant="headingSm">Trigger</Text>
                <div style={{ marginTop: '10px', paddingBottom: '2px' }}>
                    <Controller
                        name="trigger.type"
                        control={control}
                        render={({ field }) => (
                            <ChoiceList
                                title={title}
                                selected={[field.value]}
                                onChange={([selected]) => field.onChange(selected)}
                                choices={[
                                    {
                                        label: "Specific products",
                                        value: "specific_products",
                                    },
                                    {
                                        label: "Tags",
                                        value: "tags",
                                    },
                                    {
                                        label: "All products",
                                        value: "all_products",
                                    },
                                ]}
                            />
                        )}
                    />
                </div>
                {choiceSuffix()}
            </Card>
        </>
    );
}

