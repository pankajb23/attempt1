import { BlockStack, Card, Text, Select, InlineGrid, Divider } from "@shopify/polaris";
import ProductPreview from "../../../lib/preview/modal";
import { useCallback, useState } from "react";

function BoldText({ text }) {
    return <Text as="p" variant="headingSm" fontWeight="bold"> {text}</Text>
}


export default function CommonSideModal() {

    const [selected, setSelected] = useState('fbt');

    const handleSelectChange = useCallback(
        (value: string) => setSelected(value),
        [],
    );
    const options = [
        { label: 'Frequently bought together', value: 'fbt' },
        { label: 'Product add-ons', value: 'pao' },
        { label: 'Upsell funnel', value: 'uf' },
        { label: 'Cart add-ons', value: 'cao' },
        { label: 'Post purchase upsell', value: 'ppu' },
        { label: 'Thank you page add-ons', value: 'tpao' }
    ];

    return (
        <Card roundedAbove="sm">
            <BlockStack gap="300">
                <InlineGrid gap="200" columns={2}>
                    <BoldText text="Preview" />
                    <div >
                        <Select
                            label=''
                            options={options}
                            onChange={handleSelectChange}
                            value={selected}
                        />
                    </div>
                </InlineGrid>
                <Divider />
                <BlockStack gap="200">
                    <div style={{marginTop:'30px', marginLeft:'20px'}}>
                        <ProductPreview />
                    </div>
                </BlockStack>
            </BlockStack>
        </Card>
    );
}