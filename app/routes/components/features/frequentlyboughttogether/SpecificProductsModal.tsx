import { useState, useCallback } from "react";
import { Thumbnail, Button, Text, LegacyCard, ResourceItem, ResourceList, Avatar, Icon, InlineGrid, InlineStack } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ViewIcon, XSmallIcon } from "@shopify/polaris-icons";
import AddProductsModal from "../common/AddProductsModal";

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
                                                handleProductChange([pid])
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


export default function SpecificProducts({ allProducts }) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const shopify = useAppBridge();

    const handleProductChange = useCallback((productIds: string[]) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            productIds.forEach(id => {
                if (newSet.has(id)) {
                    newSet.delete(id);
                } else {
                    newSet.add(id);
                }
            });
            return newSet;
        });
    }, []);


    return (<div style={{ marginTop: '6px' }}>
        {/* @ts-ignore */}
        <Button variant="secondary" onClick={() => shopify.modal.show('my-product-modal')}>
            <Text as="h6" fontWeight="bold" variant="headingSm">Select products</Text>
        </Button>
        {SelectedProducts(selectedIds, allProducts, handleProductChange)}
        <div style={{ marginTop: '10px' }}>
            <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
            <AddProductsModal allProducts={allProducts} selectedProducts={selectedIds} addSelectedProducts={handleProductChange} modalId={"my-product-modal"} render={renderItem} />
        </div>
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