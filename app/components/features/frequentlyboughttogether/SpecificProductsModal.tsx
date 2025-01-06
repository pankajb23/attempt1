import { useState, useCallback, useEffect } from "react";
import { Button, Text, LegacyCard, ResourceItem, ResourceList, Avatar, Icon, InlineGrid, InlineStack } from "@shopify/polaris";
import { ViewIcon, XSmallIcon } from "@shopify/polaris-icons";
import { useFormContext } from "react-hook-form";
import { type SelectedProductType } from "app/types";

function SelectedProducts(pids, handleProductChange) {
    if (pids === undefined || pids.size === 0) {
        return null;
    }
    return (
        <div style={{ marginTop: '10px' }}>
            <LegacyCard>
                <ResourceList
                    resourceName={{ singular: 'product', plural: 'products' }}
                    items={[...pids]}
                    renderItem={(item) => {
                        const { pid, title, img } = item;
                        const media = <Avatar customer size="md" name={title} source={img} />
                        return (
                            <ResourceItem
                                id={pid}
                                name={title}
                                media={media}
                                url={''}
                                accessibilityLabel={`View details for ${title}`}
                            >
                                <InlineGrid columns={["twoThirds", "oneThird"]}>
                                    <InlineStack>
                                        <div style={{ width: '90%' }}>
                                            <Text variant="bodyMd" fontWeight="regular" as="h3">
                                                {title}
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
                                                handleProductChange(item)
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


export default function SpecificProducts({ selectedProducts, property, showButton }) {
    const [selectedIds, setSelectedIds] = useState<Set<SelectedProductType>>(new Set(selectedProducts));

    const { setValue } = useFormContext();

    useEffect(() => {
        setSelectedIds(new Set(selectedProducts));
    }, [selectedProducts])


    const handleProductChange = useCallback((products: SelectedProductType | SelectedProductType[]) => {
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

    return (<div style={{ marginTop: '6px' }}>
        {showButton &&
            /* @ts-ignore */
            <Button variant="secondary" onClick={() => {
                shopify.resourcePicker({
                    type: "product",
                    multiple: 50,
                    selectionIds: [],
                    action: 'select',
                    filter: {
                        variants: false
                    }
                }).then((selected) => {
                    const productTypList = selected.map((p) => {
                        const selectedProductType: SelectedProductType = {
                            pid: p.id,
                            title: p.title,
                            img: p.images[0]?.originalSrc ?? null,
                        }
                        return selectedProductType;

                    })
                    handleProductChange(productTypList);
                });
            }}>
                <Text as="h6" fontWeight="bold" variant="bodySm">Select products</Text>
            </Button>
        }
        {SelectedProducts(selectedIds, handleProductChange)}
        <div style={{ marginTop: '10px' }}>
            {showButton &&
                <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
            }
        </div>
    </div>);
}
