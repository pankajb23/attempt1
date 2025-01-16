import { BlockStack, Card, Text, Select, InlineGrid, Divider } from "@shopify/polaris";
import ProductPreview from "../../../lib/preview/modal";
import { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useStoreContext } from "app/lib/context/StoreContext";
import * as CommonConfigsName from "./CommonConfigsName";

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


    const { modalsAndStoreId } = useStoreContext();
    const currencyFormat = modalsAndStoreId.currencyFormat;
    const products = modalsAndStoreId.storeData.map((node, index) => {
        const variants = node.variants?.nodes.map((variant, index) => {
            return {
                id: variant.id,
                price: variant?.price,
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

    const commonStyling = {
        [CommonConfigsName.ButtonBackgroundColor]: watch(CommonConfigsName.ButtonBackgroundColor) ?? '#0b8498ff',
        [CommonConfigsName.ButtonTextColor]: watch(CommonConfigsName.ButtonTextColor) ?? '#ffffff',
        [CommonConfigsName.ButtonTextFamily]: watch(CommonConfigsName.ButtonTextFamily) ?? 'Arial, sans-serif',
        [CommonConfigsName.ButtonBorderRadius]: watch(CommonConfigsName.ButtonBorderRadius) ?? '10',
        [CommonConfigsName.ButtonBorderColor]: watch(CommonConfigsName.ButtonBorderColor) ?? '#d37594ff',
        [CommonConfigsName.ButtonBorderWidth]: watch(CommonConfigsName.ButtonBorderWidth) ?? '4',

        [CommonConfigsName.CanvasBackgroundColor]: watch(CommonConfigsName.CanvasBackgroundColor) ?? '#ffffff',
        [CommonConfigsName.CanvasLeftPadding]: watch(CommonConfigsName.CanvasLeftPadding) ?? '10',
        [CommonConfigsName.CanvasRightPadding]: watch(CommonConfigsName.CanvasRightPadding),
        [CommonConfigsName.CanvasTopPadding]: watch(CommonConfigsName.CanvasTopPadding) ?? '10',
        [CommonConfigsName.CanvasBottomPadding]: watch(CommonConfigsName.CanvasBottomPadding) ?? '10',
        [CommonConfigsName.CanvasBorderRadius]: watch(CommonConfigsName.CanvasBorderRadius) ?? '10',
        [CommonConfigsName.CanvasBorderWidth]: watch(CommonConfigsName.CanvasBorderWidth) ?? '4',
        [CommonConfigsName.CanvasBorderColor]: watch(CommonConfigsName.CanvasBorderColor) ?? '#333333',

        [CommonConfigsName.CanvasTextColor]: watch(CommonConfigsName.CanvasTextColor) ?? '#000000',
        [CommonConfigsName.CanvasTextSize]: watch(CommonConfigsName.CanvasTextSize) ?? "18",
        [CommonConfigsName.CanvasTextFamily]: watch(CommonConfigsName.CanvasTextFamily) ?? 'Arial, sans-serif',

        [CommonConfigsName.TotalPriceTextColor]: watch(CommonConfigsName.TotalPriceTextColor) ?? '#fb0101ff',
        [CommonConfigsName.TotalPriceComponentTextColor]: watch(CommonConfigsName.TotalPriceComponentTextColor) ?? '#444',
        [CommonConfigsName.TotalPriceCrossedOutTextColor]: watch(CommonConfigsName.TotalPriceCrossedOutTextColor) ?? '#444',

        [CommonConfigsName.CanvasLeftMargin]: watch(CommonConfigsName.CanvasLeftMargin) ?? '0',
        [CommonConfigsName.CanvasRightMargin]: watch(CommonConfigsName.CanvasRightMargin) ?? '0',
        [CommonConfigsName.CanvasTopMargin]: watch(CommonConfigsName.CanvasTopMargin) ?? '0',
        [CommonConfigsName.CanvasBottomMargin]: watch(CommonConfigsName.CanvasBottomMargin) ?? '0'

        // [CommonConfigsName.TotalPriceTextSize]: watch(CommonConfigsName.TotalPriceTextSize) ?? '10',
        // [CommonConfigsName.TotalPriceTextWeight]: watch(CommonConfigsName.TotalPriceTextWeight) ?? 'normal',
        // [CommonConfigsName.TotalPriceTextFamily]: watch(CommonConfigsName.TotalPriceTextFamily) ?? 'Arial, sans-serif',

        // [CommonConfigsName.TotalPriceComponentTextColor]: watch(CommonConfigsName.TotalPriceComponentTextColor),
        // [CommonConfigsName.TotalPriceComponentTextSize]: watch(CommonConfigsName.TotalPriceComponentTextSize),
        // [CommonConfigsName.TotalPriceComponentTextWeight]: watch(CommonConfigsName.TotalPriceComponentTextWeight),
        // [CommonConfigsName.TotalPriceComponentTextFamily]: watch(CommonConfigsName.TotalPriceComponentTextFamily),

        // [CommonConfigsName.TotalPriceCrossedOutTextColor]: watch(CommonConfigsName.TotalPriceCrossedOutTextColor),
        // [CommonConfigsName.TotalPriceCrossedOutTextSize]: watch(CommonConfigsName.TotalPriceCrossedOutTextSize),
        // [CommonConfigsName.TotalPriceCrossedOutTextWeight]: watch(CommonConfigsName.TotalPriceCrossedOutTextWeight),
        // [CommonConfigsName.TotalPriceCrossedOutTextFamily]: watch(CommonConfigsName.TotalPriceCrossedOutTextFamily) ,
    }
    // console.log("commonStyling", commonStyling);
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
                    <ProductPreview 
                        products={products} 
                        commonStyling={commonStyling} 
                        isWeb={isWeb} 
                        productCounts={previewCount} 
                        currencyFormat={currencyFormat}
                        />
                </Card>
            </BlockStack>
        </div>
    );
}