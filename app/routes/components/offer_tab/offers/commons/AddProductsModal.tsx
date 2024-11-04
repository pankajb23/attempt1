import { useState, useCallback, useEffect } from "react";
import { Checkbox, BlockStack, ResourceItem, LegacyFilters, ResourceList, InlineStack, Text, Thumbnail } from "@shopify/polaris";
import { Modal, TitleBar } from "@shopify/app-bridge-react";

export default function AddProductsModal({ tagsArray, selectedIds, handleChange, modalId }) {
    const [queryValue, setQueryValue] = useState<string | undefined>(undefined);
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

    const onSelectingTags = useCallback((productId: string) => {
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

    console.log("Pid Modal " + JSON.stringify(tagsArray));

    const newDs = tagsArray.map(pidModal => ({
        name: pidModal.name,
        img: pidModal.img
    })).filter((item) =>
        !queryValue  // this checks for undefined, null, empty string
        || item.name.toLowerCase().includes(queryValue.toLowerCase())  // case-insensitive search
    )
        .map((item) => ({
            name: item.name,
            img: item.img,
            isChecked: selectedIds.has(name) || selectedTags.has(item.name)
        }));

    const resourceName = {
        singular: "tag",
        plural: "tags",
    }

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                shopify.modal.hide(modalId)
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
        const { name, img, isChecked } = item;
        console.log("Item " + JSON.stringify(item));
        const label = <InlineStack gap='200'>
            <Thumbnail source={img} size="small" alt="img" />
            <Text as="p" variant="bodySm">{name}</Text>
        </InlineStack>

        return (
            <ResourceItem id={name} 
            verticalAlignment="center"
            onClick={() => {
                onSelectingTags(name)
            }}>
                <Checkbox
                    label={label}
                    checked={isChecked}
                    onChange={() => { }}
                />
            </ResourceItem>
        );
    }

    return (
        <>
            <Modal id={modalId} variant="large">
                <TitleBar title="Add product tags">
                    <button variant="primary" onClick={() => {
                        console.log("Submitting pids " + selectedTags);
                        selectedTags.forEach(tag =>
                            handleChange(tag)
                        )
                        shopify.modal.toggle(modalId)
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
