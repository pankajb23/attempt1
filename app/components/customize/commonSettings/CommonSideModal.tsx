import { BlockStack, Card, Text, Select, InlineGrid, Divider } from "@shopify/polaris";
import ProductPreview from "../../../lib/preview/modal";
import { useCallback, useState } from "react";
import { type CommonStyling } from "app/types";
import { useFormContext } from "react-hook-form";

function BoldText({ text }) {
    return <Text as="p" variant="headingSm" fontWeight="bold"> {text}</Text>
}


export default function CommonSideModal() {
    const { watch } = useFormContext();

    const [web, setIsWeb] = useState('web');

    const handleSelectChange = useCallback(
        (value: string) => setIsWeb(value),
        [],
    );
    const options = [
        { label: 'web', value: 'web' },
        { label: 'mobile', value: 'mobile' }

    ];

    const products = [
        {
            title: "Toddler Monkey Caps Winter Woolen Knit Hat",
            price: "$15",
            img: "https://via.placeholder.com/150"
        },
        {
            title: "Pampers All Round Protection Baby Diapers",
            price: "$15",
            img: "https://via.placeholder.com/150"
        },
        {
            title: "Pampers All Round Protection Baby Diapers",
            price: "$15",
            img: "https://via.placeholder.com/150"
        }
    ];

    const commonStyling: CommonStyling = {
        'buttonBgColor': watch('btn.bg.color') ?? '#000000',
        'buttonTextColor': watch('btn.txt.color') ?? '#ffffff',
        'buttonBorderColor': watch('btn.brdr.color') ?? '#000000',
        'buttonBorderWidth': watch('btn.brdr.wdth') ?? '0',
        'textColor': watch('text.color') ?? '#333',
        'priceColor': watch('price.color') ?? '#444',
        'salePriceColor': watch('price.sale.color') ?? '#720707ff',
        'compareAtPriceColor': watch('price.compare.color') ?? '#777',
        'timerTextColor': watch('text.timer.color') ?? '#888',
        'borderRadius': watch('btn.radius') ?? "0"
    }
    const isWeb = web === 'web';
    const width = isWeb ? '100%' : '50%';

    return (
        <div style={{ width: width }}>
            <Card roundedAbove="sm">
                <BlockStack gap="300">
                    <InlineGrid gap="200" columns={2}>
                        <BoldText text="Preview" />
                        <div >
                            <Select
                                label=''
                                options={options}
                                onChange={handleSelectChange}
                                value={web}
                            />
                        </div>
                    </InlineGrid>
                    <Divider />
                    <BlockStack gap="200">
                        {
                            <div style={{ marginTop: '30px' }}>
                                <ProductPreview products={products} commonStyling={commonStyling} isWeb={isWeb} />
                            </div>
                        }
                    </BlockStack>
                </BlockStack>
            </Card>
        </div>
    );
}