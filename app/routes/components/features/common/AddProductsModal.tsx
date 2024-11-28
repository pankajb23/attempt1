import { useState, useCallback, useEffect } from "react";
import { BlockStack, LegacyFilters, ResourceList, LegacyCard } from "@shopify/polaris";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import type { ResourceListProps } from "@shopify/polaris";

export default function AddProductsModal({ allProducts, selectedProducts, addSelectedProducts, modalId, render }) {
    const selectedProductsAsArray: string[] = [...selectedProducts];

    const [selectedItems, setSelectedItems] = useState<ResourceListProps["selectedItems"]>(selectedProductsAsArray);
    const [queryValue, setQueryValue] = useState<string | undefined>(undefined);


    useEffect(() => {
        setSelectedItems(selectedProducts || []);
    }, [selectedProducts]);

    const handleSelectedItemsChange = useCallback(
        (selectedItems: ResourceListProps["selectedItems"]) => {
            setSelectedItems(selectedItems);
        },
        []
    );

    useEffect(() => {
        setSelectedItems(selectedProducts || []);
    }, [selectedProducts]);

    const newDs = () => {
        if (Array.isArray(allProducts)) {
            return allProducts.map(modal => ({
                name: modal.label,
                pid: modal.pid,
                tagId: modal.tagId,
                img: modal.img
            })).filter((item) => {
                return !queryValue  // this checks for undefined, null, empty string
                    || item.name.toLowerCase().includes(queryValue.toLowerCase())  // case-insensitive search
            });
        } else {
            return [];
        }
    }

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                shopify.modal.hide(modalId)
            }
        };
        document.addEventListener('keydown', handleEscKey);
    });


    const handleQueryValueChange = useCallback(
        (value: string) => setQueryValue(value),
        []
    );
    const handleQueryValueRemove = useCallback(
        () => setQueryValue(undefined),
        []
    );

    const handleClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [handleQueryValueRemove]);

    const resourceName = {
        singular: "tag",
        plural: "tags",
    };

    const filterControl = (
        <LegacyFilters
            queryValue={queryValue}
            filters={[]}
            appliedFilters={[]}
            onQueryChange={handleQueryValueChange}
            onQueryClear={handleQueryValueRemove}
            onClearAll={handleClearAll}
        />
    );

    return (
        <>
            <Modal id={modalId} variant="large" >
                <TitleBar title="Add product tags">
                    <button variant="primary" onClick={() => {
                        addSelectedProducts(selectedItems);
                        shopify.modal.hide(modalId)
                    }}>Add</button>
                </TitleBar>
                <BlockStack>
                    <LegacyCard>
                        <ResourceList
                            resourceName={resourceName}
                            items={newDs()}
                            promotedBulkActions={[]}
                            renderItem={render}
                            selectedItems={Array.from(selectedItems) || []}
                            onSelectionChange={handleSelectedItemsChange}
                            filterControl={filterControl}
                            showHeader={true}
                            selectable
                        />
                    </LegacyCard>
                </BlockStack>
            </Modal>
        </>
    );
}
