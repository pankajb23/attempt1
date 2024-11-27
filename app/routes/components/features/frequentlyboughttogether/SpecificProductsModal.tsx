import { useState, useCallback, useEffect } from "react";
import { Thumbnail, Button, Text, LegacyCard, ResourceItem, ResourceList, Avatar, Icon, InlineGrid, InlineStack } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ViewIcon, XSmallIcon } from "@shopify/polaris-icons";
import AddProductsModal from "../common/AddProductsModal";
import { useFormContext } from "react-hook-form";

function SelectedProducts(selectedPids, all, handleProductChange) {
    if (selectedPids === undefined) {
        return null;
    }
    const pids = all.filter(pid => selectedPids.has(pid.pid));
    return (
        <div style={{ marginTop: '10px' }}>
            <LegacyCard >
                <ResourceList
                    resourceName={{ singular: 'product', plural: 'products' }}
                    items={pids}
                    renderItem={(item) => {
                        const { pid, label, img } = item;
                        const media = <Avatar customer size="md" name={label} source={img} />
                        return (
                            <ResourceItem
                                id={pid}
                                name={label}
                                media={media}
                                url={''}
                                accessibilityLabel={`View details for ${label}`}
                            >
                                <InlineGrid columns={["twoThirds", "oneThird"]}>
                                    <InlineStack>
                                        <div style={{ width: '90%' }}>
                                            <Text variant="bodyMd" fontWeight="regular" as="h3">
                                                {label}
                                            </Text>
                                        </div>
                                    </InlineStack>
                                    <InlineGrid columns={4} gap="0">
                                        <div></div>
                                        <div></div>
                                        <div>
                                            <Icon source={ViewIcon} />
                                        </div>
                                        <div>
                                            {/* @ts-ignore */}
                                            <Button variant="plain" icon={XSmallIcon} onClick={() => {
                                                console.log("Removing product " + pid);
                                                handleProductChange(pid)
                                            }} />
                                        </div>
                                    </InlineGrid>
                                </InlineGrid>
                            </ResourceItem>
                        );
                    }}
                />
            </LegacyCard>
        </div>
    )
}


function AddProductModalComponent({allProducts, selectedIds, handleProductChange}   ) {
    return (
        <div style={{ marginTop: '10px' }}>
            <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
            <AddProductsModal allProducts={allProducts} selectedProducts={selectedIds} addSelectedProducts={handleProductChange} modalId={"my-product-modal"} render={renderItem} />
        </div>
    );
}

export default function SpecificProducts({ allProducts, selectedProducts }) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(selectedProducts));

    const { setValue } = useFormContext();

    useEffect(() => {
        setSelectedIds(new Set(selectedProducts));
    }, [selectedProducts])

    const shopify = useAppBridge();

    const handleProductChange = useCallback((products: string | string[]) => {
        setSelectedIds((prev) => {
            // If input is array, just replace all tags
            const newPids = new Set(prev);
            if (Array.isArray(products)) {
                setValue('trigger.products', products);
                return new Set(products);
            } else {
                if (newPids.has(products)) {
                    newPids.delete(products);
                } else {
                    newPids.add(products);
                }
                setValue('trigger.products', newPids);
                return newPids;
            }
        });
    }, []);

    return (<div style={{ marginTop: '6px' }}>
        {/* @ts-ignore */}
        <Button variant="secondary" onClick={() => shopify.modal.show('my-product-modal')}>
            <Text as="h6" fontWeight="bold" variant="headingSm">Select products</Text>
        </Button>
        {SelectedProducts(selectedIds, allProducts, handleProductChange)}
        <AddProductModalComponent allProducts={allProducts} selectedIds={selectedIds} handleProductChange={handleProductChange} />
    </div>);
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