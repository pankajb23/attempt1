import { Thumbnail, Card, Text, ChoiceList, Icon, InlineStack, Tooltip, Button, Select, ResourceItem } from "@shopify/polaris";
import { useCallback } from "react";
import { AlertCircleIcon } from '@shopify/polaris-icons';
import { useAppBridge } from "@shopify/app-bridge-react";
import AddProductsModal from "./AddProductsModal";
import AutomaticOfferProducts from "./AutomaticOfferProducts";
import { Controller, useFormContext} from "react-hook-form";
import NestedProductVariantsModal from "./NestedProductVariantsModal";
import SelectedProducts from "./SelectedProductsDraggable";

export default function OfferProductRadioButtonModal({ allProducts, allTags, allVariants }) {
    const { control, setValue, watch, getValues } = useFormContext();
    const shopify = useAppBridge();

    const modalId = "my-product-modalId-draggable";
    const nestedModalId = "my-nested-product-modalId";

    const offerType = watch('offerProducts.type') ?? "automatic";
    const manualOfferType = watch('offerProducts.assets.type') ?? "products";

    const selectedPidsArray = watch('offerProducts.assets.products') || [];

    // console.log("Selected pids " + selectedPidsArray);
    const selectedIds = new Set(selectedPidsArray);;

    const handleProductChange = useCallback((productIds: string | string[]) => {
        console.log("products", productIds);

        if (Array.isArray(productIds)) {
            setValue('offerProducts.assets.products', productIds);
        } else {
            const newSet = new Set(selectedPidsArray);
            newSet.has(productIds) ? newSet.delete(productIds) : newSet.add(productIds);
            setValue('offerProducts.assets.products', [...newSet]);
        }
    }, [setValue, selectedPidsArray]);

    const handleDragEnd = useCallback(({ source, destination }) => {
        if (!destination) return;
        const currentProducts = getValues('offerProducts.assets.products') || [];
        const newProducts = [...currentProducts];
        const [temp] = newProducts.splice(source.index, 1);
        newProducts.splice(destination.index, 0, temp);

        setValue('offerProducts.assets.products', newProducts);
    }, [setValue]);


    const automaticOption =
        (
            <>
                <InlineStack>
                    <Text as="p" variant="bodyMd" > Automatic </Text>
                    <Tooltip content="Frequently bought together is an unobtrusive widget and automatic recommendations are available.">
                        <Icon source={AlertCircleIcon} tone="base" />
                    </Tooltip>
                </InlineStack>
            </>
        );

    const selectOption = [
        { label: 'by Products', value: 'products' },
        // { label: 'by Variants', value: 'tags' },
    ];

    const changingPlyCardAtTheBottom = (() => {
        switch (offerType) {
            case 'manual':
                if (manualOfferType === "tags") {
                    return (
                        <NestedProductVariantsModal allVariants={allVariants} modalId={nestedModalId} />
                    );
                } else {
                    return (
                        <AddProductsModal
                            allProducts={allProducts}
                            selectedProducts={selectedIds}
                            addSelectedProducts={handleProductChange}
                            modalId={modalId}
                            render={renderItem}
                        />
                    );
                }
            case 'automatic':
                return (
                    <AutomaticOfferProducts />
                );
            default:
                return null;
        }
    });

    return (
        <>
            <Card>
                <Text as="h5" variant="headingSm">Offer products</Text>
                <div style={{ marginTop: '10px' }}>
                    <Controller
                        name="offerProducts.type"
                        control={control}
                        defaultValue={offerType}
                        render={({ field: { onChange, value } }) => (
                            < ChoiceList
                                title={<Text as="p" variant="headingSm" fontWeight="bold">Select offer products</Text>}
                                choices={[
                                    { label: 'Manual', value: 'manual' },
                                    { label: automaticOption, value: 'automatic' },
                                ]}
                                selected={value ? [value] : []}
                                onChange={(selectedValues) => {
                                    // ChoiceList returns an array, but we want a single value
                                    onChange(selectedValues[0]);
                                }}
                            />
                        )}
                    >
                    </Controller>
                </div>
                {
                    (offerType === "manual") ? (
                        <div style={{ marginTop: '10px' }}>
                            <InlineStack gap='200'>
                                {/** @ts-ignore */}
                                <Button variant="secondary" onClick={() => {
                                    if (manualOfferType === "tags") {
                                        shopify.modal.show(nestedModalId);
                                    } else {
                                        shopify.modal.show(modalId);
                                    }
                                }}>
                                    <Text as="p" variant="bodyMd" fontWeight="bold"> Select products</Text>
                                </Button>
                                <Controller
                                    name="offerProducts.assets.type"
                                    defaultValue={manualOfferType}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            label={null}
                                            options={selectOption}
                                            onChange={onChange}
                                            value={value}
                                        />
                                    )}
                                />
                            </InlineStack>
                            <SelectedProducts
                                selectedPids={[...selectedIds]}
                                all={allProducts}
                                selectedProductsPids={selectedPidsArray}
                                handleDragEnd={handleDragEnd}
                                handleProductChange={handleProductChange}
                            />
                        </div>
                    ) : null
                }
                {changingPlyCardAtTheBottom()}
                <div style={{ marginTop: '14px' }}>
                    <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
                </div>
            </Card >
        </>
    );
}

function renderItem(item) {
    const { pid, name, img } = item;
    const thumbnail = <Thumbnail source={img} size="small" alt="img" />
    return (
        <ResourceItem
            id={pid}
            media={thumbnail}
            onClick={() => { }}
        >
            <Text as="p" variant="bodySm">{name}</Text>
        </ResourceItem>
    );
}