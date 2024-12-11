import { Card, Text, ChoiceList, Icon, InlineStack, Tooltip, Button, Select } from "@shopify/polaris";
import { useCallback } from "react";
import { AlertCircleIcon } from '@shopify/polaris-icons';
import { useAppBridge } from "@shopify/app-bridge-react";
import { Controller, useFormContext } from "react-hook-form";
import SelectedProducts from "./SelectedProductsDraggable";
import { type BaseResource } from "@shopify/app-bridge/actions/ResourcePicker";

export interface ProductArray {
    title: string
    pid: string
    img: string
}

export interface VariantsArray extends ProductArray {
    variants: ProductArray[]
}

const OfferType = "offerProducts.type";
const OfferAssets = "offerProducts.assets";
const OfferAssetsProducts = "offerProducts.assets.products";
const OfferAssetsVariants = "offerProducts.assets.variants";
const OfferAssetsType = "offerProducts.assets.type";


export default function OfferProductRadioButtonModal({ toolTipContent = "Frequently bought together is an unobtrusive widget and automatic recommendations are available." }) {
    const { control, setValue, watch } = useFormContext();
    const shopify = useAppBridge();

    // const modalId = "my-product-modalId-draggable";
    // const nestedModalId = "my-nested-product-modalId";

    const offerType = watch(OfferType) ?? "automatic";
    const manualOfferType = watch(OfferAssetsType) ?? "products";

    // const [selectedPropertyArray, setSelectedPropertyArray] = useState([]);
    let property = manualOfferType === "products" ? OfferAssetsProducts : OfferAssetsVariants;

    const selectedPidsArray: ProductArray[] = (watch(OfferAssetsProducts) ?? []) as ProductArray[];
    const selectedVariantsArray: VariantsArray[] = (watch(OfferAssetsVariants) ?? []) as VariantsArray[];

    const pidsArray = manualOfferType === "products" ? selectedPidsArray : selectedVariantsArray;

    const handleProductChange = useCallback((pid: string) => {
        console.log("pid", pid);

        const newSet = (pidsArray) as (ProductArray[] | VariantsArray[]);
        const updatedSet = newSet.filter((p) => p.pid !== pid);

        setValue(property, updatedSet);
    }, [setValue, selectedPidsArray, selectedVariantsArray]);

    const handleDragEnd = useCallback(({ source, destination }) => {
        if (!destination) return;

        const currentProducts =  watch(property) ?? [];

        const newProducts = [...currentProducts];
        console.log("pidsArray", pidsArray, "newProducts", newProducts, "currentProducts", currentProducts, "source", source, "destination", destination, "selectedPidsArray", selectedPidsArray, "selectedVariantsArray", selectedVariantsArray);
        const [temp] = newProducts.splice(source.index, 1);
        newProducts.splice(destination.index, 0, temp);

        setValue(property, newProducts);
    }, [setValue]);


    const automaticOption =
        (
            <>
                <InlineStack>
                    <Text as="p" variant="bodyMd" > Automatic </Text>
                    <Tooltip content="">
                        <Icon source={AlertCircleIcon} tone="base" />
                    </Tooltip>
                </InlineStack>
            </>
        );

    const selectOption = [
        { label: 'by Products', value: 'products' },
        { label: 'by Variants', value: 'variants' },
    ];


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
                                <Button variant="secondary" onClick={async () => {
                                    if (manualOfferType === "variants") {
                                        let selectionIds: BaseResource[] = selectedVariantsArray.map((p) => {
                                            return {
                                                id: p.pid,
                                                variants: p.variants.map((v) => ({ id: v.pid }))
                                            };
                                        })

                                        console.log("selected Ids --> ", selectionIds);

                                        const selectedPIds = await shopify.resourcePicker({
                                            type: "product",
                                            multiple: true,
                                            selectionIds: selectionIds,
                                            action: 'select',
                                            filter: {
                                                variants: true
                                            }
                                        });
                                        if (selectedPIds !== undefined) {
                                            const pidVariantsArray: VariantsArray[] = selectedPIds.map((p, index) => {
                                                return {
                                                    title: p.title,
                                                    pid: p.id,
                                                    img: p.images[0]?.originalSrc ?? null,
                                                    variants: p.variants.map((v, vIndex) => {
                                                        return {
                                                            title: v.title,
                                                            pid: v.id,
                                                            img: null
                                                        }
                                                    })
                                                }
                                            });
                                            console.log("unique variants", pidVariantsArray);
                                            setValue(OfferAssetsVariants, pidVariantsArray);
                                        }
                                    } else {
                                        let selectionIds: BaseResource[] = selectedPidsArray.map((p) => {
                                            return {
                                                id: p.pid
                                            }
                                        })
                                        const selectedIds = await shopify.resourcePicker({
                                            type: "product",
                                            multiple: true,
                                            selectionIds: selectionIds,
                                            action: 'select',
                                            filter: {
                                                variants: false
                                            }
                                        });
                                        if (selectedIds !== undefined) {
                                            console.log("selectedIds products", selectedIds);
                                            const pids = selectedIds.map((p) => {
                                                return {
                                                    pid: p.id,
                                                    title: p.title,
                                                    img: p.images[0]?.originalSrc ?? null,
                                                }
                                            });
                                            console.log("setting pids", pids)
                                            setValue(OfferAssetsProducts, pids);
                                        }
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
                                selectedPids={pidsArray}
                                handleDragEnd={handleDragEnd}
                                handleProductChange={handleProductChange}
                            />
                        </div>
                    ) : null
                }

                <div style={{ marginTop: '14px' }}>
                    <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
                </div>
            </Card >
        </>
    );
}
