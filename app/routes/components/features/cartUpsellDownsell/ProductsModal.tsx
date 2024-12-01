import { useState, useCallback, useEffect } from "react";
import { Thumbnail, Button, Text, LegacyCard, ResourceItem, ResourceList, Avatar, Icon, InlineGrid, InlineStack } from "@shopify/polaris";
import { ViewIcon, XSmallIcon } from "@shopify/polaris-icons";
import AddProductsModal from "../common/AddProductsModal";
import { useFormContext } from "react-hook-form";

function SelectedProducts(selectedPids, all, handleProductChange) {
    if (selectedPids === undefined) {
        return null;
    }
    const pids = all.filter(pid => selectedPids.has(pid.pid));
    return (
        <div style={{ marginTop: '4px', marginBottom:'4px' }}>
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


function AddProductModalComponent({ allProducts, selectedIds, handleProductChange, modalId }) {
    return (
        <div >
            <AddProductsModal allProducts={allProducts} selectedProducts={selectedIds} addSelectedProducts={handleProductChange} modalId={modalId} render={renderItem} />
        </div>
    );
}

export default function ProductsModal({ allProducts, selectedProducts, property, modalId }) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(selectedProducts));

    const { setValue } = useFormContext();

    useEffect(() => {
        setSelectedIds(new Set(selectedProducts));
    }, [selectedProducts])

    const handleProductChange = useCallback((products: string | string[]) => {
        setSelectedIds((prev) => {
            // If input is array, just replace all tags
            const newPids = new Set(prev);
            if (Array.isArray(products)) {
                setValue(property, products);
                return new Set(products);
            } else {
                if (newPids.has(products)) {
                    newPids.delete(products);
                } else {
                    newPids.add(products);
                }
                setValue(property, newPids);
                return newPids;
            }
        });
    }, []);

    return (<div >
        {SelectedProducts(selectedIds, allProducts, handleProductChange)}
        <AddProductModalComponent allProducts={allProducts} selectedIds={selectedIds} handleProductChange={handleProductChange} modalId={modalId}/>
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