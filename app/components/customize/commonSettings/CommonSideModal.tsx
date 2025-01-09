import { BlockStack, Card, Text, Select, InlineGrid, Divider } from "@shopify/polaris";
import ProductPreview from "../../../lib/preview/modal";
import { useCallback, useState } from "react";
import { type CommonStyling } from "app/types";
import { useFormContext } from "react-hook-form";
import { useStoreContext } from "app/lib/context/StoreContext";

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

    const [previewCount, setPreviewCount] = useState(2);

    const handlePreviewCountChange = useCallback(
        (value: string) => setPreviewCount(parseInt(value)),
        [],
    );
    const optionsPreview = [
        { label: '2 Products', value: '2' },
        { label: '3 Products', value: '3' },
        { label: '4 Products', value: '4' }
    ]


    const {modalsAndStoreId} = useStoreContext();
    const products = modalsAndStoreId.storeData.map((node, index) =>{
        const variants = node.variants?.nodes.map((variant, index) => {
            return {
                id: variant.id,
                price: variant.price,
                title: variant.displayName
            }
        })
        const image = node.featuredMedia?.preview?.image
        return {
            id: node.id,
            title: node.title,
            url: node.onlineStoreUrl || node.onlineStorePreviewUrl,
            img: image?.url,
            height: image?.height,
            width: image?.width,
            variants: variants
        }
    });

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

    const divSize = isWeb ? '50%' : '96%';

    return (
        <div style={{ width: width }}>
            <BlockStack gap="600">
                <Card roundedAbove="sm">
                    <BlockStack gap="300">
                        <InlineGrid gap="200" columns={2}>
                            <div style={{ width: `${divSize}` }}>
                                <Select
                                    label={<Text as="p" fontWeight="bold">Preview with </Text>}
                                    options={optionsPreview}
                                    onChange={handlePreviewCountChange}
                                    value={previewCount.toString()}
                                />
                            </div>
                            <div style={{ width: `${divSize}`, marginLeft: 'auto' }}>
                                <Select
                                    label={<Text as="p" fontWeight="bold">Preview on </Text>}
                                    options={options}
                                    onChange={handleSelectChange}
                                    value={web}
                                />
                            </div>
                        </InlineGrid>
                    </BlockStack>
                </Card>
                <Card padding={{ xs: "0", sm: "0" }} roundedAbove="sm">
                    <ProductPreview products={products} commonStyling={commonStyling} isWeb={isWeb} productCounts={previewCount} />
                </Card>
            </BlockStack>
        </div>
    );
}