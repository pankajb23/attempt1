import { useState, useCallback, useEffect } from "react";
import {Checkbox, BlockStack, ResourceItem, LegacyFilters, ResourceList } from "@shopify/polaris";
import { Modal, TitleBar } from "@shopify/app-bridge-react";

export default function AddProductTagsModal({ tagsArray, selectedIds, handleChange }) {
    const [queryValue, setQueryValue] = useState<string | undefined>(undefined);
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

    const onSelectingTags = useCallback((productId: string) => {
        console.log("change in productId " + productId)
        setSelectedTags((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    }, []);

    const handleQueryValueRemove = useCallback(
        () => setQueryValue(undefined),
        []
    );

    const handleClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [handleQueryValueRemove]);

    const newDs = tagsArray
        .filter(name =>
            !queryValue  // this checks for undefined, null, empty string
            || name.toLowerCase().includes(queryValue.toLowerCase())  // case-insensitive search
        )
        .map(name => ({
            name,
            isChecked: selectedIds.has(name) || selectedTags.has(name)
        }));

    const resourceName = {
        singular: "tag",
        plural: "tags",
    }

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                shopify.modal.hide('my-modal')
            }
        };
        document.addEventListener('keydown', handleEscKey);
    });

    const filterControl = (
        <LegacyFilters
            queryValue={queryValue}
            filters={[]}
            appliedFilters={[]}
            onQueryChange={setQueryValue}
            onQueryClear={handleQueryValueRemove}
            onClearAll={handleClearAll}
        ></LegacyFilters>
    );

    function renderItem(item) {
        const { name, isChecked } = item;

        return (
            <ResourceItem id={name} onClick={() => {
                console.log("Changing in resource Item")
                onSelectingTags(name)
            }}>
                <Checkbox
                    label={name}
                    checked={isChecked}
                    onChange={() => { }}
                />
            </ResourceItem>
        );
    }

    return (
        <>
            <Modal id="my-modal" variant="large">
                <TitleBar title="Add product tags">
                    <button variant="primary" onClick={() => {
                        console.log("Submitting pids " + selectedTags);
                        selectedTags.forEach(tag =>
                            handleChange(tag)
                        )
                        shopify.modal.toggle('my-modal')
                    }}>Add</button>
                </TitleBar>
                <BlockStack>
                    <ResourceList
                        resourceName={resourceName}
                        items={newDs}
                        renderItem={renderItem}
                        filterControl={filterControl}
                    />
                </BlockStack>
            </Modal>
        </>
    );
}
