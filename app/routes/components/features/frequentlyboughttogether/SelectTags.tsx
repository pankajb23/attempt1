import { Button, Text, Tag, ResourceItem } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useState, useCallback } from "react";
import AddProductsModal from "../common/AddProductsModal";

function TagsUI(selectedIds, allTags, handleTagsChange) {
    const tags = allTags.filter(tag => selectedIds.has(tag.tagId));

    console.log("Selected ids " + JSON.stringify(selectedIds) + " all tags " + JSON.stringify(allTags) + " tags " + JSON.stringify(tags));
    return (
        Array.from(tags).map(tag => (
            <Tag
                key={tag.tagId}
                onRemove={() => {
                    console.log("Removing tag " + tag.tagId + "selected Ids");
                    handleTagsChange(tag.tagId)
                }}><div>{tag.label}</div></Tag>
        ))
    );
}

export default function SelectTags({ allTags }) {
    const shopify = useAppBridge();
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

    console.log("all tags " + JSON.stringify(allTags));

    const handleTagsChange = useCallback((tags: string | string[]) => {
        setSelectedTags(prevTags => {
            // If input is array, just replace all tags
            const newTags = new Set(prevTags);
            if (Array.isArray(tags)) {
                return new Set(tags);
            } else {
                if (newTags.has(tags)) {
                    newTags.delete(tags);
                } else {
                    newTags.add(tags);
                }
                return newTags;
            }
        });
    }, []);

    const modalId = "my-modal";


    return (<>
        {/* @ts-ignore */}
        <Button variant="secondary" onClick={() => shopify.modal.show(modalId)}>
            <Text as="p" fontWeight="bold" variant="bodySm">Select Tags</Text>
        </Button>
        <br />
        {TagsUI(selectedTags, allTags, handleTagsChange)}
        <div style={{ marginTop: '10px' }} >
            <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
            <AddProductsModal allProducts={allTags} selectedProducts={selectedTags} addSelectedProducts={handleTagsChange} modalId={modalId} render={renderItem} />
        </div>
    </>);
}

function renderItem(item) {
    const { tagId, name } = item;
    return (
        <ResourceItem
            id={tagId}
            onClick={() => { }}
        >
            <Text as="p" variant="bodySm">{name}</Text>
        </ResourceItem>
    );
}