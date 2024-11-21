import { useState, useCallback, useEffect } from "react";
import { BlockStack, LegacyFilters, ResourceList, LegacyCard } from "@shopify/polaris";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import type { ResourceListProps } from "@shopify/polaris";
// import type { ResourceListSelectedItems 

export default function AddProductsModal({ allProducts, selectedProducts, addSelectedProducts, modalId, render }) {
    const [selectedItems, setSelectedItems] = useState<ResourceListProps["selectedItems"]>([]);
    const [queryValue, setQueryValue] = useState<string | undefined>(undefined);

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
        ></LegacyFilters>
    );


    return (
        <>
            <Modal id={modalId} variant="large">
                <TitleBar title="Add product tags">
                    <button variant="primary" onClick={() => {
                        console.log("Submitting pids " + JSON.stringify(selectedItems));
                        addSelectedProducts(selectedItems);
                        shopify.modal.toggle(modalId)
                    }}>Add</button>
                </TitleBar>
                <BlockStack>
                    <LegacyCard>
                        <ResourceList
                            resourceName={resourceName}
                            items={newDs()}
                            promotedBulkActions={[]}
                            renderItem={render}
                            selectedItems={selectedItems}
                            onSelectionChange={setSelectedItems}
                            filterControl={filterControl}
                            showHeader={true}
                            // emptyState={queryValue && queryValue.length > 0 ? <div> Press add to add value </div> : <div> No defined values </div>}
                            selectable
                        />
                    </LegacyCard>
                </BlockStack>
            </Modal>
        </>
    );
}
