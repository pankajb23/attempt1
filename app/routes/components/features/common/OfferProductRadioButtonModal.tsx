import { Thumbnail, Card, Text, ChoiceList, Icon, InlineStack, Tooltip, Button, Select, LegacyCard, ResourceList, ResourceItem, InlineGrid, Avatar } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { AlertCircleIcon, XSmallIcon, ViewIcon } from '@shopify/polaris-icons';
import { useAppBridge } from "@shopify/app-bridge-react";
import AddProductsModal from "./AddProductsModal";
import AutomaticOfferProducts from "./AutomaticOfferProducts";
import { useSelector } from "react-redux";
import { selectPids } from "app/lib/reducers/RestClientReducer";
import { Controller, useFormContext } from "react-hook-form";
import NestedProductVariantsModal from "./NestedProductVariantsModal";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SelectedProducts from "./SelectedProductsDraggable";

export default function OfferProductRadioButtonModal({ allProducts, allTags, allVariants }) {
    const { control, watch } = useFormContext();

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleProductChange = useCallback((productIds: string | string[]) => {
        setSelectedIds((prev) => {
            console.log("Incoming data " + JSON.stringify(productIds));
            if (Array.isArray(productIds)) {
                return new Set(productIds);
            } else {
                const newSet = new Set(prev);
                if (newSet.has(productIds)) {
                    newSet.delete(productIds);
                } else {
                    newSet.add(productIds);
                }
                return newSet;
            }
        });
    }, []);


    console.log("selectedIds ", [...selectedIds]);

    const offerType = watch('offerProducts.type') ?? "products";
    const manualOfferType = watch('offerProducts.assets.type') ?? "products";

    const [selected, setSelected] = useState<string[]>(['manual']);
    const handleChange = useCallback((value: string[]) => setSelected(value), []);
    const productsArray = useSelector(state => selectPids(state));


    const [selectProductOption, setProductOptionSelected] = useState<string | undefined>(undefined);

    const [selectedPids, setSelectedPids] = useState<Set<string>>(new Set());

    const [automaticOfferProductValueSet, setAutomaticOfferProductValueSet] = useState<number>(2);
    const handleAutomaticOfferProductValueSet = (n: number) => {
        setAutomaticOfferProductValueSet(n);
    }

    const shopify = useAppBridge();

    const modalId = "my-product-modalId-draggable";
    const nestedModalId = "my-nested-product-modalId";

    const handleSelectChange = useCallback((value) => {
        console.log("changing to value " + value);
        setProductOptionSelected(value)
    },
        [],
    );

    const [orderedPids, setOrderedPids] = useState([]);

    const handleReorder = (newOrder: string[]) => {
        console.log("newOrder " + JSON.stringify(newOrder))
        setOrderedPids(newOrder);
    };

    const handlePidChanges = useCallback((pid: string) => {
        setSelectedPids((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(pid)) {
                newSet.delete(pid);
            } else {
                newSet.add(pid);
            }
            return newSet;
        });
    }, []);


    const title = <Text as="p" variant="headingSm" fontWeight="bold">Select offer products</Text>
    const automaticOption =
        (
            <>
                <InlineStack>
                    <Text as="p" variant="bodyMd" > Automatic
                    </Text>
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
                    console.log("manualOfferType " + manualOfferType);
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
                    <AutomaticOfferProducts
                        value={automaticOfferProductValueSet}
                        handleChange={handleAutomaticOfferProductValueSet}
                    />
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
                        render={({ field: { onChange, value } }) => (
                            < ChoiceList
                                title={title}
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
                                    console.log("manualOfferType " + manualOfferType);
                                    if (manualOfferType === "tags") {
                                        console.log("Clicking select variants")
                                        shopify.modal.show(nestedModalId);
                                    } else {
                                        console.log("Clicking select products")
                                        shopify.modal.show(modalId);
                                    }
                                }}>
                                    <Text as="p" variant="bodyMd" fontWeight="bold"> Select products</Text>
                                </Button>
                                <Controller
                                    name="offerProducts.assets.type"
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
                            <SelectedProducts selectedPids={[...selectedIds]} all={allProducts}/>
                            {/* {SelectedProducts(selectedIds, allProducts, handleProductChange, handleReorder)} */}
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